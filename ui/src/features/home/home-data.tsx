import { Icons } from '../../components/Icons';

/* ===================================================================
   Data constants for the Home page — all values derived from the
   real codebase. Extracted to keep HomePage.tsx focused on layout.
   =================================================================== */

export interface TechItem {
  category: string;
  icon: React.ReactNode;
  iconClass?: string;
  tags: string[];
}

export const TECH_STACK: TechItem[] = [
  {
    category: 'Frontend',
    icon: <Icons.Layout size={20} />,
    iconClass: 'tech-card__icon--accent',
    tags: ['React 18', 'TypeScript', 'Vite', 'React Router 6', 'React Hook Form', 'Zod', 'Axios', 'react-toastify', 'Poppins'],
  },
  {
    category: 'Backend',
    icon: <Icons.Server size={20} />,
    iconClass: 'tech-card__icon--accent',
    tags: ['Node.js', 'NestJS 10', 'TypeScript', 'Express', 'Swagger/OpenAPI', 'class-validator', 'class-transformer'],
  },
  {
    category: 'Banco de Dados',
    icon: <Icons.Database size={20} />,
    tags: ['PostgreSQL 16', 'Prisma ORM 7', 'Connection Pooling', 'Migrations'],
  },
  {
    category: 'Infraestrutura',
    icon: <Icons.Server size={20} />,
    iconClass: 'tech-card__icon--neutral',
    tags: ['Docker Engine 29+', 'Docker Compose v2.40+', 'Docker Multi-stage', 'Nginx 1.27 Alpine', 'PostgreSQL 16 Alpine'],
  },
  {
    category: 'Segurança',
    icon: <Icons.Shield size={20} />,
    iconClass: 'tech-card__icon--success',
    tags: ['Helmet', 'Rate Limiting', 'CORS', 'ValidationPipe', 'Request ID', 'Payload Limit'],
  },
  {
    category: 'Observabilidade',
    icon: <Icons.Activity size={20} />,
    iconClass: 'tech-card__icon--neutral',
    tags: ['Pino Logger', 'Health Checks', 'Liveness', 'Readiness', 'X-Request-Id'],
  },
  {
    category: 'Testes',
    icon: <Icons.CheckCircle size={20} />,
    iconClass: 'tech-card__icon--success',
    tags: ['Jest', 'Vitest', 'React Testing Library', 'jsdom'],
  },
  {
    category: 'Integrações',
    icon: <Icons.Globe size={20} />,
    iconClass: 'tech-card__icon--neutral',
    tags: ['REST API', 'Swagger/OpenAPI', 'AI Provider (plugável)', 'PostgreSQL'],
  },
];

export interface ModuleItem {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: string;
  statusVariant: 'success' | 'info' | 'neutral';
}

export const MODULES: ModuleItem[] = [
  {
    name: 'Gestão de Projetos',
    description:
      'CRUD completo com transições de status controladas (Em análise → Aprovado → Em andamento → Encerrado), cálculo automático de risco baseado em orçamento e prazo, bloqueio de exclusão por status e listagem com paginação e ordenação.',
    icon: <Icons.Briefcase size={22} />,
    status: 'Em produção',
    statusVariant: 'success',
  },
  {
    name: 'Análise com IA',
    description:
      'Módulo de análise inteligente de projetos com arquitetura plugável. Atualmente utiliza motor mockado com lógica contextual rica, preparado para integração com provedor real de IA via interface AiClient.',
    icon: <Icons.Sparkles size={22} />,
    status: 'Mock ativo',
    statusVariant: 'info',
  },
  {
    name: 'Health & Monitoramento',
    description:
      'Endpoints de liveness e readiness com verificação de conectividade do banco de dados. Logging estruturado via Pino, tracing de requisições via X-Request-Id e graceful shutdown para desligamento seguro.',
    icon: <Icons.Activity size={22} />,
    status: 'Ativo',
    statusVariant: 'success',
  },
];

