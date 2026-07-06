import { ProjectRiskCalculator } from '../src/common/project-risk-calculator';
import { ProjectRisk } from '../src/common/project-risk.enum';
import { parseDateOnly } from '../src/common/date-utils';

describe('ProjectRiskCalculator', () => {
  describe('calculate', () => {
    it('should return LOW risk when budget <= 100k and duration is within 3 calendar months', () => {
      const risk = ProjectRiskCalculator.calculate(
        100_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-03-31'),
      );
      expect(risk).toBe(ProjectRisk.LOW);
    });

    it.each([
      ['2026-01-01', '2026-04-01'],
      ['2026-01-31', '2026-04-30'],
      ['2024-02-29', '2024-05-29'],
      ['2026-03-31', '2026-06-30'],
    ])('should treat %s through %s as no more than 3 calendar months', (start, end) => {
      expect(
        ProjectRiskCalculator.calculateFromStrings(100_000, start, end),
      ).toBe(ProjectRisk.LOW);
    });

    it('should return MEDIUM one day after the 3-month calendar boundary', () => {
      expect(
        ProjectRiskCalculator.calculateFromStrings(
          100_000,
          '2026-01-01',
          '2026-04-02',
        ),
      ).toBe(ProjectRisk.MEDIUM);
    });

    it('should keep exactly 6 calendar months as MEDIUM', () => {
      expect(
        ProjectRiskCalculator.calculateFromStrings(
          100_000,
          '2026-01-01',
          '2026-07-01',
        ),
      ).toBe(ProjectRisk.MEDIUM);
    });

    it('should return HIGH one day after the 6-month calendar boundary', () => {
      expect(
        ProjectRiskCalculator.calculateFromStrings(
          100_000,
          '2026-01-01',
          '2026-07-02',
        ),
      ).toBe(ProjectRisk.HIGH);
    });

    it('should return MEDIUM risk when budget > 100k and <= 500k', () => {
      const risk = ProjectRiskCalculator.calculate(
        150_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-02-01'),
      );
      expect(risk).toBe(ProjectRisk.MEDIUM);
    });

    it('should return MEDIUM risk when duration > 90 days and <= 180 days', () => {
      const risk = ProjectRiskCalculator.calculate(
        50_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-05-01'),
      );
      expect(risk).toBe(ProjectRisk.MEDIUM);
    });

    it('should return HIGH risk when budget > 500k', () => {
      const risk = ProjectRiskCalculator.calculate(
        600_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-02-01'),
      );
      expect(risk).toBe(ProjectRisk.HIGH);
    });

    it.each([
      [100_000, ProjectRisk.LOW],
      [100_001, ProjectRisk.MEDIUM],
      [500_000, ProjectRisk.MEDIUM],
      [500_001, ProjectRisk.HIGH],
    ])('should classify budget boundary %s as %s', (budget, expected) => {
      expect(
        ProjectRiskCalculator.calculateFromStrings(
          budget as number,
          '2026-01-01',
          '2026-02-01',
        ),
      ).toBe(expected);
    });

    it('should return HIGH risk when duration > 180 days', () => {
      const risk = ProjectRiskCalculator.calculate(
        50_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-08-01'),
      );
      expect(risk).toBe(ProjectRisk.HIGH);
    });

    it('should return HIGH risk (highest prevails) when both budget and duration are high', () => {
      const risk = ProjectRiskCalculator.calculate(
        600_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-08-01'),
      );
      expect(risk).toBe(ProjectRisk.HIGH);
    });

    it('should return MEDIUM when budget is medium and duration is low (highest prevails)', () => {
      const risk = ProjectRiskCalculator.calculate(
        200_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-02-01'),
      );
      expect(risk).toBe(ProjectRisk.MEDIUM);
    });

    it('should return HIGH when budget is high and duration is low (highest prevails)', () => {
      const risk = ProjectRiskCalculator.calculate(
        600_000,
        parseDateOnly('2026-01-01'),
        parseDateOnly('2026-02-01'),
      );
      expect(risk).toBe(ProjectRisk.HIGH);
    });
  });

  describe('calculateFromStrings', () => {
    it('should accept YYYY-MM-DD strings directly and return correct risk', () => {
      const risk = ProjectRiskCalculator.calculateFromStrings(
        100_000,
        '2026-01-01',
        '2026-03-31',
      );
      expect(risk).toBe(ProjectRisk.LOW);
    });

    it('should not lose a day when parsing date strings', () => {
      // 2026-07-04 to 2026-08-04 = 31 days
      const risk = ProjectRiskCalculator.calculateFromStrings(
        50_000,
        '2026-07-04',
        '2026-08-04',
      );
      // 31 days <= 90 days, budget <= 100k => LOW
      expect(risk).toBe(ProjectRisk.LOW);
    });

    it('should correctly calculate 1-day duration as 1 day (not 0)', () => {
      const risk = ProjectRiskCalculator.calculateFromStrings(
        50_000,
        '2026-07-04',
        '2026-07-05',
      );
      // 1 day <= 90 days, budget <= 100k => LOW
      expect(risk).toBe(ProjectRisk.LOW);
    });
  });
});
