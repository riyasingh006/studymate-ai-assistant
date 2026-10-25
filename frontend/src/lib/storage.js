// Local-only persistence for AI StudyMate.
//
// What lives here:
//   - Study history + saved results  -> `studymate:results`
//   - User preferences / settings    -> `studymate:settings`
//
// Everything is stored in the browser's localStorage on this device. Nothing
// here is ever sent to a server. All reads are defensive: malformed values
// fall back to safe defaults instead of crashing the app.

const RESULTS_KEY = 'studymate:results';
const SETTINGS_KEY = 'studymate:settings';
const MAX_RESULTS = 100;

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage full / disabled (e.g. private mode). Treat as a no-op; callers
    // that care about failures surface their own message.
  }
}

function safeParse(raw, fallback) {
  if (raw == null) return fallback;
  try {
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// --- Stored results (history + saved) ---------------------------------------

export function getResults() {
  const list = safeParse(read(RESULTS_KEY), []);
  if (!Array.isArray(list)) return [];
  return list.filter(
    (entry) =>
      entry &&
      typeof entry === 'object' &&
      typeof entry.id === 'string' &&
      typeof entry.tool === 'string' &&
      entry.data
  );
}

export function saveResults(list) {
  write(RESULTS_KEY, JSON.stringify(list.slice(0, MAX_RESULTS)));
}

export function addResult(entry) {
  const list = getResults();
  list.unshift(entry);
  saveResults(list);
  return entry;
}

export function updateResult(id, patch) {
  const list = getResults().map((entry) =>
    entry.id === id ? { ...entry, ...patch } : entry
  );
  saveResults(list);
}

export function deleteResult(id) {
  saveResults(getResults().filter((entry) => entry.id !== id));
}

export function toggleSaved(id) {
  const entry = getResults().find((item) => item.id === id);
  if (!entry) return null;
  const next = { saved: !entry.saved };
  updateResult(id, next);
  return next.saved;
}

export function clearResults() {
  try {
    window.localStorage.removeItem(RESULTS_KEY);
  } catch {
    // ignore
  }
}

// --- Settings ----------------------------------------------------------------

const DEFAULT_SETTINGS = {
  theme: 'dark',
  defaultSummaryLength: 'medium',
  defaultQuizDifficulty: 'medium',
  defaultExplanationLevel: 'beginner',
};

export function getSettings() {
  const stored = safeParse(read(SETTINGS_KEY), {});
  if (!stored || typeof stored !== 'object') return { ...DEFAULT_SETTINGS };
  return {
    theme: stored.theme || DEFAULT_SETTINGS.theme,
    defaultSummaryLength: stored.defaultSummaryLength || DEFAULT_SETTINGS.defaultSummaryLength,
    defaultQuizDifficulty: stored.defaultQuizDifficulty || DEFAULT_SETTINGS.defaultQuizDifficulty,
    defaultExplanationLevel:
      stored.defaultExplanationLevel || DEFAULT_SETTINGS.defaultExplanationLevel,
  };
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  write(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

// --- Data management ---------------------------------------------------------

export function storageUsageBytes() {
  let bytes = 0;
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      const value = window.localStorage.getItem(key);
      bytes += (key.length + (value ? value.length : 0)) * 2;
    }
  } catch {
    // ignore
  }
  return bytes;
}

export function clearAllData() {
  try {
    window.localStorage.removeItem(RESULTS_KEY);
    window.localStorage.removeItem(SETTINGS_KEY);
  } catch {
    // ignore
  }
}