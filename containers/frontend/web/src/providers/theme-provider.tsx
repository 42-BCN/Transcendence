'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 1. Synchronous initialization based on current state (matches FOUC script)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';

    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored as Theme;
      }

      // If there is garbage in localStorage, clean it up to restore auto-mode
      if (stored) {
        localStorage.removeItem('theme');
      }
    } catch (e) {
      // Storage might be blocked (e.g. Incognito mode in some browsers)
      console.warn('ThemeProvider: localStorage access failed during init', e);
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 2. Real-time system listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Only follow system if NO manual override exists in localStorage
      try {
        if (!localStorage.getItem('theme')) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch (_) {
        // Fallback: if storage is blocked, we follow system anyway
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    setIsInitialized(true);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme, isInitialized]);

  const persistTheme = (value: Theme) => {
    try {
      localStorage.setItem('theme', value);
    } catch (e) {
      // Ignore storage persistence failures so the UI theme still updates.
      console.warn('ThemeProvider: Failed to persist theme to localStorage', e);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    persistTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    persistTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
