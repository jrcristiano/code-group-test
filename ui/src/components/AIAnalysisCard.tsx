import type { ProjectAnalysis } from '../types/project';
import { Button } from './Button';
import { Card } from './Card';
import { ErrorState } from './ErrorMessage';
import { Icons } from './Icons';

interface Props {
  analysis: ProjectAnalysis | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}

export function AIAnalysisCard({ analysis, loading, error, onGenerate }: Props) {
  return (
    <Card className="ai-card">
      <div className="ai-card__header">
        <div className="ai-card__title-group">
          <div className="ai-card__icon"><Icons.Sparkles size={21} /></div>
          <div>
            <h2 className="ai-card__title">Análise de viabilidade</h2>
            <p className="ai-card__description">
              Gere uma análise automática considerando orçamento, prazo, risco e descrição do projeto.
            </p>
          </div>
        </div>
        <Button variant="dark" onClick={onGenerate} loading={loading} icon={<Icons.Sparkles />}>
          {loading ? 'Gerando análise...' : analysis ? 'Gerar novamente' : 'Gerar análise'}
        </Button>
      </div>

      <div className="ai-card__body">
        {loading && <AnalysisSkeleton />}
        {error && !loading && (
          <ErrorState
            compact
            title="Não foi possível gerar a análise"
            message={error}
            onRetry={onGenerate}
          />
        )}
        {analysis && !loading && !error && (
          <div className="analysis-grid">
            <AnalysisBlock title="Resumo executivo" wide icon={<Icons.FileText size={17} />}>
              <p>{analysis.summary}</p>
            </AnalysisBlock>
            <AnalysisBlock title="Riscos e pontos de atenção" icon={<Icons.Alert size={17} />}>
              <ul>
                {analysis.attentionPoints.map((point, index) => <li key={`${point}-${index}`}>{point}</li>)}
              </ul>
            </AnalysisBlock>
            <AnalysisBlock title="Recomendação executiva" icon={<Icons.Check size={17} />}>
              <p>{analysis.executiveRecommendation}</p>
            </AnalysisBlock>
            <AnalysisBlock title="Próximos passos" wide icon={<Icons.ArrowRight size={17} />}>
              <p>Revise os pontos identificados com as áreas responsáveis, registre a decisão e avance o projeto conforme o fluxo aprovado.</p>
            </AnalysisBlock>
          </div>
        )}
        {!analysis && !loading && !error && (
          <div className="ai-empty">
            <span className="ai-empty__icon"><Icons.FileText size={24} /></span>
            <h3>Transforme dados em contexto para decisão</h3>
            <p>A análise ainda não foi gerada. Ela oferece apoio à decisão e não substitui a avaliação das pessoas responsáveis pelo projeto.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="analysis-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Analisando dados do projeto...</span>
      <div className="analysis-skeleton__block analysis-skeleton__block--wide" aria-hidden="true">
        <span className="skeleton skeleton--line skeleton--short" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--medium" />
      </div>
      <div className="analysis-skeleton__block" aria-hidden="true">
        <span className="skeleton skeleton--line skeleton--short" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--medium" />
      </div>
      <div className="analysis-skeleton__block" aria-hidden="true">
        <span className="skeleton skeleton--line skeleton--short" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--medium" />
      </div>
    </div>
  );
}

function AnalysisBlock({
  title,
  children,
  icon,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={`analysis-block${wide ? ' analysis-block--wide' : ''}`}>
      <h3 className="analysis-block__title">{icon}{title}</h3>
      {children}
    </section>
  );
}
