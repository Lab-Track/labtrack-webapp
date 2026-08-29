# LabTrack — Frontend Web

Aplicação web do **LabTrack**, sistema de rastreio de empréstimos de materiais em laboratório, desenvolvido como projeto da disciplina **Projeto e Requisitos de Software** (IFMA).

## Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev) — build tool e servidor de desenvolvimento
- [TanStack Router](https://tanstack.com/router/latest) — roteamento com file-based routing
- [TanStack Query](https://tanstack.com/query/latest) — gerenciamento de estado de servidor
- [Tailwind CSS](https://tailwindcss.com/docs) — estilização utility-first
- [shadcn/ui](https://ui.shadcn.com) (Radix UI, preset Nova) — componentes de UI
- ESLint — padronização e qualidade de código

## Pré-requisitos

- [Node.js](https://nodejs.org) (versão 18 ou superior recomendada)
- npm (instalado junto com o Node.js)
- Git

## Como clonar o repositório

Via SSH (recomendado, requer chave SSH configurada na sua conta do GitHub e acesso à organização LabTrack):

```bash
git clone git@github.com:LabTrack/labtrack-webapp.git
cd labtrack-webapp
```

## Instalação

Instale as dependências do projeto:

```bash
npm install
```

## Rodando o projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173` (ou outra porta, caso a 5173 esteja em uso — o terminal indicará o endereço correto).

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Serve localmente a build de produção gerada |
| `npm run lint` | Executa o ESLint para checar problemas no código |

## Adicionando componentes do shadcn/ui

Para adicionar novos componentes prontos do shadcn/ui ao projeto:

```bash
npx shadcn@latest add <nome-do-componente>
```

Exemplo:

```bash
npx shadcn@latest add dialog
```

Os componentes são adicionados diretamente em `src/components/ui/`, com código totalmente editável.

## Estrutura de rotas

O roteamento é feito via **file-based routing** do TanStack Router. Cada arquivo dentro de `src/routes/` representa uma rota da aplicação:

- `src/routes/__root.tsx` — layout raiz da aplicação
- `src/routes/index.tsx` — rota inicial (`/`)

O arquivo `src/routeTree.gen.ts` é gerado **automaticamente** pelo plugin do TanStack Router a partir dos arquivos em `src/routes/` — não deve ser editado manualmente.

## Path alias

O projeto usa o alias `@/` apontando para a pasta `src/`. Exemplo de uso:

```ts
import { Button } from "@/components/ui/button"
```

## Documentação da stack

Para uma visão mais aprofundada sobre cada tecnologia utilizada e as decisões tomadas, consulte a página de pesquisa de desenvolvimento no Notion do time.