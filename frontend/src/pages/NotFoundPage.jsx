import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Compass size={28} aria-hidden="true" />
      </span>
      <h1 className="text-2xl font-bold text-ink">Page not found</h1>
      <p className="max-w-md text-sm text-ink-2">
        The page you are looking for does not exist or has moved. Head back to your workspace to
        keep studying.
      </p>
      <Link to="/dashboard">
        <Button>Back to workspace</Button>
      </Link>
    </div>
  );
}