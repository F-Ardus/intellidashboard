import { useCallback, useEffect, useState } from 'react';
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
  limit: 10,
};

const VALID_SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];
const VALID_TYPES: IndicatorType[] = ['ip', 'domain', 'hash', 'url'];

function parseFiltersFromUrl(): UIFilters {
  const params = new URLSearchParams(window.location.search);
  const severity = params.get('severity') as Severity;
  const type = params.get('type') as IndicatorType;

  return {
    search: params.get('q') ?? DEFAULT_FILTERS.search,
    severity: VALID_SEVERITIES.includes(severity) ? severity : undefined,
    type: VALID_TYPES.includes(type) ? type : undefined,
    source: params.get('source') ?? undefined,
    page: Number(params.get('page')) || DEFAULT_FILTERS.page,
    limit: Number(params.get('limit')) || DEFAULT_FILTERS.limit,
  };
}

function filtersToUrl(filters: UIFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('q', filters.search);
  if (filters.severity) params.set('severity', filters.severity);
  if (filters.type) params.set('type', filters.type);
  if (filters.source) params.set('source', filters.source);
  if (filters.page && filters.page !== 1) params.set('page', String(filters.page));
  if (filters.limit && filters.limit !== DEFAULT_FILTERS.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : window.location.pathname;
}

export function useFilters() {
  const [filters, setFilters] = useState<UIFilters>(parseFiltersFromUrl);

  useEffect(() => {
    history.replaceState(null, '', filtersToUrl(filters));
  }, [filters]);

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

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return { filters, setSearch, setSeverity, setType, setSource, setPage, setLimit, reset };
}
