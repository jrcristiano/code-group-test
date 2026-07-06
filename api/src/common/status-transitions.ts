import { ProjectStatus } from './project-status.enum';

const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  [ProjectStatus.IN_REVIEW]: [ProjectStatus.APPROVED, ProjectStatus.CANCELED],
  [ProjectStatus.APPROVED]: [ProjectStatus.IN_PROGRESS, ProjectStatus.CANCELED],
  [ProjectStatus.IN_PROGRESS]: [ProjectStatus.FINISHED, ProjectStatus.CANCELED],
  [ProjectStatus.FINISHED]: [ProjectStatus.CANCELED],
  [ProjectStatus.CANCELED]: [],
};

export function isTransitionAllowed(
  from: ProjectStatus,
  to: ProjectStatus,
): boolean {
  if (from === to) {
    return false;
  }

  const allowed = ALLOWED_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export function canDeleteProject(status: ProjectStatus): boolean {
  const blockedStatuses: ProjectStatus[] = [
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.FINISHED,
  ];
  return !blockedStatuses.includes(status);
}
