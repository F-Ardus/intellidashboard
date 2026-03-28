import { useCallback, useState } from 'react';
import type { Indicator } from '../types/indicator';

export type SortField = 'value' | 'type' | 'severity' | 'source' | 'confidence' | 'lastSeen';
export type SortDir = 'asc' | 'desc';

export interface SortState {
  field: SortField | null;
  dir: SortDir;
}

const SEVERITY_RANK: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortIndicators(indicators: Indicator[], sort: SortState): Indicator[] {
  if (!sort.field) return indicators;
  const { field, dir } = sort;

  return [...indicators].sort((a, b) => {
    let cmp = 0;
    if (field === 'lastSeen') {
      cmp = new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime();
    } else if (field === 'confidence') {
      cmp = a.confidence - b.confidence;
    } else if (field === 'severity') {
      cmp = (SEVERITY_RANK[a.severity] ?? 0) - (SEVERITY_RANK[b.severity] ?? 0);
    } else if (field === 'value') {
      cmp = a.value.localeCompare(b.value);
    } else if (field === 'type') {
      cmp = a.type.localeCompare(b.type);
    } else if (field === 'source') {
      cmp = a.source.localeCompare(b.source);
    }
    return dir === 'asc' ? cmp : -cmp;
  });
}

export function useSort() {
  const [sort, setSort] = useState<SortState>({ field: null, dir: 'desc' });

  const toggleSort = useCallback((field: SortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, dir: prev.dir === 'desc' ? 'asc' : 'desc' };
      }
      return { field, dir: 'desc' };
    });
  }, []);

  return { sort, toggleSort };
}
