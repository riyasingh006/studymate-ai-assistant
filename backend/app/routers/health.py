"""
Health-check routes.

A health endpoint lets the frontend (and you) confirm the backend is up and
whether the Gemini key has been configured, without calling the AI provider.
"""

from datetime import datetime, timezone

from fastapi import APIRouter

from app import __version__
from app.config import settings
from app.models.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return basic service status. Always safe to call (no AI usage)."""
    return HealthResponse(
        status="ok",
        app=settings.app_name,
        environment=settings.app_env,
        version=__version__,
        gemini_configured=settings.gemini_configured,
        timestamp=datetime.now(timezone.utc),
    )
