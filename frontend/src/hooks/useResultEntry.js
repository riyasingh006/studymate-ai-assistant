import { useCallback, useEffect, useRef, useState } from 'react';
import { addResult, toggleSaved, updateResult, uid, getResults } from '../lib/storage.js';
import { describeResult } from '../utils/format.js';

// Manages the history/saved entry for a generated result.
//   record(data)  -> adds to history on first generation, updates the same
//                    entry on "Regenerate" (so history does not fill up).
//   toggleSave()  -> flips the saved flag for the current entry.
//   resetEntry()  -> clears the reference so the next generation is a fresh entry.
export function useResultEntry(tool) {
  const idRef = useRef(null);
  const [saved, setSaved] = useState(false);

  const record = useCallback(
    (data) => {
      const { title, preview } = describeResult(tool, data);
      const now = new Date().toISOString();
      if (idRef.current) {
        updateResult(idRef.current, { data, title, preview, updatedAt: now });
      } else {
        idRef.current = uid();
        addResult({
          id: idRef.current,
          tool,
          title,
          preview,
          data,
          saved: false,
          createdAt: now,
        });
      }
      return idRef.current;
    },
    [tool]
  );

  const toggleSave = useCallback(() => {
    if (!idRef.current) return false;
    const next = toggleSaved(idRef.current);
    setSaved(next);
    return next;
  }, []);

  const resetEntry = useCallback(() => {
    idRef.current = null;
    setSaved(false);
  }, []);

  // When the user edits inputs, keep the entry but refresh the saved flag.
  useEffect(() => {
    if (!idRef.current) return;
    const entry = getResults().find((item) => item.id === idRef.current);
    if (entry) setSaved(Boolean(entry.saved));
  });

  return { record, toggleSave, saved, resetEntry };
}