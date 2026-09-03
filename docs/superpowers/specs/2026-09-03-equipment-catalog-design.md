# Catálogo de Equipamentos (tela de listagem) — Design

Data: 2026-09-03
Branch: `feature/lista-equipamentos`

## Contexto

Primeira tela funcional do LabTrack web: catálogo geral de equipamentos, tela
inicial do app após login. Consome `GET /api/equipamentos` (TASK-LAB-043) e
`GET /api/projetos` (nova task, descrita abaixo). Ao clicar num item, navega
para o detalhe (TASK-LAB-063, ainda não implementado — recebe um placeholder
nesta task).

O projeto está em scaffold inicial (Vite + React 19 + TS + TanStack
Router/Query + Tailwind v4 + shadcn/ui `radix-nova`), sem nenhuma tela real,
API configurada ou autenticação ainda.

## Decisões de regra de negócio (confirmadas com o usuário)

- **Categoria**: fora do escopo do projeto — não existe filtro/campo de
  categoria.
- **Projeto**: entidade real (pesquisa/disciplina) à qual um equipamento é
  vinculado. Precisa de endpoint próprio de listagem para popular o filtro.
- **Catálogo pode crescer**: a tela usa scroll infinito, não só uma página
  fixa — então filtros de busca/projeto não podem depender de "o que já foi
  carregado", precisam ser resolvidos pelo backend.

## Contratos de API (atualizados nesta sessão)

### `GET /api/equipamentos` (TASK-LAB-043, atualizado)

Query params: `status`, `search` (nome ou código, parcial, case-insensitive),
`projetoId`, `page` (default 1), `pageSize` (default 20). Combináveis (AND).
Resposta paginada com metadados (`total`/`page`/`pageSize`/`totalPages` ou
equivalente) para alimentar o scroll infinito. Cada equipamento retorna o
`projeto` vinculado embutido (`{ id, nome }`) quando existir. Rota protegida
por JWT.

### `GET /api/projetos` (nova task)

Lista simples, sem paginação, de `{ id, nome }`. Popula o dropdown de filtro
por projeto. Rota protegida por JWT.

Os textos completos das duas tasks de backend (com critérios de aceite em
Gherkin) foram entregues ao usuário durante o brainstorming desta feature e
não são repetidos aqui — este spec cobre apenas o front.

## Arquitetura do front

### Rotas (TanStack Router, file-based)

- `/` — `beforeLoad` redireciona para `/equipment` (evita retrabalho quando o
  Dashboard existir futuramente).
- `/equipment` — tela de catálogo (esta task).
- `/equipment/$id` — placeholder de detalhe ("Detalhe do equipamento — em
  construção"), pronto para TASK-LAB-063 preencher.
- `__root.tsx` passa a montar um `AppShell` (sidebar fixa + área de conteúdo)
  em vez de só `<Outlet />`.

Paths e nomes de arquivo/pasta/componentes em inglês; os campos de dados
espelham o JSON da API (português: `nome`, `codigo`, `status`, `projeto`,
`laboratorio`, `bancada`), por ser o contrato do backend.

### Camada de dados (`src/features/equipment/`)

- `types.ts` — `Equipamento` (`id`, `nome`, `codigo`, `projeto: { id, nome } |
  null`, `laboratorio`, `bancada`, `status`, `qtdDisponivel`, `qtdTotal`) e
  enum `StatusEquipamento` (`DISPONIVEL | EMPRESTADO | MANUTENCAO |
  INATIVO`); `Projeto` (`id`, `nome`).
- `api.ts` — `fetchEquipamentos({ status, search, projetoId, page, pageSize
  })` → `GET {VITE_API_URL}/api/equipamentos`; `fetchProjetos()` → `GET
  /api/projetos`. Único ponto de anexação de auth: `getAuthToken()` (hoje
  retorna `null` — sem login implementado ainda, lacuna conhecida e fora do
  escopo desta task).
- Modo mock: `VITE_USE_MOCK_API` (default `true`, já que os dois backends
  ainda não existem). O mock de equipamentos simula paginação real (pageSize
  pequeno) e aplica os filtros localmente sobre os 8 itens do design, para
  permitir testar scroll infinito e filtros combinados no navegador.
- `use-equipment.ts` — `useInfiniteQuery` (TanStack Query); `queryKey` inclui
  `status`/`search`/`projetoId`; `getNextPageParam` a partir dos metadados de
  paginação.
- `use-projects.ts` — `useQuery` simples para o dropdown de projeto.

### Filtros e busca

- Busca por nome/código com debounce.
- Pills de status: Todos / Disponível / Emprestado / Manutenção / Inativo.
- Select de projeto (via `use-projects`).
- Qualquer mudança de filtro reseta o `useInfiniteQuery` (novo `queryKey`).
- Scroll infinito via `IntersectionObserver` num elemento sentinela no fim do
  grid.

### Componentes

- `src/components/layout/sidebar.tsx` — nav escura seguindo o mockup
  (`Equipamentos - Desktop.png`): Dashboard, Equipamentos (ativo, único item
  navegável nesta task), Empréstimos, Alunos, Histórico, Alertas·3, seção
  "Sistema" (Relatórios, Configurações), rodapé com usuário. Demais itens são
  visuais/inertes até suas próprias tasks existirem.
- `src/components/layout/topbar.tsx` — título/subtítulo da página, busca
  global (decorativa, fora do escopo), sino de notificação, chip de usuário.
- `src/features/equipment/components/`: `equipment-filters.tsx`,
  `equipment-grid.tsx`, `equipment-card.tsx`, `status-badge.tsx`.

### Tema

Ajustar `--primary`/`--sidebar-*` em `src/index.css` para a paleta
roxa/violeta do design (hoje neutra/grayscale). Adicionar componentes shadcn
que faltam: `input`, `badge`, `avatar`, `select`, `dropdown-menu`.

## Fora de escopo (lacunas conhecidas, não bloqueiam esta task)

- Autenticação/login real (JWT) — front chama a API sem token por enquanto.
- Implementação real de `GET /api/equipamentos` e `GET /api/projetos` — mock
  local cobre o desenvolvimento até essas tasks de backend serem feitas.
- Conteúdo real da tela de detalhe (TASK-LAB-063) — apenas placeholder.
- Navegação funcional dos demais itens da sidebar.

## Verificação

Sem infra de teste automatizado no repo (nenhum vitest/jest configurado) —
não será introduzida nesta task. Verificação via `npm run lint`, `npm run
build` (typecheck) e teste manual no navegador: lista carrega, busca filtra,
filtro de status filtra, filtro de projeto filtra, filtros combinados
funcionam, scroll infinito carrega mais itens, clique navega para o
placeholder de detalhe.
