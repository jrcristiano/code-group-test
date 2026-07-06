import { formatCurrencyBRL } from './masks';

export function formatCurrency(value: number, options?: { compact?: boolean }): string {
  if (!options?.compact) return formatCurrencyBRL(value);

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

/**
 * Extract a safe error message from an unknown error value.
 * Centralizes the repeated pattern used across all pages and hooks.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
