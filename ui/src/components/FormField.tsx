import type { ReactNode } from 'react';

interface Props {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ id, label, required, hint, error, children, className = '' }: Props) {
  return (
    <div className={`form-field ${className}`.trim()}>
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required && <span className="form-field__required" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (obrigatório)</span>}
      </label>
      {children}
      {error ? (
        <span className="form-field__error" id={`${id}-error`} role="alert">{error}</span>
      ) : hint ? (
        <span className="form-field__hint" id={`${id}-hint`}>{hint}</span>
      ) : null}
    </div>
  );
}
