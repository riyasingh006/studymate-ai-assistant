import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { getResults } from '../lib/storage.js';
import { TOOL_META, TOOL_ORDER, timeAgo, describeResult } from '../utils/format.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { ArrowRight, Bookmark, History, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FileText, ListChecks, PenLine, Lightbulb } from 'lucide-react';

const TOOL_ICONS = {
  summarizer: FileText,
  quiz: ListChecks,
  improver: PenLine,
  explainer: Lightbulb,
};

export default function DashboardPage() {
  useDocumentTitle('Overview');
  const results = getResults();
  const recent = results.slice(0, 6);
  const saved = results.filter((item) => item.saved).slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand">Welcome to AI StudyMate</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Your study session starts here
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-2">
              Summarize your notes, quiz yourself, strengthen answers, and understand tricky
              concepts — all in one place, powered by Gemini.
            </p>
          </div>
          <Badge tone="accent" className="shrink-0">
            <Sparkles size={13} />
            Local-first workspace
          </Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/tools/summarizer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-[#031c1a] transition hover:brightness-110"
          >
            Summarize notes
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/tools/quiz"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-elevated px-4 py-2 text-sm font-medium text-ink-2 transition hover:bg-canvas-2 hover:text-ink"
          >
            Generate a quiz
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-3">
          Your AI tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOL_ORDER.map((key) => {
            const meta = TOOL_META[key];
            const Icon = TOOL_ICONS[key];
            return (
              <Link
                key={key}
                to={meta.path}
                className="group rounded-2xl border border-line bg-card p-5 shadow-card transition hover:border-brand/40 hover:shadow-card-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-semibold text-ink">{meta.label}</h3>
                <p className="mt-1 text-sm text-ink-2">{meta.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Open tool
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-ink">
              <History size={17} className="text-brand" aria-hidden="true" />
              Recent activity
            </h2>
            <Link to="/history" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              icon={History}
              title="No study activity yet"
              description="Generate your first summary or quiz and it will appear here."
              action={
                <Link to="/tools/summarizer" className="text-sm font-medium text-brand hover:underline">
                  Try a tool
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((item) => {
                const meta = TOOL_META[item.tool];
                const Icon = TOOL_ICONS[item.tool] || Sparkles;
                const { title } = describeResult(item.tool, item.data);
                return (
                  <li key={item.id} className="flex items-center gap-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{title}</p>
                      <p className="text-xs text-ink-3">
                        {meta.short} · {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-ink">
              <Bookmark size={17} className="text-brand" aria-hidden="true" />
              Saved results
            </h2>
            <Link to="/saved" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          {saved.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="Nothing saved yet"
              description="Use the Save button on any result to pin it here for quick review."
            />
          ) : (
            <ul className="divide-y divide-line">
              {saved.map((item) => {
                const meta = TOOL_META[item.tool];
                const Icon = TOOL_ICONS[item.tool] || Sparkles;
                const { title } = describeResult(item.tool, item.data);
                return (
                  <li key={item.id} className="flex items-center gap-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{title}</p>
                      <p className="text-xs text-ink-3">
                        {meta.short} · {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}