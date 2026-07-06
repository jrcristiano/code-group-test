import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProjectNotFoundException } from '../../common/business-exceptions';
import { formatDateOnly, daysBetween } from '../../common/date-utils';
import { AI_CLIENT, type AiClient } from './ai-client.interface';
import {
  ProjectAnalysisPromptBuilder,
  ProjectContext,
} from './project-analysis-prompt-builder';
import { ProjectAnalysisResponseDto } from './dto/project-analysis-response.dto';
import { ProjectRiskCalculator } from '../../common/project-risk-calculator';

@Injectable()
export class AiAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
  ) {}

  async analyze(projectId: string): Promise<ProjectAnalysisResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ProjectNotFoundException(projectId);
    }

    const durationInDays = daysBetween(project.startDate, project.endDate);

    const context: ProjectContext = {
      name: project.name,
      description: project.description,
      status: project.status,
      risk: project.risk,
      totalBudget: project.totalBudget,
      startDate: formatDateOnly(project.startDate),
      endDate: formatDateOnly(project.endDate),
      durationInDays,
      durationRisk: ProjectRiskCalculator.calculateDurationRisk(
        project.startDate,
        project.endDate,
      ),
    };

    const prompt = ProjectAnalysisPromptBuilder.build(context);
    return this.aiClient.generateAnalysis(prompt, context);
  }
}
