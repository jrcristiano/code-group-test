import { Button, ButtonLink } from './Button';
import { Icons } from './Icons';

interface Props {
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: 'projects' | 'search';
}

export function EmptyState({ title, message, actionLabel, actionTo, onAction, icon = 'projects' }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__icon">
          {icon === 'search' ? <Icons.Search size={25} /> : <Icons.Briefcase size={25} />}
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        {actionLabel && actionTo && (
          <ButtonLink to={actionTo} icon={<Icons.Plus />}>{actionLabel}</ButtonLink>
        )}
        {actionLabel && onAction && !actionTo && (
          <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
    </div>
  );
}
