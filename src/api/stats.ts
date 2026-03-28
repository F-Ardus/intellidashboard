import type { Stats } from '../types/stats';
import { apiFetch } from './client';

export function fetchStats(signal?: AbortSignal): Promise<Stats> {
  return apiFetch<Stats>('/stats', undefined, signal);
}
