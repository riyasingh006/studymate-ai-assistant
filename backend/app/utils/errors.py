"""
Custom exceptions and global exception handlers.

Centralizing error handling keeps routes clean and guarantees the API always
returns a consistent, JSON error shape instead of leaking stack traces.
"""

import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class AppError(Exception):
    """Base class for expected, application-level errors.

    Raise (or subclass) this anywhere in the codebase to return a controlled
    HTTP error with a clear message instead of a generic 500 response.
    """

    def __init__(
        self,
        detail: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str = "bad_request",
    ) -> None:
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code
        self.error_code = error_code


class AIConfigurationError(AppError):
    """The AI service is missing required configuration (e.g. the API key)."""

    def __init__(self, detail: str = "The AI service is not configured.") -> None:
        super().__init__(
            detail=detail,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="ai_not_configured",
        )


class AIProviderError(AppError):
    """The AI provider rejected or failed the request.

    `user_detail` is safe to show to the client; the real upstream message is
    only logged server-side so we never leak provider internals or secrets.
    """

    def __init__(
        self,
        user_detail: str,
        status_code: int = status.HTTP_502_BAD_GATEWAY,
        error_code: str = "ai_provider_error",
    ) -> None:
        super().__init__(
            detail=user_detail,
            status_code=status_code,
            error_code=error_code,
        )


class AIResponseError(AppError):
    """The AI provider returned a response we could not interpret."""

    def __init__(
        self,
        detail: str = "The AI returned an unexpected response. Please try again.",
    ) -> None:
        super().__init__(
            detail=detail,
            status_code=status.HTTP_502_BAD_GATEWAY,
            error_code="ai_invalid_response",
        )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all global exception handlers to the FastAPI app."""

    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        """Return a clean JSON body for our own AppError exceptions."""
        return JSONResponse(
            status_code=exc.status_code,
            content={"error_code": exc.error_code, "detail": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        _: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Turn FastAPI validation failures into the standard error shape."""
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error_code": "validation_error",
                "detail": "Request data was invalid.",
                "errors": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        """Catch-all so unexpected bugs never leak stack traces to clients."""
        logger.exception("Unhandled server error: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error_code": "internal_error",
                "detail": "An unexpected error occurred. Please try again later.",
            },
        )
