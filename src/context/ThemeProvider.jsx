import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'rv-theme';
const ThemeContext = createContext(null);

function readTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* ignore */ }
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme);

  const applyTheme = useCallback((next, persist = true) => {
    if (next !== 'dark' && next !== 'light') return;
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      next === 'dark' ? '#080b17' : '#4f55ff'
    );
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    }
    window.dispatchEvent(new CustomEvent('rv-theme-change', { detail: next }));
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [applyTheme, theme]);

  useEffect(() => {
    applyTheme(theme, false);
  }, [applyTheme, theme]);

  const value = useMemo(() => ({ theme, toggleTheme, applyTheme }), [theme, toggleTheme, applyTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
