import { Quote } from 'lucide-react';

// DEMO CONTENT — sample testimonials for layout purposes only. These are not
// real student endorsements and must be clearly identified as sample until
// genuine testimonials are collected.
const TESTIMONIALS = [
  {
    quote:
      'AI StudyMate makes revision easier by turning lengthy notes into clear summaries and important points.',
    name: 'Aarav Sharma',
    role: 'College Student',
  },
  {
    quote:
      'The quiz feature helps me test my understanding before exams. The explanations make difficult topics easier to revise.',
    name: 'Ananya Verma',
    role: 'Undergraduate Student',
  },
  {
    quote:
      'I like having summaries, answer improvement, and concept explanations in one place. It makes my study workflow more organized.',
    name: 'Kabir Mehta',
    role: 'University Student',
  },
];

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}

export default function TestimonialsSection() {
  return (
    <section id="experiences" className="scroll-mt-24 border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        {/* Section header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Student Experiences
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Learning That{' '}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              Feels Different.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-2">
            Discover how AI StudyMate helps students organize their notes, practice smarter, and
            understand difficult concepts with confidence.
          </p>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas-2/50 px-3 py-1 text-xs text-ink-3">
            Sample testimonials shown for demo purposes | Real student reviews coming soon.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.name}
              className="group relative flex h-full flex-col rounded-2xl border border-line bg-card p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card-lg"
            >
              <span className="absolute right-5 top-5 rounded-full border border-line/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-3">
                Sample
              </span>
              <Quote size={26} className="text-brand/25" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-2">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line/70 pt-5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-sm font-bold text-brand"
                  aria-hidden="true"
                >
                  {initialsOf(item.name)}
                </span>
                <div>
                  <div className="font-semibold text-ink">{item.name}</div>
                  <div className="text-sm text-ink-3">{item.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}