/**
 * Augur API — Cloudflare Worker
 *
 * Handles:
 *   GET /api/stats
 *   GET /api/tags
 *   GET /api/indicators
 *   GET /api/indicators/:id
 *
 * Responses are cached in Cloudflare's edge cache for 12 hours per unique URL
 * (including query-string), so each distinct filter combination is computed at
 * most twice per day regardless of request volume.
 */

import { generateIndicators } from '../server/data.js';

const CACHE_TTL = 43200; // 12 hours in seconds

// Generated once per worker instance (V8 isolate warm lifetime).
// The Workers Cache API extends this across cold-starts at the edge.
const INDICATORS = generateIndicators(500);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL}`,
      ...CORS,
    },
  });
}

// ─── Route handlers ────────────────────────────────────────────────────────

function handleStats() {
  return jsonResponse({
    total:    INDICATORS.length,
    critical: INDICATORS.filter((i) => i.severity === 'critical').length,
    high:     INDICATORS.filter((i) => i.severity === 'high').length,
    medium:   INDICATORS.filter((i) => i.severity === 'medium').length,
    low:      INDICATORS.filter((i) => i.severity === 'low').length,
    byType: {
      ip:     INDICATORS.filter((i) => i.type === 'ip').length,
      domain: INDICATORS.filter((i) => i.type === 'domain').length,
      hash:   INDICATORS.filter((i) => i.type === 'hash').length,
      url:    INDICATORS.filter((i) => i.type === 'url').length,
    },
  });
}

function applyFilters(base, params) {
  const severity    = params.get('severity');
  const type        = params.get('type');
  const search      = params.get('search');
  const source      = params.get('source');
  const tagsParam   = params.get('tags');
  const selectedTags = tagsParam ? tagsParam.split(',').filter(Boolean) : [];

  let filtered = base;

  if (severity && ['critical', 'high', 'medium', 'low'].includes(severity))
    filtered = filtered.filter((i) => i.severity === severity);

  if (type && ['ip', 'domain', 'hash', 'url'].includes(type))
    filtered = filtered.filter((i) => i.type === type);

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.value.toLowerCase().includes(q) ||
        i.source.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (source) filtered = filtered.filter((i) => i.source === source);

  if (selectedTags.length > 0)
    filtered = filtered.filter((i) => selectedTags.every((t) => i.tags.includes(t)));

  return { filtered, selectedTags };
}

function handleTags(params) {
  const { filtered, selectedTags } = applyFilters(INDICATORS, params);

  const available = new Set();
  for (const indicator of filtered)
    for (const tag of indicator.tags)
      if (!selectedTags.includes(tag)) available.add(tag);

  return jsonResponse({ tags: [...available].sort() });
}

function handleIndicators(params) {
  const page  = Math.max(1, parseInt(params.get('page'))  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.get('limit')) || 20));

  const { filtered } = applyFilters(INDICATORS, params);

  const total      = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start      = (page - 1) * limit;
  const data       = filtered.slice(start, start + limit);

  return jsonResponse({ data, total, page, totalPages });
}

function handleIndicatorById(id) {
  const indicator = INDICATORS.find((i) => i.id === id);
  if (!indicator)
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  return jsonResponse(indicator);
}

// ─── Main fetch handler ────────────────────────────────────────────────────

export default {
  async fetch(request, _env, ctx) {
    // CORS preflight
    if (request.method === 'OPTIONS')
      return new Response(null, { status: 204, headers: CORS });

    if (request.method !== 'GET')
      return new Response('Method Not Allowed', { status: 405, headers: CORS });

    // Serve from edge cache when available
    const cache  = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    // Route dispatch
    const { pathname } = new URL(request.url);
    const params = new URL(request.url).searchParams;

    let response;

    if (pathname === '/api/stats') {
      response = handleStats();
    } else if (pathname === '/api/tags') {
      response = handleTags(params);
    } else if (pathname === '/api/indicators' || pathname === '/api/indicators/') {
      response = handleIndicators(params);
    } else {
      const idMatch = pathname.match(/^\/api\/indicators\/([^/]+)$/);
      if (idMatch) {
        response = handleIndicatorById(idMatch[1]);
      } else {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
    }

    // Store in edge cache for subsequent requests (fire-and-forget)
    if (response.status === 200)
      ctx.waitUntil(cache.put(request, response.clone()));

    return response;
  },
};
