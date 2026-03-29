import { useCallback, useState } from 'react';
import type { UIFilters } from './useFilters';

export interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<UIFilters>;
}

const STORAGE_KEY = 'augur-filter-presets';

function read(): FilterPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FilterPreset[];
  } catch {
    // ignore
  }
  return [];
}

function write(presets: FilterPreset[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // ignore
  }
}

export function useFilterPresets() {
  const [presets, setPresets] = useState<FilterPreset[]>(read);

  const savePreset = useCallback((name: string, filters: UIFilters) => {
    const { page: _page, limit: _limit, ...saveable } = filters;
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: name.trim(),
      filters: saveable,
    };
    setPresets((prev) => {
      const next = [...prev, preset];
      write(next);
      return next;
    });
  }, []);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      write(next);
      return next;
    });
  }, []);

  return { presets, savePreset, deletePreset };
}
