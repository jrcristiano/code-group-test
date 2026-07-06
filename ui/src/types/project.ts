export type ProjectStatus =
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELED';

export type ProjectRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  description: string;
  status: ProjectStatus;
  risk: ProjectRisk;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  description: string;
}

export interface UpdateProjectData {
  name?: string;
  startDate?: string;
  endDate?: string;
  totalBudget?: number;
  description?: string;
}

export interface UpdateStatusData {
  status: ProjectStatus;
}

export interface ProjectAnalysis {
  summary: string;
  attentionPoints: string[];
  executiveRecommendation: string;
}

export interface ProjectSummary {
  totalProjects: number;
  inReview: number;
  inExecution: number;
  listedBudget: number;
  highRisk: number;
}

export interface PaginatedProjects {
  items: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: boolean;
  summary: ProjectSummary;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: ProjectStatus;
  risk?: ProjectRisk;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_REVIEW: 'Em análise',
  APPROVED: 'Aprovado',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Encerrado',
  CANCELED: 'Cancelado',
};

export const RISK_LABELS: Record<ProjectRisk, string> = {
  LOW: 'Baixo',
  MEDIUM: 'Médio',
  HIGH: 'Alto',
};
