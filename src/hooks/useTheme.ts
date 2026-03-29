import { useCallback, useEffect, useState } from 'react';

export type ThemeId = 'system' | 'midnight' | 'light' | 'forest' | 'dusk' | 'terminal';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  bg: string;
  surface: string;
  sidebar: string;
  accent: string;
}

export const THEMES: ThemeMeta[] = [
  { id: 'system',   name: 'System',   bg: '#0a0c10', surface: '#0f1117', sidebar: '#0d0f14', accent: '#6383ff' },
  { id: 'midnight', name: 'Midnight', bg: '#0a0c10', surface: '#0f1117', sidebar: '#0d0f14', accent: '#6383ff' },
  { id: 'light',    name: 'Light',    bg: '#f0f2f5', surface: '#ffffff', sidebar: '#0d0f14', accent: '#4060e0' },
  { id: 'forest',   name: 'Forest',   bg: '#080d0a', surface: '#0d1410', sidebar: '#0a100c', accent: '#3dd9a0' },
  { id: 'dusk',     name: 'Dusk',     bg: '#0c0a14', surface: '#100e1a', sidebar: '#0e0c18', accent: '#a87aff' },
  { id: 'terminal', name: 'Terminal', bg: '#000000', surface: '#050505', sidebar: '#000000', accent: '#00ff41' },
];

/** Resolve 'system' to the actual data-theme value to apply */
function resolveTheme(id: ThemeId): string {
  if (id !== 'system') return id;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'midnight';
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('augur-theme') as ThemeId) ?? 'system';
  });

  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-theme', resolveTheme(theme));
    };

    apply();
    localStorage.setItem('augur-theme', theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => setThemeState(id), []);

  return { theme, setTheme };
}
