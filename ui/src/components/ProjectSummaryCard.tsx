import type { Project } from '../types/project';
import { daysBetween, formatDisplayDate } from '../utils/date-utils';
import { formatCurrency } from '../utils/format';
import { Button } from './Button';
import { Card } from './Card';
import { Icons } from './Icons';
import { RiskBadge } from './RiskBadge';
import { StatusBadge } from './StatusBadge';
import { ProjectStatusFlow } from './ProjectStatusFlow';

interface Props {
  project: Project;
  nextAction: { label: string } | null;
  actionLoading: boolean;
  cancelLoading: boolean;
  onAdvance: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function ProjectSummaryCard({
  project,
  nextAction,
  actionLoading,
  cancelLoading,
  onAdvance,
  onEdit,
  onCancel,
}: Props) {
  const isTerminal = project.status === 'FINISHED' || project.status === 'CANCELED';
  const canCancel = project.status !== 'CANCELED';
  const isBusy = actionLoading || cancelLoading;

  return (
    <Card className="summary-card">
      <div className="summary-card__header">
        <div className="summary-card__heading">
          <div>
            <h2 className="summary-card__title">Visão geral</h2>
            <p className="card__description">Informações de planejamento e acompanhamento do projeto.</p>
          </div>
          <div className="summary-card__badges">
            <StatusBadge status={project.status} />
            <RiskBadge risk={project.risk} />
          </div>
        </div>
        <p className="summary-card__description">{project.description}</p>
      </div>

      <div className="metrics-grid">
        <Metric icon={<Icons.Wallet size={17} />} label="Orçamento" value={formatCurrency(project.totalBudget)} />
        <Metric icon={<Icons.Calendar size={17} />} label="Data de início" value={formatDisplayDate(project.startDate)} />
        <Metric icon={<Icons.Calendar size={17} />} label="Previsão de término" value={formatDisplayDate(project.endDate)} />
        <Metric icon={<Icons.Clock size={17} />} label="Duração planejada" value={`${daysBetween(project.startDate, project.endDate)} dias`} />
      </div>

      <ProjectStatusFlow status={project.status} />

      <div className="detail-actions">
        <p className="detail-actions__hint">
          {isTerminal ? 'Este projeto não possui novas etapas disponíveis.' : 'As mudanças de status seguem o fluxo definido do projeto.'}
        </p>
        <div className="button-group">
          {nextAction && (
            <Button variant="success" onClick={onAdvance} loading={actionLoading} disabled={isBusy} icon={<Icons.Check />}>
              {actionLoading ? 'Atualizando...' : nextAction.label}
            </Button>
          )}
          <Button variant="secondary" onClick={onEdit} disabled={isBusy} icon={<Icons.Edit />}>
            Editar
          </Button>
          {canCancel && (
            <Button variant="danger" onClick={onCancel} disabled={isBusy} icon={<Icons.Close />}>
              Cancelar projeto
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      <span className="metric__label">{icon}{label}</span>
      <span className="metric__value" title={value}>{value}</span>
    </div>
  );
}
