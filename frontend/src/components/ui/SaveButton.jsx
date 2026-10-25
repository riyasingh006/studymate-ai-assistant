import { Bookmark, BookmarkCheck } from 'lucide-react';

export default function SaveButton({ saved, onClick, label = 'Save result' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
        saved
          ? 'border-brand/40 bg-brand/10 text-brand'
          : 'border-line bg-elevated text-ink-2 hover:bg-canvas-2 hover:text-ink'
      }`}
      aria-pressed={saved}
    >
      {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {saved ? 'Saved' : label}
    </button>
  );
}