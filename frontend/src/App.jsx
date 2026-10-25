import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import ScrollToHash from './components/ScrollToHash.jsx';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import SummarizerTool from './pages/tools/SummarizerTool.jsx';
import QuizTool from './pages/tools/QuizTool.jsx';
import ImproverTool from './pages/tools/ImproverTool.jsx';
import ExplainerTool from './pages/tools/ExplainerTool.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/tools/summarizer" element={<SummarizerTool />} />
        <Route path="/tools/quiz" element={<QuizTool />} />
        <Route path="/tools/answer-improver" element={<ImproverTool />} />
        <Route path="/tools/concept-explainer" element={<ExplainerTool />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </>
  );
}