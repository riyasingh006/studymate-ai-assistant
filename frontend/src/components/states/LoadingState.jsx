import Spinner from '../ui/Spinner.jsx';

export default function LoadingState({ label = 'Generating your AI response…', className = '' }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-card px-6 py-10 text-center shadow-card ${className}`}
    >
      <Spinner size={26} className="text-brand" />
      <p className="text-sm text-ink-2">{label}</p>
      <p className="max-w-sm text-xs text-ink-3">
        This can take a few seconds. Your text is sent to the Gemini API for processing.
      </p>
    </div>
  );
}