import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Menu,
  Moon,
  MousePointerClick,
  PenLine,
  Sparkles,
  Sun,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useTheme } from '../context/ThemeContext.jsx';
import AboutSection from '../components/landing/AboutSection.jsx';
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx';

// Ordered navbar items. Route items use <NavLink> (SPA navigation); section
// items use <SectionLink> (smooth-scroll on the landing page, or navigate to
// the hashed URL from other routes so <ScrollToHash /> takes over).
const NAV_ITEMS = [
  { type: 'route', label: 'Home', to: '/', end: true },
  { type: 'section', label: 'Features', id: 'features' },
  { type: 'section', label: 'How It Works', id: 'how-it-works' },
  { type: 'section', label: 'About', id: 'about' },
  { type: 'section', label: 'Experiences', id: 'experiences' },
];

// Router-aware anchor for a section on the landing page. From the landing page
// it smooth-scrolls in place; from any other route it navigates to the hashed
// URL, where <ScrollToHash /> takes over. Back/forward stay intact.
function SectionLink({ href, id, label, className = '', onNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [to, hash] = href.split('#');

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        if (pathname === to) {
          const target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          navigate(href);
        }
        onNavigate?.();
      }}
    >
      {label}
    </a>
  );
}

const TRUST_ITEMS = [
  { icon: Zap, label: 'AI-Powered Learning' },
  { icon: MousePointerClick, label: 'Simple & Intuitive' },
  { icon: Workflow, label: 'Your Study Workflow' },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Note Summarizer',
    text: 'Condense long notes into clear, structured summaries with key points and definitions.',
    path: '/tools/summarizer',
  },
  {
    icon: ListChecks,
    title: 'Quiz Generator',
    text: 'Turn your material into practice questions with answers and explanations.',
    path: '/tools/quiz',
  },
  {
    icon: PenLine,
    title: 'Answer Improver',
    text: 'Polish drafts and answers with AI feedback on clarity, structure, and depth.',
    path: '/tools/answer-improver',
  },
  {
    icon: Lightbulb,
    title: 'Concept Explainer',
    text: 'Break down difficult concepts into step-by-step explanations with examples.',
    path: '/tools/concept-explainer',
  },
];

const STEPS = [
  {
    title: 'Add Your Material',
    text: 'Paste your notes, a slide, a question, or a concept you want to work through.',
  },
  {
    title: 'Choose Your Tool',
    text: 'Pick the study tool that fits — summarize, quiz, improve, or explain.',
  },
  {
    title: 'Learn and Review',
    text: 'Test yourself, review feedback, and save what matters for exam day.',
  },
];

