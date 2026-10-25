"""
AI feature routes.

Each handler is intentionally thin: FastAPI validates the request body against
the Pydantic model, the handler delegates to the AI service, and the validated
result model is serialized back. Error handling is centralized in
`app.utils.errors`, so nothing here handles provider failures directly.

All endpoints live under the `/api` prefix and return HTTP 200 on success.
Validation failures return 422; AI/provider failures return 4xx/5xx with a
safe `{ "error_code", "detail" }` body.
"""

from fastapi import APIRouter

from app.models.schemas import (
    ExplainConceptRequest,
    ExplanationResult,
    ImproveAnswerRequest,
    ImprovedAnswerResult,
    QuizRequest,
    QuizResult,
    SummarizeRequest,
    SummaryResult,
)
from app.services import ai_service

router = APIRouter(prefix="/api", tags=["ai"])


@router.post(
    "/summarize",
    response_model=SummaryResult,
    summary="Summarize study notes",
    description=(
        "Summarize notes into main topic, key points, important definitions, "
        "important facts and a short revision summary. Body: `SummarizeRequest`."
    ),
)
async def summarize_notes(payload: SummarizeRequest) -> SummaryResult:
    """Feature 1: Note Summarizer."""
    return await ai_service.summarize_text(payload.text, payload.summary_length)


@router.post(
    "/quiz",
    response_model=QuizResult,
    summary="Generate a multiple-choice quiz",
    description=(
        "Generate 3-10 validated multiple-choice questions with four options "
        "each, a correct answer and an explanation. Body: `QuizRequest`."
    ),
)
async def create_quiz(payload: QuizRequest) -> QuizResult:
    """Feature 2: Quiz Generator."""
    return await ai_service.generate_quiz(
        text=payload.text,
        num_questions=payload.num_questions,
        difficulty=payload.difficulty,
    )


@router.post(
    "/improve",
    response_model=ImprovedAnswerResult,
    summary="Improve a student's answer",
    description=(
        "Improve an answer while preserving its meaning, list important missing "
        "points and explain the improvements. Body: `ImproveAnswerRequest`."
    ),
)
async def improve_student_answer(payload: ImproveAnswerRequest) -> ImprovedAnswerResult:
    """Feature 3: Answer Improver."""
    return await ai_service.improve_answer(
        question=payload.question,
        answer=payload.answer,
    )


@router.post(
    "/explain",
    response_model=ExplanationResult,
    summary="Explain a concept",
    description=(
        "Explain a topic at beginner or intermediate level with a step-by-step "
        "breakdown, a practical example and a takeaway. Body: `ExplainConceptRequest`."
    ),
)
async def explain_a_concept(payload: ExplainConceptRequest) -> ExplanationResult:
    """Feature 4: Concept Explainer."""
    return await ai_service.explain_concept(
        concept=payload.concept,
        level=payload.level,
    )
