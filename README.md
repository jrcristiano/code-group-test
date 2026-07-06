# Gerenciador de Projetos

Aplicação full stack para criar e acompanhar projetos, controlar o fluxo de status, calcular risco automaticamente e gerar uma análise executiva contextual.

## Funcionalidades

- CRUD completo de projetos
- Fluxo `Em análise → Aprovado → Em andamento → Encerrado`
- Cancelamento a partir de qualquer status, inclusive encerrado
- Bloqueio de exclusão para projetos em andamento ou encerrados
- Risco automático por orçamento e prazo em meses-calendário
- Análise contextual por IA mockada
- Busca, filtros, ordenação, paginação e resumo do portfólio
- Swagger/OpenAPI e endpoints de health/readiness

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Node.js 22, NestJS 11, TypeScript, Prisma 7, PostgreSQL 16 |
| Frontend | React 18, TypeScript, Vite, React Router, Axios, React Hook Form, Zod |
| Testes | Jest, Vitest e Testing Library |
| Produção local | Docker Compose e Nginx |

O repositório contém dois pacotes npm independentes em `api/` e `ui/`. Não há workspace npm na raiz.

## Pré-requisitos

- Docker Engine 29+ e Docker Compose 2.40+ para o fluxo recomendado; ou
- Node.js 22+, npm 10+ e PostgreSQL 16+ para execução manual.

## Executar com Docker

Este é o fluxo recomendado e não depende de arquivo override:

```bash
cp .env.example .env
docker compose up --build
```

O Compose sobe PostgreSQL, aguarda o banco aceitar conexões, executa `prisma migrate deploy`, aguarda a readiness da API e inicia o frontend produtivo no Nginx. Não há seed obrigatório neste projeto.

Todas as portas, credenciais e parâmetros são configuráveis via variáveis de ambiente no `.env`. Consulte `.env.example` para ver os valores padrão.

| Serviço | Endereço |
| --- | --- |
| Frontend | http://localhost:5173 |
| API direta | http://localhost:8000 |
| API pelo Nginx | http://localhost:5173/api |
| Swagger pelo Nginx | http://localhost:5173/api/docs |
| Swagger direto | http://localhost:8000/docs |
| PostgreSQL | localhost:5433 |

Verificação rápida:

```bash
curl -i http://localhost:5173
curl -i http://localhost:5173/api/health
curl -i http://localhost:5173/api/health/readiness
curl -i http://localhost:5173/api/projects
```

Criação pela API publicada no mesmo host do frontend:

```bash
curl -i -X POST http://localhost:5173/api/projects \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Implantação ERP",
    "startDate": "2026-07-01",
    "endDate": "2026-10-01",
    "totalBudget": 150000,
    "description": "Projeto para implantação de sistema ERP."
  }'
```

A rota interna do NestJS continua sendo `POST /projects`. Para acesso direto,
sem o proxy, use `http://localhost:8000/projects` no Compose ou
`http://localhost:3001/projects` no desenvolvimento local.

Para parar sem apagar os dados:

```bash
docker compose down
```

`docker compose down -v` também remove o volume PostgreSQL e deve ser usado somente quando a perda dos dados locais for intencional.

### Desenvolvimento com hot reload via Docker

Para rodar API e frontend em modo watch dentro de containers:

```bash
cp .env.example .env
docker compose --profile dev up --build ui-dev
```

Esse comando sobe `database`, `migrate`, `api-dev` e `ui-dev`. A API dev fica em `http://localhost:3001`, o frontend dev fica em `http://localhost:5173`, e o Vite usa `http://api-dev:3001` dentro da rede Docker quando `VITE_API_URL` não está definido. O volume nomeado de `node_modules` evita que o bind mount do código sobrescreva as dependências instaladas na imagem.

Para parar:

```bash
docker compose --profile dev down
```

### Migrations, reset e limpeza

Rodar migrations manualmente contra o banco do Compose:

```bash
docker compose run --rm migrate
```