const PRIMARY_BTN =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-7 text-base font-semibold text-[#031c1a] shadow-card transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:brightness-95';
const NAV_CTA =
  'inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-[#031c1a] transition hover:brightness-110';

const PARTICLES = [
  { left: '6%', top: '55%', size: 3, duration: '19s', delay: '-2s', driftX: 46, opacity: 0.55 },
  { left: '14%', top: '76%', size: 2, duration: '24s', delay: '-9s', driftX: -32, opacity: 0.4 },
  { left: '22%', top: '38%', size: 2, duration: '21s', delay: '-14s', driftX: 28, opacity: 0.45 },
  { left: '30%', top: '84%', size: 3, duration: '26s', delay: '-4s', driftX: -44, opacity: 0.5 },
  { left: '41%', top: '62%', size: 2, duration: '18s', delay: '-11s', driftX: 36, opacity: 0.35 },
  { left: '50%', top: '90%', size: 2, duration: '23s', delay: '-7s', driftX: -24, opacity: 0.5 },
  { left: '58%', top: '48%', size: 3, duration: '20s', delay: '-16s', driftX: 40, opacity: 0.4 },
  { left: '66%', top: '80%', size: 2, duration: '25s', delay: '-1s', driftX: -36, opacity: 0.55 },
  { left: '73%', top: '34%', size: 2, duration: '22s', delay: '-13s', driftX: 30, opacity: 0.4 },
  { left: '81%', top: '70%', size: 3, duration: '19s', delay: '-6s', driftX: -26, opacity: 0.5 },
  { left: '88%', top: '52%', size: 2, duration: '24s', delay: '-18s', driftX: 34, opacity: 0.45 },
  { left: '94%', top: '84%', size: 2, duration: '21s', delay: '-3s', driftX: -40, opacity: 0.4 },
];

function AmbientBackground() {
  return (
    <div className="animate-bg-in pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 15% 0%, rgb(var(--brand-rgb) / 0.09), transparent 60%), radial-gradient(55% 45% at 90% 8%, rgb(var(--accent-rgb) / 0.08), transparent 60%), radial-gradient(60% 50% at 50% 115%, rgb(var(--brand-rgb) / 0.06), transparent 60%)',
        }}
      />
      <div className="animate-drift-a absolute -left-32 top-1/4 h-[44vmax] w-[44vmax] rounded-full bg-brand/10 blur-[130px]" />
      <div className="animate-drift-b absolute -right-40 -top-20 h-[36vmax] w-[36vmax] rounded-full bg-accent/10 blur-[120px]" />
      <div className="animate-drift-a absolute bottom-[-18vmax] left-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[150px] [animation-delay:-12s]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)',
          backgroundSize: '76px 76px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 18%, black 30%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 55% at 50% 18%, black 30%, transparent 78%)',
        }}
      />
      <div className="bg-noise absolute inset-0 opacity-[0.035] mix-blend-soft-light" />
      <div className="absolute inset-0">
        {PARTICLES.map((p, index) => (
          <span
            key={index}
            className="animate-particle absolute rounded-full bg-accent"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
              '--px': `${p.driftX}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const solid = scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`animate-nav-in fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-line/70 bg-canvas/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-[#031c1a]">
            <GraduationCap size={20} aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-ink">AI StudyMate</span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          aria-label="Main"
        >
          {NAV_ITEMS.map((item) =>
            item.type === 'route' ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <SectionLink
                key={item.label}
                href={`/#${item.id}`}
                id={item.id}
                label={item.label}
                className="text-sm font-medium text-ink-2 transition hover:text-ink"
              />
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border border-line bg-card p-2 text-ink-2 transition hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            to="/dashboard"
            className={`${NAV_CTA} hidden sm:inline-flex`}
          >
            Get Started
          </Link>
          <button
            type="button"
            className="rounded-lg border border-line bg-card p-2 text-ink-2 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="animate-fade-in absolute inset-x-0 top-full border-t border-line bg-canvas/95 px-4 py-3 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
            item.type === 'route' ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-canvas-2 hover:text-ink ${
                    isActive ? 'bg-canvas-2 text-ink' : 'text-ink-2'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <SectionLink
                key={item.label}
                href={`/#${item.id}`}
                id={item.id}
                label={item.label}
                onNavigate={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition hover:bg-canvas-2 hover:text-ink"
              />
            ),
          )}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-[#031c1a]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-2/40">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgb(var(--brand-rgb) / 0.08), transparent 70%)',
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-[#031c1a]">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink">AI StudyMate</span>
          </Link>
          <p className="mt-4 text-base font-medium text-ink">
            Your AI-powered companion for smarter learning.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
            Turn your study material into summaries, quizzes, improved answers, and clear
            explanations with the power of AI.
          </p>
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Learn Smarter. Achieve More.
          </h2>
          <p className="mt-2 text-sm text-ink-2 sm:text-base">
            Your next breakthrough starts with what you learn today.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="border-t border-line/70" />
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-ink-3">© 2026 AI StudyMate. All rights reserved.</p>
            <p className="text-xs text-ink-3">
              AI-generated content may contain errors. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useDocumentTitle('Make Your Next Study Session Count');

  return (
    <div className="min-h-screen bg-canvas">
      <LandingNav />

      {/* Hero */}
      <section className="relative flex min-h-screen min-h-svh items-center justify-center overflow-hidden">
        <AmbientBackground />
        <div className="relative mx-auto w-full max-w-4xl px-5 pt-28 pb-20 text-center sm:pt-32 sm:pb-24">
          <span
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand"
            style={{ animationDelay: '0.15s' }}
          >
            <Sparkles size={13} aria-hidden="true" />
            Your Personal AI Study Companion
          </span>

          <h1
            className="animate-rise mt-7 text-[clamp(2.6rem,6.2vw,6rem)] font-extrabold leading-[1.05] tracking-tight text-ink"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="block">Study Smarter.</span>
            <span className="mt-1 block bg-gradient-to-r from-brand to-accent bg-clip-text pb-2 text-transparent">
              Understand More.
            </span>
          </h1>

          <p
            className="animate-rise mx-auto mt-6 max-w-[680px] text-base leading-relaxed text-ink-2 sm:text-lg"
            style={{ animationDelay: '0.45s' }}
          >
            Turn your notes into clear summaries, test your knowledge with interactive quizzes, and
            master difficult concepts with AI-powered study tools.
          </p>

          <div
            className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.6s' }}
          >
            <Link to="/dashboard" className={PRIMARY_BTN}>
              Start Learning
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line bg-elevated/60 px-7 text-base font-medium text-ink transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-canvas-2 hover:text-ink"
            >
              Explore Features
            </a>
          </div>

          <ul
            className="animate-rise mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            style={{ animationDelay: '0.78s' }}
          >
            {TRUST_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm text-ink-2">
                <item.icon size={16} className="text-brand" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-y border-line bg-canvas-2/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Features</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Everything You Need to Study Better
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-2">
              Four focused tools. One smarter study workflow.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                to={feature.path}
                className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card-lg"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/0 via-brand/70 to-accent/0 opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <feature.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{feature.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Open tool
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              How it works
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              From Notes to Understanding
            </h2>
          </div>
          <div className="relative mt-16">
            <div
              className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block"
              aria-hidden="true"
            />
            <ol className="grid gap-10 lg:grid-cols-3 lg:gap-6">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex flex-col items-start gap-4 lg:items-center lg:text-center"
                >
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-canvas text-lg font-bold text-brand shadow-card">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-2 lg:mx-auto">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* About */}
      <AboutSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-line bg-canvas-2/40">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-28">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Make Your Next Study Session Count.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-2">
            Spend less time organizing your material and more time understanding what you learn.
          </p>
          <Link to="/dashboard" className={`${PRIMARY_BTN} mt-9`}>
            Start Learning
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}