"""
Dedicated Google Gemini client.

This module is the ONLY place that talks to the Gemini SDK. It turns raw SDK
calls and failures into our own clean `AppError` types, so route handlers stay
thin and never need to know about provider-specific exceptions.

Design goals:
- The API key is read from settings and never logged or returned.
- Requests are async and bounded by a timeout.
- Every failure mode (bad key, auth, rate limit, network, timeout, bad
  response, unexpected error) maps to a clear, secret-free HTTP error.
"""

import asyncio
import json
import logging
from typing import Type, TypeVar

import httpx
from google import genai
from google.genai import errors as genai_errors
from google.genai import types
from pydantic import BaseModel, ValidationError

from app.config import settings
from app.services.prompts import StructuredPrompt
from app.utils.errors import (
    AIConfigurationError,
    AIProviderError,
    AIResponseError,
    AppError,
)

logger = logging.getLogger(__name__)

# Generic Pydantic type var so callers get a correctly typed return value.
SchemaT = TypeVar("SchemaT", bound=BaseModel)

# HTTP statuses from the provider that mean "your credentials are wrong".
_AUTH_STATUS_CODES = {401, 403}


class GeminiClient:
    """Thin, reusable wrapper around the Google Gen AI SDK."""

    def __init__(
        self,
        api_key: str,
        model: str,
        timeout_seconds: float = 30.0,
        max_retries: int = 2,
    ) -> None:
        self._api_key = (api_key or "").strip()
        self._model = model
        self._timeout_seconds = timeout_seconds
        self._max_retries = max_retries
        self._client: genai.Client | None = None

    # -- Capabilities --------------------------------------------------------
    @property
    def is_configured(self) -> bool:
        """True when an API key is present (placeholder keys are excluded)."""
        return bool(self._api_key) and self._api_key != "your_gemini_api_key_here"

    @property
    def model(self) -> str:
        """The Gemini model name this client is configured to use."""
        return self._model

    # -- Client lifecycle ----------------------------------------------------
    def _ensure_client(self) -> genai.Client:
        """Create the SDK client lazily, failing fast if not configured."""
        if not self.is_configured:
            raise AIConfigurationError(
                "The AI service is not configured. Set GEMINI_API_KEY in backend/.env."
            )
        if self._client is None:
            # timeout is in milliseconds; retries handle transient 429/5xx.
            self._client = genai.Client(
                api_key=self._api_key,
                http_options=types.HttpOptions(
                    timeout=int(self._timeout_seconds * 1000),
                    retry_options=types.HttpRetryOptions(attempts=self._max_retries),
                ),
            )
            logger.info(
                "Gemini client initialised (model=%s, timeout=%ss, retries=%s)",
                self._model,
                self._timeout_seconds,
                self._max_retries,
            )
        return self._client

    async def aclose(self) -> None:
        """Close the underlying async HTTP client (called on app shutdown)."""
        if self._client is not None:
            try:
                await self._client.aio.aclose()
            except Exception:  # pragma: no cover - best-effort cleanup
                logger.debug("Ignoring error while closing Gemini client", exc_info=True)

    # -- Public API ----------------------------------------------------------
    async def generate_structured(
        self,
        prompt: StructuredPrompt,
        schema: Type[SchemaT],
        temperature: float = 0.3,
    ) -> SchemaT:
        """Send a structured prompt to Gemini and return a validated object.

        This is the one reusable entry point used by every AI feature. The
        model is instructed (via `response_schema`) to return JSON that matches
        `schema`, which we then validate before returning.
        """
        client = self._ensure_client()

        config = types.GenerateContentConfig(
            system_instruction=prompt.system_instruction,
            response_mime_type="application/json",
            response_schema=schema,
            temperature=temperature,
        )

        response = await self._call_model(client, prompt.user_message, config)
        return self._parse_response(response, schema)

    # -- Internals -----------------------------------------------------------
    async def _call_model(
        self,
        client: genai.Client,
        user_message: str,
        config: types.GenerateContentConfig,
    ):
        """Perform the async call with a hard timeout and full error mapping."""
        try:
            return await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=self._model,
                    contents=user_message,
                    config=config,
                ),
                timeout=self._timeout_seconds,
            )
        except asyncio.TimeoutError as exc:
            logger.warning("Gemini request timed out after %ss", self._timeout_seconds)
            raise AIProviderError(
                "The AI took too long to respond. Please try again.",
                status_code=504,
                error_code="ai_timeout",
            ) from exc
        except genai_errors.ClientError as exc:
            raise self._map_client_error(exc) from exc
        except genai_errors.ServerError as exc:
            logger.warning(
                "Gemini server error (code=%s)", getattr(exc, "code", None)
            )
            raise AIProviderError(
                "The AI service is temporarily unavailable. Please try again shortly.",
                status_code=503,
                error_code="ai_unavailable",
            ) from exc
        except genai_errors.APIError as exc:
            logger.warning(
                "Gemini API error (code=%s)", getattr(exc, "code", None)
            )
            raise AIProviderError(
                "The AI service rejected the request. Please try again."
            ) from exc
        except httpx.TimeoutException as exc:
            logger.warning("Network timeout talking to Gemini")
            raise AIProviderError(
                "The connection to the AI service timed out. Please try again.",
                status_code=504,
                error_code="ai_timeout",
            ) from exc
        except httpx.HTTPError as exc:
            logger.warning("Network error talking to Gemini: %s", type(exc).__name__)
            raise AIProviderError(
                "Could not reach the AI service. Please check your connection.",
                status_code=503,
                error_code="ai_network_error",
            ) from exc
        except Exception as exc:  # noqa: BLE001 - final safety net
            logger.exception("Unexpected error calling Gemini")
            raise AIProviderError(
                "Something went wrong while contacting the AI service."
            ) from exc

    def _map_client_error(self, exc: genai_errors.ClientError) -> AppError:
        """Translate a 4xx provider error into a safe, user-facing error."""
        code = getattr(exc, "code", None)
        message = (getattr(exc, "message", "") or "").lower()
        logger.warning("Gemini client error (code=%s)", code)

        # A 400 mentioning the API key means our credentials are invalid.
        if code == 400 and "api key" in message:
            return AIConfigurationError(
                "The AI service has an invalid API key. Please contact the administrator."
            )
        if code in _AUTH_STATUS_CODES:
            return AIConfigurationError(
                "The AI service could not authenticate. Please contact the administrator."
            )
        if code == 429:
            return AIProviderError(
                "The AI service is receiving too many requests. Please wait a moment and try again.",
                status_code=429,
                error_code="ai_rate_limited",
            )
        if code == 404:
            return AIConfigurationError(
                "The configured AI model is unavailable. Please contact the administrator."
            )
        if code in (400, 422):
            return AIProviderError(
                "The AI could not process that input. Try shortening or rephrasing it.",
                status_code=400,
                error_code="ai_bad_request",
            )
        return AIProviderError("The AI service rejected the request. Please try again.")

    @staticmethod
    def _parse_response(response, schema: Type[SchemaT]) -> SchemaT:
        """Extract and validate the model's JSON response against `schema`."""
        parsed = getattr(response, "parsed", None)
        if parsed is not None:
            return parsed if isinstance(parsed, schema) else schema.model_validate(parsed)

        # Fall back to parsing the raw text if the SDK did not give us `.parsed`.
        try:
            text = response.text
        except Exception:  # e.g. the response was blocked by safety filters
            text = None

        if not text:
            logger.warning("Gemini returned no usable content (possibly blocked).")
            raise AIResponseError(
                "The AI did not return any usable content. "
                "Try different or less sensitive input."
            )

        try:
            data = json.loads(text)
        except (json.JSONDecodeError, TypeError) as exc:
            logger.warning("Gemini returned non-JSON content.")
            raise AIResponseError() from exc

        try:
            return schema.model_validate(data)
        except ValidationError as exc:
            logger.warning("Gemini response failed schema validation.")
            raise AIResponseError() from exc


# ----------------------------------------------------------------------------
# Singleton accessor used by the AI service / routes.
# ----------------------------------------------------------------------------
_client_singleton: GeminiClient | None = None


def get_gemini_client() -> GeminiClient:
    """Return the process-wide Gemini client built from configuration."""
    global _client_singleton
    if _client_singleton is None:
        _client_singleton = GeminiClient(
            api_key=settings.gemini_api_key,
            model=settings.gemini_model,
            timeout_seconds=settings.gemini_timeout_seconds,
            max_retries=settings.gemini_max_retries,
        )
    return _client_singleton


async def close_gemini_client() -> None:
    """Close the singleton client (called on application shutdown)."""
    global _client_singleton
    if _client_singleton is not None:
        await _client_singleton.aclose()
        _client_singleton = None
