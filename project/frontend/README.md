# Frontend

Esta pasta contém a base do frontend React + Vite + TypeScript para um produto SaaS enterprise.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- React Router DOM
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- ESLint
- Prettier
- Radix UI
- Lucide React

## Como instalar

```bash
cd frontend
npm install
```

## Como executar

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint e formatação

```bash
npm run lint
npm run format
```

## Estrutura de pastas

- `src/app/`
  - `router/` — rotas públicas e privadas
  - `providers/` — provedores de contexto e queries
  - `layouts/` — layouts compartilhados
- `src/components/`
  - `ui/` — componentes de interface reutilizáveis
  - `common/` — componentes específicos de domínio comum
  - `shared/` — componentes de marca e navegação
- `src/features/` — módulos de domínio futuros
- `src/hooks/` — hooks customizados
- `src/lib/` — abstrações de Axios, QueryClient e utilitários
- `src/services/` — camadas de serviços e chamadas API
- `src/stores/` — estado global com Zustand
- `src/schemas/` — definições e validações Zod
- `src/types/` — tipos compartilhados
- `src/constants/` — rotas e valores fixos
- `src/utils/` — utilitários genéricos
- `src/styles/` — estilos globais e temas

## Arquivos importantes

- `.env.example` — variáveis de ambiente
- `vite.config.ts` — configuração Vite e Tailwind
- `tsconfig.app.json` — TypeScript strict
- `.eslintrc.cjs` — regras de lint
- `.prettierrc` — formatação de código

## Padrões de desenvolvimento

- Use a pasta `features/` para funcionalidades e componentes específicos de domínio
- Use `stores/` para estado global e `services/` para comunicação com APIs
- Use `lib/` para abstrações de infraestrutura e helpers
- Rotas privadas usam guardas em `app/router/protected.tsx`
- Valide formulários com Zod + React Hook Form
- Use componentes de UI em `components/ui/` sempre que possível
