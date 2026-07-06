import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { projectsApi } from '../../services/projects-api';
import type { PaginatedProjects, Project, ProjectListParams, ProjectSummary } from '../../types/project';
import { ProjectListPage } from './ProjectListPage';

const toastMock = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock('react-toastify', () => ({ toast: toastMock }));
vi.mock('../../services/projects-api', () => ({
  projectsApi: {
    list: vi.fn(),
    remove: vi.fn(),
  },
}));

const project: Project = {
  id: 'project-1',
  name: 'Projeto para exclusão',
  startDate: '2026-01-01',
  endDate: '2026-06-01',
  totalBudget: 100000,
  description: 'Descrição do projeto',
  status: 'IN_REVIEW',
  risk: 'MEDIUM',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const approvedProject: Project = {
  ...project,
  id: 'project-2',
  name: 'Projeto aprovado',
  status: 'APPROVED',
  risk: 'LOW',
};

const specialProject: Project = {
  ...project,
  id: 'project-special',
  name: 'Projeto Especial XYZ',
  status: 'IN_PROGRESS',
  risk: 'HIGH',
};

const baseSummary: ProjectSummary = {
  totalProjects: 12,
  inReview: 3,
  inExecution: 5,
  listedBudget: 1200000,
  highRisk: 2,
};

function response(
  items: Project[],
  overrides: Partial<PaginatedProjects> = {},
): PaginatedProjects {
  const total = overrides.total ?? items.length;
  const limit = overrides.limit ?? 5;
  const page = overrides.page ?? 1;
  const totalPages = overrides.totalPages ?? Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    nextPage: overrides.nextPage ?? page < totalPages,
    summary: overrides.summary ?? {
      ...baseSummary,
      totalProjects: total,
    },
  };
}

function renderList() {
  return render(
    <MemoryRouter>
      <ProjectListPage />
    </MemoryRouter>,
  );
}

async function openDeleteDialog() {
  const user = userEvent.setup();
  await screen.findByRole('button', { name: `Remover ${project.name}` });
  await user.click(screen.getByRole('button', { name: `Remover ${project.name}` }));
  return {
    user,
    dialog: await screen.findByRole('alertdialog'),
  };
}

describe('ProjectListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(projectsApi.list).mockResolvedValue(response([project], {
      summary: { ...baseSummary, totalProjects: 1 },
    }));
  });

  it('keeps essential project actions available in the mobile card', async () => {
    renderList();

    expect(
      await screen.findByRole('button', {
        name: `Editar ${project.name} (cartão móvel)`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: `Gerar análise de ${project.name} (cartão móvel)`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: `Remover ${project.name} (cartão móvel)`,
      }),
    ).toBeEnabled();
  });

  it('shows a success toast after deleting a project', async () => {
    vi.mocked(projectsApi.remove).mockResolvedValue({} as never);
    renderList();
    const { user, dialog } = await openDeleteDialog();

    await user.click(within(dialog).getByRole('button', { name: 'Remover projeto' }));

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith(
        `Projeto “${project.name}” removido com sucesso.`,
      );
    });
  });

  it('shows an error toast and preserves the list when deletion fails', async () => {
    vi.mocked(projectsApi.remove).mockRejectedValue(new Error('Exclusão indisponível.'));
    renderList();
    const { user, dialog } = await openDeleteDialog();

    await user.click(within(dialog).getByRole('button', { name: 'Remover projeto' }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('Exclusão indisponível.');
      expect(screen.getAllByText(project.name).length).toBeGreaterThan(0);
    });
  });

  it('debounces name search and finds a project that was outside the first page', async () => {
    vi.mocked(projectsApi.list).mockImplementation(async (params?: ProjectListParams) => {
      if (params?.search === 'Especial') {
        return response([specialProject], {
          summary: {
            totalProjects: 1,
            inReview: 0,
            inExecution: 1,
            listedBudget: specialProject.totalBudget,
            highRisk: 1,
          },
        });
      }
      return response([project, approvedProject], {
        total: 12,
        totalPages: 2,
        nextPage: true,
        summary: baseSummary,
      });
    });
    const user = userEvent.setup();
    renderList();

    expect((await screen.findAllByText('Projeto aprovado')).length).toBeGreaterThan(0);
    const nameSearch = screen.getByRole('searchbox', { name: 'Buscar projeto' });
    await user.type(nameSearch, 'Especial');

    await waitFor(() => {
      expect(projectsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({
        page: 1,
        limit: 5,
        search: 'Especial',
      }));
    });
    expect((await screen.findAllByText(specialProject.name)).length).toBeGreaterThan(0);
    expect(projectsApi.list).toHaveBeenCalledTimes(2);

    const totalCard = screen.getByText('Total de projetos').closest('article');
    expect(totalCard).not.toBeNull();
    expect(within(totalCard!).getByText('1')).toBeInTheDocument();
  });

  it('sends status and risk to the API instead of filtering the current page', async () => {
    vi.mocked(projectsApi.list).mockImplementation(async (params?: ProjectListParams) => {
      if (params?.status === 'APPROVED') {
        return response([approvedProject], {
          summary: { ...baseSummary, totalProjects: 1, inReview: 0, inExecution: 1 },
        });
      }
      if (params?.risk === 'MEDIUM') {
        return response([project], {
          summary: { ...baseSummary, totalProjects: 1, highRisk: 0 },
        });
      }
      return response([project, approvedProject]);
    });
    const user = userEvent.setup();
    renderList();

    const statusFilter = await screen.findByRole('combobox', { name: 'Status' });
    await user.click(statusFilter);
    await user.type(statusFilter, 'aprov');
    await user.click(screen.getByRole('option', { name: 'Aprovado' }));

    await waitFor(() => {
      expect(projectsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({
        page: 1,
        status: 'APPROVED',
      }));
    });
    expect((await screen.findAllByText(approvedProject.name)).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Limpar filtro de status' }));

    const riskFilter = screen.getByRole('combobox', { name: 'Risco' });
    await user.click(riskFilter);
    await user.type(riskFilter, 'medio');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(projectsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({
        page: 1,
        risk: 'MEDIUM',
      }));
    });
    expect((await screen.findAllByText(project.name)).length).toBeGreaterThan(0);
    expect(screen.queryByText(approvedProject.name)).not.toBeInTheDocument();
  });

  it('resets to page 1 on filter changes and preserves filters when paginating', async () => {
    vi.mocked(projectsApi.list).mockImplementation(async (params?: ProjectListParams) => response(
      params?.page === 2 ? [specialProject] : [project],
      {
        page: params?.page ?? 1,
        total: 7,
        totalPages: 2,
        nextPage: params?.page !== 2,
        summary: { ...baseSummary, totalProjects: 7, highRisk: 7 },
      },
    ));
    const user = userEvent.setup();
    renderList();

    await screen.findByRole('button', { name: /Próxima/ });
    await user.click(screen.getByRole('button', { name: /Próxima/ }));
    await waitFor(() => {
      expect(projectsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });

    const riskFilter = await screen.findByRole('combobox', { name: 'Risco' });
    await user.click(riskFilter);
    await user.type(riskFilter, 'alto');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(projectsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({
        page: 1,
        risk: 'HIGH',
      }));
    });

    await user.click(await screen.findByRole('button', { name: /Próxima/ }));
    await waitFor(() => {
      expect(projectsApi.list).toHaveBeenLastCalledWith(expect.objectContaining({
        page: 2,
        risk: 'HIGH',
      }));
    });
  });
});
