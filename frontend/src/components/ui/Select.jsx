import Field from './Field.jsx';

export default function Select({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  options,
  disabled,
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full appearance-none rounded-xl border bg-canvas px-3.5 py-2.5 pr-9 text-sm text-ink transition focus:border-brand/60 ${
          error ? 'border-error' : 'border-line hover:border-ink-3/50'
        } disabled:cursor-not-allowed disabled:opacity-60`}
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%237D929F\' stroke-width=\'1.6\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.9rem center',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}