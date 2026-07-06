import { Injectable } from '@nestjs/common';
import { AiClient } from './ai-client.interface';
import { ProjectAnalysisResponseDto } from './dto/project-analysis-response.dto';
import { ProjectContext } from './project-analysis-prompt-builder';
import { ProjectRisk } from '../../common/project-risk.enum';
import { PROJECT_RISK_LABELS } from '../../common/project-risk.enum';
import { ProjectStatus } from '../../common/project-status.enum';
import { PROJECT_STATUS_LABELS } from '../../common/project-status.enum';
import { RISK_THRESHOLDS } from '../../common/project-risk-calculator';

@Injectable()
export class MockAiClient implements AiClient {
  async generateAnalysis(
    _prompt: string,
    context: ProjectContext,
  ): Promise<ProjectAnalysisResponseDto> {
    return this.generateFromContext(context);
  }

  generateFromContext(context: ProjectContext): ProjectAnalysisResponseDto {
    const risk = context.risk as ProjectRisk;
    const status = context.status as ProjectStatus;
    const budgetFormatted = `R$ ${context.totalBudget.toLocaleString('pt-BR')}`;

    const summary = this.buildSummary(context, risk, budgetFormatted);
    const attentionPoints = this.buildAttentionPoints(context, risk, status, budgetFormatted);
    const recommendation = this.buildRecommendation(status);

    return { summary, attentionPoints, executiveRecommendation: recommendation };
  }

  private buildSummary(context: ProjectContext, risk: ProjectRisk, budget: string): string {
    const riskLabel = PROJECT_RISK_LABELS[risk];
    const statusLabel = PROJECT_STATUS_LABELS[context.status] || context.status;

    return `O projeto "${context.name}" possui orçamento de ${budget} e prazo de ${context.durationInDays} dias. ` +
      `Seu risco foi classificado como "${riskLabel}" e seu status atual é "${statusLabel}". ` +
      `A iniciativa ${context.description ? `busca ${context.description.toLowerCase()}.` : 'está em fase de estruturação.'}`;
  }

  private buildAttentionPoints(
    context: ProjectContext,
    risk: ProjectRisk,
    status: ProjectStatus,
    budget: string,
  ): string[] {
    const points: string[] = [];

    if (risk === ProjectRisk.HIGH) {
      points.push('⚠️ Risco alto: este projeto exige atenção executiva dedicada e revisões frequentes de progresso.');
      points.push('Recomenda-se a criação de um comitê de acompanhamento com reuniões quinzenais.');
    } else if (risk === ProjectRisk.MEDIUM) {
      points.push('Risco moderado: mantenha monitoramento regular dos indicadores principais.');
    } else {
      points.push('Risco baixo: o projeto apresenta condições favoráveis, mas não dispensa acompanhamento.');
    }

    if (context.totalBudget > RISK_THRESHOLDS.HIGH_BUDGET) {
      points.push(`Orçamento elevado (${budget}): implementar controle financeiro rigoroso com revisões mensais.`);
    } else if (context.totalBudget > RISK_THRESHOLDS.MEDIUM_BUDGET) {
      points.push(`Orçamento de ${budget}: definir responsável por aprovações financeiras.`);
    }

    if (context.durationRisk === ProjectRisk.HIGH) {
      points.push('Prazo superior a 6 meses: estabelecer marcos intermediários trimestrais com entregas parciais.');
    } else if (context.durationRisk === ProjectRisk.MEDIUM) {
      points.push('Prazo entre 3 e 6 meses: definir entregas mensais para acompanhamento.');
    }

    if (status === ProjectStatus.CANCELED) {
      points.push('Projeto cancelado: documentar os motivos do cancelamento para consulta futura.');
    } else if (status === ProjectStatus.FINISHED) {
      points.push('Projeto encerrado: garantir que os resultados e lições aprendidas sejam documentados.');
    } else if (status === ProjectStatus.IN_PROGRESS) {
      points.push('Projeto em andamento: manter comunicação ativa com as partes interessadas.');
    }

    if (points.length < 3) {
      points.push('Manter documentação atualizada do projeto em repositório central.');
    }

    return points;
  }

  private buildRecommendation(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.IN_REVIEW:
        return 'Recomenda-se concluir a análise de viabilidade e aprovar o projeto para início das atividades.';
      case ProjectStatus.APPROVED:
        return 'Projeto aprovado. Iniciar mobilização da equipe e definir os recursos necessários para o kick-off.';
      case ProjectStatus.IN_PROGRESS:
        return 'Manter o ritmo de execução com atenção aos marcos intermediários e gestão proativa de riscos.';
      case ProjectStatus.FINISHED:
        return 'Projeto encerrado. Realizar reunião de fechamento, documentar lições aprendidas e celebrar os resultados com a equipe.';
      case ProjectStatus.CANCELED:
        return 'Realizar uma análise de causa raiz do cancelamento e registrar as lições aprendidas para evitar recorrência em projetos futuros.';
      default:
        return 'Acompanhar o projeto conforme os ritos de governança estabelecidos.';
    }
  }

}
