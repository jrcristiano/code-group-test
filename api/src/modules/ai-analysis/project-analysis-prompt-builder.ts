import { PROJECT_STATUS_LABELS } from '../../common/project-status.enum';
import { PROJECT_RISK_LABELS } from '../../common/project-risk.enum';

export interface ProjectContext {
  name: string;
  description: string;
  status: string;
  risk: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  durationInDays: number;
  durationRisk: string;
}

export class ProjectAnalysisPromptBuilder {
  static build(context: ProjectContext): string {
    return `Analise o seguinte projeto e forneça um resumo executivo, pontos de atenção e recomendação executiva.

DADOS DO PROJETO:
- Nome: ${context.name}
- Descrição: ${context.description || 'Sem descrição'}
- Status: ${PROJECT_STATUS_LABELS[context.status] || context.status}
- Risco calculado: ${PROJECT_RISK_LABELS[context.risk] || context.risk}
- Orçamento total: R$ ${context.totalBudget.toLocaleString('pt-BR')}
- Data de início: ${context.startDate}
- Previsão de término: ${context.endDate}
- Duração estimada: ${context.durationInDays} dias
- Risco específico do prazo: ${PROJECT_RISK_LABELS[context.durationRisk] || context.durationRisk}

Com base nesses dados, gere uma análise com:
1. Resumo do projeto (2-3 frases)
2. Pontos de atenção (3-5 itens, considerando risco, orçamento e prazo)
3. Recomendação executiva (1-2 frases)

Considere:
- Projetos de alto risco precisam de pontos de atenção mais críticos.
- Projetos com orçamento alto devem mencionar controle financeiro.
- Projetos com prazo longo devem mencionar governança e marcos.
- Projetos cancelados devem recomendar análise de causa e lições aprendidas.
- Projetos encerrados devem recomendar documentação de resultados.

Responda APENAS com um objeto JSON no seguinte formato, sem texto adicional:
{
  "summary": "...",
  "attentionPoints": ["...", "..."],
  "executiveRecommendation": "..."
}`;
  }
}
