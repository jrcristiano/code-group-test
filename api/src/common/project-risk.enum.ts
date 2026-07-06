export enum ProjectRisk {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const PROJECT_RISK_LABELS: Record<ProjectRisk, string> = {
  [ProjectRisk.LOW]: 'Baixo',
  [ProjectRisk.MEDIUM]: 'Médio',
  [ProjectRisk.HIGH]: 'Alto',
};
