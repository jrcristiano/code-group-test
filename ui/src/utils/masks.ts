export const MASK_PATTERNS = {
  cpf: '000.000.000-00',
  cnpj: '00.000.000/0000-00',
  phone: '(00) 00000-0000',
  cep: '00000-000',
  date: '00/00/0000',
  percentage: '00,00%',
} as const;

export type MaskPatternName = keyof typeof MASK_PATTERNS;

type MaskableValue = string | number | null | undefined;

export function onlyDigits(value: MaskableValue): string {
  return value == null ? '' : String(value).replace(/\D/g, '');
}

export function formatCpf(value: MaskableValue): string {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function formatCnpj(value: MaskableValue): string {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}

export function formatCpfCnpj(value: MaskableValue): string {
  const digits = onlyDigits(value);
  return digits.length <= 11 ? formatCpf(digits) : formatCnpj(digits);
}

export function formatPhone(value: MaskableValue): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const localNumber = digits.slice(2);
  const firstGroupLength = digits.length === 11 ? 5 : 4;
  const firstGroup = localNumber.slice(0, firstGroupLength);
  const lastGroup = localNumber.slice(firstGroupLength);

  return `(${areaCode}) ${firstGroup}${lastGroup ? `-${lastGroup}` : ''}`;
}

export function formatCep(value: MaskableValue): string {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function formatDate(value: MaskableValue): string {
  const digits = onlyDigits(value).slice(0, 8);
  return digits
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
}

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrencyBRL(value: number | null | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? brlFormatter.format(value)
    : '';
}

/**
 * Parses either a BRL display value (R$ 1.234,56) or an API decimal (1234.56).
 * Empty and malformed values return null, while zero remains a valid number.
 */
export function parseCurrencyBRL(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value == null || !value.trim()) return null;

  const withoutCurrency = value.trim().replace(/^R\$\s*/i, '').replace(/\s/g, '');
  if (!/^-?[\d.,]+$/.test(withoutCurrency) || !/\d/.test(withoutCurrency)) return null;

  const commaParts = withoutCurrency.split(',');
  if (commaParts.length > 2) return null;

  let normalized: string;
  if (commaParts.length === 2) {
    const [integerPart, fractionPart] = commaParts;
    if (fractionPart.length > 2 || integerPart.includes('..')) return null;
    normalized = `${integerPart.replace(/\./g, '')}.${fractionPart || '0'}`;
  } else {
    const dotParts = withoutCurrency.split('.');
    if (dotParts.length === 2 && dotParts[1].length <= 2) {
      normalized = withoutCurrency;
    } else {
      normalized = withoutCurrency.replace(/\./g, '');
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
