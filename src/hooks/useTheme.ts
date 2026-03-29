import { useCallback, useEffect, useState } from 'react';

export type ThemeId = 'midnight' | 'light' | 'forest' | 'dusk' | 'terminal';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  bg: string;
  surface: string;
  sidebar: string;
  accent: string;
}

export const THEMES: ThemeMeta[] = [
  { id: 'midnight', name: 'Midnight', bg: '#0a0c10', surface: '#0f1117', sidebar: '#0d0f14', accent: '#6383ff' },
  { id: 'light',    name: 'Light',    bg: '#f0f2f5', surface: '#ffffff', sidebar: '#0d0f14', accent: '#4060e0' },
  { id: 'forest',   name: 'Forest',   bg: '#080d0a', surface: '#0d1410', sidebar: '#0a100c', accent: '#3dd9a0' },
  { id: 'dusk',     name: 'Dusk',     bg: '#0c0a14', surface: '#100e1a', sidebar: '#0e0c18', accent: '#a87aff' },
  { id: 'terminal', name: 'Terminal', bg: '#000000', surface: '#050505', sidebar: '#000000', accent: '#00ff41' },
];

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('augur-theme') as ThemeId) ?? 'midnight';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('augur-theme', theme);
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => setThemeState(id), []);

  return { theme, setTheme };
}
