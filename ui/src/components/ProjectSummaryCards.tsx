import type { ProjectSummary } from '../types/project';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/format';

interface Props {
  summary: ProjectSummary;
  filtered?: boolean;
}

export function ProjectSummaryCards({ summary, filtered = false }: Props) {
  const scopeHelper = filtered ? 'No total filtrado' : 'Em toda a base';

  const items = [
    {
      label: 'Total de projetos',
      value: summary.totalProjects.toLocaleString('pt-BR'),
      helper: scopeHelper,
      icon: <Icons.Briefcase size={19} />,
      tone: 'dark',
    },
    {
      label: 'Em análise',
      value: summary.inReview.toLocaleString('pt-BR'),
      helper: scopeHelper,
      icon: <Icons.Clock size={19} />,
      tone: 'accent',
    },
    {
      label: 'Em execução',
      value: summary.inExecution.toLocaleString('pt-BR'),
      helper: filtered ? 'Total filtrado aprovado/em andamento' : 'Total aprovado/em andamento',
      icon: <Icons.Check size={19} />,
      tone: 'success',
    },
    {
      label: 'Orçamento listado',
      value: formatCurrency(summary.listedBudget, { compact: true }),
      helper: scopeHelper,
      icon: <Icons.Wallet size={19} />,
      tone: 'neutral',
    },
    {
      label: 'Risco alto',
      value: summary.highRisk.toLocaleString('pt-BR'),
      helper: scopeHelper,
      icon: <Icons.Alert size={19} />,
      tone: summary.highRisk > 0 ? 'danger' : 'neutral',
    },
  ] as const;

  return (
    <section className="portfolio-summary" aria-label="Resumo do portfólio">
      {items.map((item) => (
        <article className="portfolio-stat" key={item.label}>
          <span className={`portfolio-stat__icon portfolio-stat__icon--${item.tone}`} aria-hidden="true">
            {item.icon}
          </span>
          <div className="portfolio-stat__content">
            <span className="portfolio-stat__label">{item.label}</span>
            <strong className="portfolio-stat__value" title={item.value}>{item.value}</strong>
            <span className="portfolio-stat__helper">{item.helper}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
