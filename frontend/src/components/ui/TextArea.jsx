import { forwardRef } from 'react';
import Field from './Field.jsx';

const TextArea = forwardRef(function TextArea(
  {
    id,
    label,
    hint,
    error,
    value,
    onChange,
    showCounter = false,
    maxLength,
    rows = 6,
    placeholder,
    disabled,
    className = '',
  },
  ref
) {
  const current = (value || '').length;
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      counter={
        showCounter && maxLength ? `${current} / ${maxLength} characters` : undefined
      }
    >
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full resize-y rounded-xl border bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 transition focus:border-brand/60 ${
          error ? 'border-error' : 'border-line hover:border-ink-3/50'
        } disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      />
    </Field>
  );
});

export default TextArea;