export interface ArchitectureLayer {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    title: 'Camada de Apresentação',
    icon: <Icons.Layout size={18} />,
    items: [
      'React 18 com TypeScript e Vite',
      'Componentes reutilizáveis (Button, Card, Badge, DataTable, Dialog)',
      'Gerenciamento de formulários com React Hook Form + Zod',
      'Notificações via react-toastify',
      'Design system com CSS custom properties e Poppins',
    ],
  },
  {
    title: 'Camada de API & Serviços',
    icon: <Icons.Server size={18} />,
    items: [
      'NestJS com arquitetura modular (Modules, Controllers, Services)',
      'DTOs com validação via class-validator (whitelist + forbidNonWhitelisted)',
      'Filtro global de exceções com respostas padronizadas',
      'Swagger/OpenAPI com documentação por endpoint',
      'HTTP client com interceptors para tracing e tratamento de erros',
    ],
  },
  {
    title: 'Camada de Domínio',
    icon: <Icons.Code size={18} />,
    items: [
      'Entidade Project com 10 campos e transições de status formais',
      'Calculadora de risco como função pura (sem efeitos colaterais)',
      'Máquina de estados para transições de status (isTransitionAllowed)',
      'Exceções de negócio tipadas (not found, invalid transition, deletion blocked)',
      'Regras de negócio exclusivamente no backend',
    ],
  },
  {
    title: 'Camada de Dados',
    icon: <Icons.Database size={18} />,
    items: [
      'PostgreSQL 16 com Prisma ORM 7',
      'Connection pooling configurável (min/max/idle timeout)',
      'Migrações versionadas (prisma migrate)',
      'Timeout de transações (maxWait 5s, timeout 10s)',
      'Adapter PostgreSQL para desempenho otimizado',
    ],
  },
];

export interface PracticeItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}

export const SECURITY_PRACTICES: PracticeItem[] = [
  {
    title: 'Headers de Segurança (Helmet)',
    description:
      'Proteção contra ataques comuns como XSS, clickjacking e sniffing MIME via helmet, com CSP configurável por ambiente.',
    icon: <Icons.Shield size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'Rate Limiting por Endpoint',
    description:
      'Throttler global (30 req/min) com limites específicos por operação: criação (10), exclusão (5), atualização de status (15), análise IA (5). Health endpoints sem limite.',
    icon: <Icons.Clock size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'CORS com Origem Restrita',
    description:
      'Whitelist dinâmica de origens permitidas via variável de ambiente. Apenas origens explicitamente configuradas são aceitas, com suporte a credenciais.',
    icon: <Icons.Globe size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'Validação Rigorosa de Entrada',
    description:
      'ValidationPipe global com whitelist (remove campos desconhecidos), forbidNonWhitelisted (rejeita campos extras) e transformação automática de tipos.',
    icon: <Icons.CheckCircle size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'Proteção contra Mass Assignment',
    description:
      'DTOs de criação e atualização não expõem campos internos (id, status, risk, createdAt, updatedAt). Status inicial é sempre IN_REVIEW, risco é sempre calculado no backend.',
    icon: <Icons.Lock size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'Limite de Payload',
    description:
      'Tamanho máximo de corpo de requisição configurável (padrão 1MB) para prevenção de ataques de negação de serviço por payloads excessivos.',
    icon: <Icons.FileText size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'Tratamento Seguro de Erros',
    description:
      'Filtro global captura todas as exceções. Erros 5xx nunca expõem detalhes internos — retornam mensagem genérica. Apenas erros 4xx intencionais expõem mensagens de negócio.',
    icon: <Icons.Alert size={18} />,
    iconClass: 'practice-card__icon--security',
  },
  {
    title: 'Tracing de Requisições',
    description:
      'Middleware RequestId gera UUID por requisição, ecoando no header de resposta X-Request-Id. Permite rastreamento ponta-a-ponta entre frontend e backend.',
    icon: <Icons.ArrowRight size={18} />,
    iconClass: 'practice-card__icon--security',
  },
];

