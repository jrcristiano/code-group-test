interface Props {
  message?: string;
  compact?: boolean;
}

export function LoadingState({ message = 'Carregando...', compact = false }: Props) {
  return (
    <div className={`state-panel${compact ? ' state-panel--compact' : ''}`} role="status" aria-live="polite">
      <div className="state-panel__content">
        <span className="loading-spinner" aria-hidden="true" />
        <p className="state-panel__title">{message}</p>
      </div>
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="skeleton-table" role="status" aria-live="polite" aria-label="Carregando projetos">
      <span className="sr-only">Carregando projetos...</span>
      <ProjectSummarySkeleton />
      <div className="card skeleton-list-card" aria-hidden="true">
        <div className="skeleton-toolbar">
          <span className="skeleton skeleton--control skeleton--search" />
          <span className="skeleton skeleton--control" />
          <span className="skeleton skeleton--control" />
        </div>
        <ProjectTableSkeleton />
      </div>
    </div>
  );
}

export function ProjectSummarySkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`skeleton-summary ${className}`.trim()}
      role="status"
      aria-label="Atualizando resumo dos projetos"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div className="skeleton-stat" key={index} aria-hidden="true">
          <span className="skeleton skeleton--icon" />
          <span className="skeleton-stat__lines">
            <span className="skeleton skeleton--line skeleton--short" />
            <span className="skeleton skeleton--line skeleton--value" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProjectTableSkeleton() {
  return (
    <div className="skeleton-rows" role="status" aria-label="Atualizando lista de projetos">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="skeleton-row" key={index} aria-hidden="true">
          <span className="skeleton skeleton--line skeleton--name" />
          <span className="skeleton skeleton--pill" />
          <span className="skeleton skeleton--pill" />
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line" />
        </div>
      ))}
    </div>
  );
}
