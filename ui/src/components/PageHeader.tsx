import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  titleMeta?: ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, description, eyebrow, actions, titleMeta, breadcrumbs }: Props) {
  return (
    <header>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumbs" aria-label="Navegação estrutural">
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="breadcrumbs__item">
              {index > 0 && <span className="breadcrumbs__separator" aria-hidden="true">/</span>}
              {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="page-header">
        <div className="page-header__content">
          {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
          <div className="page-header__title-row">
            <h1>{title}</h1>
            {titleMeta}
          </div>
          {description && <p className="page-header__description">{description}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
