import type { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export function Badge({
  children,
  variant,
  accessibleLabel,
}: {
  children: ReactNode;
  variant: BadgeVariant;
  accessibleLabel?: string;
}) {
  return (
    <span className={`badge badge--${variant}`}>
      {accessibleLabel && <span className="sr-only">{accessibleLabel}: </span>}
      {children}
    </span>
  );
}
