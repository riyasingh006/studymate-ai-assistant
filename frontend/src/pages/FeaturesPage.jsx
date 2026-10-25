import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Lightbulb, ListChecks, PenLine, ShieldCheck, Zap } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const TOOLS = [
  {
    icon: FileText,
    title: 'Note Summarizer',
    path: '/tools/summarizer',
    points: [
      'Pastes up to 8,000 characters of notes or lecture text',
      'Returns a main topic, key points, and important definitions',
      'Flags important facts and ends with a one-line revision summary',
      'Three detail levels: short, medium, or detailed',
    ],
  },
  {
    icon: ListChecks,
    title: 'Quiz Generator',
    path: '/tools/quiz',
    points: [
      'Creates 3–10 multiple-choice questions from your material',
      'Three difficulty levels to match where you are',
      'Built-in practice runner with instant feedback and explanations',
      'Shows your final score and lets you restart',
    ],
  },
  {
    icon: PenLine,
    title: 'Answer Improver',
    path: '/tools/answer-improver',
    points: [
      'Takes a question and your draft answer',
      'Rewrites the answer while keeping your good points',
      'Lists exactly which points were missing',
      'Explains what changed and why it is stronger',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Concept Explainer',
    path: '/tools/concept-explainer',
    points: [
      'Explains any concept in plain language',
      'Beginner or intermediate level',
      'Breaks the idea into clear steps',
      'Includes a concrete example and a one-line takeaway',
    ],
  },
];

export default function FeaturesPage() {
  useDocumentTitle('Features');

  return (
    <div className="space-y-10">
      <PageHeader
        title="Features"
        description="Four focused AI tools that turn your raw study material into something you can actually revise with."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {TOOLS.map((tool) => (
          <Card key={tool.title} className="p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <tool.icon size={22} aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-ink">{tool.title}</h2>
            <ul className="mt-3 space-y-2">
              {tool.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm text-ink-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              to={tool.path}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              Open {tool.title.split(' ')[0].toLowerCase()} tool
              <ArrowRight size={14} />
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-start gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <ShieldCheck size={19} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold text-ink">Private by design</h3>
            <p className="mt-1 text-sm text-ink-2">
              Your input is sent to Gemini once to produce a result. History and saved results stay
              only in this browser — no account or server-side storage.
            </p>
          </div>
        </Card>
        <Card className="flex items-start gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Zap size={19} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-semibold text-ink">Fast, structured output</h3>
            <p className="mt-1 text-sm text-ink-2">
              Every result follows a strict schema — lists, definitions, and explanations — so the
              output is consistent and easy to copy into your notes.
            </p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-6 py-8 text-center">
        <h2 className="text-xl font-bold text-ink">Ready to try it?</h2>
        <p className="max-w-md text-sm text-ink-2">
          Open a tool and paste in your notes. No sign-up, no install — just paste and generate.
        </p>
        <Link to="/dashboard">
          <Button>
            Open the workspace
            <ArrowRight size={15} />
          </Button>
        </Link>
      </div>
    </div>
  );
}