Resetar todo o ambiente Docker local, incluindo dados do PostgreSQL e volumes de dependências dev:

```bash
docker compose --profile dev down -v --remove-orphans
docker compose up --build
```

Não há comando de seed versionado nesta entrega. Se um seed for adicionado no futuro, ele deve ser idempotente e documentado aqui.

## Executar localmente

### Banco

É possível iniciar apenas o PostgreSQL do Compose:

```bash
docker compose up -d database
```

### API

```bash
cd api
cp .env.example .env
npm ci
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

A API fica em `http://localhost:3001` e o Swagger em `http://localhost:3001/docs`. Ao rodar a API fora do container, o `.env.example` já aponta para `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres?schema=public`; dentro do Compose a URL é montada automaticamente com o host interno `database:5432`.

Build e execução produtiva fora do Docker:

```bash
npm run build
npm run start:prod
```

### Interface

Em outro terminal:

```bash
cd ui
cp .env.example .env
npm ci
npm run dev
```

A interface fica em `http://localhost:5173`. Em desenvolvimento, `VITE_API_URL=http://localhost:3001` faz o Axios chamar a API diretamente. Quando a variável não é definida, o cliente usa `/api`, que é encaminhado pelo Nginx no ambiente Docker.

## Variáveis de ambiente

O arquivo `.env.example` na raiz do projeto contém todas as variáveis usadas pelo Docker Compose. Copie-o para `.env` antes de subir os containers:

```bash
cp .env.example .env
```

### Docker Compose (raiz)

| Variável | Finalidade | Padrão |
| --- | --- | --- |
| `POSTGRES_USER` | Usuário do PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nome do banco | `postgres` |
| `POSTGRES_PORT` | Porta publicada do PostgreSQL | `5433` |
| `API_PORT` | Porta publicada da API (produção) | `8000` |
| `API_INTERNAL_PORT` | Porta interna da API (produção) | `3000` |
| `API_DEV_PORT` | Porta publicada da API (dev) | `3001` |
| `API_DEV_INTERNAL_PORT` | Porta interna da API (dev) | `3001` |
| `UI_PORT` | Porta publicada do frontend (produção) | `5173` |
| `UI_DEV_PORT` | Porta publicada do frontend (dev) | `5173` |
| `NODE_ENV` | Ambiente de execução | `production` |
| `CORS_ORIGINS` | Origens permitidas, separadas por vírgula | `http://localhost:5173` |
| `SWAGGER_ENABLED` | Habilita `/docs` | `true` |
| `SWAGGER_SERVER` | Base relativa usada nos curls do Swagger | `.` |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | Janela e limite global de rate limiting | `60` / `30` |
| `DB_POOL_MIN` / `DB_POOL_MAX` | Pool PostgreSQL | `2` / `10` |
| `DB_POOL_ACQUIRE_TIMEOUT` | Timeout de aquisição do pool | `30000` |
| `MAX_PAYLOAD_SIZE` | Limite JSON | `1mb` |
| `VITE_API_URL` | URL da API usada pelo build de produção | `/api` |

### API (fora do Docker)

| Variável | Finalidade | Exemplo local |
| --- | --- | --- |
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta HTTP | `3001` |
| `DATABASE_URL` | Conexão PostgreSQL | veja `api/.env.example` |
| `CORS_ORIGINS` | Origens permitidas, separadas por vírgula | `http://localhost:5173` |
| `SWAGGER_ENABLED` | Habilita `/docs` | `true` |
| `SWAGGER_SERVER` | Base relativa usada nos curls do Swagger | `.` |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | Janela e limite global | `60` / `30` |
| `DB_POOL_MIN` / `DB_POOL_MAX` | Pool PostgreSQL | `2` / `10` |
| `MAX_PAYLOAD_SIZE` | Limite JSON | `1mb` |

### Interface

| Variável | Finalidade | Padrão |
| --- | --- | --- |
| `VITE_API_URL` | URL da API usada pelo navegador | `/api` quando ausente |

