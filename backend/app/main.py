"""
AI StudyMate - FastAPI application entry point.

Run with:
    uvicorn app.main:app --reload --port 8000

This module wires together configuration, CORS, routers and global error
handling.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.config import settings
from app.routers import ai, health
from app.services.gemini_client import close_gemini_client
from app.utils.errors import register_exception_handlers

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("ai_studymate")


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Run startup/shutdown logic (modern replacement for on_event)."""
    logger.info("Starting %s (env=%s)", settings.app_name, settings.app_env)
    if settings.gemini_configured:
        logger.info("Gemini API key detected (model=%s).", settings.gemini_model)
    else:
        logger.warning(
            "Gemini API key NOT configured. AI features will be unavailable."
        )
    yield
    await close_gemini_client()
    logger.info("Shutting down %s.", settings.app_name)


app = FastAPI(
    title=settings.app_name,
    version=__version__,
    description="AI StudyMate backend: study features powered by Google Gemini.",
    lifespan=lifespan,
)

# --- CORS -------------------------------------------------------------------
# Only the origins listed in ALLOWED_ORIGINS may call this API from a browser.
# We deliberately avoid the "*" wildcard so the API is not open to any site.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# --- Global error handling --------------------------------------------------
register_exception_handlers(app)

# --- Routes -----------------------------------------------------------------
# Health lives at the root (/health); AI endpoints use the /api prefix.
app.include_router(health.router)
app.include_router(ai.router)


@app.get("/", tags=["health"])
async def root() -> dict[str, str]:
    """Small welcome payload so the base URL is not a 404."""
    return {
        "message": f"{settings.app_name} is running.",
        "docs": "/docs",
        "health": "/health",
    }
