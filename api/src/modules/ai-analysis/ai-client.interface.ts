import { ProjectAnalysisResponseDto } from './dto/project-analysis-response.dto';
import { ProjectContext } from './project-analysis-prompt-builder';

export const AI_CLIENT = Symbol('AI_CLIENT');

export interface AiClient {
  generateAnalysis(
    prompt: string,
    context: ProjectContext,
  ): Promise<ProjectAnalysisResponseDto>;
}
