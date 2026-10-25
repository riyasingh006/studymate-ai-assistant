import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Target, User, Zap } from 'lucide-react';

const BENEFITS = [
  {
    icon: Zap,
    title: 'Save Time',
    text: 'Focus on what matters most.',
  },
  {
    icon: Target,
    title: 'Learn Better',
    text: 'Understand difficult concepts step by step.',
  },
  {
    icon: User,
    title: 'Build Confidence',
    text: 'Practice, improve, and track your progress.',
  },
];

const ABOUT_CSS = `
  @keyframes as-fade-up {
    from { opacity: 0; transform: translate3d(0, 14px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes as-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .as-fade-up { animation: as-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .as-fade-in { animation: as-fade-in 0.9s ease-out 0.15s both; }
  .as-img-mask {
    -webkit-mask-image: radial-gradient(ellipse 72% 64% at 50% 48%, #000 55%, transparent 95%);
    mask-image: radial-gradient(ellipse 72% 64% at 50% 48%, #000 55%, transparent 95%);
  }
`;

// Router-aware CTA that scrolls to the landing page's #features section, or
// navigates to "/#features" from any other page. Mirrors the landing nav's
// SectionLink behavior so the existing navigation architecture stays intact.
function ExploreFeaturesButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <a
      href="/#features"
      onClick={(event) => {
        event.preventDefault();
        if (pathname === '/') {
          const target = document.getElementById('features');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          navigate('/#features');
        }
      }}
      className="group mt-10 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#00e5e5] to-[#16d9f5] px-9 text-base font-bold text-[#03111d] shadow-[0_10px_36px_rgba(0,229,229,0.3)] transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
    >
      Explore Features
      <ArrowRight size={18} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

// Shared About section: rendered on the landing page as `#about` and on the
// standalone /about route. `headingLevel` keeps one semantic h1 on the /about
// page while the landing page renders it as an h2 (the Hero owns the h1).
export default function AboutSection({ headingLevel: Heading = 'h2' }) {
  return (
    <section
      id="about"
      className="scroll-mt-20 relative overflow-hidden border-y border-[#16d9f5]/10 bg-gradient-to-br from-[#03111d] via-[#051722] to-[#061a28]"
    >
      <style>{ABOUT_CSS}</style>

      {/* Subtle dark-ocean background shapes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-28 -top-24 h-80 w-80 rounded-full border border-[#16d9f5]/10" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full border border-dashed border-[#00e5e5]/10" />
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#00e5e5]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* LEFT COLUMN */}
          <div className="as-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16d9f5]/40 bg-[#16d9f5]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#16d9f5]">
              <span aria-hidden="true">&#10022;</span>
              About AI StudyMate
            </span>

            <Heading className="mt-6 text-[2.4rem] font-extrabold leading-[1.06] tracking-tight text-[#f4f8ff] sm:text-5xl lg:text-[3.25rem]">
              Smarter Learning,
              <span className="mt-1 block bg-gradient-to-r from-[#00e5e5] to-[#16d9f5] bg-clip-text pb-2 text-transparent">
                Made for You.
              </span>
            </Heading>

            <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-[#b7c9d8] sm:text-base">
              AI StudyMate helps students turn study material into clear summaries, practice
              quizzes, improved answers, and easy-to-understand explanations.
            </p>

            <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-3">
              {BENEFITS.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00e5e5]/40 bg-[#00e5e5]/5 text-[#00e5e5]">
                    <benefit.icon size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#f4f8ff]">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-[#95adbf]">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <ExploreFeaturesButton />
          </div>

          {/* RIGHT COLUMN — study illustration */}
          <div className="as-fade-in relative">
            <div
              className="absolute left-1/2 top-1/2 h-[62%] w-[88%] max-w-[430px] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  'radial-gradient(50% 50% at 50% 50%, rgba(0, 229, 229, 0.16), transparent 72%)',
              }}
              aria-hidden="true"
            />
            <img
              src="/images/about-study.png"
              alt="Student wearing headphones studying at a laptop with notes, pen, and books"
              loading="lazy"
              className="as-img-mask relative mx-auto h-auto w-full max-w-[460px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}