import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from './useFilters';

describe('useFilters', () => {
  it('initialises with default values', () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.limit).toBe(10);
    expect(result.current.filters.search).toBe('');
  });

  it('setSearch resets page to 1', () => {
    const { result } = renderHook(() => useFilters());

    act(() => { result.current.setPage(3); });
    expect(result.current.filters.page).toBe(3);

    act(() => { result.current.setSearch('malware'); });
    expect(result.current.filters.search).toBe('malware');
    expect(result.current.filters.page).toBe(1);
  });

  it('setSeverity resets page to 1', () => {
    const { result } = renderHook(() => useFilters());

    act(() => { result.current.setPage(5); });
    act(() => { result.current.setSeverity('critical'); });

    expect(result.current.filters.severity).toBe('critical');
    expect(result.current.filters.page).toBe(1);
  });

  it('setPage does not reset other filters', () => {
    const { result } = renderHook(() => useFilters());

    act(() => { result.current.setSearch('test'); });
    act(() => { result.current.setPage(2); });

    expect(result.current.filters.search).toBe('test');
    expect(result.current.filters.page).toBe(2);
  });

  it('reset restores all defaults', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setSearch('apt');
      result.current.setSeverity('high');
      result.current.setPage(4);
    });

    act(() => { result.current.reset(); });

    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.severity).toBeUndefined();
    expect(result.current.filters.page).toBe(1);
  });

  it('setter references are stable across renders', () => {
    const { result, rerender } = renderHook(() => useFilters());
    const { setSearch, setSeverity, setType, setSource, setPage, reset } = result.current;

    rerender();

    expect(result.current.setSearch).toBe(setSearch);
    expect(result.current.setSeverity).toBe(setSeverity);
    expect(result.current.setType).toBe(setType);
    expect(result.current.setSource).toBe(setSource);
    expect(result.current.setPage).toBe(setPage);
    expect(result.current.reset).toBe(reset);
  });
});
