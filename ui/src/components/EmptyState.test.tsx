import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Nenhum projeto" message="Crie seu primeiro projeto." />
      </MemoryRouter>,
    );

    expect(screen.getByText('Nenhum projeto')).toBeInTheDocument();
    expect(screen.getByText('Crie seu primeiro projeto.')).toBeInTheDocument();
  });

  it('renders action link when actionLabel and actionTo are provided', () => {
    render(
      <MemoryRouter>
        <EmptyState
          title="Vazio"
          message="Nada aqui."
          actionLabel="Novo projeto"
          actionTo="/projects/new"
        />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Novo projeto' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/projects/new');
  });

  it('does not render link when actionLabel or actionTo are missing', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Vazio" message="Nada aqui." />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
