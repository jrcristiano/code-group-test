# IA_USAGE.md

## Uso de IA no desenvolvimento

Este documento descreve como ferramentas de Inteligência Artificial foram utilizadas como apoio durante o desenvolvimento da aplicação do desafio técnico. A IA foi usada como instrumento auxiliar para análise, planejamento, revisão e geração de sugestões, mas as decisões finais de implementação, validação e aceite foram feitas manualmente pelo desenvolvedor.

A aplicação foi construída com foco em uma solução full stack para gestão de projetos, contemplando back-end, front-end, integração com banco de dados, execução via Docker, documentação e testes.

---

## Ferramentas utilizadas

Durante o desenvolvimento, foram utilizados assistentes de IA conversacional e agentes de apoio à programação para:

- interpretar requisitos do desafio;
- decompor funcionalidades em tarefas técnicas;
- gerar prompts de revisão e correção;
- revisar decisões de arquitetura;
- sugerir melhorias de código, validação, testes e Docker;
- auxiliar na escrita e revisão da documentação.

A IA não foi usada como fonte única de verdade. Todas as sugestões relevantes passaram por revisão crítica antes de serem aplicadas.

---

## Como a IA foi utilizada no back-end

A IA foi utilizada no back-end principalmente para apoiar a estruturação da API, revisão de regras de negócio e diagnóstico de problemas de integração.

Principais usos:

- análise dos requisitos obrigatórios do domínio de projetos;
- organização de controllers, services, DTOs, validações e regras de negócio;
- revisão dos endpoints REST de criação, listagem, busca, atualização e remoção de projetos;
- apoio na validação das transições de status dos projetos;
- revisão do cálculo de risco com base nas regras definidas;
- orientação para bloqueio de exclusão de projetos em estados não permitidos;
- revisão da integração com Prisma e PostgreSQL;
- diagnóstico de falhas de conexão entre containers, especialmente erros de acesso ao banco em `database:5432`;
- revisão de migrações, seed e consistência do schema;
- apoio na documentação dos endpoints com Swagger;
- sugestão de testes unitários e de integração para happy paths, corner cases e regras críticas.

A IA também foi usada para revisar inconsistências entre código, README, Docker e variáveis de ambiente, principalmente em pontos onde a aplicação poderia funcionar localmente, mas falhar quando executada por Docker Compose.

---

## Como a IA foi utilizada no front-end

No front-end, a IA foi usada para apoiar a construção e revisão da interface da aplicação, com foco em usabilidade, integração com a API e consistência visual.

Principais usos:

- estruturação das telas de listagem, criação, edição e detalhe de projetos;
- revisão dos fluxos de criação, atualização, exclusão e alteração de status;
- apoio na integração das chamadas HTTP com o back-end;
- melhoria de estados de interface, como loading, erro, vazio e sucesso;
- revisão de componentes de tabela, paginação, filtros e ações;
- sugestões para melhorar legibilidade, espaçamento, responsividade e experiência visual;
- correção de problemas de layout, scroll, truncamento de textos longos e comportamento em diferentes larguras de tela;
- apoio na criação de uma experiência mais limpa e menos genérica, evitando aparência artificial ou excessivamente padronizada.

A IA foi usada para gerar propostas de melhoria, mas a seleção final dos ajustes visuais foi feita considerando simplicidade, aderência ao escopo e prazo do desafio.

---

## Como a IA foi utilizada no Docker e ambiente de execução

A IA foi utilizada para revisar e melhorar a execução da aplicação via Docker, com atenção especial à previsibilidade do ambiente.

Principais usos:

- análise do `docker-compose.yml`;
- sugestão de uso consistente de variáveis de ambiente;
- revisão da comunicação entre serviços;
- diagnóstico de problemas de healthcheck e readiness do PostgreSQL;
- correção de falhas em fluxos de migration;
- revisão de portas expostas e URLs usadas por front-end e back-end;
- sugestão de separação entre ambiente local e ambiente containerizado;
- análise de inconsistências entre o que estava documentado e o que realmente era executado;
- revisão do fluxo de subida da aplicação com banco, migração, API e front-end.

Um dos pontos analisados com apoio da IA foi o erro em que o serviço de migração tentava acessar o banco em `database:5432`, mesmo com o container marcado como saudável. A IA ajudou a direcionar a investigação para diferenças entre container saudável, banco pronto para aceitar conexões, variáveis de ambiente, ordem de inicialização e configuração dos serviços.

---

## Como a IA foi utilizada na funcionalidade de análise por IA

A aplicação inclui uma funcionalidade de análise textual relacionada aos projetos. A IA foi utilizada para apoiar a modelagem dessa funcionalidade, especialmente na separação entre contrato, serviço e implementação.

A IA ajudou a estruturar:

- o endpoint de análise textual do projeto;
- o contrato esperado da resposta;
- a separação entre serviço de domínio e cliente de IA;
- a implementação inicial baseada em mock;
- a preparação da arquitetura para substituição futura por um provedor real de IA.

