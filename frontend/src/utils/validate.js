import { useCallback, useState } from 'react';

// Small client-side validators that mirror the backend's Pydantic limits.
// Each returns an error string (falsy when valid).
export function validateLength(value, { min, max, label }) {
  const trimmed = (value || '').trim();
  if (trimmed.length === 0) {
    return `${label} is required.`;
  }
  if (trimmed.length < min) {
    return `${label} must be at least ${min} characters (currently ${trimmed.length}).`;
  }
  if (trimmed.length > max) {
    return `${label} must be at most ${max} characters.`;
  }
  return null;
}

export function toErrorMap(validators) {
  return validators
    .map(({ field, message }) => ({ field, message }))
    .filter((entry) => entry.message)
    .reduce((acc, entry) => {
      acc[entry.field] = entry.message;
      return acc;
    }, {});
}