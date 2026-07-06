/**
 * Date utility functions for safe date-only handling.
 *
 * All project dates (startDate, endDate) are civil dates without time or timezone.
 * These utilities treat every date as UTC midnight to avoid timezone offset issues.
 *
 * CRITICAL: Both parseDateOnly and formatDateOnly MUST use the same reference
 * (UTC) — otherwise dates shift by the server's timezone offset on every round-trip.
 *
 * With PostgreSQL TIMESTAMP, Prisma treats stored values as UTC.
 * With PostgreSQL DATE (@db.Date), Prisma returns a Date at UTC midnight.
 * In all cases, using UTC consistently is the correct approach.
 */

/**
 * Parse a YYYY-MM-DD string into a Date at UTC midnight.
 *
 * Uses Date.UTC() so the result is always T00:00:00.000Z
 * regardless of the server's local timezone.
 *
 * Example: parseDateOnly('2026-07-04') → 2026-07-04T00:00:00.000Z
 */
/**
 * Private helper: format UTC date components to YYYY-MM-DD string.
 * Used by both formatDateOnly and toDateOnly to avoid duplication.
 */
function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate days between two Date objects (inclusive of the end date).
 * Uses Math.ceil so a 1-day project spanning start to end returns 1.
 */
export function daysBetween(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function parseDateOnly(value: string): Date {
  if (!isValidDateOnly(value)) {
    throw new RangeError(`Data inválida: "${value}". Use o formato YYYY-MM-DD.`);
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Format a Date object to a YYYY-MM-DD string using UTC components.
 *
 * Uses getUTC* methods so the date is extracted from the UTC representation,
 * matching the UTC midnight created by parseDateOnly.
 *
 * Example: formatDateOnly(new Date('2026-07-04T00:00:00.000Z')) → '2026-07-04'
 */
export function formatDateOnly(date: Date): string {
  return formatUtcDate(date);
}

/**
 * Convert a Date or date string to a YYYY-MM-DD string (date-only).
 *
 * Handles:
 * - Date objects (from Prisma) — uses getUTC* methods
 * - ISO strings like "2026-07-06T00:00:00.000Z" — slices first 10 chars
 * - Plain strings like "2026-07-06" — returns as-is
 * - null/undefined — returns null
 *
 * Use this in API response serialization to guarantee date-only format.
 */
export function toDateOnly(value: Date | string | null | undefined): string | null {
  if (!value) return null;

  if (typeof value === 'string') {
    // Could be ISO timestamp or already YYYY-MM-DD
    const datePart = value.slice(0, 10);
    // Validate it looks like YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
    return null;
  }

  // Date object (from Prisma)
  return formatUtcDate(value);
}
