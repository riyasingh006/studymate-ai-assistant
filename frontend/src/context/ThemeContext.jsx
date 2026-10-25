import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSettings, saveSettings } from '../lib/storage.js';

const ThemeContext = createContext(null);

function systemPrefersLight() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches
  );
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getSettings().theme);

  useEffect(() => {
    const root = document.documentElement;
    const resolved =
      theme === 'system' ? (systemPrefersLight() ? 'light' : 'dark') : theme;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    saveSettings({ theme });
  }, [theme]);

  // React to OS changes while in "system" mode.
  useEffect(() => {
    if (theme !== 'system') return undefined;
    const media = window.matchMedia?.('(prefers-color-scheme: light)');
    if (!media) return undefined;
    const onChange = () => {
      const root = document.documentElement;
      root.classList.toggle('dark', !media.matches);
      root.style.colorScheme = media.matches ? 'light' : 'dark';
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () =>
        setTheme((current) =>
          current === 'dark'
            ? 'light'
            : current === 'light'
              ? 'dark'
              : systemPrefersLight()
                ? 'dark'
                : 'light'
        ),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return context;
}