import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 20, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SpinnerButtonText({ children }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner size={15} />
      {children}
    </span>
  );
}