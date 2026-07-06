import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders correct label for IN_REVIEW', () => {
    render(<StatusBadge status="IN_REVIEW" />);
    expect(screen.getByText('Em análise')).toBeInTheDocument();
  });

  it('renders correct label for APPROVED', () => {
    render(<StatusBadge status="APPROVED" />);
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
  });

  it('renders correct label for IN_PROGRESS', () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('Em andamento')).toBeInTheDocument();
  });

  it('renders correct label for FINISHED', () => {
    render(<StatusBadge status="FINISHED" />);
    expect(screen.getByText('Encerrado')).toBeInTheDocument();
  });

  it('renders correct label for CANCELED', () => {
    render(<StatusBadge status="CANCELED" />);
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });
});
