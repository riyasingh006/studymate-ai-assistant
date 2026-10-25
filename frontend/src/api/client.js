// Thin HTTP client for the AI StudyMate backend.
//
// The base URL comes from the frontend environment variable VITE_API_BASE_URL.
// No secrets belong in this file: the Gemini API key never leaves the backend.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Send a JSON POST request and return the parsed JSON body.
// On failure we throw an Error whose message is user-friendly (taken from the
// backend's `detail` field when available), so the UI never shows raw HTML
// or a fake response.
async function post(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = `Request failed (HTTP ${response.status}). Please try again.`;
    try {
      const data = await response.json();
      if (data && data.detail) {
        detail = data.detail;
      }
    } catch {
      // Body was not JSON; keep the generic message.
    }
    throw new Error(detail);
  }

  return response.json();
}

// Check the backend health endpoint (used by the header status pill).
async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Backend unreachable');
  }
  return response.json();
}

export const api = {
  summarize: (body) => post('/api/summarize', body),
  quiz: (body) => post('/api/quiz', body),
  improve: (body) => post('/api/improve', body),
  explain: (body) => post('/api/explain', body),
  getHealth,
};