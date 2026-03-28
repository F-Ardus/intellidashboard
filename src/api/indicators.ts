import type { Indicator, IndicatorFilters, PaginatedResponse } from '../types/indicator';
import { apiFetch } from './client';

export function fetchIndicators(
  filters: IndicatorFilters,
  signal?: AbortSignal,
): Promise<PaginatedResponse<Indicator>> {
  return apiFetch<PaginatedResponse<Indicator>>(
    '/indicators',
    {
      page: filters.page,
      limit: filters.limit,
      severity: filters.severity,
      type: filters.type,
      search: filters.search,
    },
    signal,
  );
}

export function fetchIndicatorById(
  id: string,
  signal?: AbortSignal,
): Promise<Indicator> {
  return apiFetch<Indicator>(`/indicators/${id}`, undefined, signal);
}
