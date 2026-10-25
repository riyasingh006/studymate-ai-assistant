import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function Toast({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info;
  const accent = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-accent',
  }[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-slide-up flex items-start gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-card-lg"
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${accent}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-sm font-semibold text-ink">{toast.title}</p>}
        {toast.message && <p className="mt-0.5 text-sm text-ink-2">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-ink-3 transition hover:bg-canvas-2 hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timerRef.current[id]) {
      clearTimeout(timerRef.current[id]);
      delete timerRef.current[id];
    }
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 4500 }) => {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      timerRef.current[id] = setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
}