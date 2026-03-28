import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatRelativeTime, formatAbsoluteTime } from './time';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for very recent timestamps', () => {
    const recent = new Date(Date.now() - 10_000).toISOString(); // 10s ago
    expect(formatRelativeTime(recent)).toMatch(/now|second/i);
  });

  it('returns minutes for timestamps a few minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toMatch(/5 minute/i);
  });

  it('returns hours for timestamps hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3_600_000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toMatch(/2 hour/i);
  });

  it('returns days for timestamps days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toMatch(/3 day/i);
  });
});

describe('formatAbsoluteTime', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatAbsoluteTime('2024-06-01T10:30:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
