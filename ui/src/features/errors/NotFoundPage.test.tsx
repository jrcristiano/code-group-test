import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes';

describe('NotFoundPage', () => {
  it('renders the application layout and recovery actions for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/route-that-does-not-exist']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
    expect(screen.getByText(/não existe, foi removida ou teve o endereço alterado/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para projetos/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });

  it('returns to the previous application page', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/', '/unknown']} initialIndex={1}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(screen.getByRole('heading', { name: /gerencie projetos com/i })).toBeInTheDocument();
  });
});
