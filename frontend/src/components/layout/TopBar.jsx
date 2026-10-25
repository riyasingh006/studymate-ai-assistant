import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ChevronLeft, Menu, Moon, Sun } from 'lucide-react';
import BackendStatus from './BackendStatus.jsx';

const TITLES = {
  '/dashboard': 'Overview',
  '/features': 'Features',
  '/history': 'Study History',
  '/saved': 'Saved Results',
  '/settings': 'Settings',
  '/help': 'Help & FAQ',
  '/about': 'About',
  '/privacy': 'Privacy',
  '/tools/summarizer': 'Note Summarizer',
  '/tools/quiz': 'Quiz Generator',
  '/tools/answer-improver': 'Answer Improver',
  '/tools/concept-explainer': 'Concept Explainer',
};

export default function TopBar({ onOpenNav }) {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const title = TITLES[pathname] || 'AI StudyMate';

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNav}
            className="rounded-lg border border-line bg-card p-2 text-ink-2 hover:text-ink lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link to="/dashboard" className="hidden text-ink-3 transition hover:text-ink sm:block">
              Home
            </Link>
            <ChevronLeft size={14} className="hidden rotate-180 text-ink-3 sm:block" aria-hidden="true" />
            <h1 className="truncate text-base font-semibold text-ink">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BackendStatus compact />
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border border-line bg-card p-2 text-ink-2 transition hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-line bg-card px-2.5 py-1.5 transition hover:bg-canvas-2"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                G
              </span>
              <span className="hidden text-sm font-medium text-ink-2 sm:block">Guest</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-line bg-card p-2 shadow-card-lg">
                <p className="px-2 py-1 text-xs font-medium text-ink-3">Signed in as</p>
                <p className="px-2 pb-2 text-sm font-medium text-ink">Guest (local only)</p>
                <div className="border-t border-line pt-2">
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-2 py-1.5 text-sm text-ink-2 transition hover:bg-canvas-2 hover:text-ink"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-2 py-1.5 text-sm text-ink-2 transition hover:bg-canvas-2 hover:text-ink"
                  >
                    Help &amp; FAQ
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 cursor-default"
          aria-label="Close user menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}