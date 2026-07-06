import {
  parseDateOnly,
  formatDateOnly,
  isValidDateOnly,
  toDateOnly,
} from '../src/common/date-utils';

describe('Date utilities', () => {
  describe('isValidDateOnly', () => {
    it.each(['2026-02-30', '2026-01-01T00:00:00.000Z', '01/01/2026'])(
      'should reject invalid date-only input %s',
      (value) => expect(isValidDateOnly(value)).toBe(false),
    );

    it.each(['2024-02-29', '2026-01-01', '2026-12-31'])(
      'should accept valid date-only input %s',
      (value) => expect(isValidDateOnly(value)).toBe(true),
    );
  });

  describe('parseDateOnly', () => {
    it('should parse YYYY-MM-DD into a Date at UTC midnight', () => {
      const result = parseDateOnly('2026-07-04');

      // UTC components should match the input date
      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(6); // July is 0-indexed
      expect(result.getUTCDate()).toBe(4);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
    });

    it('should parse January 1st correctly', () => {
      const result = parseDateOnly('2026-01-01');

      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(0);
      expect(result.getUTCDate()).toBe(1);
    });

    it('should parse December 31st correctly', () => {
      const result = parseDateOnly('2026-12-31');

      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(11);
      expect(result.getUTCDate()).toBe(31);
    });

    it('should always produce UTC midnight regardless of server timezone', () => {
      const result = parseDateOnly('2026-07-04');

      // The ISO string should always be midnight UTC
      expect(result.toISOString()).toBe('2026-07-04T00:00:00.000Z');
    });
  });

  describe('formatDateOnly', () => {
    it('should format a UTC midnight Date back to YYYY-MM-DD', () => {
      const date = new Date('2026-07-04T00:00:00.000Z');
      const result = formatDateOnly(date);

      expect(result).toBe('2026-07-04');
    });

    it('should format a Date with non-midnight UTC time correctly', () => {
      // 3 AM UTC on July 4 is still July 4
      const date = new Date('2026-07-04T03:00:00.000Z');
      const result = formatDateOnly(date);

      expect(result).toBe('2026-07-04');
    });

    it('should handle end of month correctly', () => {
      const date = new Date('2026-01-31T00:00:00.000Z');
      const result = formatDateOnly(date);

      expect(result).toBe('2026-01-31');
    });

    it('should handle leap year date', () => {
      const date = new Date('2024-02-29T00:00:00.000Z');
      const result = formatDateOnly(date);

      expect(result).toBe('2024-02-29');
    });
  });

  describe('toDateOnly', () => {
    it('should format a Date object to YYYY-MM-DD', () => {
      expect(toDateOnly(new Date('2026-07-06T00:00:00.000Z'))).toBe('2026-07-06');
    });

    it('should extract date from ISO timestamp string', () => {
      expect(toDateOnly('2026-07-06T00:00:00.000Z')).toBe('2026-07-06');
    });

    it('should preserve plain YYYY-MM-DD string', () => {
      expect(toDateOnly('2026-07-06')).toBe('2026-07-06');
    });

    it('should return null for null input', () => {
      expect(toDateOnly(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(toDateOnly(undefined)).toBeNull();
    });

    it('should handle date at end of year', () => {
      expect(toDateOnly(new Date('2026-12-31T00:00:00.000Z'))).toBe('2026-12-31');
    });

    it('should handle date at start of year', () => {
      expect(toDateOnly('2026-01-01')).toBe('2026-01-01');
    });

    it('should handle leap year date', () => {
      expect(toDateOnly('2024-02-29')).toBe('2024-02-29');
    });
  });

  describe('round-trip consistency', () => {
    it('should preserve the date through parse → format round-trip', () => {
      const inputs = ['2026-07-04', '2026-01-01', '2026-12-31', '2024-02-29'];

      for (const input of inputs) {
        const parsed = parseDateOnly(input);
        const formatted = formatDateOnly(parsed);
        expect(formatted).toBe(input);
      }
    });

    it('should preserve dates regardless of server timezone', () => {
      // This test verifies that parseDateOnly → store → read → formatDateOnly
      // preserves the date. We simulate the store/read cycle with toISOString.
      const inputs = ['2026-07-04', '2026-01-01', '2026-12-31'];

      for (const input of inputs) {
        const parsed = parseDateOnly(input);
        // Simulate what Prisma returns after storing and reading from DB
        const roundTripped = new Date(parsed.toISOString());
        const formatted = formatDateOnly(roundTripped);
        expect(formatted).toBe(input);
      }
    });

    it('should preserve date through toDateOnly after round-trip', () => {
      const inputs = ['2026-07-06', '2026-01-01', '2026-12-31'];

      for (const input of inputs) {
        const parsed = parseDateOnly(input);
        // Simulate Prisma returning a Date object
        const fromDb = new Date(parsed.toISOString());
        const result = toDateOnly(fromDb);
        expect(result).toBe(input);
      }
    });
  });
});
