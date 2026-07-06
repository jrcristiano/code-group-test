import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { IMaskInput } from 'react-imask';
import { MASK_PATTERNS, onlyDigits, parseCurrencyBRL } from '../utils/masks';
import type { MaskPatternName } from '../utils/masks';

function inputClassName(className?: string): string {
  return ['input', className].filter(Boolean).join(' ');
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    const { className, ...inputProps } = props;
    return <input ref={ref} type="text" className={inputClassName(className)} {...inputProps} />;
  },
);

export const DateInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function DateInput(props, ref) {
    const { className, ...inputProps } = props;
    return <input ref={ref} type="date" className={inputClassName(className)} {...inputProps} />;
  },
);

export const MoneyInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function MoneyInput(props, ref) {
    const { className, ...inputProps } = props;
    return (
      <input
        ref={ref}
        type="number"
        inputMode="decimal"
        className={inputClassName(className)}
        {...inputProps}
      />
    );
  },
);

export type MaskedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  mask: MaskPatternName | string;
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

/**
 * Controlled/uncontrolled text input whose public value contains only digits.
 * Use with React Hook Form's Controller when the form must store the clean value.
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput(
    { mask, value, defaultValue, onChange, className, inputMode = 'numeric', ...props },
    ref,
  ) {
    const resolvedMask = Object.prototype.hasOwnProperty.call(MASK_PATTERNS, mask)
      ? MASK_PATTERNS[mask as MaskPatternName]
      : mask;
    const controlledValue = value !== undefined ? { value: onlyDigits(value) } : {};
    const initialValue = value === undefined && defaultValue !== undefined
      ? { defaultValue: onlyDigits(defaultValue) }
      : {};

    return (
      <IMaskInput
        {...props}
        {...controlledValue}
        {...initialValue}
        mask={resolvedMask}
        unmask
        inputRef={ref}
        inputMode={inputMode}
        className={inputClassName(className)}
        onAccept={(cleanValue) => onChange?.(String(cleanValue))}
      />
    );
  },
);

export type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
> & {
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
};

const currencyNumberBlock = {
  mask: Number,
  scale: 2,
  radix: ',',
  thousandsSeparator: '.',
  mapToRadix: ['.'],
  normalizeZeros: true,
  padFractionalZeros: true,
};

/**
 * BRL input that renders `R$ 1.234,56` and emits `1234.56` (number).
 * Empty or invalid input emits null, keeping visual formatting out of payloads.
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { value, defaultValue, onChange, className, inputMode = 'decimal', ...props },
    ref,
  ) {
    const controlledValue = value !== undefined
      ? { value: value == null || !Number.isFinite(value) ? '' : String(value) }
      : {};
    const initialValue = value === undefined && defaultValue !== undefined
      ? { defaultValue: Number.isFinite(defaultValue) ? String(defaultValue) : '' }
      : {};
    return (
      <IMaskInput
        {...props}
        {...controlledValue}
        {...initialValue}
        mask="R$ num"
        blocks={{ num: currencyNumberBlock }}
        unmask
        inputRef={ref}
        inputMode={inputMode}
        className={inputClassName(className)}
        onAccept={(cleanValue) => onChange?.(parseCurrencyBRL(String(cleanValue)))}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    const { className, ...textareaProps } = props;
    return (
      <textarea
        ref={ref}
        className={['textarea', className].filter(Boolean).join(' ')}
        {...textareaProps}
      />
    );
  },
);
