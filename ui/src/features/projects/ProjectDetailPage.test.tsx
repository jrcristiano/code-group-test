import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectDetailPage } from './ProjectDetailPage';
import type { Project, ProjectAnalysis } from '../../types/project';

// Build a base project fixture
function buildProject(
  overrides: Partial<Project> = {},
): Project {
  return {
    id: '1',
    name: 'Projeto Teste',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    totalBudget: 150000,
    description: 'Descrição do projeto',
    status: 'IN_REVIEW',
    risk: 'LOW',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

// Mock the projects API
const mockGetById = vi.fn();
const mockUpdateStatus = vi.fn();
const mockGetAiAnalysis = vi.fn();

vi.mock('../../services/projects-api', () => ({
  projectsApi: {
    getById: (...args: unknown[]) => mockGetById(...args),
    updateStatus: (...args: unknown[]) => mockUpdateStatus(...args),
    getAiAnalysis: (...args: unknown[]) => mockGetAiAnalysis(...args),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

function renderPage(project: Project = buildProject()) {
  mockGetById.mockResolvedValue(project);
  return render(
    <MemoryRouter>
      <ProjectDetailPage />
    </MemoryRouter>,
  );
}

describe('ProjectDetailPage — status buttons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Aprovar" button when status is IN_REVIEW', async () => {
    renderPage(buildProject({ status: 'IN_REVIEW' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Aprovar' })).toBeInTheDocument();
    });
  });

  it('shows "Iniciar andamento" button when status is APPROVED', async () => {
    renderPage(buildProject({ status: 'APPROVED' }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Iniciar andamento' }),
      ).toBeInTheDocument();
    });
  });

  it('shows "Encerrar" button when status is IN_PROGRESS', async () => {
    renderPage(buildProject({ status: 'IN_PROGRESS' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Encerrar' })).toBeInTheDocument();
    });
  });

  it('does NOT show an advance button when status is FINISHED', async () => {
    renderPage(buildProject({ status: 'FINISHED' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Projeto Teste' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Aprovar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iniciar andamento' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Encerrar' })).not.toBeInTheDocument();
  });

  it('does NOT show an advance button when status is CANCELED', async () => {
    renderPage(buildProject({ status: 'CANCELED' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Projeto Teste' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Aprovar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iniciar andamento' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Encerrar' })).not.toBeInTheDocument();
  });
});

describe('ProjectDetailPage — AI analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const analysisFixture: ProjectAnalysis = {
    summary: 'Resumo do projeto de teste.',
    attentionPoints: ['Ponto 1', 'Ponto 2'],
    executiveRecommendation: 'Seguir com o projeto.',
  };

  it('displays AI analysis summary, attention points, and executive recommendation', async () => {
    const project = buildProject();
    mockGetById.mockResolvedValue(project);
    mockGetAiAnalysis.mockResolvedValue(analysisFixture);

    render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();

    // Wait for project to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Projeto Teste' })).toBeInTheDocument();
    });

    // Click to generate analysis
    await user.click(
      screen.getByRole('button', { name: 'Gerar análise' }),
    );

    // Wait for analysis to appear
    await waitFor(() => {
      expect(screen.getByText('Resumo do projeto de teste.')).toBeInTheDocument();
    });

    expect(screen.getByText('Ponto 1')).toBeInTheDocument();
    expect(screen.getByText('Ponto 2')).toBeInTheDocument();
    expect(screen.getByText('Seguir com o projeto.')).toBeInTheDocument();
  });

  it('clears a stale analysis after the project status changes', async () => {
    const project = buildProject({ status: 'IN_REVIEW' });
    mockGetById.mockResolvedValue(project);
    mockGetAiAnalysis.mockResolvedValue(analysisFixture);
    mockUpdateStatus.mockResolvedValue({ ...project, status: 'APPROVED' });

    render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: 'Gerar análise' }));
    expect(await screen.findByText('Resumo do projeto de teste.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aprovar' }));

    await waitFor(() => {
      expect(screen.queryByText('Resumo do projeto de teste.')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/análise ainda não foi gerada/i)).toBeInTheDocument();
  });
});
