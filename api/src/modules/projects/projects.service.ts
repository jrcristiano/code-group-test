import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma, Project } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ProjectRiskCalculator } from '../../common/project-risk-calculator';
import {
  parseDateOnly,
  formatDateOnly,
  isValidDateOnly,
} from '../../common/date-utils';
import {
  isTransitionAllowed,
  canDeleteProject,
} from '../../common/status-transitions';
import { ProjectStatus } from '../../common/project-status.enum';
import { ProjectRisk } from '../../common/project-risk.enum';
import {
  InvalidStatusTransitionException,
  ProjectDeletionBlockedException,
  InvalidDateRangeException,
  InvalidProjectDateException,
  ProjectNotFoundException,
} from '../../common/business-exceptions';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { PaginatedProjectsResponseDto } from './dto/paginated-projects-response.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    this.validateDateRange(dto.startDate, dto.endDate);

    const name = this.normalizeRequiredText(dto.name, 'name');
    const description = this.normalizeRequiredText(
      dto.description,
      'description',
    );

    const startDate = parseDateOnly(dto.startDate);
    const endDate = parseDateOnly(dto.endDate);

    const risk = ProjectRiskCalculator.calculate(
      dto.totalBudget,
      startDate,
      endDate,
    );

    const project = await this.prisma.project.create({
      data: {
        name,
        startDate,
        endDate,
        totalBudget: dto.totalBudget,
        description,
        status: ProjectStatus.IN_REVIEW,
        risk,
      },
    });

    return this.toResponse(project);
  }

  async findAll(query: QueryProjectsDto): Promise<PaginatedProjectsResponseDto> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };
    const where = this.buildFilters(query);

    const [projects, total, inReview, inExecution, budget, highRisk] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.project.count({ where }),
      this.prisma.project.count({
        where: { AND: [where, { status: ProjectStatus.IN_REVIEW }] },
      }),
      this.prisma.project.count({
        where: {
          AND: [
            where,
            { status: { in: [ProjectStatus.APPROVED, ProjectStatus.IN_PROGRESS] } },
          ],
        },
      }),
      this.prisma.project.aggregate({
        where,
        _sum: { totalBudget: true },
      }),
      this.prisma.project.count({
        where: { AND: [where, { risk: ProjectRisk.HIGH }] },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: projects.map((p) => this.toResponse(p)),
      total,
      page,
      limit,
      totalPages,
      nextPage: page < totalPages,
      summary: {
        totalProjects: total,
        inReview,
        inExecution,
        listedBudget: budget._sum.totalBudget ?? 0,
        highRisk,
      },
    };
  }

  private buildFilters(query: QueryProjectsDto): Prisma.ProjectWhereInput {
    const search = query.search?.trim();

    return {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(query.status && { status: query.status }),
      ...(query.risk && { risk: query.risk }),
    };
  }

  async findById(id: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new ProjectNotFoundException(id);
    }

    return this.toResponse(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const existing = await this.prisma.project.findUnique({ where: { id } });

    if (!existing) {
      throw new ProjectNotFoundException(id);
    }

    const startDate = dto.startDate
      ? parseDateOnly(dto.startDate)
      : existing.startDate;
    const endDate = dto.endDate
      ? parseDateOnly(dto.endDate)
      : existing.endDate;
    const totalBudget = dto.totalBudget ?? existing.totalBudget;
    const name =
      dto.name === undefined
        ? undefined
        : this.normalizeRequiredText(dto.name, 'name');
    const description =
      dto.description === undefined
        ? undefined
        : this.normalizeRequiredText(dto.description, 'description');

    this.validateDateRange(
      dto.startDate || formatDateOnly(existing.startDate),
      dto.endDate || formatDateOnly(existing.endDate),
    );

    const risk = ProjectRiskCalculator.calculate(
      totalBudget,
      startDate,
      endDate,
    );

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        startDate,
        endDate,
        ...(dto.totalBudget !== undefined && { totalBudget: dto.totalBudget }),
        ...(description !== undefined && { description }),
        risk,
      },
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.project.findUnique({ where: { id } });

    if (!existing) {
      throw new ProjectNotFoundException(id);
    }

    if (!canDeleteProject(existing.status as ProjectStatus)) {
      throw new ProjectDeletionBlockedException(existing.status);
    }

    await this.prisma.project.delete({ where: { id } });
  }

  async updateStatus(
    id: string,
    dto: UpdateProjectStatusDto,
  ): Promise<ProjectResponseDto> {
    const existing = await this.prisma.project.findUnique({ where: { id } });

    if (!existing) {
      throw new ProjectNotFoundException(id);
    }

    const currentStatus = existing.status as ProjectStatus;
    const newStatus = dto.status;

    if (!isTransitionAllowed(currentStatus, newStatus)) {
      throw new InvalidStatusTransitionException(currentStatus, newStatus);
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: { status: newStatus },
    });

    return this.toResponse(updated);
  }

  private validateDateRange(startDateStr: string, endDateStr: string): void {
    if (!isValidDateOnly(startDateStr)) {
      throw new InvalidProjectDateException('startDate');
    }

    if (!isValidDateOnly(endDateStr)) {
      throw new InvalidProjectDateException('endDate');
    }

    const start = parseDateOnly(startDateStr);
    const end = parseDateOnly(endDateStr);

    if (end <= start) {
      throw new InvalidDateRangeException();
    }
  }

  private normalizeRequiredText(
    value: string,
    field: 'name' | 'description',
  ): string {
    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException(
        field === 'name'
          ? 'O nome não pode estar vazio.'
          : 'A descrição não pode estar vazia.',
      );
    }
    return normalized;
  }

  private toResponse(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      startDate: formatDateOnly(project.startDate),
      endDate: formatDateOnly(project.endDate),
      totalBudget: project.totalBudget,
      description: project.description,
      status: project.status as ProjectStatus,
      risk: project.risk as ProjectRisk,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
