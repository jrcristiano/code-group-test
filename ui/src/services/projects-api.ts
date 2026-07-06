import httpClient from './http-client';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  UpdateStatusData,
  ProjectAnalysis,
  PaginatedProjects,
  ProjectListParams,
} from '../types/project';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function parsePaginatedProjects(payload: unknown): PaginatedProjects {
  if (!payload || typeof payload !== 'object') {
    throw new Error('A API retornou uma resposta inválida para a listagem de projetos.');
  }

  const response = payload as Partial<PaginatedProjects> & { data?: unknown };
  const summary = response.summary;
  const hasValidSummary = Boolean(
    summary
    && isFiniteNumber(summary.totalProjects)
    && isFiniteNumber(summary.inReview)
    && isFiniteNumber(summary.inExecution)
    && isFiniteNumber(summary.listedBudget)
    && isFiniteNumber(summary.highRisk),
  );
  const hasValidPagination = isFiniteNumber(response.total)
    && isFiniteNumber(response.page)
    && isFiniteNumber(response.limit)
    && isFiniteNumber(response.totalPages)
    && typeof response.nextPage === 'boolean';

  if (!Array.isArray(response.items) || !hasValidPagination || !hasValidSummary) {
    if (Array.isArray(response.data)) {
      throw new Error(
        'A API está usando o contrato antigo da listagem. Reconstrua ou reinicie o serviço da API.',
      );
    }
    throw new Error('A API retornou uma resposta incompleta para a listagem de projetos.');
  }

  return response as PaginatedProjects;
}

export const projectsApi = {
  list: (params?: ProjectListParams) =>
    httpClient
      .get<unknown>('/projects', { params })
      .then((response) => parsePaginatedProjects(response.data)),

  getById: (id: string) =>
    httpClient.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (data: CreateProjectData) =>
    httpClient.post<Project>('/projects', data).then((r) => r.data),

  update: (id: string, data: UpdateProjectData) =>
    httpClient.patch<Project>(`/projects/${id}`, data).then((r) => r.data),

  remove: (id: string) => httpClient.delete(`/projects/${id}`),

  updateStatus: (id: string, data: UpdateStatusData) =>
    httpClient.patch<Project>(`/projects/${id}/status`, data).then((r) => r.data),

  getAiAnalysis: (id: string) =>
    httpClient
      .get<ProjectAnalysis>(`/projects/${id}/ai-analysis`)
      .then((r) => r.data),
};
