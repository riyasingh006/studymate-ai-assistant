// Navigation smoke test.
//
// Renders the whole <App /> on the server (via Vite's SSR loader) for every
// route and asserts that (a) each route renders without throwing, and
// (b) the expected page content and the landing nav link targets are present.
// This catches "route exists but the page crashes" and "nav link points at a
// dead target" regressions.
//
// Run: node navigation-smoke-test.mjs

import { createServer } from 'vite';
import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

const CASES = [
  {
    path: '/',
    contains: [
      'Study Smarter.',
      'Your Personal AI Study Companion',
      'href="/#features"',
      'href="/#how-it-works"',
      'href="/#about"',
      'href="/dashboard"',
      'Get Started',
      'id="features"',
      'id="how-it-works"',
      'id="about"',
      'Smarter Learning,',
      'Made for You.',
      'Student Experiences',
      'Learning That',
      'Feels Different.',
      'Aarav Sharma',
      'Ananya Verma',
      'Kabir Mehta',
      'Sample testimonials shown for demo purposes',
    ],
    excluded: ['href="/about"'],
    uniqueIds: ['about'],
  },
  {
    path: '/features',
    contains: [
      'Features',
      'Note Summarizer',
      'Quiz Generator',
      'Answer Improver',
      'Concept Explainer',
      'href="/tools/summarizer"',
    ],
  },
  {
    path: '/about',
    contains: [
      'About AI StudyMate',
      'Smarter Learning,',
      'Made for You.',
      'Save Time',
      'Learn Better',
      'Build Confidence',
      'Explore Features',
      'src="/images/about-study.png"',
      'href="/#features"',
    ],
  },
  { path: '/dashboard', contains: ['Overview'] },
  { path: '/tools/summarizer', contains: ['Note Summarizer'] },
  { path: '/tools/quiz', contains: ['Quiz Generator'] },
  { path: '/tools/answer-improver', contains: ['Answer Improver'] },
  { path: '/tools/concept-explainer', contains: ['Concept Explainer'] },
  { path: '/history', contains: ['Study History'] },
  { path: '/saved', contains: ['Saved Results'] },
  { path: '/settings', contains: ['Settings'] },
  { path: '/help', contains: ['Help &amp; FAQ'] },
  { path: '/privacy', contains: ['Privacy'] },
  { path: '/this-route-does-not-exist', contains: ['Page not found'] },
];

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

let passed = 0;
let failed = 0;

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { ThemeProvider } = await server.ssrLoadModule('/src/context/ThemeContext.jsx');
  const { ToastProvider } = await server.ssrLoadModule('/src/context/ToastContext.jsx');

  for (const { path, contains = [], excluded = [], uniqueIds = [] } of CASES) {
    let html;
    try {
      const router = createMemoryRouter([{ path: '*', element: React.createElement(App) }], {
        initialEntries: [path],
      });
      html = renderToString(
        React.createElement(ThemeProvider, null,
          React.createElement(ToastProvider, null,
            React.createElement(RouterProvider, { router })))
      );
    } catch (error) {
      failed += 1;
      console.error(`FAIL ${path} \u2014 rendered with error: ${error.message}`);
      continue;
    }

    const missing = contains.filter((text) => !html.includes(text));
    const present = excluded.filter((text) => html.includes(text));
    const nonUnique = uniqueIds.filter((id) => (html.match(new RegExp(`id="${id}"`, 'g')) || []).length !== 1);
    if (missing.length === 0 && present.length === 0 && nonUnique.length === 0) {
      passed += 1;
      console.log(`PASS ${path}`);
    } else {
      failed += 1;
      console.error(
        `FAIL ${path} \u2014 ` +
          (missing.length ? `missing: ${missing.join(', ')} ` : '') +
          (present.length ? `unexpected: ${present.join(', ')} ` : '') +
          (nonUnique.length ? `non-unique ids: ${nonUnique.join(', ')}` : '')
      );
    }
  }
} finally {
  await server.close();
}

console.log(`\nNAVIGATION-RESULT: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);