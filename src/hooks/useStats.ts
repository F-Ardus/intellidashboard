import { useEffect, useState } from 'react';
import { fetchStats } from '../api/stats';
import type { Stats } from '../types/stats';

interface UseStatsResult {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchStats(controller.signal)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load stats');
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { stats, loading, error };
}
