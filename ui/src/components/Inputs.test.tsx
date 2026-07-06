import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CurrencyInput, MaskedInput } from './Inputs';

describe('MaskedInput', () => {
  it('displays a CPF mask and emits only digits', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<MaskedInput aria-label="CPF" mask="cpf" onChange={onChange} />);
    const input = screen.getByLabelText('CPF');
    await user.type(input, '12345678901');

    expect(input).toHaveValue('123.456.789-01');
    expect(onChange).toHaveBeenLastCalledWith('12345678901');
  });
});

describe('CurrencyInput', () => {
  it('is controlled, displays BRL and emits a clean decimal', async () => {
    const receivedValues: Array<number | null> = [];
    const user = userEvent.setup();

    function Harness() {
      const [value, setValue] = useState<number | null>(null);
      return (
        <CurrencyInput
          aria-label="Orçamento"
          value={value}
          onChange={(nextValue) => {
            receivedValues.push(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }

    render(<Harness />);
    const input = screen.getByLabelText('Orçamento');
    await user.type(input, '1234,56');

    expect(input).toHaveValue('R$ 1.234,56');
    expect(receivedValues[receivedValues.length - 1]).toBe(1234.56);

    await user.clear(input);
    expect(receivedValues[receivedValues.length - 1]).toBeNull();
  });

  it('accepts a fractional value without getting stuck at zero', async () => {
    const receivedValues: Array<number | null> = [];
    const user = userEvent.setup();

    function Harness() {
      const [value, setValue] = useState<number | null>(null);
      return (
        <CurrencyInput
          aria-label="Orçamento mínimo"
          value={value}
          onChange={(nextValue) => {
            receivedValues.push(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }

    render(<Harness />);
    const input = screen.getByLabelText('Orçamento mínimo');
    await user.type(input, '0,01');

    expect(input).toHaveValue('R$ 0,01');
    expect(receivedValues[receivedValues.length - 1]).toBe(0.01);
  });
});
