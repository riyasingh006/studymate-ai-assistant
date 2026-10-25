import { forwardRef } from 'react';
import Field from './Field.jsx';

export const TextInput = forwardRef(function TextInput(
  {
    id,
    label,
    hint,
    error,
    value,
    onChange,
    placeholder,
    maxLength,
    type = 'text',
    disabled,
    autoComplete,
  },
  ref
) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 transition focus:border-brand/60 ${
          error ? 'border-error' : 'border-line hover:border-ink-3/50'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      />
    </Field>
  );
});

export default TextInput;