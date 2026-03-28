import { useState } from 'react';
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

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }

  function setSeverity(severity: Severity | undefined) {
    setFilters((prev) => ({ ...prev, severity, page: 1 }));
  }

  function setType(type: IndicatorType | undefined) {
    setFilters((prev) => ({ ...prev, type, page: 1 }));
  }

  function setSource(source: string | undefined) {
    setFilters((prev) => ({ ...prev, source, page: 1 }));
  }

  function setPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  function reset() {
    setFilters(DEFAULT_FILTERS);
  }

  return { filters, setSearch, setSeverity, setType, setSource, setPage, reset };
}
