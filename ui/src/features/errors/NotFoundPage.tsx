import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ButtonLink } from '../../components/Button';
import { Icons } from '../../components/Icons';

export function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Página não encontrada | Gerenciador de Projetos';
    titleRef.current?.focus();

    return () => {
      document.title = previousTitle;
    };
  }, []);

  function handleBack() {
    if (location.key === 'default') {
      navigate('/projects', { replace: true });
      return;
    }

    navigate(-1);
  }

  return (
    <div className="not-found-page">
      <section className="card not-found-card" aria-labelledby="not-found-title">
        <div className="not-found-card__content">
          <div className="not-found-card__icon" aria-hidden="true">
            <Icons.Alert size={26} />
          </div>

          <p className="not-found-card__eyebrow">Erro 404</p>
          <h1 ref={titleRef} id="not-found-title" tabIndex={-1}>
            Página não encontrada
          </h1>
          <p className="not-found-card__description">
            A página que você tentou acessar não existe, foi removida ou teve o endereço alterado.
          </p>

          <div className="not-found-card__actions">
            <ButtonLink
              to="/projects"
              variant="primary"
              icon={<Icons.Briefcase size={17} />}
            >
              Voltar para projetos
            </ButtonLink>
            <Button
              variant="secondary"
              icon={<Icons.ArrowLeft size={17} />}
              onClick={handleBack}
            >
              Voltar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
