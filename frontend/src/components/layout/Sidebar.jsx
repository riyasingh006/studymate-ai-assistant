import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  Bookmark,
  FileText,
  GraduationCap,
  HelpCircle,
  History,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Moon,
  PenLine,
  Sun,
  X,
} from 'lucide-react';

const NAV = [
  {
    section: 'Overview',
    links: [
      { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ],
  },
  {
    section: 'AI Tools',
    links: [
      { to: '/tools/summarizer', label: 'Note Summarizer', icon: FileText },
      { to: '/tools/quiz', label: 'Quiz Generator', icon: ListChecks },
      { to: '/tools/answer-improver', label: 'Answer Improver', icon: PenLine },
      { to: '/tools/concept-explainer', label: 'Concept Explainer', icon: Lightbulb },
    ],
  },
  {
    section: 'Library',
    links: [
      { to: '/history', label: 'Study History', icon: History },
      { to: '/saved', label: 'Saved Results', icon: Bookmark },
    ],
  },
  {
    section: 'App',
    links: [
      { to: '/settings', label: 'Settings', icon: Moon },
      { to: '/help', label: 'Help & FAQ', icon: HelpCircle },
    ],
  },
];

function BrandLink({ collapsed }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 px-2 py-1 ${collapsed ? 'justify-center' : ''}`}
      aria-label="AI StudyMate home"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-[#031c1a]">
        <GraduationCap size={20} aria-hidden="true" />
      </span>
      {!collapsed && (
        <span className="text-base font-bold tracking-tight text-ink">AI StudyMate</span>
      )}
    </Link>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const { theme, toggle } = useTheme();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col gap-4 border-r border-line bg-canvas-2 px-3 pb-4 pt-5 transition-[width] duration-200 lg:flex ${
          collapsed ? 'w-16' : 'w-60'
        }`}
        aria-label="Primary navigation"
      >
        <BrandLink collapsed={collapsed} />
        <nav className="flex-1 space-y-4 overflow-y-auto">
          {NAV.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  {group.section}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.links.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                          isActive
                            ? 'bg-brand/15 text-brand'
                            : 'text-ink-2 hover:bg-canvas/60 hover:text-ink'
                        } ${collapsed ? 'justify-center' : ''}`
                      }
                    >
                      <item.icon size={18} aria-hidden="true" className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggle}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-2 transition hover:bg-canvas/60 hover:text-ink ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Toggle theme' : undefined}
        >
          {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <aside className="animate-fade-in relative flex h-full w-72 flex-col gap-4 border-r border-line bg-canvas-2 px-3 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <BrandLink />
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-2 text-ink-2 hover:bg-canvas/60 hover:text-ink"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 space-y-4 overflow-y-auto">
              {NAV.map((group) => (
                <div key={group.section}>
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-3">
                    {group.section}
                  </p>
                  <ul className="space-y-0.5">
                    {group.links.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                              isActive
                                ? 'bg-brand/15 text-brand'
                                : 'text-ink-2 hover:bg-canvas/60 hover:text-ink'
                            }`
                          }
                        >
                          <item.icon size={18} aria-hidden="true" className="shrink-0" />
                          <span>{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}