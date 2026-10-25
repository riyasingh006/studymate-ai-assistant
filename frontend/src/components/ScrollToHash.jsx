import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router does not scroll to a `#hash` target when the navigation is a
// client-side route change (e.g. clicking a Link to "/#how-it-works" while on
// another page). This handler closes that gap: whenever the location carries a
// hash, it scrolls the matching element into view after the new route paints.
//
// Sections use `scroll-margin-top` (see LandingPage), so the fixed landing nav
// never covers the target. It runs only for hashed locations and never touches
// plain route changes, leaving <ScrollRestoration /> in AppShell in charge of
// scroll restoration for the app pages.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const id = hash.startsWith('#') ? hash.slice(1) : hash;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}