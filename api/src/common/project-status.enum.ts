export enum ProjectStatus {
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.IN_REVIEW]: 'Em análise',
  [ProjectStatus.APPROVED]: 'Aprovado',
  [ProjectStatus.IN_PROGRESS]: 'Em andamento',
  [ProjectStatus.FINISHED]: 'Encerrado',
  [ProjectStatus.CANCELED]: 'Cancelado',
};
