import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimeAgo } from '../hooks/useTimeAgo';

describe('useTimeAgo Hook (frontend/src/hooks/useTimeAgo.ts)', () => {
  it('returns null when date is undefined', () => {
    const { result } = renderHook(() => useTimeAgo(undefined));
    expect(result.current.timeDiff).toBeNull();
    expect(result.current.category).toBe('far');
  });

  it('calculates seconds/near for very recent dates', () => {
    const recentDate = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    const { result } = renderHook(() =>
      useTimeAgo(recentDate, { live: false })
    );

    expect(result.current.timeDiff).not.toBeNull();
    expect(result.current.timeDiff?.unit).toBe('seconds');
    expect(result.current.timeDiff?.isOverdue).toBe(true);
    expect(result.current.category).toBe('overdue');
  });

  it('calculates future dates with correct category', () => {
    const futureHours = new Date(Date.now() + 2 * 3600 * 1000); // 2 hours in future
    const { result } = renderHook(() =>
      useTimeAgo(futureHours, { live: false })
    );

    expect(result.current.timeDiff?.unit).toBe('hours');
    expect(result.current.timeDiff?.isOverdue).toBe(false);
    expect(result.current.category).toBe('soon');
  });

  it('calculates days with soon category', () => {
    const futureDays = new Date(Date.now() + 5 * 24 * 3600 * 1000); // 5 days in future
    const { result } = renderHook(() =>
      useTimeAgo(futureDays, { live: false })
    );

    expect(result.current.timeDiff?.unit).toBe('days');
    expect(result.current.category).toBe('soon');
  });

  it('calculates months with far category', () => {
    const futureMonths = new Date(Date.now() + 60 * 24 * 3600 * 1000); // 60 days
    const { result } = renderHook(() =>
      useTimeAgo(futureMonths, { live: false })
    );

    expect(result.current.timeDiff?.unit).toBe('months');
    expect(result.current.category).toBe('far');
  });

  it('calculates years with far category', () => {
    const futureYears = new Date(Date.now() + 400 * 24 * 3600 * 1000); // 400 days
    const { result } = renderHook(() =>
      useTimeAgo(futureYears, { live: false })
    );

    expect(result.current.timeDiff?.unit).toBe('years');
    expect(result.current.category).toBe('far');
  });
});
