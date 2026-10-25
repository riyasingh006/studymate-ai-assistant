import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · AI StudyMate` : 'AI StudyMate';
    return () => {
      document.title = previous;
    };
  }, [title]);
}