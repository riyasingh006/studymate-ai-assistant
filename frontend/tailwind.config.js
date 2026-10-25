/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas-rgb) / <alpha-value>)',
        'canvas-2': 'rgb(var(--canvas-2-rgb) / <alpha-value>)',
        card: 'rgb(var(--card-rgb) / <alpha-value>)',
        elevated: 'rgb(var(--elevated-rgb) / <alpha-value>)',
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        'brand-strong': 'rgb(var(--brand-strong-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-2': 'rgb(var(--ink-2-rgb) / <alpha-value>)',
        'ink-3': 'rgb(var(--ink-3-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        success: 'rgb(var(--success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--warning-rgb) / <alpha-value>)',
        error: 'rgb(var(--error-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: 'var(--shadow)',
        'card-lg': 'var(--shadow-lg)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.3s ease-out both',
        rise: 'rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'nav-in': 'nav-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'bg-in': 'bg-in 1.6s ease-out both',
        'drift-a': 'drift-a 26s ease-in-out infinite alternate',
        'drift-b': 'drift-b 34s ease-in-out infinite alternate',
        particle: 'particle 22s linear infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'nav-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bg-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'drift-a': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(60px, -40px, 0) scale(1.15)' },
        },
        'drift-b': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1.05)' },
          '100%': { transform: 'translate3d(-70px, 50px, 0) scale(0.95)' },
        },
        particle: {
          '0%': { opacity: '0', transform: 'translate3d(0, 0, 0) scale(1)' },
          '12%': { opacity: '0.8' },
          '80%': { opacity: '0.4' },
          '100%': {
            opacity: '0',
            transform: 'translate3d(var(--px, 40px), -56vh, 0) scale(0.5)',
          },
        },
      },
    },
  },
  plugins: [],
};