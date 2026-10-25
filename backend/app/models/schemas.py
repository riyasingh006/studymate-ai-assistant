"""
Pydantic schemas for request validation and response serialization.

Keeping every request/response model in one place makes the API contract
explicit and beginner-friendly: you can read this file top-to-bottom to see
exactly what the frontend sends and what the backend returns.

The `...Result` models double as the `response_schema` handed to Gemini, so
the model is constrained to return JSON matching these exact shapes.
"""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator


# ============================================================================
# Shared enums
# ============================================================================
class SummaryLength(str, Enum):
    """How much detail the note summary should include."""

    short = "short"
    medium = "medium"
    detailed = "detailed"


class DifficultyLevel(str, Enum):
    """Allowed quiz difficulty levels."""

    easy = "easy"
    medium = "medium"
    hard = "hard"


class ExplanationLevel(str, Enum):
    """Audience level for a concept explanation."""

    beginner = "beginner"
    intermediate = "intermediate"


class DiagramType(str, Enum):
    """Supported kinds of study diagrams."""

    flowchart = "flowchart"
    workflow = "workflow"
    decision_tree = "decision_tree"
    concept_map = "concept_map"
    none = "none"


class DiagramNodeKind(str, Enum):
    """Visual role of a diagram node."""

    start = "start"
    end = "end"
    step = "step"
    decision = "decision"
    concept = "concept"


# ============================================================================
# Foundation schemas
# ============================================================================
class HealthResponse(BaseModel):
    """Payload returned by GET /health."""

    status: str = Field(..., description="Overall service status.")
    app: str = Field(..., description="Application name from configuration.")
    environment: str = Field(..., description="Current environment (dev/prod).")
    version: str = Field(..., description="Backend version.")
    gemini_configured: bool = Field(
        ...,
        description="Whether a real Gemini API key is present in the environment.",
    )
    timestamp: datetime = Field(..., description="Server time when the check ran.")


class ErrorResponse(BaseModel):
    """Standard error body returned for handled failures."""

    error_code: str = Field(..., description="Short, machine-readable error code.")
    detail: str = Field(..., description="Human-readable description of the error.")


# ============================================================================
# Request models (validated before any AI call is made)
# ============================================================================
class _TrimmedTextModel(BaseModel):
    """Base model that strips surrounding whitespace on all string fields."""

    @field_validator("*", mode="before")
    @classmethod
    def _strip_strings(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class SummarizeRequest(_TrimmedTextModel):
    """Request body for the Note Summarizer."""

    text: str = Field(
        ...,
        min_length=20,
        max_length=8000,
        description="Study notes to summarize (20-8000 characters).",
    )
    summary_length: SummaryLength = Field(
        default=SummaryLength.medium,
        description="Preferred level of detail: short, medium, or detailed.",
    )


class QuizRequest(_TrimmedTextModel):
    """Request body for the Quiz Generator."""

    text: str = Field(
        ...,
        min_length=20,
        max_length=8000,
        description="Study material to build the quiz from (20-8000 characters).",
    )
    num_questions: int = Field(
        default=5,
        ge=3,
        le=10,
        description="How many questions to generate (3-10).",
    )
    difficulty: DifficultyLevel = Field(
        default=DifficultyLevel.medium,
        description="Difficulty level: easy, medium, or hard.",
    )


class ImproveAnswerRequest(_TrimmedTextModel):
    """Request body for the Answer Improver."""

    question: str = Field(
        ...,
        min_length=5,
        max_length=2000,
        description="The original question (5-2000 characters).",
    )
    answer: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="The student's current answer (1-5000 characters).",
    )


class ExplainConceptRequest(_TrimmedTextModel):
    """Request body for the Concept Explainer."""

    concept: str = Field(
        ...,
        min_length=2,
        max_length=300,
        description="The topic or question to explain (2-300 characters).",
    )
    level: ExplanationLevel = Field(
        default=ExplanationLevel.beginner,
        description="Preferred level: beginner or intermediate.",
    )


# Largest amount of extracted document text accepted for summarization.
# Documents above this limit are rejected with a clear error instead of being
# silently truncated. The text is still chunked internally before it is sent
# to Gemini (see `ai_service.summarize_document`).
MAX_DOCUMENT_TEXT_LENGTH = 150_000


class DocumentSummarizeRequest(_TrimmedTextModel):
    """Request body for summarizing an uploaded (extracted) document."""

    text: str = Field(
        ...,
        min_length=20,
        max_length=MAX_DOCUMENT_TEXT_LENGTH,
        description=(
            "Extracted document text (20-150000 characters). Longer documents "
            "are summarized hierarchically without truncation."
        ),
    )
    summary_length: SummaryLength = Field(
        default=SummaryLength.medium,
        description="Preferred level of detail: short, medium, or detailed.",
    )
    filename: str | None = Field(
        default=None,
        max_length=255,
        description="Original document filename, used for display and PDF export.",
    )


