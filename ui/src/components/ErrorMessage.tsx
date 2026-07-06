import { Button } from './Button';
import { Icons } from './Icons';

interface Props {
  message: string;
  title?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  message,
  title = 'Não foi possível concluir a operação',
  onRetry,
  compact = false,
}: Props) {
  return (
    <div className={`state-panel${compact ? ' state-panel--compact' : ''}`} role="alert">
      <div className="state-panel__content error-state">
        <div className="error-state__icon"><Icons.Alert size={22} /></div>
        <h2 className="error-state__title">{title}</h2>
        <p className="error-state__message">{message}</p>
        {onRetry && <Button variant="secondary" onClick={onRetry}>Tente novamente</Button>}
      </div>
    </div>
  );
}

