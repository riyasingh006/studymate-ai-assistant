import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

// Interactive practice runner for generated quizzes. Lets students answer each
// question, reveal the correct option and explanation, and see their score.
export default function QuizRunner({ data }) {
  const questions = useMemo(() => (Array.isArray(data?.questions) ? data.questions : []), [data]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <p role="alert" className="text-sm text-error">
        This quiz could not be loaded.
      </p>
    );
  }

  const selected = answers[current];
  const isAnswered = selected != null;
  const question = questions[current];
  const correct = question.correct_answer;
  const isCorrect = isAnswered && selected === correct;
  const score = questions.filter((q, i) => answers[i] === q.correct_answer).length;

  function restart() {
    setAnswers({});
    setCurrent(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-bold"
          style={{ backgroundColor: 'rgb(var(--brand-rgb))', color: '#031c1a' }}
        >
          {pct}%
        </div>
        <div>
          <p className="text-lg font-semibold text-ink">
            You scored {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-ink-2">
            {pct >= 80
              ? 'Excellent! You are well prepared.'
              : pct >= 50
                ? 'Good progress — review the ones you missed below.'
                : 'Keep practicing — re-read your notes and go again.'}
          </p>
        </div>
        <div className="w-full max-w-sm space-y-1.5">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-line bg-canvas/50 px-3 py-2 text-left text-sm"
            >
              {answers[i] === q.correct_answer ? (
                <CheckCircle2 size={16} className="shrink-0 text-success" />
              ) : (
                <XCircle size={16} className="shrink-0 text-error" />
              )}
              <span className="truncate text-ink-2">{q.question}</span>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={restart}>
          <RotateCcw size={15} />
          Restart quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-2">
            Question {current + 1} of {questions.length}
          </p>
          <Badge tone={isCorrect ? 'success' : 'neutral'}>
            {isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered yet'}
          </Badge>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-2">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="animate-fade-in rounded-xl border border-line bg-canvas/40 px-4 py-3" key={current}>
        <h3 className="text-base font-semibold leading-snug text-ink">{question.question}</h3>
      </div>

      <div className="space-y-2" role="group" aria-label="Answer options">
        {question.options.map((option, index) => {
          const isSelected = selected === option;
          const showsResult = isAnswered;
          const isThisCorrect = option === correct;
          const dimmed = showsResult && !isSelected && !isThisCorrect;

          return (
            <button
              key={index}
              type="button"
              disabled={showsResult}
              onClick={() => setAnswers((prev) => ({ ...prev, [current]: option }))}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${
                showsResult && isThisCorrect
                  ? 'border-success/60 bg-success/10 text-ink'
                  : showsResult && isSelected
                    ? 'border-error/60 bg-error/10 text-ink'
                    : isSelected
                      ? 'border-brand bg-brand/10 text-ink'
                      : 'border-line bg-card text-ink-2 hover:border-brand/50'
              } ${dimmed ? 'opacity-50' : ''}`}
            >
              <span className="font-medium">{option}</span>
              {showsResult && isThisCorrect && (
                <CheckCircle2 size={17} className="shrink-0 text-success" aria-label="Correct answer" />
              )}
              {showsResult && isSelected && !isThisCorrect && (
                <XCircle size={17} className="shrink-0 text-error" aria-label="Your incorrect answer" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="animate-fade-in rounded-xl border border-line bg-canvas/40 px-4 py-3">
          <p className="text-sm font-semibold text-ink">
            {isCorrect ? 'Correct!' : `The correct answer is: ${correct}`}
          </p>
          {question.explanation && (
            <p className="mt-1 text-sm text-ink-2">{question.explanation}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Previous
        </Button>
        {current < questions.length - 1 ? (
          <Button
            disabled={!isAnswered}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Next question
            <ChevronRight size={15} />
          </Button>
        ) : (
          <Button disabled={!isAnswered} onClick={() => setFinished(true)}>
            Finish &amp; see score
          </Button>
        )}
      </div>
    </div>
  );
}