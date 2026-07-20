# Project Frontend

A React + Vite + TypeScript SaaS Enterprise frontend starter (Atlhon Sales CRM Suite).

## How to run

The app starts automatically via the **Start application** workflow.
- Dev server: `cd project/frontend && npm run dev` → http://localhost:5000

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4
- React Router DOM v7
- TanStack Query v5
- Zustand (global state)
- React Hook Form + Zod
- Radix UI / shadcn-inspired components
- Framer Motion, Sonner, Lucide React

## Project structure

```
project/
  frontend/
    src/
      app/         # Router, providers, layouts
      features/    # Domain logic (auth, etc.)
      components/  # Shared/UI components
      stores/      # Zustand stores
      services/    # API service layer
      lib/         # axios, queryClient
      schemas/     # Zod schemas
```

## Environment variables

Set in Replit Secrets / env vars:

| Key                | Description                        |
|--------------------|------------------------------------|
| `VITE_API_URL`     | Backend API base URL (optional)    |
| `VITE_APP_NAME`    | App display name (default set)     |
| `VITE_ENVIRONMENT` | Environment tag (default set)      |

## User preferences
