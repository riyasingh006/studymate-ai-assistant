"""
AI service layer.

This is the bridge between the API routes and the Gemini client:
- it turns feature inputs into structured prompts,
- calls the reusable Gemini client,
- validates the raw model output,
- and returns validated result models.

Route handlers depend only on these small functions and never touch the
Gemini SDK directly. All features share the same `generate_structured` call,
so the API logic is not duplicated.
"""

import logging

from app.models.schemas import (
    DifficultyLevel,
    ExplanationLevel,
    ExplanationResult,
    ImprovedAnswerResult,
    QuizResult,
    SummaryLength,
    SummaryResult,
)
from app.services.gemini_client import GeminiClient, get_gemini_client
from app.services.prompts import (
    build_explain_concept_prompt,
    build_improve_answer_prompt,
    build_quiz_prompt,
    build_summarize_prompt,
)
from app.utils.errors import AIResponseError

logger = logging.getLogger(__name__)

# A quiz must have at least this many questions to be considered usable.
_MIN_QUESTIONS = 1


# ---------------------------------------------------------------------------
# Feature 1: Note Summarizer
# ---------------------------------------------------------------------------
async def summarize_text(
    text: str,
    summary_length: SummaryLength,
    client: GeminiClient | None = None,
) -> SummaryResult:
    """Summarize study notes into a structured revision aid."""
    gemini = client or get_gemini_client()
    prompt = build_summarize_prompt(text, summary_length)
    return await gemini.generate_structured(prompt, SummaryResult, temperature=0.2)


# ---------------------------------------------------------------------------
# Feature 2: Quiz Generator
# ---------------------------------------------------------------------------
async def generate_quiz(
    text: str,
    num_questions: int,
    difficulty: DifficultyLevel,
    client: GeminiClient | None = None,
) -> QuizResult:
    """Generate and validate a multiple-choice quiz."""
    gemini = client or get_gemini_client()
    prompt = build_quiz_prompt(text, num_questions, difficulty)
    quiz = await gemini.generate_structured(prompt, QuizResult, temperature=0.4)

    # Never return a structurally broken quiz to the frontend.
    return _validate_quiz(quiz, expected_count=num_questions)


def _validate_quiz(quiz: QuizResult, expected_count: int) -> QuizResult:
    """Ensure every question is well-formed; raise a safe error otherwise.

    Rules enforced:
    - at least one question exists;
    - each question has non-empty text and explanation;
    - each question has exactly 4 options, all non-empty;
    - the correct answer can be resolved to one of the options.
    """
    questions = quiz.questions or []
    if len(questions) < _MIN_QUESTIONS:
        raise AIResponseError(
            "The AI did not return any quiz questions. Please try again."
        )

    cleaned = []
    for index, item in enumerate(questions[:expected_count], start=1):
        if not item.question.strip():
            raise AIResponseError(f"Quiz question {index} was empty. Please try again.")

        options = [opt.strip() for opt in item.options if opt and opt.strip()]
        if len(options) != 4:
            raise AIResponseError(
                f"Quiz question {index} did not have exactly four options. "
                "Please try again."
            )

        resolved = _resolve_correct_answer(item.correct_answer, options)
        if resolved is None:
            raise AIResponseError(
                f"Quiz question {index} had no valid correct answer. Please try again."
            )

        if not item.explanation.strip():
            raise AIResponseError(
                f"Quiz question {index} was missing an explanation. Please try again."
            )

        item.question = item.question.strip()
        item.options = options
        item.correct_answer = resolved
        item.explanation = item.explanation.strip()
        cleaned.append(item)

    if len(cleaned) != expected_count:
        logger.warning(
            "Quiz asked for %s questions but received %s; returning %s.",
            expected_count,
            len(questions),
            len(cleaned),
        )

    return QuizResult(questions=cleaned)


def _resolve_correct_answer(raw: str, options: list[str]) -> str | None:
    """Map the model's `correct_answer` onto an exact option string.

    Handles the common ways a model may phrase the answer: the full option
    text, the option letter ("A"/"B"/...), or a prefixed letter ("A) ...").
    Returns the matching option text, or None if nothing matches.
    """
    if raw is None:
        return None
    candidate = raw.strip()
    if not candidate:
        return None

    # 1) Exact match.
    for option in options:
        if candidate == option:
            return option

    # 2) Case-insensitive / whitespace-insensitive match.
    lowered = candidate.lower()
    for option in options:
        if lowered == option.strip().lower():
            return option

    # 3) Option letter ("A".."D") or "A) ..." / "A. ...".
    letter = candidate[0].upper()
    if letter in "ABCD" and (len(candidate) == 1 or not candidate[1].isalnum()):
        index = "ABCD".index(letter)
        if index < len(options):
            return options[index]

    return None


# ---------------------------------------------------------------------------
# Feature 3: Answer Improver
# ---------------------------------------------------------------------------
async def improve_answer(
    question: str,
    answer: str,
    client: GeminiClient | None = None,
) -> ImprovedAnswerResult:
    """Improve a student's answer while preserving its meaning."""
    gemini = client or get_gemini_client()
    prompt = build_improve_answer_prompt(question, answer)
    return await gemini.generate_structured(
        prompt, ImprovedAnswerResult, temperature=0.3
    )


# ---------------------------------------------------------------------------
# Feature 4: Concept Explainer
# ---------------------------------------------------------------------------
async def explain_concept(
    concept: str,
    level: ExplanationLevel,
    client: GeminiClient | None = None,
) -> ExplanationResult:
    """Explain a concept at the requested audience level."""
    gemini = client or get_gemini_client()
    prompt = build_explain_concept_prompt(concept, level)
    return await gemini.generate_structured(prompt, ExplanationResult, temperature=0.3)
