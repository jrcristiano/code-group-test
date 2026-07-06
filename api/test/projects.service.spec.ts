import type { Project } from '@prisma/client';
import { ProjectRisk } from '../src/common/project-risk.enum';
import { ProjectStatus } from '../src/common/project-status.enum';
import { PrismaService } from '../src/database/prisma.service';
import { ProjectsService } from '../src/modules/projects/projects.service';
import {
  InvalidDateRangeException,
  InvalidStatusTransitionException,
  ProjectDeletionBlockedException,
  ProjectNotFoundException,
} from '../src/common/business-exceptions';

type ProjectWhere = {
  AND?: ProjectWhere[];
  name?: { contains?: string };
  status?: string | { in?: string[] };
  risk?: string | { in?: string[] };
};

function matches(project: Project, where: ProjectWhere = {}): boolean {
  if (where.AND && !where.AND.every((condition) => matches(project, condition))) {
    return false;
  }

  if (where.name?.contains && !project.name.toLocaleLowerCase('pt-BR').includes(
    where.name.contains.toLocaleLowerCase('pt-BR'),
  )) {
    return false;
  }

  for (const field of ['status', 'risk'] as const) {
    const condition = where[field];
    if (typeof condition === 'string' && project[field] !== condition) return false;
    if (typeof condition === 'object' && condition.in && !condition.in.includes(project[field])) {
      return false;
    }
  }

  return true;
}

function createProjects(): Project[] {
  return Array.from({ length: 12 }, (_, offset) => {
    const index = offset + 1;
    const statuses: Record<number, ProjectStatus> = {
      1: ProjectStatus.IN_REVIEW,
      2: ProjectStatus.APPROVED,
      3: ProjectStatus.IN_PROGRESS,
      7: ProjectStatus.IN_REVIEW,
      8: ProjectStatus.APPROVED,
      9: ProjectStatus.IN_PROGRESS,
      12: ProjectStatus.IN_REVIEW,
    };

    return {
      id: `project-${index}`,
      name: index === 3 ? 'Projeto Especial XYZ' : `Projeto ${index}`,
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-12-31T00:00:00.000Z'),
      totalBudget: index * 1000,
      description: `Descrição ${index}`,
      status: statuses[index] ?? ProjectStatus.FINISHED,
      risk: [2, 11].includes(index) ? ProjectRisk.HIGH : ProjectRisk.LOW,
      createdAt: new Date(`2026-01-${String(index).padStart(2, '0')}T00:00:00.000Z`),
      updatedAt: new Date(`2026-01-${String(index).padStart(2, '0')}T00:00:00.000Z`),
    };
  });
}

function createPrismaMock(projects: Project[]) {
  const filtered = (where?: ProjectWhere) => projects.filter((project) => matches(project, where));

  const project = {
    findMany: jest.fn(async ({ where, skip = 0, take = projects.length, orderBy }: any) => {
      const result = [...filtered(where)];
      const [field, direction] = Object.entries(orderBy ?? { createdAt: 'desc' })[0] as [
        keyof Project,
        'asc' | 'desc',
      ];
      result.sort((left, right) => {
        const leftValue = left[field];
        const rightValue = right[field];
        if (leftValue === rightValue) return 0;
        const comparison = leftValue < rightValue ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
      });
      return result.slice(skip, skip + take);
    }),
    count: jest.fn(async ({ where }: any = {}) => filtered(where).length),
    aggregate: jest.fn(async ({ where }: any = {}) => ({
      _sum: {
        totalBudget: filtered(where).reduce((sum, item) => sum + item.totalBudget, 0),
      },
    })),
  };

  return {
    project,
    $transaction: jest.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
  };
}