# ============================================================================
# Response models (also used as Gemini `response_schema`s)
# ============================================================================
class DefinitionItem(BaseModel):
    """A term and its meaning, taken from the study material."""

    term: str = Field(..., description="The term or concept being defined.")
    definition: str = Field(..., description="A short, accurate definition.")


class SummaryCore(BaseModel):
    """Core structured summary fields shared across summary responses."""

    main_topic: str = Field(..., description="The overall subject of the notes.")
    key_points: list[str] = Field(
        ..., description="The most important ideas from the notes."
    )
    important_definitions: list[DefinitionItem] = Field(
        ..., description="Key terms and their definitions found in the notes."
    )
    important_facts: list[str] = Field(
        ..., description="Notable facts or figures from the notes."
    )
    revision_summary: str = Field(
        ..., description="A short paragraph for quick revision."
    )


class SummaryResult(SummaryCore):
    """Output of the Note Summarizer (backward compatible)."""

    overview: str | None = Field(
        default=None,
        description="Overview.",
    )
    main_concepts: list[str] = Field(
        default_factory=list,
        description="Main concepts.",
    )
    processes_and_steps: list[str] = Field(
        default_factory=list,
        description="Processes and step-by-step explanations.",
    )
    formulas_and_examples: list[str] = Field(
        default_factory=list,
        description="Important facts, formulas and examples.",
    )
    relationships: list[str] = Field(
        default_factory=list,
        description="Relationships between concepts.",
    )
    quick_revision_notes: list[str] = Field(
        default_factory=list,
        description="Quick revision notes.",
    )
    conclusion: str | None = Field(
        default=None,
        description="Conclusion.",
    )
    filename: str | None = Field(default=None, description="Original filename if uploaded.")
    extracted_chars: int | None = Field(default=None, description="Character count of extracted text.")
    source_truncated: bool = Field(default=False, description="Whether source was truncated in context (never expected here).")

class QuizQuestionItem(BaseModel):
    """A single multiple-choice question."""

    question: str = Field(..., description="The question text.")
    options: list[str] = Field(..., description="Exactly four answer options.")
    correct_answer: str = Field(
        ..., description="The correct option (must match one of the options)."
    )
    explanation: str = Field(..., description="Why the correct answer is correct.")


class QuizResult(BaseModel):
    """Output of the Quiz Generator."""

    questions: list[QuizQuestionItem] = Field(
        ..., description="The generated multiple-choice questions."
    )


class ImprovedAnswerResult(BaseModel):
    """Output of the Answer Improver."""

    improved_answer: str = Field(
        ..., description="The improved answer, preserving the student's meaning."
    )
    missing_points: list[str] = Field(
        ..., description="Important points the original answer left out."
    )
    improvement_explanation: str = Field(
        ..., description="A brief explanation of what was improved and why."
    )


class ExplanationResult(BaseModel):
    """Output of the Concept Explainer."""

    explanation: str = Field(..., description="A simple explanation of the concept.")
    steps: list[str] = Field(
        ...,
        description="A step-by-step breakdown (empty list if not applicable).",
    )
    example: str = Field(..., description="A practical, concrete example.")
    takeaway: str = Field(..., description="A short revision takeaway.")


class DiagramNode(BaseModel):
    """A node in a flowchart/concept diagram."""

    id: str = Field(..., description="Stable node identifier.")
    label: str = Field(..., description="Node label to display.")
    kind: DiagramNodeKind = Field(default=DiagramNodeKind.step)
    x: float | None = None
    y: float | None = None


class DiagramEdge(BaseModel):
    """An edge between diagram nodes."""

    from_id: str = Field(..., alias="from")
    to_id: str = Field(..., alias="to")
    label: str | None = None

    model_config = {"populate_by_name": True}


class DiagramData(BaseModel):
    """Structured diagram description returned by the AI."""

    title: str = Field(..., description="Meaningful diagram title.")
    type: DiagramType = Field(default=DiagramType.flowchart)
    nodes: list[DiagramNode] = Field(default_factory=list)
    edges: list[DiagramEdge] = Field(default_factory=list)
    mermaid: str | None = Field(default=None, description="Optional Mermaid representation.")
    notes: str | None = Field(default=None, description="Notes about the diagram if any.")


class SummaryWithDiagram(SummaryResult):
    """Summary plus optional generated diagram."""

    diagram: DiagramData | None = None


class PdfExportRequest(BaseModel):
    """Request to export a summary (with optional diagram) as PDF."""

    summary: SummaryResult
    diagram_data_url: str | None = Field(
        default=None,
        max_length=10_000_000,
        description="Data URL of the rendered diagram image (PNG) if available.",
    )
    include_diagram: bool = True
