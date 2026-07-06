import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { projectsApi } from '../../services/projects-api';
import { toDateInputValue, formatDisplayDate } from '../../utils/date-utils';
import { formatCurrency, getErrorMessage } from '../../utils/format';
import { LoadingState } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorMessage';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { CurrencyInput, DateInput, Textarea, TextInput } from '../../components/Inputs';
import { Icons } from '../../components/Icons';

export const projectSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome é obrigatório.'),
    startDate: z.string().min(1, 'Data de início é obrigatória.'),
    endDate: z.string().min(1, 'Data de término é obrigatória.'),
    totalBudget: z
      .number({
        invalid_type_error: 'Informe o orçamento do projeto.',
        required_error: 'Informe o orçamento do projeto.',
      })
      .finite('Informe um orçamento válido.')
      .min(0.01, 'Orçamento deve ser maior que zero.'),
    description: z.string().trim().min(1, 'Descrição é obrigatória.'),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || new Date(data.endDate) > new Date(data.startDate),
    {
      message: 'Data de término deve ser posterior à data de início.',
      path: ['endDate'],
    },
  );

type ProjectFormData = z.infer<typeof projectSchema>;

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loadingProject, setLoadingProject] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      totalBudget: undefined,
      description: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const projectName = watch('name');
  const totalBudget = watch('totalBudget');

  const loadProject = useCallback(async () => {
    if (!isEdit || !id) return;
    setLoadingProject(true);
    setLoadError(null);
    try {
      const project = await projectsApi.getById(id);
      reset({
        name: project.name,
        startDate: toDateInputValue(project.startDate),
        endDate: toDateInputValue(project.endDate),
        totalBudget: project.totalBudget,
        description: project.description,
      });
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Não foi possível carregar o projeto.'));
    } finally {
      setLoadingProject(false);
    }
  }, [id, isEdit, reset]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const onSubmit = async (data: ProjectFormData) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (isEdit && id) {
        await projectsApi.update(id, data);
        toast.success('Projeto atualizado com sucesso.');
      } else {
        await projectsApi.create(data);
        toast.success('Projeto criado com sucesso.');
      }
      navigate('/projects');
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          isEdit
            ? 'Não foi possível atualizar o projeto.'
            : 'Não foi possível criar o projeto.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const title = isEdit ? 'Editar projeto' : 'Novo projeto';
  const description = isEdit
    ? 'Atualize as informações de planejamento e acompanhamento do projeto.'
    : 'Cadastre as informações iniciais para análise, acompanhamento e priorização do projeto.';

  if (loadingProject) {
    return <Card><LoadingState message="Carregando informações do projeto..." /></Card>;
  }

  if (loadError) {
    return <Card><ErrorState title="Não foi possível carregar o projeto" message={loadError} onRetry={loadProject} /></Card>;
  }

  return (
    <div className="page-stack">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: 'Projetos', to: '/projects' },
          { label: title },
        ]}
      />

      <div className="form-workspace">
        <Card className="form-card">
          <form id="project-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-card__section">
            <h2 className="form-card__section-title">Informações do projeto</h2>
            <p className="form-card__section-description">Identifique o projeto de forma clara para todo o portfólio. Campos com asterisco são obrigatórios.</p>
            <div className="form-grid form-grid--single">
              <FormField
                id="project-name"
                label="Nome do projeto"
                required
                error={errors.name?.message}
                hint="Use um nome claro e fácil de reconhecer."
                className="form-grid__full"
              >
                <TextInput
                  id="project-name"
                  placeholder="Nome do projeto"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'project-name-error' : 'project-name-hint'}
                  {...register('name')}
                />
              </FormField>

            </div>
          </div>

          <div className="form-card__section">
            <h2 className="form-card__section-title">Planejamento</h2>
            <p className="form-card__section-description">Defina o horizonte de execução e o investimento previsto.</p>
            <div className="form-grid">
              <FormField id="start-date" label="Data de início" required error={errors.startDate?.message}>
                <DateInput
                  id="start-date"
                  aria-invalid={Boolean(errors.startDate)}
                  aria-describedby={errors.startDate ? 'start-date-error' : undefined}
                  {...register('startDate')}
                />
              </FormField>

              <FormField id="end-date" label="Previsão de término" required error={errors.endDate?.message}>
                <DateInput
                  id="end-date"
                  min={startDate || undefined}
                  aria-invalid={Boolean(errors.endDate)}
                  aria-describedby={errors.endDate ? 'end-date-error' : undefined}
                  {...register('endDate')}
                />
              </FormField>

              <FormField
                id="total-budget"
                label="Orçamento total (R$)"
                required
                error={errors.totalBudget?.message}
                hint="Informe o valor total planejado para o projeto."
                className="form-grid__full"
              >
                <Controller
                  name="totalBudget"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="total-budget"
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? null}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="R$ 150.000,00"
                      aria-invalid={Boolean(errors.totalBudget)}
                      aria-describedby={errors.totalBudget ? 'total-budget-error' : 'total-budget-hint'}
                    />
                  )}
                />
              </FormField>
            </div>
          </div>

          <div className="form-card__section">
            <h2 className="form-card__section-title">Contexto e objetivo</h2>
            <p className="form-card__section-description">Descreva o que será entregue e por que este projeto é importante.</p>
            <FormField
              id="project-description"
              label="Descrição"
              required
              error={errors.description?.message}
              hint="Inclua escopo, objetivo e resultado esperado."
            >
              <Textarea
                id="project-description"
                rows={5}
                placeholder="Descreva o objetivo, o escopo e os resultados esperados do projeto."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'project-description-error' : 'project-description-hint'}
                {...register('description')}
              />
            </FormField>
          </div>

          <div className="form-card__footer">
            <Button variant="secondary" onClick={() => navigate('/projects')} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} icon={<Icons.Check />}>
              {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar projeto'}
            </Button>
          </div>
          </form>
        </Card>

        <aside className="form-summary" aria-labelledby="form-summary-title">
          <div className="form-summary__header">
            <span className="form-summary__icon"><Icons.FileText size={19} /></span>
            <div>
              <h2 id="form-summary-title">Resumo do cadastro</h2>
              <p>Confira os principais dados antes de salvar.</p>
            </div>
          </div>
          <dl className="form-summary__list">
            <SummaryItem label="Projeto" value={projectName?.trim() || 'Ainda não informado'} />
            <SummaryItem label="Período" value={formatPeriod(startDate, endDate)} />
            <SummaryItem label="Orçamento" value={summaryBudget(totalBudget)} />
          </dl>
          <div className="form-summary__notice">
            <Icons.Alert size={17} />
            <p>O risco e o status serão definidos pelas regras atuais do produto após o cadastro.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="form-summary__item">
      <dt>{label}</dt>
      <dd title={value}>{value}</dd>
    </div>
  );
}

function summaryBudget(value: number | undefined) {
  if (!value || Number.isNaN(Number(value))) return 'Ainda não informado';
  return formatCurrency(Number(value));
}

function formatPeriod(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return 'Ainda não informado';
  const fmt = (value?: string) => value ? formatDisplayDate(value) : '—';
  return `${fmt(startDate)} a ${fmt(endDate)}`;
}
