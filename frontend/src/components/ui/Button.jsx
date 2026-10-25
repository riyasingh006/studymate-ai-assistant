const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60';

const variants = {
  primary: 'bg-brand text-[#031c1a] hover:brightness-110 active:brightness-95',
  secondary: 'border border-line bg-elevated text-ink-2 hover:bg-canvas-2 hover:text-ink',
  ghost: 'text-ink-2 hover:bg-canvas-2 hover:text-ink',
  danger: 'bg-error text-white hover:brightness-110',
  subtle: 'text-brand hover:bg-brand/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
}