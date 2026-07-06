import { describe, expect, it } from 'vitest';
import {
  formatCep,
  formatCnpj,
  formatCpf,
  formatCpfCnpj,
  formatCurrencyBRL,
  formatPhone,
  onlyDigits,
  parseCurrencyBRL,
} from './masks';

describe('mask helpers', () => {
  it('keeps only digits and handles empty values', () => {
    expect(onlyDigits('R$ 1.234,56')).toBe('123456');
    expect(onlyDigits(null)).toBe('');
    expect(onlyDigits(undefined)).toBe('');
  });

  it('formats CPF and CNPJ without accepting extra digits', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01');
    expect(formatCpf('1234567890199')).toBe('123.456.789-01');
    expect(formatCnpj('12345678000199')).toBe('12.345.678/0001-99');
    expect(formatCnpj('1234567800019911')).toBe('12.345.678/0001-99');
  });

  it('selects CPF or CNPJ formatting from the clean length', () => {
    expect(formatCpfCnpj('12345678901')).toBe('123.456.789-01');
    expect(formatCpfCnpj('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('formats Brazilian landlines, mobile phones and CEP', () => {
    expect(formatPhone('1123456789')).toBe('(11) 2345-6789');
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    expect(formatCep('69900000')).toBe('69900-000');
  });
});

describe('BRL helpers', () => {
  it('formats finite decimal values as BRL', () => {
    expect(formatCurrencyBRL(1234.56)).toBe('R$ 1.234,56');
    expect(formatCurrencyBRL(0)).toBe('R$ 0,00');
  });

  it('parses a formatted BRL value and an API decimal', () => {
    expect(parseCurrencyBRL('R$ 1.234,56')).toBe(1234.56);
    expect(parseCurrencyBRL('1234.56')).toBe(1234.56);
    expect(parseCurrencyBRL(1234.56)).toBe(1234.56);
    expect(parseCurrencyBRL('0')).toBe(0);
  });

  it('returns null for empty, non-finite and malformed values', () => {
    expect(parseCurrencyBRL('')).toBeNull();
    expect(parseCurrencyBRL(null)).toBeNull();
    expect(parseCurrencyBRL(undefined)).toBeNull();
    expect(parseCurrencyBRL(Number.NaN)).toBeNull();
    expect(parseCurrencyBRL('valor inválido')).toBeNull();
    expect(formatCurrencyBRL(Number.POSITIVE_INFINITY)).toBe('');
  });
});
