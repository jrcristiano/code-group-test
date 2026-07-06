import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card__header">
      <div>
        <h2 className="card__title">{title}</h2>
        {description && <p className="card__description">{description}</p>}
      </div>
      {action}
    </div>
  );
}
