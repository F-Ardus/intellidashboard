export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// In production (GitHub Pages build) VITE_API_BASE is set to the CF Worker origin.
// In dev the env var is absent, so relative /api/* is used — Vite proxies to localhost:3001.
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  const base = `${API_BASE}/api${path}`;
  if (!params) return base;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  const url = buildUrl(path, params);
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new ApiError(`API error: ${response.statusText}`, response.status);
  }

  return response.json() as Promise<T>;
}
