import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectsApi } from '../../services/projects-api';
import { getErrorMessage } from '../../utils/format';
import type { Project, ProjectAnalysis } from '../../types/project';
import { LoadingState } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorMessage';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Icons } from '../../components/Icons';
import { StatusBadge } from '../../components/StatusBadge';
import { RiskBadge } from '../../components/RiskBadge';
import { ProjectSummaryCard } from '../../components/ProjectSummaryCard';
import { AIAnalysisCard } from '../../components/AIAnalysisCard';

const NEXT_STATUS_MAP: Record<Project['status'], { status: Project['status']; label: string } | null> = {
  IN_REVIEW: { status: 'APPROVED', label: 'Aprovar' },
  APPROVED: { status: 'IN_PROGRESS', label: 'Iniciar andamento' },
  IN_PROGRESS: { status: 'FINISHED', label: 'Encerrar' },
  FINISHED: null,
  CANCELED: null,
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectsApi.getById(id!);
      setProject(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar o projeto.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleAdvanceStatus = async () => {
    if (!project) return;
    const nextAction = NEXT_STATUS_MAP[project.status];
    if (!nextAction) return;
    setAdvanceLoading(true);
    setError(null);
    try {
      const updated = await projectsApi.updateStatus(project.id, { status: nextAction.status });
      setProject(updated);
      setAnalysis(null);
      setAnalysisError(null);
      toast.success('Status do projeto atualizado com sucesso.');
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível atualizar o status.'));
    } finally {
      setAdvanceLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!project) return;
    setCancelLoading(true);
    setError(null);
    try {
      const updated = await projectsApi.updateStatus(project.id, { status: 'CANCELED' });
      setProject(updated);
      setAnalysis(null);
      setAnalysisError(null);
      setCancelDialogOpen(false);
      toast.success('Projeto cancelado com sucesso.');
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível cancelar o projeto.'));
    } finally {
      setCancelLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!project) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const result = await projectsApi.getAiAnalysis(project.id);
      setAnalysis(result);
      toast.success('Análise gerada com sucesso.');
    } catch (err) {
      setAnalysisError(getErrorMessage(err, 'Não foi possível gerar a análise.'));
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) return <Card><LoadingState message="Carregando projeto..." /></Card>;
  if (error && !project) {
    return <Card><ErrorState title="Não foi possível carregar o projeto" message={error} onRetry={loadProject} /></Card>;
  }
  if (!project) {
    return <Card><ErrorState title="Projeto não encontrado" message="Verifique o endereço ou volte para a listagem de projetos." /></Card>;
  }

  const nextAction = NEXT_STATUS_MAP[project.status];

  return (
    <div className="page-stack">
      <PageHeader
        title={project.name}
        description="Consulte informações, acompanhe o fluxo de status e gere uma análise de viabilidade."
        breadcrumbs={[
          { label: 'Projetos', to: '/projects' },
          { label: project.name },
        ]}
        titleMeta={
          <div className="summary-card__badges">
            <StatusBadge status={project.status} />
            <RiskBadge risk={project.risk} />
          </div>
        }
        actions={
          <Button variant="secondary" onClick={() => navigate('/projects')} icon={<Icons.ArrowLeft />}>
            Voltar para projetos
          </Button>
        }
      />

      {error && (
        <div className="alert" role="alert">
          <Icons.Alert size={20} />
          <span><strong>Não foi possível concluir a ação.</strong><br />{error}</span>
        </div>
      )}

      <ProjectSummaryCard
        project={project}
        nextAction={nextAction}
        actionLoading={advanceLoading}
        cancelLoading={cancelLoading}
        onAdvance={handleAdvanceStatus}
        onEdit={() => navigate(`/projects/${project.id}/edit`)}
        onCancel={() => setCancelDialogOpen(true)}
      />

      <div id="ai-analysis">
        <AIAnalysisCard
          analysis={analysis}
          loading={analysisLoading}
          error={analysisError}
          onGenerate={handleGenerateAnalysis}
        />
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancelar projeto?"
        message={`O projeto “${project.name}” será marcado como cancelado. Esta ação não poderá ser desfeita.`}
        confirmLabel="Cancelar projeto"
        onConfirm={handleCancel}
        onCancel={() => setCancelDialogOpen(false)}
        loading={cancelLoading}
      />
    </div>
  );
}
