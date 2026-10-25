// Shared field wrapper: label + control + optional counter / hint / error.
export default function Field({ id, label, hint, error, counter, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {counter && <span className="text-xs text-ink-3">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}