describe('ProjectsService.findAll', () => {
  const projects = createProjects();
  const prisma = createPrismaMock(projects);
  const service = new ProjectsService(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('paginates items after filtering and summarizes all 12 database records', async () => {
    const result = await service.findAll({ page: 1, limit: 6 });

    expect(result.items).toHaveLength(6);
    expect(result.items.some((item) => item.name === 'Projeto Especial XYZ')).toBe(false);
    expect(result.total).toBe(12);
    expect(result.totalPages).toBe(2);
    expect(result.nextPage).toBe(true);
    expect(result.summary).toEqual({
      totalProjects: 12,
      inReview: 3,
      inExecution: 4,
      listedBudget: 78000,
      highRisk: 2,
    });
  });

  it('finds on page 1 a project that belongs to page 2 without filters', async () => {
    const result = await service.findAll({ page: 1, limit: 6, search: 'especial' });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Projeto Especial XYZ');
    expect(result.total).toBe(1);
    expect(result.summary.totalProjects).toBe(1);
    expect(result.summary.inExecution).toBe(1);
    expect(result.summary.listedBudget).toBe(3000);
  });

  it('keeps risk filters across pages and aggregates the complete filtered result', async () => {
    const firstPage = await service.findAll({
      page: 1,
      limit: 1,
      risk: ProjectRisk.HIGH,
    });
    const secondPage = await service.findAll({
      page: 2,
      limit: 1,
      risk: ProjectRisk.HIGH,
    });

    expect(firstPage.items).toHaveLength(1);
    expect(secondPage.items).toHaveLength(1);
    expect(firstPage.items[0].id).not.toBe(secondPage.items[0].id);
    expect(firstPage.total).toBe(2);
    expect(secondPage.total).toBe(2);
    expect(firstPage.summary.highRisk).toBe(2);
    expect(secondPage.summary.highRisk).toBe(2);
    expect(secondPage.nextPage).toBe(false);
  });
});

function createProjectFixture(overrides: Partial<Project> = {}): Project {
  return {
    id: '66c587e9-55cd-4891-b509-fa00cd29e275',
    name: 'Projeto base',
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-04-01T00:00:00.000Z'),
    totalBudget: 100000,
    description: 'Descrição base',
    status: ProjectStatus.IN_REVIEW,
    risk: ProjectRisk.LOW,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('ProjectsService business operations', () => {
  let existing: Project;
  let prisma: any;
  let service: ProjectsService;

  beforeEach(() => {
    existing = createProjectFixture();
    prisma = {
      project: {
        create: jest.fn(async ({ data }: any) =>
          createProjectFixture({ ...data }),
        ),
        findUnique: jest.fn(async () => existing),
        update: jest.fn(async ({ data }: any) => ({
          ...existing,
          ...data,
          updatedAt: new Date('2026-02-01T00:00:00.000Z'),
        })),
        delete: jest.fn(async () => existing),
      },
    };
    service = new ProjectsService(prisma as PrismaService);
  });

  it('creates with normalized text, initial status and calculated risk', async () => {
    const result = await service.create({
      name: '  Projeto criado  ',
      startDate: '2026-01-01',
      endDate: '2026-04-02',
      totalBudget: 100000,
      description: '  Descrição criada  ',
    });

    expect(prisma.project.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Projeto criado',
        description: 'Descrição criada',
        status: ProjectStatus.IN_REVIEW,
        risk: ProjectRisk.MEDIUM,
      }),
    });
    expect(result.status).toBe(ProjectStatus.IN_REVIEW);
    expect(result.risk).toBe(ProjectRisk.MEDIUM);
  });

  it('rejects whitespace-only required text even when called outside HTTP', async () => {
    await expect(
      service.create({
        name: '   ',
        startDate: '2026-01-01',
        endDate: '2026-04-01',
        totalBudget: 100000,
        description: 'Descrição',
      }),
    ).rejects.toThrow('O nome não pode estar vazio.');
  });

  it('preserves omitted fields and recalculates risk on update', async () => {
    const result = await service.update(existing.id, { totalBudget: 500001 });

    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: existing.id },
      data: expect.objectContaining({
        startDate: existing.startDate,
        endDate: existing.endDate,
        totalBudget: 500001,
        risk: ProjectRisk.HIGH,
      }),
    });
    expect(result.name).toBe(existing.name);
    expect(result.description).toBe(existing.description);
    expect(result.risk).toBe(ProjectRisk.HIGH);
  });

  it('rejects an invalid date range during update', async () => {
    await expect(
      service.update(existing.id, { endDate: '2025-12-31' }),
    ).rejects.toBeInstanceOf(InvalidDateRangeException);
  });

  it('applies a valid status transition', async () => {
    const result = await service.updateStatus(existing.id, {
      status: ProjectStatus.APPROVED,
    });

    expect(result.status).toBe(ProjectStatus.APPROVED);
  });

  it('blocks status jumps and transitions from canceled projects', async () => {
    await expect(
      service.updateStatus(existing.id, { status: ProjectStatus.IN_PROGRESS }),
    ).rejects.toBeInstanceOf(InvalidStatusTransitionException);

    existing = createProjectFixture({ status: ProjectStatus.CANCELED });
    await expect(
      service.updateStatus(existing.id, { status: ProjectStatus.APPROVED }),
    ).rejects.toBeInstanceOf(InvalidStatusTransitionException);
  });

  it.each([ProjectStatus.IN_PROGRESS, ProjectStatus.FINISHED])(
    'blocks deletion for status %s',
    async (status) => {
      existing = createProjectFixture({ status });

      await expect(service.remove(existing.id)).rejects.toBeInstanceOf(
        ProjectDeletionBlockedException,
      );
      expect(prisma.project.delete).not.toHaveBeenCalled();
    },
  );

  it.each([
    ProjectStatus.IN_REVIEW,
    ProjectStatus.APPROVED,
    ProjectStatus.CANCELED,
  ])('allows deletion for status %s', async (status) => {
    existing = createProjectFixture({ status });

    await service.remove(existing.id);

    expect(prisma.project.delete).toHaveBeenCalledWith({
      where: { id: existing.id },
    });
  });

  it('returns not found for a valid but unknown UUID', async () => {
    prisma.project.findUnique.mockResolvedValue(null);

    await expect(service.findById(existing.id)).rejects.toBeInstanceOf(
      ProjectNotFoundException,
    );
  });
});
