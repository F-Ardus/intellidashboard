import { useCallback, useState } from 'react';
import type { IndicatorFilters, IndicatorType, Severity } from '../types/indicator';

export interface UIFilters extends IndicatorFilters {
  source?: string;
}

const DEFAULT_FILTERS: UIFilters = {
  search: '',
  severity: undefined,
  type: undefined,
  source: undefined,
  page: 1,
  limit: 20,
};

export function useFilters() {
  const [filters, setFilters] = useState<UIFilters>(DEFAULT_FILTERS);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setSeverity = useCallback((severity: Severity | undefined) => {
    setFilters((prev) => ({ ...prev, severity, page: 1 }));
  }, []);

  const setType = useCallback((type: IndicatorType | undefined) => {
    setFilters((prev) => ({ ...prev, type, page: 1 }));
  }, []);

  const setSource = useCallback((source: string | undefined) => {
    setFilters((prev) => ({ ...prev, source, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return { filters, setSearch, setSeverity, setType, setSource, setPage, reset };
}
