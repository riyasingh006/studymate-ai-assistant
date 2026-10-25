import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client.js';

// Real backend + Gemini availability status.
//   ready          -> backend responds and Gemini is configured
//   not_configured -> backend responds but the API key is missing on the server
//   offline        -> backend unreachable
export default function BackendStatus({ compact = false }) {
  const [status, setStatus] = useState('checking');

  const check = useCallback(async () => {
    setStatus('checking');
    try {
      const health = await api.getHealth();
      setStatus(health?.gemini_configured ? 'ready' : 'not_configured');
    } catch {
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, [check]);

  const config = {
    ready: { label: 'AI ready', dot: 'bg-success', text: 'text-success', message: 'Backend connected and Gemini is configured.' },
    not_configured: { label: 'AI not configured', dot: 'bg-warning', text: 'text-warning', message: 'Backend is running, but the Gemini API key is not set on the server.' },
    offline: { label: 'Backend offline', dot: 'bg-error', text: 'text-error', message: 'Could not reach the backend at VITE_API_BASE_URL. Start the API and try again.' },
    checking: { label: 'Checking…', dot: 'bg-ink-3', text: 'text-ink-3', message: 'Checking backend status…' },
  }[status];

  return (
    <button
      type="button"
      onClick={check}
      title={`${config.message} (click to re-check)`}
      aria-label={`Backend status: ${config.label}. Click to re-check.`}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-canvas-2"
    >
      <span className="relative flex h-2 w-2">
        {status !== 'offline' && status !== 'checking' && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${config.dot}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
      </span>
      <span className={`${compact ? 'hidden sm:inline' : ''} ${config.text}`}>{config.label}</span>
    </button>
  );
}