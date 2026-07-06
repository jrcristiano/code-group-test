import type { ProjectStatus } from '../types/project';
import { STATUS_LABELS } from '../types/project';
import { Icons } from './Icons';

const MAIN_FLOW: ProjectStatus[] = ['IN_REVIEW', 'APPROVED', 'IN_PROGRESS', 'FINISHED'];

export function ProjectStatusFlow({ status }: { status: ProjectStatus }) {
  const currentIndex = MAIN_FLOW.indexOf(status);
  const isCanceled = status === 'CANCELED';
  const steps = isCanceled ? [...MAIN_FLOW, 'CANCELED' as const] : MAIN_FLOW;

  return (
    <section className="status-flow" aria-labelledby="status-flow-title">
      <div className="status-flow__header">
        <div>
          <h3 id="status-flow-title">Fluxo do projeto</h3>
          <p>{isCanceled ? 'O projeto foi encerrado fora do fluxo operacional.' : 'Acompanhe a etapa atual do ciclo de execução.'}</p>
        </div>
        <span className="status-flow__current">Etapa atual: <strong>{STATUS_LABELS[status]}</strong></span>
      </div>
      <ol className={`status-flow__steps${isCanceled ? ' status-flow__steps--canceled' : ''}`}>
        {steps.map((step, index) => {
          const isCurrent = step === status;
          const isComplete = !isCanceled && index < currentIndex;
          return (
            <li
              key={step}
              className={`status-flow__step${isCurrent ? ' is-current' : ''}${isComplete ? ' is-complete' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="status-flow__marker" aria-hidden="true">
                {isComplete ? <Icons.Check size={14} /> : index + 1}
              </span>
              <span className="status-flow__label">{STATUS_LABELS[step]}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
