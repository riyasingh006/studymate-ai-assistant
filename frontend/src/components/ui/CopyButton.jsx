import { useCopy } from '../../hooks/useCopy.js';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, className = '' }) {
  const [copied, copy] = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      disabled={!text}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-3 py-1.5 text-sm font-medium text-ink-2 transition hover:bg-canvas-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}