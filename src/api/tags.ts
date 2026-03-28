import { apiFetch } from './client';

interface FetchTagsParams {
  severity?: string;
  type?: string;
  search?: string;
  source?: string;
  tags?: string[];
}

export function fetchAvailableTags(
  params: FetchTagsParams,
  signal?: AbortSignal,
): Promise<{ tags: string[] }> {
  return apiFetch<{ tags: string[] }>(
    '/tags',
    {
      severity: params.severity,
      type: params.type,
      search: params.search,
      source: params.source,
      tags: params.tags && params.tags.length > 0 ? params.tags.join(',') : undefined,
    },
    signal,
  );
}