export const RESILIENCE_PRACTICES: PracticeItem[] = [
  {
    title: 'Tratamento Padronizado de Erros',
    description:
      'Todas as respostas de erro seguem o formato { statusCode, message, timestamp, requestId }, facilitando o diagnóstico por sistemas consumidores.',
    icon: <Icons.CheckCircle size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'Logs Estruturados',
    description:
      'Pino logger com níveis configuráveis (LOG_LEVEL) e saída formatada em desenvolvimento. Logs incluem requestId, path e método HTTP para correlação.',
    icon: <Icons.FileText size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'Connection Pooling',
    description:
      'Pool de conexões PostgreSQL com limites configuráveis (DB_POOL_MIN, DB_POOL_MAX) e timeout de aquisição (DB_POOL_ACQUIRE_TIMEOUT) para evitar exaustão.',
    icon: <Icons.Database size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'Health Checks',
    description:
      'Endpoints /health (liveness — aplicação está rodando?) e /health/readiness (readiness — banco está acessível?). Prontos para orquestradores como Kubernetes.',
    icon: <Icons.Activity size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'Idempotência em Transições',
    description:
      'Transições de status são validadas contra uma máquina de estados formal. Transições repetidas para o mesmo status são rejeitadas, garantindo previsibilidade.',
    icon: <Icons.Layers size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'Graceful Shutdown',
    description:
      'Hooks de desligamento gracioso garantem que conexões com o banco de dados sejam fechadas corretamente antes da aplicação encerrar (enableShutdownHooks).',
    icon: <Icons.Zap size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'Timeout em Transações',
    description:
      'Transações do Prisma configuradas com maxWait (5s) e timeout (10s), prevenindo bloqueios longos e garantindo liberação de recursos.',
    icon: <Icons.Clock size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
  {
    title: 'SPA Fallback (Nginx)',
    description:
      'Configuração Nginx com try_files para fallback SPA — refresh em qualquer rota retorna index.html. Headers de cache otimizados (1 ano para assets, no-cache para HTML).',
    icon: <Icons.Layout size={18} />,
    iconClass: 'practice-card__icon--resilience',
  },
];

export interface IntegrationItem {
  name: string;
  version?: string;
  description: string;
  icon: React.ReactNode;
}

export const INTEGRATIONS: IntegrationItem[] = [
  {
    name: 'PostgreSQL',
    version: 'v16 Alpine',
    description:
      'Banco de dados relacional principal. Acesso via Prisma ORM com connection pooling e adapter dedicado (PrismaPg). Comunicação interna via rede Docker.',
    icon: <Icons.Database size={20} />,
  },
  {
    name: 'Provedor de IA',
    version: 'Plugável',
    description:
      'Arquitetura preparada para integração com serviço externo de IA via interface AiClient. A entrega utiliza MockAiClient contextual e não promete um provedor real.',
    icon: <Icons.Sparkles size={20} />,
  },
  {
    name: 'Swagger/OpenAPI',
    version: 'v7.2',
    description:
      'Documentação interativa da API REST com os endpoints do projeto. Disponível em /docs na API e em /api/docs pelo frontend Docker.',
    icon: <Icons.FileText size={20} />,
  },
  {
    name: 'Nginx',
    version: 'Alpine',
    description:
      'Servidor web para entrega do frontend em produção. Configurado com SPA fallback, cache otimizado para assets estáticos e headers de segurança HTTP.',
    icon: <Icons.Globe size={20} />,
  },
];

export interface KpiItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  iconClass: string;
}

export const KPI_CARDS: KpiItem[] = [
  {
    value: '3',
    label: 'Módulos da aplicação',
    icon: <Icons.Layers size={20} />,
    iconClass: 'kpi-card__icon--dark',
  },
  {
    value: '7',
    label: 'Endpoints REST',
    icon: <Icons.Code size={20} />,
    iconClass: 'kpi-card__icon--accent',
  },
  {
    value: '25+',
    label: 'Testes automatizados',
    icon: <Icons.CheckCircle size={20} />,
    iconClass: 'kpi-card__icon--success',
  },
  {
    value: '4',
    label: 'Camadas arquiteturais',
    icon: <Icons.Layers size={20} />,
    iconClass: 'kpi-card__icon--info',
  },
  {
    value: '8',
    label: 'Práticas de segurança',
    icon: <Icons.Shield size={20} />,
    iconClass: 'kpi-card__icon--accent',
  },
];
