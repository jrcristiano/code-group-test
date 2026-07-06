import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'success'
  | 'danger'
  | 'danger-solid'
  | 'ghost';

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'default' | 'small';
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

function classes(variant: ButtonVariant, size: 'default' | 'small', className?: string) {
  return [
    'button',
    `button--${variant}`,
    size === 'small' ? 'button--small' : '',
    className ?? '',
  ].filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children,
  variant = 'primary',
  size = 'default',
  icon,
  loading = false,
  disabled,
  className,
  type = 'button',
  ...props
}: ButtonProps, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={classes(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});

interface ButtonLinkProps extends CommonProps {
  to: string;
  'aria-label'?: string;
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'default',
  icon,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link to={to} className={classes(variant, size, className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}
