import { useState } from 'react';
import { Database, Monitor, Moon, Sun, Trash2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  getSettings,
  saveSettings,
  getResults,
  clearAllData,
  storageUsageBytes,
} from '../lib/storage.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Bright, high-contrast interface' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes, default theme' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow your device setting' },
];

const SUMMARY_OPTIONS = [
  { value: 'short', label: 'Short — quick essentials' },
  { value: 'medium', label: 'Medium — balanced detail' },
  { value: 'detailed', label: 'Detailed — most thorough' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner — first introduction' },
  { value: 'intermediate', label: 'Intermediate — more depth' },
];

const THEME_ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function SettingsPage() {
  useDocumentTitle('Settings');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [version, setVersion] = useState(0);
  const [clearOpen, setClearOpen] = useState(false);
  const [settings, setSettings] = useState(() => getSettings());

  const results = getResults();
  const savedCount = results.filter((item) => item.saved).length;
  const usageKB = (storageUsageBytes() / 1024).toFixed(1);

  function update(patch) {
    const next = saveSettings(patch);
    setSettings(next);
    setVersion((v) => v + 1);
    toast({ type: 'success', title: 'Settings saved' });
  }

  function handleClearAll() {
    clearAllData();
    setClearOpen(false);
    setSettings(getSettings());
    setTheme('dark');
    setVersion((v) => v + 1);
    toast({ type: 'success', title: 'All local data cleared' });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Preferences are stored only in this browser (localStorage)." />

      <Card className="p-5 sm:p-6">
        <h2 className="mb-1 text-base font-semibold text-ink">Appearance</h2>
        <p className="mb-4 text-sm text-ink-2">Choose how AI StudyMate looks on this device.</p>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Theme">
          {THEME_OPTIONS.map((option) => {
            const Icon = THEME_ICONS[option.value];
            const active = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => update({ theme: option.value })}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-brand bg-brand/10'
                    : 'border-line bg-canvas/40 hover:border-ink-3/50'
                }`}
              >
                <Icon size={18} className={active ? 'text-brand' : 'text-ink-3'} aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold text-ink">{option.label}</p>
                <p className="mt-0.5 text-xs text-ink-2">{option.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-1 text-base font-semibold text-ink">Default preferences</h2>
        <p className="mb-4 text-sm text-ink-2">
          These values are pre-selected when you open each tool.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="pref-summary"
            label="Default summary length"
            value={settings.defaultSummaryLength}
            onChange={(e) => update({ defaultSummaryLength: e.target.value })}
            options={SUMMARY_OPTIONS}
          />
          <Select
            id="pref-quiz"
            label="Default quiz difficulty"
            value={settings.defaultQuizDifficulty}
            onChange={(e) => update({ defaultQuizDifficulty: e.target.value })}
            options={DIFFICULTY_OPTIONS}
          />
          <Select
            id="pref-explain"
            label="Default explanation level"
            value={settings.defaultExplanationLevel}
            onChange={(e) => update({ defaultExplanationLevel: e.target.value })}
            options={LEVEL_OPTIONS}
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-ink">
          <Database size={17} className="text-brand" aria-hidden="true" />
          Your local data
        </h2>
        <p className="text-sm text-ink-2">
          Everything lives in this browser only. No account, no cloud sync, no server-side storage.
        </p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Study history entries', value: results.length },
            { label: 'Saved results', value: savedCount },
            { label: 'Storage used', value: `${usageKB} KB` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-line bg-canvas/40 px-4 py-3">
              <dt className="text-xs text-ink-3">{stat.label}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Clear all local data</p>
            <p className="text-sm text-ink-2">
              Deletes study history, saved results, and preferences from this browser.
            </p>
          </div>
          <Button variant="danger" onClick={() => setClearOpen(true)}>
            <Trash2 size={15} />
            Clear all data
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={clearOpen}
        onCancel={() => setClearOpen(false)}
        onConfirm={handleClearAll}
        title="Clear all local data?"
        message="This permanently deletes your study history, saved results, and preference settings from this browser. This cannot be undone."
        confirmLabel="Clear everything"
        danger
      />
    </div>
  );
}