A decisão de manter uma implementação mockada foi intencional para preservar previsibilidade, custo zero, facilidade de execução local e aderência ao escopo do desafio. A arquitetura foi pensada para permitir troca futura por um serviço externo sem alterar o contrato principal da API.

---

## Prompts e solicitações utilizados

Durante o desenvolvimento, foram utilizados prompts com finalidades específicas, incluindo:

- analisar a aplicação e identificar falhas antes do envio;
- auditar aderência ao escopo do desafio técnico;
- corrigir inconsistências entre README, código e Docker;
- revisar o Docker Compose e garantir uso adequado de variáveis de ambiente;
- diagnosticar erro de conexão com PostgreSQL durante migrations;
- revisar o front-end e melhorar UI/UX;
- corrigir problemas de scroll, largura de colunas e responsividade;
- validar regras de paginação e filtros;
- revisar testes unitários e de integração;
- corrigir vulnerabilidades, warnings e inconsistências de dependências;
- preparar documentação clara para execução e avaliação do projeto.

Exemplos de intenções usadas nos prompts:

```text
Analise o projeto completo e aponte falhas críticas antes do envio.
```

```text
Revise o docker-compose.yml e garanta que a aplicação use variáveis de ambiente de forma consistente.
```

```text
Corrija o erro de conexão do serviço de migration com o PostgreSQL em database:5432.
```

```text
Analise o front-end e proponha melhorias de UI/UX sem quebrar funcionalidades existentes.
```

```text
Implemente ou revise testes cobrindo happy paths, corner cases e regras de negócio críticas.
```

```text
Audite a aplicação considerando os critérios do desafio técnico e classifique os itens como OK, parcial ou não atendido.
```

---

## O que foi aceito das sugestões da IA

Foram aceitas sugestões que contribuíram diretamente para qualidade, clareza ou aderência ao desafio, como:

- divisão mais clara entre responsabilidades no back-end;
- reforço de validações e regras de negócio;
- melhoria da documentação de execução;
- revisão do uso de variáveis de ambiente;
- ajustes no Docker Compose;
- melhoria de mensagens, estados visuais e legibilidade no front-end;
- criação de testes para regras críticas;
- separação da análise textual em serviço próprio;
- arquitetura preparada para substituição futura do mock de IA por provedor real;
- identificação de riscos antes do envio.

---

## O que foi ajustado manualmente

Nem todas as sugestões da IA foram aplicadas literalmente. Alguns pontos foram ajustados manualmente para respeitar o escopo, o prazo e a simplicidade da entrega.

Foram revisados manualmente:

- nomes de variáveis, funções, arquivos e mensagens;
- contratos de API;
- formato das respostas;
- organização final dos módulos;
- regras de negócio específicas;
- configuração final do Docker Compose;
- consistência entre documentação e comportamento real;
- textos do README;
- decisões de UI para evitar excesso de complexidade visual;
- validação final dos fluxos principais.

---

## O que foi descartado

Algumas sugestões da IA foram descartadas por não serem adequadas ao contexto do desafio.

Foram descartadas ou evitadas:

- overengineering desnecessário;
- criação de camadas ou abstrações sem uso real;
- dependência obrigatória de provedor externo de IA;
- soluções que exigissem serviços pagos para execução local;
- mudanças com risco de breaking changes;
- alterações visuais excessivas ou genéricas;
- documentação que prometesse recursos não implementados;
- configurações divergentes entre ambiente local e Docker;
- qualquer menção desnecessária à empresa avaliadora dentro do repositório.

---

## Decisões técnicas mantidas pelo desenvolvedor

As seguintes decisões foram tomadas ou validadas manualmente:

- manter a aplicação executável localmente via Docker;
- priorizar clareza e previsibilidade sobre complexidade;
- usar banco relacional para persistência dos projetos;
- manter migrations e schema versionados;
- documentar variáveis de ambiente necessárias;
- manter a análise por IA mockada, mas isolada por contrato;
- garantir que regras críticas fossem testáveis;
- alinhar README, Docker e comportamento real da aplicação;
- revisar a aplicação antes do envio com base em auditoria técnica.

---

## Limitações conhecidas

Apesar do uso de IA no apoio ao desenvolvimento, a aplicação possui limitações compatíveis com o escopo de um desafio técnico:

- a análise por IA utiliza implementação mockada;
- não há integração com provedor externo real de IA;
- a configuração Docker foi pensada principalmente para execução local e avaliação técnica;
- recursos de observabilidade, autenticação avançada, CI/CD e hardening de produção não foram priorizados;
- a cobertura de testes foi direcionada às regras e fluxos mais relevantes, não necessariamente a 100% do código;
- melhorias de UI/UX foram aplicadas dentro do limite de tempo e escopo.

---

## Considerações finais

A IA foi utilizada como ferramenta de apoio técnico, revisão e aceleração do desenvolvimento. Ela contribuiu para identificar inconsistências, sugerir melhorias e estruturar soluções, mas não substituiu a análise crítica, a validação manual e as decisões finais de implementação.

O objetivo do uso da IA foi aumentar a qualidade da entrega, reduzir riscos de inconsistência e tornar o projeto mais claro para avaliação.