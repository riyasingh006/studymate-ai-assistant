"""
Tests for the Gemini integration, request validation and quiz validation.

Tests that make a real network call are marked `integration` and are skipped
automatically when no API key is configured. Run them with:

    pytest -m integration
"""

import asyncio

import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.main import app
from app.models.schemas import (
    QuizQuestionItem,
    QuizResult,
    SummaryLength,
    SummaryResult,
)
from app.services.ai_service import _resolve_correct_answer, _validate_quiz
from app.services.gemini_client import GeminiClient
from app.services.prompts import build_summarize_prompt
from app.utils.errors import AIConfigurationError, AIProviderError, AIResponseError

client = TestClient(app)

_MODEL = settings.gemini_model
_SAMPLE = (
    "The mitochondria is the powerhouse of the cell. It produces ATP through "
    "cellular respiration, supplying energy for the cell's activities."
)


# ---------------------------------------------------------------------------
# Configuration tests (no network)
# ---------------------------------------------------------------------------
def test_missing_key_is_not_configured() -> None:
    gemini = GeminiClient(api_key="", model=_MODEL)
    assert gemini.is_configured is False
    with pytest.raises(AIConfigurationError):
        asyncio.run(
            gemini.generate_structured(
                build_summarize_prompt(_SAMPLE, SummaryLength.medium), SummaryResult
            )
        )


def test_placeholder_key_is_not_configured() -> None:
    gemini = GeminiClient(api_key="your_gemini_api_key_here", model=_MODEL)
    assert gemini.is_configured is False


# ---------------------------------------------------------------------------
# Request validation tests (no AI call is made)
# ---------------------------------------------------------------------------
def test_summarize_rejects_short_text() -> None:
    response = client.post("/api/summarize", json={"text": "too short"})
    assert response.status_code == 422
    assert response.json()["error_code"] == "validation_error"


def test_quiz_rejects_out_of_range_question_count() -> None:
    response = client.post("/api/quiz", json={"text": _SAMPLE, "num_questions": 2})
    assert response.status_code == 422


def test_quiz_rejects_too_many_questions() -> None:
    response = client.post("/api/quiz", json={"text": _SAMPLE, "num_questions": 11})
    assert response.status_code == 422


def test_explain_rejects_missing_concept() -> None:
    response = client.post("/api/explain", json={})
    assert response.status_code == 422


def test_invalid_enum_value_is_rejected() -> None:
    response = client.post(
        "/api/summarize", json={"text": _SAMPLE, "summary_length": "gigantic"}
    )
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# Quiz validation tests (pure logic, no network)
# ---------------------------------------------------------------------------
def _quiz_item(**overrides) -> QuizQuestionItem:
    data = {
        "question": "What is the powerhouse of the cell?",
        "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
        "correct_answer": "Mitochondria",
        "explanation": "Mitochondria produce ATP for the cell.",
    }
    data.update(overrides)
    return QuizQuestionItem(**data)


def test_resolve_correct_answer_variants() -> None:
    options = ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"]
    assert _resolve_correct_answer("Mitochondria", options) == "Mitochondria"
    assert _resolve_correct_answer("  mitochondria ", options) == "Mitochondria"
    assert _resolve_correct_answer("B", options) == "Mitochondria"
    assert _resolve_correct_answer("B) Mitochondria", options) == "Mitochondria"
    assert _resolve_correct_answer("elephant", options) is None


def test_validate_quiz_accepts_well_formed_quiz() -> None:
    quiz = QuizResult(questions=[_quiz_item()])
    result = _validate_quiz(quiz, expected_count=1)
    assert len(result.questions) == 1
    assert result.questions[0].correct_answer == "Mitochondria"


def test_validate_quiz_rejects_wrong_option_count() -> None:
    quiz = QuizResult(questions=[_quiz_item(options=["A", "B", "C"])])
    with pytest.raises(AIResponseError):
        _validate_quiz(quiz, expected_count=1)


def test_validate_quiz_rejects_unresolvable_answer() -> None:
    quiz = QuizResult(questions=[_quiz_item(correct_answer="None of the above")])
    with pytest.raises(AIResponseError):
        _validate_quiz(quiz, expected_count=1)


def test_validate_quiz_rejects_empty_quiz() -> None:
    quiz = QuizResult(questions=[])
    with pytest.raises(AIResponseError):
        _validate_quiz(quiz, expected_count=5)


def test_validate_quiz_trims_extra_questions() -> None:
    quiz = QuizResult(questions=[_quiz_item(), _quiz_item(), _quiz_item()])
    result = _validate_quiz(quiz, expected_count=2)
    assert len(result.questions) == 2


# ---------------------------------------------------------------------------
# Error handling for failed requests (integration: needs network)
# ---------------------------------------------------------------------------
@pytest.mark.integration
def test_invalid_api_key_returns_safe_error() -> None:
    gemini = GeminiClient(
        api_key="AIzaSyINVALIDKEY000000000000000000000000",
        model=_MODEL,
    )
    with pytest.raises((AIConfigurationError, AIProviderError)) as exc_info:
        asyncio.run(
            gemini.generate_structured(
                build_summarize_prompt(_SAMPLE, SummaryLength.medium), SummaryResult
            )
        )
    # The error must be safe: never echo the API key or provider internals.
    assert "AIzaSyINVALIDKEY" not in str(exc_info.value)


# ---------------------------------------------------------------------------
# Live success test (skipped automatically if no key is configured)
# ---------------------------------------------------------------------------
@pytest.mark.integration
@pytest.mark.skipif(
    not settings.gemini_configured, reason="No Gemini API key configured."
)
def test_live_summarize_endpoint_returns_valid_shape() -> None:
    response = client.post(
        "/api/summarize", json={"text": _SAMPLE, "summary_length": "medium"}
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert set(body.keys()) == {
        "main_topic",
        "key_points",
        "important_definitions",
        "important_facts",
        "revision_summary",
    }
    assert isinstance(body["main_topic"], str) and body["main_topic"]
    assert isinstance(body["key_points"], list)
