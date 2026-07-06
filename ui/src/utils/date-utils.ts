/**
 * Date utility functions for safe date-only handling in the frontend.
 *
 * All project dates (startDate, endDate) should be treated as civil dates
 * in YYYY-MM-DD format, without time or timezone conversion.
 */

/**
 * Normalize any date input to a YYYY-MM-DD string suitable for
 * `<input type="date">` value.
 *
 * Handles:
 * - ISO strings from API: "2026-07-04T00:00:00.000Z"
 * - Already formatted strings: "2026-07-04"
 * - Date objects
 *
 * Uses the date part only, never applies timezone offset.
 */
export function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return '';

  if (typeof value === 'string') {
    // Could be ISO "2026-07-04T00:00:00.000Z" or plain "2026-07-04"
    return value.slice(0, 10);
  }

  // Date object: extract local date components (not UTC)
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format a date for display in pt-BR format without timezone shifts.
 *
 * Accepts:
 * - ISO strings from API: "2026-07-04T00:00:00.000Z"
 * - Already formatted strings: "2026-07-04"
 *
 * Extracts the date part directly from the string without creating
 * a Date object that would apply timezone conversion.
 */
export function formatDisplayDate(value: string | null | undefined): string {
  if (!value) return '';

  // Extract YYYY-MM-DD from the beginning of the string
  const [year, month, day] = value.slice(0, 10).split('-');
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
}

/**
 * Calculate the number of days between two date-only strings.
 *
 * Uses Date.UTC() internally for timezone-safe calculation.
 * Accepts both plain YYYY-MM-DD and ISO timestamp strings.
 *
 * Returns a positive integer when end is after start.
 */
export function daysBetween(start: string, end: string): number {
  const [sy, sm, sd] = start.slice(0, 10).split('-').map(Number);
  const [ey, em, ed] = end.slice(0, 10).split('-').map(Number);

  const startMs = Date.UTC(sy, sm - 1, sd);
  const endMs = Date.UTC(ey, em - 1, ed);

  return Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24));
}
