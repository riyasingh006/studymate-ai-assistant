import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const styles = {
  info: { box: 'border-accent/40 bg-accent/10', icon: 'text-accent', Icon: Info },
  success: { box: 'border-success/40 bg-success/10', icon: 'text-success', Icon: CheckCircle2 },
  warning: { box: 'border-warning/40 bg-warning/10', icon: 'text-warning', Icon: AlertTriangle },
  error: { box: 'border-error/40 bg-error/10', icon: 'text-error', Icon: XCircle },
};

export default function Alert({ type = 'info', title, children, className = '' }) {
  const { box, icon, Icon } = styles[type];
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${box} ${className}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${icon}`} aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="text-sm font-semibold text-ink">{title}</p>}
        {children && <div className="text-sm text-ink-2">{children}</div>}
      </div>
    </div>
  );
}