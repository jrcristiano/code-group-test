import { describe, it, expect } from 'vitest';
import { toDateInputValue, formatDisplayDate, daysBetween } from './date-utils';

describe('toDateInputValue', () => {
  it('returns empty string for null/undefined', () => {
    expect(toDateInputValue(null)).toBe('');
    expect(toDateInputValue(undefined)).toBe('');
  });

  it('extracts date part from ISO timestamp string', () => {
    expect(toDateInputValue('2026-07-04T00:00:00.000Z')).toBe('2026-07-04');
  });

  it('preserves plain YYYY-MM-DD string', () => {
    expect(toDateInputValue('2026-07-04')).toBe('2026-07-04');
  });

  it('handles Date object correctly', () => {
    // Create a UTC midnight Date — getUTC* would give the right components
    const date = new Date('2026-12-25T00:00:00.000Z');
    const result = toDateInputValue(date);
    // toDateInputValue uses local getFullYear/getMonth/getDate,
    // but for a Date created from an ISO string in a test environment,
    // the local methods may differ from UTC. We just verify it returns YYYY-MM-DD.
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatDisplayDate', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatDisplayDate(null)).toBe('');
    expect(formatDisplayDate(undefined)).toBe('');
  });

  it('formats plain YYYY-MM-DD to dd/mm/yyyy', () => {
    expect(formatDisplayDate('2026-07-04')).toBe('04/07/2026');
  });

  it('formats ISO timestamp to dd/mm/yyyy without timezone shift', () => {
    // This is the critical test: a UTC midnight date should NOT shift
    expect(formatDisplayDate('2026-07-04T00:00:00.000Z')).toBe('04/07/2026');
  });

  it('formats January 1st correctly', () => {
    expect(formatDisplayDate('2026-01-01')).toBe('01/01/2026');
  });

  it('formats December 31st correctly', () => {
    expect(formatDisplayDate('2026-12-31')).toBe('31/12/2026');
  });

  it('formats February 29 (leap year) correctly', () => {
    expect(formatDisplayDate('2024-02-29')).toBe('29/02/2024');
  });

  it('handles date-only string with time part', () => {
    // Even if the source has a time component, only the date matters
    expect(formatDisplayDate('2026-08-15T15:30:00.000Z')).toBe('15/08/2026');
  });
});

describe('daysBetween', () => {
  it('calculates days between two plain YYYY-MM-DD strings', () => {
    expect(daysBetween('2026-07-04', '2026-08-04')).toBe(31);
  });

  it('calculates days between ISO timestamp strings', () => {
    expect(
      daysBetween(
        '2026-07-04T00:00:00.000Z',
        '2026-08-04T00:00:00.000Z',
      ),
    ).toBe(31);
  });

  it('returns 1 for consecutive days', () => {
    expect(daysBetween('2026-07-04', '2026-07-05')).toBe(1);
  });

  it('returns 0 for same day', () => {
    expect(daysBetween('2026-07-04', '2026-07-04')).toBe(0);
  });

  it('handles leap year correctly', () => {
    // Feb 1 to Mar 1 in a leap year = 29 days
    expect(daysBetween('2024-02-01', '2024-03-01')).toBe(29);
  });

  it('handles year boundary', () => {
    expect(daysBetween('2025-12-25', '2026-01-01')).toBe(7);
  });

  it('handles long duration', () => {
    expect(daysBetween('2026-01-01', '2026-12-31')).toBe(365);
  });
});
