import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectsApi } from '../../services/projects-api';
import type { Project, ProjectRisk, ProjectStatus, ProjectSummary } from '../../types/project';
import { RISK_LABELS, STATUS_LABELS } from '../../types/project';
import { formatDisplayDate } from '../../utils/date-utils';
import { formatCurrency, getErrorMessage } from '../../utils/format';
import { StatusBadge } from '../../components/StatusBadge';
import { RiskBadge } from '../../components/RiskBadge';
import {
  ProjectListSkeleton,
  ProjectSummarySkeleton,
  ProjectTableSkeleton,
} from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { Icons } from '../../components/Icons';
import { ProjectActions } from '../../components/ProjectActions';
import { ProjectSummaryCards } from '../../components/ProjectSummaryCards';
import { SearchableSelect } from '../../components/SearchableSelect';
import type { SelectOption } from '../../components/SearchableSelect';

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 400;

export function ProjectListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [riskFilter, setRiskFilter] = useState<ProjectRisk | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const requestSequence = useRef(0);

  const loadProjects = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await projectsApi.list({
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        risk: riskFilter || undefined,
      });
      if (requestId !== requestSequence.current) return;

      setProjects(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setSummary(result.summary);
      setInitialized(true);
    } catch (err) {
      if (requestId !== requestSequence.current) return;
      setError(getErrorMessage(err, 'Não foi possível carregar os projetos.'));
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }, [debouncedSearch, page, riskFilter, sortBy, sortOrder, statusFilter]);

  useEffect(() => {
    void loadProjects();
    return () => {
      requestSequence.current += 1;
    };
  }, [loadProjects]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const hasFilters = Boolean(search.trim() || statusFilter || riskFilter);
  const isSearchPending = search.trim() !== debouncedSearch;
  const isRefreshing = loading || isSearchPending;

  const beginRefresh = () => {
    setLoading(true);
    setSummary(null);
  };

  const handleSort = (field: string) => {
    beginRefresh();
    if (field === sortBy) {
      setSortOrder((current) => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsApi.remove(deleteTarget.id);
      const removedName = deleteTarget.name;
      setDeleteTarget(null);
      toast.success(`Projeto “${removedName}” removido com sucesso.`);
      if (projects.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadProjects();
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível remover o projeto.'));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    beginRefresh();
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('');
    setRiskFilter('');
    setPage(1);
  };

  const handleStatusChange = (value: ProjectStatus | '') => {
    beginRefresh();
    setStatusFilter(value);
    setPage(1);
  };

  const handleRiskChange = (value: ProjectRisk | '') => {
    beginRefresh();
    setRiskFilter(value);
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    beginRefresh();
    setPage(nextPage);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Projetos"
        description="Acompanhe o ciclo de vida, orçamento, risco e status dos projetos cadastrados."
      />

      {error ? (
        <Card>
          <ErrorState
            title="Não foi possível carregar os projetos"
            message={error}
            onRetry={loadProjects}
          />
        </Card>
      ) : !initialized && loading ? (
        <ProjectListSkeleton />
      ) : !hasFilters && !isRefreshing && total === 0 ? (
        <Card>
          <EmptyState
            title="Nenhum projeto cadastrado"
            message="Crie seu primeiro projeto para acompanhar orçamento, prazo, risco e status em um só lugar."
            actionLabel="Criar primeiro projeto"
            actionTo="/projects/new"
          />
        </Card>
      ) : (
        <>
          {isRefreshing || !summary ? (
            <ProjectSummarySkeleton className="skeleton-summary--inline" />
          ) : (
            <ProjectSummaryCards summary={summary} filtered={hasFilters} />
          )}
          <Card className="project-list-card">
          <div className="toolbar">
            <div className="toolbar__filters">
              <div className="form-field">
                <label className="form-field__label" htmlFor="project-search">Buscar projeto</label>
                <div className="input-wrap">
                  <span className="input-wrap__icon"><Icons.Search size={17} /></span>
                  <input
                    id="project-search"
                    className="input"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por nome"
                    aria-describedby="project-search-hint"
                  />
                </div>
                <span className="sr-only" id="project-search-hint">A busca é aplicada após uma breve pausa na digitação.</span>
              </div>
              <SearchableSelect
                id="status-filter"
                label="Status"
                placeholder="Todos os status"
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={handleStatusChange}
              />
              <SearchableSelect
                id="risk-filter"
                label="Risco"
                placeholder="Todos os riscos"
                value={riskFilter}
                options={RISK_OPTIONS}
                onChange={handleRiskChange}
              />
            </div>
            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} icon={<Icons.Close size={16} />}>
                Limpar filtros
              </Button>
            )}
          </div>

          {isRefreshing ? (
            <ProjectTableSkeleton />
          ) : projects.length === 0 ? (
            <EmptyState
              icon="search"
              title="Nenhum projeto encontrado"
              message="Ajuste os filtros ou tente outro termo de busca."
              actionLabel="Limpar filtros"
              onAction={clearFilters}
            />
          ) : (
            <>
              <DataTable label="Lista de projetos">
                <colgroup>
                  {TABLE_COLUMNS.map((column) => (
                    <col key={column.value} className={COLUMN_CLASS[column.value]} />
                  ))}
                  <col className="col-actions" />
                </colgroup>
                <thead>
                  <tr>
                    {TABLE_COLUMNS.map((column) => (
                      <th key={column.value} scope="col" className={COLUMN_CLASS[column.value]}>
                        <button
                          className="sort-button"
                          onClick={() => handleSort(column.value)}
                          aria-pressed={sortBy === column.value}
                          aria-label={`Ordenar por ${column.label}${sortBy === column.value ? `, ordem ${sortOrder === 'asc' ? 'crescente' : 'decrescente'}` : ''}`}
                        >
                          {column.label}
                          <SortIcon active={sortBy === column.value} direction={sortOrder} />
                        </button>
                      </th>
                    ))}
                    <th scope="col" className="data-table__actions-heading col-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      data-clickable="true"
                      tabIndex={0}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      onKeyDown={(event) => {
                        if (event.currentTarget === event.target && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault();
                          navigate(`/projects/${project.id}`);
                        }
                      }}
                    >
                      <td className="col-name">
                        <Link
                          className="table-project-name"
                          to={`/projects/${project.id}`}
                          title={project.name}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="col-status"><StatusBadge status={project.status} /></td>
                      <td className="col-risk"><RiskBadge risk={project.risk} /></td>
                      <td className="col-budget">{formatCurrency(project.totalBudget)}</td>
                      <td className="col-start">{formatDisplayDate(project.startDate)}</td>
                      <td className="col-end">{formatDisplayDate(project.endDate)}</td>
                      <td className="col-actions"><ProjectActions project={project} onRemove={setDeleteTarget} /></td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>

              <div className="mobile-project-list" aria-label="Lista de projetos">
                {projects.map((project) => (
                  <article className="project-mobile-card" key={project.id}>
                    <Link className="project-mobile-card__top" to={`/projects/${project.id}`}>
                      <h3 className="project-mobile-card__name">{project.name}</h3>
                      <Icons.ArrowRight size={17} />
                    </Link>
                    <div className="summary-card__badges project-mobile-card__badges">
                      <StatusBadge status={project.status} />
                      <RiskBadge risk={project.risk} />
                    </div>
                    <div className="project-mobile-card__meta">
                      <div><span className="meta-label">Orçamento</span><span className="meta-value">{formatCurrency(project.totalBudget)}</span></div>
                      <div><span className="meta-label">Previsão</span><span className="meta-value">{formatDisplayDate(project.endDate)}</span></div>
                    </div>
                    <div className="project-mobile-card__actions">
                      <ProjectActions
                        project={project}
                        onRemove={setDeleteTarget}
                        labelContext="cartão móvel"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {!isRefreshing && projects.length > 0 && <div className="pagination">
            <span className="pagination__summary">
              {hasFilters
                ? `${total} resultado${total === 1 ? '' : 's'}`
                : `${total} projeto${total === 1 ? '' : 's'} no total`}
              {hasFilters && <Button variant="ghost" size="small" onClick={clearFilters}>Limpar filtros</Button>}
            </span>
            {totalPages > 1 && (
              <div className="pagination__controls">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => changePage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  icon={<Icons.ArrowLeft size={16} />}
                >
                  Anterior
                </Button>
                <span className="pagination__summary" aria-live="polite">Página {page} de {totalPages}</span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => changePage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                >
                  Próxima <Icons.ArrowRight size={16} />
                </Button>
              </div>
            )}
          </div>}
          </Card>
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Deseja remover este projeto?"
        message={deleteTarget ? `O projeto “${deleteTarget.name}” será removido permanentemente. Esta ação não poderá ser desfeita.` : ''}
        confirmLabel="Remover projeto"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  if (!active) return <span className="sort-button__icon"><Icons.ChevronsUpDown size={14} /></span>;
  return (
    <span className="sort-button__icon">
      {direction === 'asc' ? <Icons.ArrowUp size={14} /> : <Icons.ArrowDown size={14} />}
    </span>
  );
}

const TABLE_COLUMNS = [
  { value: 'name', label: 'Projeto' },
  { value: 'status', label: 'Status' },
  { value: 'risk', label: 'Risco' },
  { value: 'totalBudget', label: 'Orçamento' },
  { value: 'startDate', label: 'Início' },
  { value: 'endDate', label: 'Previsão' },
];

const COLUMN_CLASS: Record<string, string> = {
  name: 'col-name',
  status: 'col-status',
  risk: 'col-risk',
  totalBudget: 'col-budget',
  startDate: 'col-start',
  endDate: 'col-end',
};

const STATUS_SEARCH_KEYWORDS: Partial<Record<ProjectStatus, string[]>> = {
  IN_PROGRESS: ['Em execução'],
  FINISHED: ['Finalizado'],
};

const STATUS_OPTIONS: SelectOption<ProjectStatus>[] = (
  Object.entries(STATUS_LABELS) as [ProjectStatus, string][]
).map(([value, label]) => ({
  value,
  label,
  keywords: STATUS_SEARCH_KEYWORDS[value],
}));

const RISK_OPTIONS: SelectOption<ProjectRisk>[] = (
  Object.entries(RISK_LABELS) as [ProjectRisk, string][]
).map(([value, label]) => ({ value, label }));
