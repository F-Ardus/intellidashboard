import { describe, it, expect } from 'vitest';
import { buildPages } from './buildPages';

describe('buildPages', () => {
  it('returns all pages when totalPages <= 7', () => {
    expect(buildPages(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPages(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('shows leading pages with trailing ellipsis near the start', () => {
    const pages = buildPages(2, 20);
    expect(pages).toEqual([1, 2, 3, 4, 5, '…', 20]);
  });

  it('shows trailing pages with leading ellipsis near the end', () => {
    const pages = buildPages(19, 20);
    expect(pages).toEqual([1, '…', 16, 17, 18, 19, 20]);
  });

  it('shows both ellipses when in the middle', () => {
    const pages = buildPages(10, 20);
    expect(pages).toEqual([1, '…', 9, 10, 11, '…', 20]);
  });

  it('always returns exactly 7 entries for large page counts', () => {
    for (const page of [1, 5, 10, 50, 99, 100]) {
      expect(buildPages(page, 100).length).toBe(7);
    }
  });

  it('active page always appears in the result', () => {
    for (const page of [1, 5, 10, 50, 99, 100]) {
      expect(buildPages(page, 100)).toContain(page);
    }
  });
});
