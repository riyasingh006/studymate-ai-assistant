import AboutSection from '../components/landing/AboutSection.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function AboutPage() {
  useDocumentTitle('About');

  return <AboutSection headingLevel="h1" />;
}