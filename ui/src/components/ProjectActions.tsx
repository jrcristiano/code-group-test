import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/project';
import { Icons } from './Icons';
import { Tooltip } from './Tooltip';

interface Props {
  project: Project;
  onRemove: (project: Project) => void;
  labelContext?: string;
}

export function ProjectActions({ project, onRemove, labelContext }: Props) {
  const navigate = useNavigate();
  const canRemove = project.status !== 'IN_PROGRESS' && project.status !== 'FINISHED';
  const removeTooltip = canRemove
    ? 'Remover projeto'
    : 'Projetos em andamento ou encerrados não podem ser removidos';
  const accessibleLabel = (label: string) =>
    labelContext ? `${label} (${labelContext})` : label;

  return (
    <div className="table-actions" onClick={(event) => event.stopPropagation()}>
      <Tooltip label="Visualizar">
        <button
          className="icon-button"
          onClick={() => navigate(`/projects/${project.id}`)}
          aria-label={accessibleLabel(`Visualizar ${project.name}`)}
        >
          <Icons.Eye />
        </button>
      </Tooltip>
      <Tooltip label="Editar">
        <button
          className="icon-button"
          onClick={() => navigate(`/projects/${project.id}/edit`)}
          aria-label={accessibleLabel(`Editar ${project.name}`)}
        >
          <Icons.Edit />
        </button>
      </Tooltip>
      <Tooltip label="Gerar análise">
        <button
          className="icon-button"
          onClick={() => navigate(`/projects/${project.id}#ai-analysis`)}
          aria-label={accessibleLabel(`Gerar análise de ${project.name}`)}
        >
          <Icons.Sparkles />
        </button>
      </Tooltip>
      <Tooltip label={removeTooltip}>
        <button
          className="icon-button icon-button--danger"
          onClick={() => onRemove(project)}
          disabled={!canRemove}
          aria-label={accessibleLabel(canRemove ? `Remover ${project.name}` : `${removeTooltip}: ${project.name}`)}
        >
          <Icons.Trash />
        </button>
      </Tooltip>
    </div>
  );
}
