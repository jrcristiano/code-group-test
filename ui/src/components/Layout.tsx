import { Link, Outlet, useLocation } from 'react-router-dom';
import { ButtonLink } from './Button';
import { Icons } from './Icons';

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isProjectsContext = pathname.startsWith('/projects');

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand" aria-label="Gerenciador de Projetos — início">
            <span className="brand__mark"><Icons.Briefcase size={19} /></span>
            <span className="brand__text">Gerenciador de Projetos</span>
          </Link>
          <nav className="topbar__nav" aria-label="Navegação principal">
            <Link
              to="/"
              className="topbar__link"
              aria-current={isHome ? 'page' : undefined}
            >
              Início
            </Link>
            <Link
              to="/projects"
              className="topbar__link"
              aria-current={isProjectsContext ? 'page' : undefined}
            >
              Projetos
            </Link>
            <ButtonLink to="/projects/new" variant="primary" icon={<Icons.Plus size={16} />}>
              Novo projeto
            </ButtonLink>
          </nav>
        </div>
      </header>
      <main className="app-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
