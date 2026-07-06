import type { ProjectStatus } from '../types/project';
import { STATUS_LABELS } from '../types/project';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

const STATUS_VARIANTS: Record<ProjectStatus, BadgeVariant> = {
  IN_REVIEW: 'warning',
  APPROVED: 'success',
  IN_PROGRESS: 'info',
  FINISHED: 'neutral',
  CANCELED: 'danger',
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} accessibleLabel="Status">
      {STATUS_LABELS[status]}
    </Badge>
  );
}
