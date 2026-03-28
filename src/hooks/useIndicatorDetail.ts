import { useEffect, useState } from 'react';
import { fetchIndicatorById } from '../api/indicators';
import type { Indicator } from '../types/indicator';

interface UseIndicatorDetailResult {
  indicator: Indicator | null;
  loading: boolean;
  error: string | null;
}

export function useIndicatorDetail(id: string | null): UseIndicatorDetailResult {
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchIndicatorById(id, controller.signal)
      .then((data) => {
        setIndicator(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load indicator');
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return { indicator, loading, error };
}
