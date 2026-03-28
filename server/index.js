import express from 'express';
import cors from 'cors';
import { generateIndicators } from './data.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Generate a fixed dataset on startup so results are consistent
const indicators = generateIndicators(500);

/**
 * GET /api/indicators
 *
 * Query parameters:
 *   - page     (number, default: 1)
 *   - limit    (number, default: 20, max: 100)
 *   - severity (string, one of: critical, high, medium, low)
 *   - type     (string, one of: ip, domain, hash, url)
 *   - search   (string, partial match on indicator value)
 *
 * Response:
 *   {
 *     data: Indicator[],
 *     total: number,
 *     page: number,
 *     totalPages: number
 *   }
 */
app.get('/api/indicators', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const severity = req.query.severity?.toLowerCase();
  const type = req.query.type?.toLowerCase();
  const search = req.query.search?.toLowerCase();
  const source = req.query.source;
  const tags = req.query.tags ? req.query.tags.split(',').filter(Boolean) : [];

  let filtered = [...indicators];

  if (severity && ['critical', 'high', 'medium', 'low'].includes(severity)) {
    filtered = filtered.filter((i) => i.severity === severity);
  }

  if (type && ['ip', 'domain', 'hash', 'url'].includes(type)) {
    filtered = filtered.filter((i) => i.type === type);
  }

  if (search) {
    filtered = filtered.filter(
      (i) =>
        i.value.toLowerCase().includes(search) ||
        i.source.toLowerCase().includes(search) ||
        i.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  if (source) {
    filtered = filtered.filter((i) => i.source === source);
  }

  if (tags.length > 0) {
    filtered = filtered.filter((i) => tags.every((t) => i.tags.includes(t)));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  // Simulate slight network latency (200–600ms)
  const delay = 200 + Math.random() * 400;
  setTimeout(() => {
    res.json({ data, total, page, totalPages });
  }, delay);
});

/**
 * GET /api/tags
 *
 * Returns the list of tags that appear in at least one indicator matching
 * the current filter params. Already-selected tags are excluded from the
 * response so the client only shows tags that will produce new results.
 *
 * Query parameters: same as /api/indicators (except page/limit)
 */
app.get('/api/tags', (req, res) => {
  const severity = req.query.severity?.toLowerCase();
  const type = req.query.type?.toLowerCase();
  const search = req.query.search?.toLowerCase();
  const source = req.query.source;
  const tags = req.query.tags ? req.query.tags.split(',').filter(Boolean) : [];

  let filtered = [...indicators];

  if (severity && ['critical', 'high', 'medium', 'low'].includes(severity)) {
    filtered = filtered.filter((i) => i.severity === severity);
  }
  if (type && ['ip', 'domain', 'hash', 'url'].includes(type)) {
    filtered = filtered.filter((i) => i.type === type);
  }
  if (search) {
    filtered = filtered.filter(
      (i) =>
        i.value.toLowerCase().includes(search) ||
        i.source.toLowerCase().includes(search) ||
        i.tags.some((t) => t.toLowerCase().includes(search))
    );
  }
  if (source) {
    filtered = filtered.filter((i) => i.source === source);
  }
  if (tags.length > 0) {
    filtered = filtered.filter((i) => tags.every((t) => i.tags.includes(t)));
  }

  const available = new Set();
  for (const indicator of filtered) {
    for (const tag of indicator.tags) {
      if (!tags.includes(tag)) available.add(tag);
    }
  }

  res.json({ tags: [...available].sort() });
});

/**
 * GET /api/indicators/:id
 *
 * Returns a single indicator by ID.
 */
app.get('/api/indicators/:id', (req, res) => {
  const indicator = indicators.find((i) => i.id === req.params.id);
  if (!indicator) {
    return res.status(404).json({ error: 'Indicator not found' });
  }
  const delay = 100 + Math.random() * 200;
  setTimeout(() => {
    res.json(indicator);
  }, delay);
});

/**
 * GET /api/stats
 *
 * Returns summary statistics for the dashboard header.
 */
app.get('/api/stats', (_req, res) => {
  const stats = {
    total: indicators.length,
    critical: indicators.filter((i) => i.severity === 'critical').length,
    high: indicators.filter((i) => i.severity === 'high').length,
    medium: indicators.filter((i) => i.severity === 'medium').length,
    low: indicators.filter((i) => i.severity === 'low').length,
    byType: {
      ip: indicators.filter((i) => i.type === 'ip').length,
      domain: indicators.filter((i) => i.type === 'domain').length,
      hash: indicators.filter((i) => i.type === 'hash').length,
      url: indicators.filter((i) => i.type === 'url').length,
    },
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`\n  🛡  Mock Threat Intel API running at http://localhost:${PORT}`);
  console.log(`  📊 ${indicators.length} indicators loaded\n`);
});
