import { ProjectRisk } from './project-risk.enum';
import { parseDateOnly } from './date-utils';

export const RISK_THRESHOLDS = {
  HIGH_BUDGET: 500_000,
  MEDIUM_BUDGET: 100_000,
} as const;

function addCalendarMonths(date: Date, months: number): Date {
  const sourceYear = date.getUTCFullYear();
  const sourceMonth = date.getUTCMonth();
  const targetMonthIndex = sourceMonth + months;
  const targetYear = sourceYear + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0),
  ).getUTCDate();
  const targetDay = Math.min(date.getUTCDate(), lastDayOfTargetMonth);

  return new Date(Date.UTC(targetYear, targetMonth, targetDay));
}

export class ProjectRiskCalculator {
  static calculate(totalBudget: number, startDate: Date, endDate: Date): ProjectRisk {
    const durationRisk = ProjectRiskCalculator.calculateDurationRisk(
      startDate,
      endDate,
    );

    if (
      totalBudget > RISK_THRESHOLDS.HIGH_BUDGET ||
      durationRisk === ProjectRisk.HIGH
    ) {
      return ProjectRisk.HIGH;
    }

    if (
      totalBudget > RISK_THRESHOLDS.MEDIUM_BUDGET ||
      durationRisk === ProjectRisk.MEDIUM
    ) {
      return ProjectRisk.MEDIUM;
    }

    return ProjectRisk.LOW;
  }

  static calculateDurationRisk(startDate: Date, endDate: Date): ProjectRisk {
    if (endDate <= addCalendarMonths(startDate, 3)) {
      return ProjectRisk.LOW;
    }

    if (endDate <= addCalendarMonths(startDate, 6)) {
      return ProjectRisk.MEDIUM;
    }

    return ProjectRisk.HIGH;
  }

  /**
   * Calculate risk using date-only strings (YYYY-MM-DD).
   * Parses dates safely without timezone offset.
   */
  static calculateFromStrings(totalBudget: number, startDateStr: string, endDateStr: string): ProjectRisk {
    const startDate = parseDateOnly(startDateStr);
    const endDate = parseDateOnly(endDateStr);
    return ProjectRiskCalculator.calculate(totalBudget, startDate, endDate);
  }
}
