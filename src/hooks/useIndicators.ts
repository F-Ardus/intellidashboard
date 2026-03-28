import { useEffect, useState } from 'react';
import { fetchIndicators } from '../api/indicators';
import type { Indicator } from '../types/indicator';
import type { UIFilters } from './useFilters';

interface UseIndicatorsResult {
  data: Indicator[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function useIndicators(filters: UIFilters): UseIndicatorsResult {
  const [data, setData] = useState<Indicator[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { search, severity, type, source, page: filtersPage, limit } = filters;

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchIndicators(
      { search, severity, type, page: filtersPage, limit },
      controller.signal,
    )
      .then((response) => {
        // Source filter is client-side — the server doesn't support it
        const filtered = source
          ? response.data.filter((i) => i.source === source)
          : response.data;

        setData(filtered);
        setTotal(source ? filtered.length : response.total);
        setPage(response.page);
        setTotalPages(
          source
            ? Math.ceil(filtered.length / (limit ?? 20))
            : response.totalPages,
        );
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load indicators');
        setLoading(false);
      });

    return () => controller.abort();
  }, [search, severity, type, source, filtersPage, limit]);

  return { data, total, page, totalPages, loading, error };
}
