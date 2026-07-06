import type { ProjectRisk } from '../types/project';
import { RISK_LABELS } from '../types/project';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

const RISK_VARIANTS: Record<ProjectRisk, BadgeVariant> = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
};

export function RiskBadge({ risk }: { risk: ProjectRisk }) {
  return (
    <Badge variant={RISK_VARIANTS[risk]} accessibleLabel="Risco">
      {RISK_LABELS[risk]}
    </Badge>
  );
}
