import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectStatusFlow } from './ProjectStatusFlow';

describe('ProjectStatusFlow', () => {
  it('identifica a etapa atual sem depender apenas de cor', () => {
    render(<ProjectStatusFlow status="IN_PROGRESS" />);

    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Em andamento');
    expect(screen.getByText(/Etapa atual:/)).toHaveTextContent('Em andamento');
  });

  it('apresenta cancelamento fora do fluxo operacional', () => {
    render(<ProjectStatusFlow status="CANCELED" />);

    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Cancelado');
    expect(screen.getByText(/encerrado fora do fluxo operacional/i)).toBeInTheDocument();
  });
});
