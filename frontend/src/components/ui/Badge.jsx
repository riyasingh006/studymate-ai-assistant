export default function Badge({ children, tone = 'brand', className = '' }) {
  const tones = {
    brand: 'border-brand/40 bg-brand/10 text-brand',
    accent: 'border-accent/40 bg-accent/10 text-accent',
    success: 'border-success/40 bg-success/10 text-success',
    warning: 'border-warning/40 bg-warning/10 text-warning',
    error: 'border-error/40 bg-error/10 text-error',
    neutral: 'border-line bg-canvas-2 text-ink-2',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}