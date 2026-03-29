import { useCallback, useState } from 'react';

export type RowDensity = 'compact' | 'normal' | 'comfortable';

export interface TablePrefs {
  density: RowDensity;
  expandTags: boolean;
}

const STORAGE_KEY = 'augur-table-prefs';

const DEFAULTS: TablePrefs = {
  density: 'normal',
  expandTags: false,
};

function read(): TablePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULTS;
}

function write(prefs: TablePrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function useTablePrefs() {
  const [prefs, setPrefs] = useState<TablePrefs>(read);

  const setDensity = useCallback((density: RowDensity) => {
    setPrefs((prev) => {
      const next = { ...prev, density };
      write(next);
      return next;
    });
  }, []);

  const setExpandTags = useCallback((expandTags: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, expandTags };
      write(next);
      return next;
    });
  }, []);

  return { prefs, setDensity, setExpandTags };
}
