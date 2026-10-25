import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'Do I need an account?',
    a: 'No. StudyMate is fully usable as a guest. History, saved results, and settings are stored in this browser, not tied to an account.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Generated results, saved items, and preferences are stored in your browser localStorage on this device. No account data, no cloud sync, no server-side user storage.',
  },
  {
    q: 'Is my study material sent to the Gemini API?',
    a: 'Yes — the text you paste is sent to the backend, which forwards it to the Gemini API one time to generate a result. After that, the result lives only in your browser. See the Privacy page for details.',
  },
  {
    q: 'Why does it say "Backend offline"?',
    a: 'The AI tools need the FastAPI backend running locally (start it with `uvicorn app.main:app` from the backend folder). The status pill in the top bar shows the real connection state and re-checks it every 30 seconds.',
  },
  {
    q: 'Why does it say "AI not configured"?',
    a: 'The backend is running but the server does not have the Gemini API key set (GEMINI_API_KEY). Add it to the backend .env file or your environment and restart the backend.',
  },
  {
    q: 'How long can my notes be?',
    a: 'Notes for summaries and quizzes accept 20–8,000 characters. Questions for the answer improver accept up to 2,000 characters and answers up to 5,000. Concepts accept 2–300 characters.',
  },
  {
    q: 'What happens if I clear my browser data?',
    a: 'Clearing site data or browser storage deletes your StudyMate history and settings. You can also clear them yourself in Settings → Clear all local data.',
  },
  {
    q: 'Can AI results be wrong?',
    a: 'Yes. Gemini results are generated instantly and may occasionally be inaccurate or outdated. Treat outputs as a study aid and verify important facts against your course material.',
  },
];

export default function HelpPage() {
  useDocumentTitle('Help & FAQ');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & FAQ"
        description="Quick answers about using AI StudyMate."
      />

      <Card className="divide-y divide-line">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-ink [&::-webkit-details-marker]:hidden">
              {faq.q}
              <span className="text-ink-3 transition group-open:rotate-45">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{faq.a}</p>
          </details>
        ))}
      </Card>

      <Alert type="info" title="Still stuck?">
        <p>
          This is a local project without live support. Check the GitHub issues page for the
          repository, or start the app yourself — the backend and frontend are documented in the
          project README.
        </p>
      </Alert>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-2">Ready to get back to studying?</p>
        <Link to="/dashboard">
          <Button variant="secondary">Back to workspace</Button>
        </Link>
      </div>
    </div>
  );
}