No Docker produtivo, `VITE_API_URL=/api` é definido no build e o Nginx encaminha `/api/*` para `api:3000`. No Vite dev, se `VITE_API_URL` estiver ausente, o proxy encaminha `/api/*` para `VITE_API_TARGET` ou para `http://localhost:8000` por padrão.

O OpenAPI usa `servers.url=.`. Por ser relativo ao documento servido, o Swagger
chama `/projects` quando aberto diretamente em `/docs` e `/api/projects` quando
aberto pelo proxy em `/api/docs`, sem fixar host ou porta no artefato.

## Endpoints principais

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/projects` | Criar projeto |
| `GET` | `/projects` | Listar, filtrar e paginar |
| `GET` | `/projects/:id` | Consultar projeto |
| `PATCH` | `/projects/:id` | Atualizar dados editáveis |
| `DELETE` | `/projects/:id` | Excluir quando permitido |
| `PATCH` | `/projects/:id/status` | Alterar status |
| `GET` | `/projects/:id/ai-analysis` | Gerar análise contextual |
| `GET` | `/health` | Liveness |
| `GET` | `/health/readiness` | Readiness com PostgreSQL |

Todos os identificadores de projeto são UUID v4. Datas de entrada aceitam exclusivamente `YYYY-MM-DD`.

## Regras de negócio

### Status

- Todo projeto inicia em `IN_REVIEW` (`Em análise`).
- Fluxo normal: `IN_REVIEW → APPROVED → IN_PROGRESS → FINISHED`.
- Qualquer status pode ser alterado para `CANCELED`.
- Não é permitido pular ou reverter etapas.
- Projetos `IN_PROGRESS` e `FINISHED` não podem ser excluídos.

### Risco

O maior risco entre orçamento e prazo prevalece:

| Risco | Orçamento | Prazo |
| --- | --- | --- |
| Baixo | até R$ 100.000 | até 3 meses-calendário |
| Médio | acima de R$ 100.000 até R$ 500.000 | acima de 3 até 6 meses-calendário |
| Alto | acima de R$ 500.000 | acima de 6 meses-calendário |

Meses são comparados adicionando 3 ou 6 meses à data inicial. Quando o dia não existe no mês de destino, usa-se o último dia desse mês; por exemplo, 31/01 + 3 meses resulta em 30/04.

### Análise automática

A entrega usa `MockAiClient`, que produz resumo, pontos de atenção e recomendação a partir dos dados reais do projeto. `AiClient` e `ProjectAnalysisPromptBuilder` isolam o contrato para uma futura integração externa. Não existe configuração de provedor real nem credencial de IA nesta entrega.

## Testes e qualidade

```bash
cd api
npm test -- --runInBand
npm run build
npm audit --omit=dev

cd ../ui
npm test -- --run
npm run build
npm audit --omit=dev
```

Validações Docker recomendadas:

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs --tail=100 api ui migrate database
curl -fsS http://localhost:8000/health/readiness
curl -fsS http://localhost:5173/api/health/readiness
curl -fsS http://localhost:5173/api/projects
```

Os testes cobrem cálculo de risco, datas, DTOs, transições, criação, atualização, exclusão, análise, filtros e fluxos principais da interface.

Não foi adicionada uma configuração de ESLint nesta entrega. Os builds TypeScript dos dois pacotes são a verificação estática utilizada; introduzir um lint completo exigiria definir e revisar uma política de estilo fora do escopo funcional.

## Decisões e limitações

- PostgreSQL é o único banco suportado.
- A análise automática é mockada; integração real com IA não é necessária para o escopo.
- Não há autenticação, autorização ou gestão de usuários.
- Valores monetários usam `Float` no schema atual; uma aplicação financeira com cálculos contábeis deveria avaliar `Decimal`.
- Swagger fica habilitado no Compose e no `.env.example` para facilitar a avaliação; pode ser desabilitado com `SWAGGER_ENABLED=false`.

Consulte [AI_USAGE.md](./AI_USAGE.md) para a declaração de uso de IA durante o desenvolvimento.
