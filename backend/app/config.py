"""
Configuration and environment-variable loading for AI StudyMate.

All settings are read from a local ".env" file (never hardcoded) and are
exposed through a single cached `settings` object so the rest of the
application has one source of truth.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application settings loaded from environment variables."""

    # --- AI provider ---
    gemini_api_key: str = ""
    # Verified-working default. "gemini-flash-lite-latest" is fast and reliable;
    # "gemini-flash-latest" (higher quality) or "gemini-3.6-flash" can be set
    # via GEMINI_MODEL if you prefer. Pin a version for production.
    gemini_model: str = "gemini-flash-lite-latest"
    # Hard time limit for a single AI call, in seconds.
    gemini_timeout_seconds: float = 30.0
    # How many times the SDK retries transient failures (429 / 5xx).
    gemini_max_retries: int = 2

    # --- Application ---
    app_name: str = "AI StudyMate API"
    app_env: str = "development"

    # Raw comma-separated string from the environment (see `allowed_origins_list`).
    allowed_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://studymate-ai-assistant.vercel.app"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        """Return the allowed CORS origins as a clean Python list."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def gemini_configured(self) -> bool:
        """True when a (non-placeholder) Gemini API key has been provided."""
        key = self.gemini_api_key.strip()
        return bool(key) and key != "your_gemini_api_key_here"


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (loaded once per process)."""
    return Settings()


# Convenience singleton used across the app.
settings = get_settings()
