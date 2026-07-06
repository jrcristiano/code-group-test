import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RiskBadge } from './RiskBadge';

describe('RiskBadge', () => {
  it('renders correct label for LOW risk', () => {
    render(<RiskBadge risk="LOW" />);
    expect(screen.getByText('Baixo')).toBeInTheDocument();
  });

  it('renders correct label for MEDIUM risk', () => {
    render(<RiskBadge risk="MEDIUM" />);
    expect(screen.getByText('Médio')).toBeInTheDocument();
  });

  it('renders correct label for HIGH risk', () => {
    render(<RiskBadge risk="HIGH" />);
    expect(screen.getByText('Alto')).toBeInTheDocument();
  });
});
