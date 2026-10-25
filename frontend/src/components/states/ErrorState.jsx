import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function ErrorState({ message, onRetry, className = '' }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-3 rounded-2xl border border-error/30 bg-error/5 px-6 py-8 text-center ${className}`}
    >
      <AlertTriangle size={22} className="text-error" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-ink">Something went wrong</p>
        <p className="mt-1 max-w-md text-sm text-ink-2">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}