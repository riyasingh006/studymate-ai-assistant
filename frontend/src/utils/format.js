// Formatting helpers for results and dates.

export function formatDate(iso) {
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function timeAgo(iso) {
  try {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  } catch {
    return '';
  }
}

export function makePreview(text, max = 120) {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/[,\s]+$/, '')}…`;
}

// Builds the human-readable title / preview for a stored result entry.
// `data` is a parsed backend response for the given tool.
export function describeResult(tool, data) {
  if (!data) return { title: 'Untitled', preview: '' };
  switch (tool) {
    case 'summarizer':
      return {
        title: data.main_topic || 'Summary',
        preview: makePreview(data.revision_summary),
      };
    case 'quiz': {
      const count = Array.isArray(data.questions) ? data.questions.length : 0;
      return {
        title: `Quiz — ${count} question${count === 1 ? '' : 's'}`,
        preview: data.questions?.[0]?.question
          ? makePreview(data.questions[0].question)
          : '',
      };
    }
    case 'improver':
      return {
        title: 'Improved answer',
        preview: makePreview(data.improved_answer),
      };
    case 'explainer':
      return {
        title: data.takeaway ? `Understanding: ${makePreview(data.takeaway, 48)}` : 'Concept explained',
        preview: makePreview(data.explanation),
      };
    default:
      return { title: 'Result', preview: '' };
  }
}

// Converts a stored result to plain text (used by the Copy button on saved items).
export function resultToText(tool, data) {
  if (!data) return '';
  switch (tool) {
    case 'summarizer': {
      const lines = [
        `Main topic: ${data.main_topic || ''}`,
        '',
        'Key points:',
        ...(data.key_points || []).map((p) => `  • ${p}`),
        data.important_definitions?.length
          ? ['', 'Important definitions:', ...data.important_definitions.map((d) => `  • ${d.term}: ${d.definition}`)].join('\n')
          : '',
        data.important_facts?.length
          ? ['', 'Important facts:', ...data.important_facts.map((f) => `  • ${f}`)].join('\n')
          : '',
        '',
        'Revision summary:',
        data.revision_summary || '',
      ];
      return lines.filter(Boolean).join('\n');
    }
    case 'quiz':
      return (data.questions || [])
        .map(
          (q, i) =>
            `${i + 1}. ${q.question}\n   Correct: ${q.correct_answer}\n   Why: ${q.explanation}`
        )
        .join('\n\n');
    case 'improver':
      return [
        'Improved answer:',
        data.improved_answer || '',
        '',
        'Missing points:',
        ...(data.missing_points || []).map((p) => `  • ${p}`),
        '',
        data.improvement_explanation || '',
      ].join('\n');
    case 'explainer':
      return [
        data.explanation || '',
        '',
        'Steps:',
        ...(data.steps || []).map((s, i) => `  ${i + 1}. ${s}`),
        '',
        `Example:\n${data.example || ''}`,
        '',
        `Takeaway: ${data.takeaway || ''}`,
      ].join('\n');
    default:
      return '';
  }
}

export const TOOL_META = {
  summarizer: {
    label: 'Note Summarizer',
    short: 'Summarizer',
    path: '/tools/summarizer',
    description: 'Turn long notes into a structured summary you can actually revise from.',
  },
  quiz: {
    label: 'Quiz Generator',
    short: 'Quiz',
    path: '/tools/quiz',
    description: 'Build practice questions from your material, with answers and explanations.',
  },
  improver: {
    label: 'Answer Improver',
    short: 'Answer Improver',
    path: '/tools/answer-improver',
    description: 'Upgrade a draft answer and see exactly which points were missing.',
  },
  explainer: {
    label: 'Concept Explainer',
    short: 'Explainer',
    path: '/tools/concept-explainer',
    description: 'Get a clear, step-by-step explanation of a topic in plain language.',
  },
};

export const TOOL_ORDER = ['summarizer', 'quiz', 'improver', 'explainer'];