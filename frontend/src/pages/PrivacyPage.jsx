import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function PrivacyPage() {
  useDocumentTitle('Privacy');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Privacy"
        description="What AI StudyMate does with your data — in plain language."
      />

      <Card className="p-5 sm:p-6">
        <h2 className="text-base font-semibold text-ink">The short version</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          AI StudyMate does not have accounts and does not run its own user database. Your input is
          sent to Google&apos;s Gemini API to generate a result, and everything you keep (history,
          saved results, settings) is stored only in your browser.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="font-semibold text-ink">What we handle</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-ink-2">
            <li className="flex gap-2.5">
              <span className="text-brand">›</span>
              The text you paste into a tool is sent to the local FastAPI backend and forwarded to
              the Gemini API, once, to generate the requested result.
            </li>
            <li className="flex gap-2.5">
              <span className="text-brand">›</span>
              Study history, saved results, and preference settings are written to this browser&apos;s
              localStorage. They never leave this device.
            </li>
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="font-semibold text-ink">What we do not handle</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-ink-2">
            <li className="flex gap-2.5">
              <span className="text-error">×</span>
              No sign-up, logins, or user profiles — no personal accounts exist.
            </li>
            <li className="flex gap-2.5">
              <span className="text-error">×</span>
              No tracking, analytics, advertising, or cookies beyond what the sites you link
              (Google Fonts) may set on their own domains.
            </li>
            <li className="flex gap-2.5">
              <span className="text-error">×</span>
              We never store or log your input text on a server after processing.
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <h3 className="font-semibold text-ink">Third parties</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-2">
          <li className="flex gap-2.5">
            <span className="text-brand">›</span>
            <span>
              <strong className="text-ink">Google Gemini API</strong> — processes the text you submit
              to generate results. Your use is subject to Google&apos;s terms and data policy.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-brand">›</span>
            <span>
              <strong className="text-ink">Google Fonts</strong> — served from
              fonts.googleapis.com only for typography; loading it may share your IP with Google.
            </span>
          </li>
        </ul>
      </Card>

      <Card className="p-5 sm:p-6">
        <h3 className="font-semibold text-ink">Your control</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Because everything is local, deletion is instant and final. Delete individual results in
          Study History or Saved Results, or clear everything under Settings → Clear all local data.
          Clearing your browser&apos;s site data achieves the same thing.
        </p>
      </Card>
    </div>
  );
}