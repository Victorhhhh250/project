# Frontend

Este repositório contém o ambiente frontend React + Vite + TypeScript pronto para o desenvolvimento de um produto SaaS Enterprise.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- React Router DOM
- TanStack Query
- Axios
- Zustand
- React Hook Form
- Zod
- Hookform Resolvers
- shadcn/ui-inspired UI
- Radix UI
- Lucide React
- Framer Motion
- Sonner
- date-fns
- TanStack Table
- dnd-kit
- React Dropzone
- imask
- clsx
- tailwind-merge
- class-variance-authority

## Instalação

```bash
cd frontend
npm install
```

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — compila o app para produção
- `npm run preview` — pré-visualiza o build de produção
- `npm run lint` — valida o código com ESLint
- `npm run lint:fix` — corrige automaticamente problemas suportados
- `npm run format` — formata o código com Prettier
- `npm run type-check` — executa verificação de tipos TypeScript

## Arquitetura

```
src/
  app/
    layouts/
    providers/
    router/
  assets/
    fonts/
    icons/
    images/
  components/
    common/
    shared/
    ui/
  config/
  constants/
  features/
  hooks/
  lib/
    axios.ts
    queryClient.ts
    utils.ts
  schemas/
  services/
  stores/
  styles/
  types/
  utils/
  pages/
```

## Convenções

- `@/*` mapeia para `src/*`
- os imports devem ser ordenados em: React, bibliotecas, aliases e relativos
- use `features/` para lógica de domínio e `components/ui/` para componentes reutilizáveis
- serviços API vivem em `services/` e abstrações de infraestrutura em `lib/`
- estado global fica em `stores/`
- `app/providers/` agrupa provedores de contexto

## Configurações

- TypeScript com `strict` e regras de qualidade ativas
- Tailwind CSS v4 com modo `class` para dark mode
- ESLint + Prettier + plugin Tailwind
- Husky + lint-staged para hooks de pré-commit

## Variáveis de ambiente

Use `.env.example` como referência:

```env
VITE_API_URL=
VITE_APP_NAME=Project Frontend
VITE_ENVIRONMENT=development
```

## Dependências instaladas

- UI, roteamento e estado: React, React Router DOM, Zustand, TanStack Query
- Formulários e validação: React Hook Form, Zod, @hookform/resolvers
- Estilo e temas: Tailwind CSS, clsx, tailwind-merge, class-variance-authority
- APIs e utilitários: Axios, date-fns, imask
- Interação: dnd-kit, react-dropzone
- Notificações e animações: Sonner, Framer Motion
- Acessibilidade e componentes: Radix UI, Lucide React

## Observações

Este repositório está preparado para iniciar o desenvolvimento com arquitetura SaaS escalável, controles de qualidade e suporte a temas escuro/claro.
