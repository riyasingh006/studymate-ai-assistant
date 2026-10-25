import { useMemo, useState } from 'react';
import {
  Bookmark,
  Eye,
  FileText,
  History,
  Lightbulb,
  ListChecks,
  PenLine,
  Trash2,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import ResultViewerModal from '../components/results/ResultViewerModal.jsx';
import { getResults, deleteResult } from '../lib/storage.js';
import { TOOL_META, TOOL_ORDER, describeResult, timeAgo } from '../utils/format.js';
import { useToast } from '../context/ToastContext.jsx';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const TOOL_ICONS = {
  summarizer: FileText,
  quiz: ListChecks,
  improver: PenLine,
  explainer: Lightbulb,
};

export default function HistoryPage() {
  useDocumentTitle('Study History');
  const { toast } = useToast();
  const [version, setVersion] = useState(0);
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const entries = useMemo(() => {
    const all = getResults();
    return filter === 'all'
      ? all
      : all.filter((item) => item.tool === filter);
  }, [filter, version]);

  function handleDelete() {
    if (!toDelete) return;
    deleteResult(toDelete);
    setToDelete(null);
    setVersion((v) => v + 1);
    toast({ type: 'success', title: 'Result deleted' });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study History"
        description="Everything you've generated is saved locally in this browser. Open a result to review it, or delete it anytime."
        badge={`${entries.length} item${entries.length === 1 ? '' : 's'}`}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
            filter === 'all'
              ? 'border-brand bg-brand/15 text-brand'
              : 'border-line bg-card text-ink-2 hover:text-ink'
          }`}
        >
          All
        </button>
        {TOOL_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              filter === key
                ? 'border-brand bg-brand/15 text-brand'
                : 'border-line bg-card text-ink-2 hover:text-ink'
            }`}
          >
            {TOOL_META[key].short}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="No study activity here"
          description={
            filter === 'all'
              ? 'Generate a summary, quiz, improved answer, or explanation and it will be recorded here.'
              : `Nothing generated with the ${TOOL_META[filter]?.label || filter} tool yet.`
          }
          action={
            <Link to="/dashboard" className="text-sm font-medium text-brand hover:underline">
              Go to workspace
            </Link>
          }
        />
      ) : (
        <Card className="divide-y divide-line">
          {entries.map((item) => {
            const meta = TOOL_META[item.tool];
            const Icon = TOOL_ICONS[item.tool];
            const { title, preview } = describeResult(item.tool, item.data);
            return (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand sm:flex">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{title}</p>
                    {item.saved && (
                      <Badge tone="accent">
                        <Bookmark size={11} aria-hidden="true" />
                        Saved
                      </Badge>
                    )}
                  </div>
                  {preview && <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">{preview}</p>}
                  <p className="mt-1 text-xs text-ink-3">
                    {meta.short} · {timeAgo(item.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => setViewing(item)}>
                    <Eye size={15} />
                    <span className="hidden sm:inline">Open</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setToDelete(item.id)}
                    aria-label={`Delete ${title}`}
                  >
                    <Trash2 size={15} className="text-error" />
                  </Button>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <ResultViewerModal entry={viewing} onClose={() => setViewing(null)} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete this result?"
        message="This removes the result from your study history on this device. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}