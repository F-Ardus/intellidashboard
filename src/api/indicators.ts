import type { Indicator, IndicatorFilters, PaginatedResponse } from '../types/indicator';
import { apiFetch } from './client';

interface FetchIndicatorsParams extends IndicatorFilters {
  source?: string;
  tags?: string[];
}

export function fetchIndicators(
  filters: FetchIndicatorsParams,
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
      source: filters.source,
      tags: filters.tags && filters.tags.length > 0 ? filters.tags.join(',') : undefined,
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
