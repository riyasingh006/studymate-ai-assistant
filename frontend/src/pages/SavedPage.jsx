import { useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkX,
  Eye,
  FileText,
  Lightbulb,
  ListChecks,
  PenLine,
  Search,
  Trash2,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import ResultViewerModal from '../components/results/ResultViewerModal.jsx';
import CopyButton from '../components/ui/CopyButton.jsx';
import { getResults, deleteResult, updateResult } from '../lib/storage.js';
import { TOOL_META, describeResult, resultToText, timeAgo } from '../utils/format.js';
import { useToast } from '../context/ToastContext.jsx';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const TOOL_ICONS = {
  summarizer: FileText,
  quiz: ListChecks,
  improver: PenLine,
  explainer: Lightbulb,
};

export default function SavedPage() {
  useDocumentTitle('Saved Results');
  const { toast } = useToast();
  const [version, setVersion] = useState(0);
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const entries = useMemo(() => {
    const saved = getResults().filter((item) => item.saved);
    const q = query.trim().toLowerCase();
    if (!q) return saved;
    return saved.filter((item) => {
      const { title, preview } = describeResult(item.tool, item.data);
      return `${title} ${preview}`.toLowerCase().includes(q);
    });
  }, [query, version]);

  function unsave(id, title) {
    updateResult(id, { saved: false });
    setVersion((v) => v + 1);
    toast({ type: 'info', title: 'Removed from Saved Results', message: title });
  }

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
        title="Saved Results"
        description="Results you pinned with the Save button. Kept only in this browser's local storage."
        badge={`${entries.length} saved`}
      />

      <div className="relative max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search saved results…"
          aria-label="Search saved results"
          className="w-full rounded-xl border border-line bg-card py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-3 transition focus:border-brand/60"
        />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={query ? 'No matches' : 'Nothing saved yet'}
          description={
            query
              ? 'No saved result matches your search.'
              : 'Use the Save button on any summary, quiz, improved answer, or explanation to pin it here.'
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
                  <p className="truncate text-sm font-semibold text-ink">{title}</p>
                  {preview && <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">{preview}</p>}
                  <p className="mt-1 text-xs text-ink-3">
                    {meta.short} · saved {timeAgo(item.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <CopyButton text={resultToText(item.tool, item.data)} className="hidden sm:inline-flex" />
                  <Button variant="ghost" size="sm" onClick={() => setViewing(item)}>
                    <Eye size={15} />
                    <span className="hidden lg:inline">Open</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => unsave(item.id, title)}
                    aria-label={`Unsave ${title}`}
                    title="Remove from Saved Results (keeps entry in history)"
                  >
                    <BookmarkX size={15} className="text-warning" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setToDelete(item.id)}
                    aria-label={`Delete ${title}`}
                    title="Delete result"
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
        title="Delete this saved result?"
        message="This removes the result from your saved results and study history on this device."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}