import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';

type StatusValue = 'IN_REVIEW' | 'IN_PROGRESS' | 'FINISHED';

const options: SelectOption<StatusValue>[] = [
  { label: 'Em análise', value: 'IN_REVIEW' },
  { label: 'Em andamento', value: 'IN_PROGRESS', keywords: ['Em execução'] },
  { label: 'Encerrado', value: 'FINISHED', keywords: ['Finalizado'] },
];

function SelectHarness({ initialValue = '' }: { initialValue?: StatusValue | '' }) {
  const [value, setValue] = useState<StatusValue | ''>(initialValue);
  return (
    <SearchableSelect
      id="status-test"
      label="Status"
      placeholder="Todos os status"
      value={value}
      options={options}
      onChange={setValue}
    />
  );
}

describe('SearchableSelect', () => {
  it('opens, searches aliases without accents and selects an option', async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);
    const combobox = screen.getByRole('combobox', { name: 'Status' });

    await user.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await user.type(combobox, 'execucao');
    expect(screen.getByRole('option', { name: 'Em andamento' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Em análise' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Em andamento' }));
    expect(combobox).toHaveValue('Em andamento');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports ArrowDown, ArrowUp, Enter and Escape', async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);
    const combobox = screen.getByRole('combobox', { name: 'Status' });

    await user.click(combobox);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(combobox).toHaveValue('Em análise');

    await user.click(combobox);
    await user.keyboard('{ArrowUp}{Enter}');
    expect(combobox).toHaveValue('');

    await user.click(combobox);
    await user.keyboard('{Escape}');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the empty state and closes on Escape or outside click', async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);
    const combobox = screen.getByRole('combobox', { name: 'Status' });

    await user.click(combobox);
    await user.type(combobox, 'inexistente');
    expect(screen.getByText('Nenhuma opção encontrada')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(combobox);
    await user.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears a selected value and exposes disabled and loading states', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SelectHarness initialValue="FINISHED" />);
    const combobox = screen.getByRole('combobox', { name: 'Status' });

    await user.click(screen.getByRole('button', { name: 'Limpar filtro de status' }));
    expect(combobox).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Todos os status' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    const onChange = vi.fn();
    rerender(
      <SearchableSelect
        label="Status"
        placeholder="Todos os status"
        value=""
        options={options}
        onChange={onChange}
        disabled
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Status' })).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <SearchableSelect
        label="Status"
        placeholder="Todos os status"
        value=""
        options={options}
        onChange={onChange}
        loading
      />,
    );
    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    expect(screen.getByRole('status')).toHaveTextContent('Carregando opções...');
  });
});
