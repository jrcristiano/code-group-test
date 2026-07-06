import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectSummaryCards } from './ProjectSummaryCards';

describe('ProjectSummaryCards', () => {
  it('renderiza as agregações globais recebidas da API', () => {
    render(<ProjectSummaryCards summary={{
      totalProjects: 12,
      inReview: 3,
      inExecution: 4,
      listedBudget: 750000,
      highRisk: 2,
    }} />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByTitle(/750/)).toBeInTheDocument();
    expect(screen.getByText('Em execução')).toBeInTheDocument();
    expect(screen.getByText('Risco alto')).toBeInTheDocument();
    expect(screen.getAllByText('Em toda a base')).toHaveLength(4);
    expect(screen.getByText('Total aprovado/em andamento')).toBeInTheDocument();
  });

  it('deixa explícito quando os totais consideram os filtros ativos', () => {
    render(<ProjectSummaryCards filtered summary={{
      totalProjects: 2,
      inReview: 1,
      inExecution: 1,
      listedBudget: 100000,
      highRisk: 1,
    }} />);

    expect(screen.getAllByText('No total filtrado')).toHaveLength(4);
    expect(screen.getByText('Total filtrado aprovado/em andamento')).toBeInTheDocument();
  });
});
