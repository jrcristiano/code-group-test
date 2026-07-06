import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectsApi } from '../../services/projects-api';
import type { Project } from '../../types/project';
import { projectSchema, ProjectFormPage } from './ProjectFormPage';

const routeState = vi.hoisted(() => ({ projectId: undefined as string | undefined }));
const toastMock = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock('react-toastify', () => ({ toast: toastMock }));

describe('ProjectFormPage — validation schema', () => {
  it('rejects empty name', () => {
    const result = projectSchema.safeParse({
      name: '',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      totalBudget: 100000,
      description: 'Desc',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === 'Nome é obrigatório.')).toBe(true);
    }
  });

  it('rejects budget zero', () => {
    const result = projectSchema.safeParse({
      name: 'Projeto X',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      totalBudget: 0,
      description: 'Desc',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'Orçamento deve ser maior que zero.'),
      ).toBe(true);
    }
  });

  it('rejects endDate not after startDate', () => {
    const result = projectSchema.safeParse({
      name: 'Projeto X',
      startDate: '2026-12-31',
      endDate: '2026-01-01',
      totalBudget: 100000,
      description: 'Desc',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) => i.message === 'Data de término deve ser posterior à data de início.',
        ),
      ).toBe(true);
    }
  });

  it('rejects empty description', () => {
    const result = projectSchema.safeParse({
      name: 'Projeto X',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      totalBudget: 100000,
      description: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'Descrição é obrigatória.'),
      ).toBe(true);
    }
  });

  it('accepts valid project data', () => {
    const result = projectSchema.safeParse({
      name: 'Projeto X',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      totalBudget: 100000,
      description: 'Descrição válida',
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Integration tests for the form page (narrow scope)
// ---------------------------------------------------------------------------

// Mock the projects API
vi.mock('../../services/projects-api', () => ({
  projectsApi: {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
  },
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: routeState.projectId }),
  };
});

const project: Project = {
  id: 'project-1',
  name: 'Projeto existente',
  startDate: '2026-01-01',
  endDate: '2026-06-01',
  totalBudget: 100000,
  description: 'Descrição existente',
  status: 'IN_REVIEW',
  risk: 'MEDIUM',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function renderForm() {
  return render(
    <MemoryRouter>
      <ProjectFormPage />
    </MemoryRouter>,
  );
}

describe('ProjectFormPage — form integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeState.projectId = undefined;
  });

  async function fillValidForm() {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Nome do projeto'), 'Projeto X');
    fireEvent.change(document.querySelector('input[name="startDate"]')!, {
      target: { value: '2026-01-01' },
    });
    fireEvent.change(document.querySelector('input[name="endDate"]')!, {
      target: { value: '2026-06-01' },
    });
    await user.type(document.querySelector('input[name="totalBudget"]')!, '100000');
    await user.type(
      screen.getByPlaceholderText(/descreva o objetivo/i),
      'Descrição válida',
    );
    return user;
  }

  it('shows validation error when submitting empty form', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /criar projeto/i }));

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório.')).toBeInTheDocument();
    });
  });

  it('clears the zero-budget validation after a positive monetary value is entered', async () => {
    renderForm();
    const user = userEvent.setup();
    const budgetInput = screen.getByLabelText(/orçamento total/i);

    await user.type(budgetInput, '0');
    await user.click(screen.getByRole('button', { name: /criar projeto/i }));

    expect(await screen.findByText('Orçamento deve ser maior que zero.')).toBeInTheDocument();

    await user.clear(budgetInput);
    await user.type(budgetInput, '1234,56');

    await waitFor(() => {
      expect(screen.queryByText('Orçamento deve ser maior que zero.')).not.toBeInTheDocument();
    });
    expect(budgetInput).toHaveValue('R$ 1.234,56');
  });

  it('shows validation error when description is left empty', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Nome do projeto'), 'Projeto X');

    await user.click(screen.getByRole('button', { name: /criar projeto/i }));

    await waitFor(() => {
      expect(screen.getByText('Descrição é obrigatória.')).toBeInTheDocument();
    });
  });

  it('shows validation error when dates are inverted', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Nome do projeto'), 'Projeto X');

    const startDateInput = document.querySelector(
      'input[name="startDate"]',
    ) as HTMLInputElement;
    const endDateInput = document.querySelector(
      'input[name="endDate"]',
    ) as HTMLInputElement;

    fireEvent.change(startDateInput!, { target: { value: '2026-12-31' } });
    fireEvent.change(endDateInput!, { target: { value: '2026-01-01' } });
    await user.type(document.querySelector('input[name="totalBudget"]')!, '100000');

    await user.click(screen.getByRole('button', { name: /criar projeto/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Data de término deve ser posterior à data de início.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('shows a success toast after creating a project', async () => {
    vi.mocked(projectsApi.create).mockResolvedValue(project);
    renderForm();
    const user = await fillValidForm();

    await user.click(screen.getByRole('button', { name: /criar projeto/i }));

    await waitFor(() => {
      expect(projectsApi.create).toHaveBeenCalledWith(expect.objectContaining({
        totalBudget: 100000,
      }));
      expect(toastMock.success).toHaveBeenCalledWith('Projeto criado com sucesso.');
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  it('shows an error toast when project creation fails', async () => {
    vi.mocked(projectsApi.create).mockRejectedValue(new Error('API indisponível.'));
    renderForm();
    const user = await fillValidForm();

    await user.click(screen.getByRole('button', { name: /criar projeto/i }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('API indisponível.');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('shows success and error feedback for project editing through toasts', async () => {
    routeState.projectId = project.id;
    vi.mocked(projectsApi.getById).mockResolvedValue(project);
    vi.mocked(projectsApi.update)
      .mockResolvedValueOnce(project)
      .mockRejectedValueOnce(new Error('Não foi possível editar.'));

    const firstRender = renderForm();
    const firstSave = await screen.findByRole('button', { name: /salvar alterações/i });
    await userEvent.click(firstSave);
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith('Projeto atualizado com sucesso.');
    });

    firstRender.unmount();
    mockNavigate.mockClear();
    renderForm();
    const secondSave = await screen.findByRole('button', { name: /salvar alterações/i });
    await userEvent.click(secondSave);
    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('Não foi possível editar.');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
