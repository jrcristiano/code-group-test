import { ButtonLink } from '../../components/Button';
import { Icons } from '../../components/Icons';
import {
  TECH_STACK,
  MODULES,
  ARCHITECTURE_LAYERS,
  SECURITY_PRACTICES,
  RESILIENCE_PRACTICES,
  INTEGRATIONS,
  KPI_CARDS,
} from './home-data';

/* ===================================================================
   Home Page Component
   =================================================================== */

export function HomePage() {
  return (
    <div className="page-stack" style={{ gap: 0 }}>
      {/* ================================================================
          Hero Section
          ================================================================ */}
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero__inner">
          <span className="home-hero__badge">
            <span className="home-hero__badge-dot" aria-hidden="true" />
            Plataforma de gestão empresarial
          </span>

          <h1 id="hero-title">
            Gerencie projetos com{' '}
            <span className="home-hero__accent">controle e previsibilidade</span>
          </h1>

          <p className="home-hero__description">
            Uma aplicação full stack para acompanhamento do ciclo de vida de projetos,
            com transições de status controladas, cálculo automático de risco baseado
            em orçamento e prazo, análise inteligente e arquitetura preparada para
            escala, segurança e confiabilidade.
          </p>

          <div className="home-hero__actions">
            <ButtonLink to="/projects" variant="primary" icon={<Icons.Briefcase size={18} />}>
              Ver projetos
            </ButtonLink>
            <ButtonLink to="/projects/new" variant="dark" icon={<Icons.Plus size={18} />}>
              Novo projeto
            </ButtonLink>
          </div>

          <div className="home-hero__stats">
            <div className="home-hero__stat">
              <div className="home-hero__stat-value">REST</div>
              <div className="home-hero__stat-label">API HTTP</div>
            </div>
            <div className="home-hero__stat">
              <div className="home-hero__stat-value">3</div>
              <div className="home-hero__stat-label">Módulos</div>
            </div>
            <div className="home-hero__stat">
              <div className="home-hero__stat-value">5</div>
              <div className="home-hero__stat-label">Status de projeto</div>
            </div>
            <div className="home-hero__stat">
              <div className="home-hero__stat-value">Docker</div>
              <div className="home-hero__stat-label">Containerizado</div>
            </div>
          </div>
        </div>
      </section>

      <div className="alert" role="alert">
        <Icons.Alert size={20} />
        <span><strong>Ambiente de execução:</strong> Este projeto utiliza <strong>Docker Engine 29+</strong> e <strong>Docker Compose v2.40+</strong>. Certifique-se de usar versões compatíveis para evitar problemas de execução.</span>
      </div>

      {/* ================================================================
          Visão Geral
          ================================================================ */}
      <section className="home-section" aria-labelledby="overview-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Visão geral</span>
          <h2 id="overview-title">O que a aplicação faz</h2>
          <p className="home-section__description">
            O Gerenciador de Projetos permite cadastrar, acompanhar e gerenciar
            projetos ao longo de seu ciclo de vida. Cada projeto passa por um fluxo
            de status com transições controladas, tem seu risco calculado
            automaticamente com base em orçamento e prazo, e pode receber análise
            contextual gerada por IA. Todas as regras de negócio são aplicadas no
            backend, garantindo consistência e segurança dos dados.
          </p>
        </div>

        <div className="module-grid">
          {[
            {
              title: 'Ciclo de vida controlado',
              text: 'Status com transições formais (Em análise → Aprovado → Em andamento → Encerrado). Qualquer status permite cancelamento. Não é possível pular etapas nem reverter status encerrados.',
              icon: <Icons.ArrowRight size={22} />,
            },
            {
              title: 'Risco calculado automaticamente',
              text: 'Classificação Baixo/Médio/Alto definida por orçamento (limiares de R$ 100 mil e R$ 500 mil) e prazo em meses-calendário (3 e 6 meses). O maior risco prevalece quando múltiplas regras se aplicam.',
              icon: <Icons.BarChart size={22} />,
            },
            {
              title: 'Análise inteligente por projeto',
              text: 'Módulo de IA gera resumo, pontos de atenção e recomendação executiva com base nos dados reais do projeto. Arquitetura plugável pronta para provedor real de IA.',
              icon: <Icons.Sparkles size={22} />,
            },
          ].map((item) => (
            <div className="module-card" key={item.title}>
              <div className="module-card__icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Stack Tecnológica
          ================================================================ */}
      <section className="home-section" aria-labelledby="stack-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Tecnologia</span>
          <h2 id="stack-title">Stack utilizada</h2>
          <p className="home-section__description">
            Tecnologias, bibliotecas e ferramentas presentes no código da aplicação,
            organizadas por camada de responsabilidade.
          </p>
        </div>

        <div className="tech-grid">
          {TECH_STACK.map((tech) => (
            <div className="tech-card" key={tech.category}>
              <div className={`tech-card__icon ${tech.iconClass ?? ''}`}>
                {tech.icon}
              </div>
              <div className="tech-card__content">
                <h3>{tech.category}</h3>
                <div className="tech-card__tags">
                  {tech.tags.map((tag) => (
                    <span className="tech-card__tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Módulos da Aplicação
          ================================================================ */}
      <section className="home-section" aria-labelledby="modules-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Funcionalidades</span>
          <h2 id="modules-title">Módulos da aplicação</h2>
          <p className="home-section__description">
            A aplicação é organizada em módulos independentes com responsabilidades
            bem definidas, seguindo os princípios de separação de responsabilidades
            do NestJS e componentização do React.
          </p>
        </div>

        <div className="module-grid">
          {MODULES.map((mod) => (
            <div className="module-card" key={mod.name}>
              <div className="module-card__icon">{mod.icon}</div>
              <h3>{mod.name}</h3>
              <p>{mod.description}</p>
              <div className="module-card__badge">
                <span className={`badge badge--${mod.statusVariant}`}>
                  {mod.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Arquitetura e Organização
          ================================================================ */}
      <section className="home-section" aria-labelledby="arch-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Design</span>
          <h2 id="arch-title">Arquitetura e organização</h2>
          <p className="home-section__description">
            A aplicação segue uma arquitetura em camadas com separação clara de
            responsabilidades entre apresentação, API, domínio e dados. O backend
            utiliza NestJS com módulos independentes; o frontend segue organização
            por features com componentes reutilizáveis.
          </p>
        </div>

        <div className="arch-layers">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <div className="arch-layer" key={layer.title}>
              <div className="arch-layer__header">
                <div className="arch-layer__icon">{layer.icon}</div>
                <h3>{layer.title}</h3>
              </div>
              <ul>
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Segurança (OWASP Top 10)
          ================================================================ */}
      <section className="home-section" aria-labelledby="security-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Proteção</span>
          <h2 id="security-title">Práticas de segurança</h2>
          <p className="home-section__description">
            A aplicação incorpora múltiplas camadas de proteção alinhadas às boas
            práticas do <strong>OWASP Top 10</strong>. As medidas abaixo estão implementadas no
            código e são verificáveis nos arquivos fonte do projeto.
          </p>
        </div>

        <div className="practice-grid">
          {SECURITY_PRACTICES.map((practice) => (
            <div className="practice-card" key={practice.title}>
              <div className={`practice-card__icon ${practice.iconClass}`}>
                {practice.icon}
              </div>
              <div className="practice-card__content">
                <h3>{practice.title}</h3>
                <p>{practice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Resiliência e Confiabilidade
          ================================================================ */}
      <section className="home-section" aria-labelledby="resilience-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Confiabilidade</span>
          <h2 id="resilience-title">Resiliência e robustez</h2>
          <p className="home-section__description">
            Mecanismos implementados para garantir que a aplicação se comporte de
            forma previsível sob condições adversas, falhas de infraestrutura ou
            picos de carga, mantendo a integridade dos dados e a rastreabilidade
            das operações.
          </p>
        </div>

        <div className="practice-grid">
          {RESILIENCE_PRACTICES.map((practice) => (
            <div className="practice-card" key={practice.title}>
              <div className={`practice-card__icon ${practice.iconClass}`}>
                {practice.icon}
              </div>
              <div className="practice-card__content">
                <h3>{practice.title}</h3>
                <p>{practice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Integrações
          ================================================================ */}
      <section className="home-section" aria-labelledby="integrations-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Conexões</span>
          <h2 id="integrations-title">Integrações externas</h2>
          <p className="home-section__description">
            Serviços e sistemas com os quais a aplicação se comunica. Todas as
            integrações são configuráveis via variáveis de ambiente, sem credenciais
            hardcoded no código fonte.
          </p>
        </div>

        <div className="integration-grid">
          {INTEGRATIONS.map((integration) => (
            <div className="integration-card" key={integration.name}>
              <div className="integration-card__icon">{integration.icon}</div>
              <div className="integration-card__content">
                <h3>
                  {integration.name}
                  {integration.version && (
                    <span className="integration-card__version">
                      {integration.version}
                    </span>
                  )}
                </h3>
                <p>{integration.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Indicadores Técnicos
          ================================================================ */}
      <section className="home-section" aria-labelledby="kpi-title">
        <div className="home-section__header">
          <span className="home-section__eyebrow">Números</span>
          <h2 id="kpi-title">Indicadores técnicos</h2>
          <p className="home-section__description">
            Métricas extraídas diretamente da base de código atual, refletindo a
            estrutura real da aplicação.
          </p>
        </div>

        <div className="kpi-grid">
          {KPI_CARDS.map((kpi) => (
            <div className="kpi-card" key={kpi.label}>
              <div className={`kpi-card__icon ${kpi.iconClass}`}>{kpi.icon}</div>
              <div className="kpi-card__value">{kpi.value}</div>
              <div className="kpi-card__label">{kpi.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          CTA Final
          ================================================================ */}
      <section className="home-section" aria-labelledby="cta-title">
        <div className="home-cta">
          <div className="home-cta__inner">
            <h2 id="cta-title">Comece a gerenciar seus projetos</h2>
            <p>
              Cadastre projetos, acompanhe o ciclo de vida, visualize riscos
              automaticamente e gere análises inteligentes. Tudo com uma
              arquitetura preparada para segurança, confiabilidade e escala.
            </p>
            <div className="home-cta__actions">
              <ButtonLink
                to="/projects/new"
                variant="primary"
                icon={<Icons.Plus size={18} />}
              >
                Criar primeiro projeto
              </ButtonLink>
              <ButtonLink
                to="/projects"
                variant="dark"
                icon={<Icons.ArrowRight size={18} />}
              >
                Explorar projetos
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
