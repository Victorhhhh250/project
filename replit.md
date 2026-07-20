# Atlhon Sales — CRM Suite Frontend

React + Vite + TypeScript SaaS frontend boilerplate. Currently shows an Atlhon Sales CRM login/signup page.

## How to run

The dev server starts automatically via the **Start application** workflow.

```bash
cd project/frontend && npm run dev
```

Runs on **port 5000**.

## Stack

- React 19, Vite 8, TypeScript 5
- Tailwind CSS v4
- React Router DOM v7
- TanStack Query v5
- Zustand, React Hook Form, Zod
- Radix UI primitives + shadcn/ui-inspired components
- Framer Motion, Sonner, Lucide React

## Environment variables

Copy `project/frontend/.env.example` as reference. Key variable:

- `VITE_API_URL` — backend API base URL (leave blank while there's no backend)
- `VITE_APP_NAME` — displayed app name
- `VITE_ENVIRONMENT` — `development` or `production`

Set these via Replit Secrets if they contain sensitive values.

## Project structure

```
project/frontend/src/
  app/          — layouts, providers, router
  components/   — shared UI components
  features/     — domain-specific logic
  stores/       — Zustand global state
  lib/          — axios, queryClient, utils
  schemas/      — Zod validation schemas
  types/        — TypeScript types
```

## User preferences

- Keep existing project structure (do not restructure or migrate)
- Portuguese (Brazilian) is the app language
