# Atlhon Sales – CRM Suite Frontend

A React + Vite + TypeScript SaaS frontend boilerplate for an Enterprise CRM product ("Atlhon Sales"). The app features a login page, Google OAuth entry point, and is structured for a full SaaS product with dark/light mode support.

## Stack

- **React 18 + TypeScript** — component framework
- **Vite** — dev server and bundler (port 5000)
- **Tailwind CSS v4** — styling
- **React Router DOM v7** — routing
- **TanStack Query** — server state / data fetching
- **Zustand** — global client state
- **React Hook Form + Zod** — forms and validation
- **Radix UI + shadcn/ui-inspired components** — accessible UI primitives
- **Axios** — HTTP client
- **Framer Motion** — animations
- **Sonner** — toast notifications
- **dnd-kit** — drag-and-drop
- **Recharts** — charts

## How to run

The dev server starts automatically via the **Start application** workflow:

```bash
cd project/frontend && npm run dev
```

App is served on port 5000.

## Project layout

```
project/
  frontend/
    src/
      app/          # layouts, providers, router
      assets/       # fonts, icons, images
      components/   # common, shared, ui primitives
      features/     # domain logic by feature
      lib/          # axios, queryClient, utils
      schemas/      # Zod schemas
      services/     # API service layer
      stores/       # Zustand stores
      styles/       # global styles
      types/        # shared TypeScript types
      utils/        # utility functions
```

## Environment variables

| Key | Purpose | Required |
|-----|---------|----------|
| `VITE_API_URL` | Base URL of the backend API | Yes (for API calls) |
| `VITE_APP_NAME` | App display name | No (defaults to "Project Frontend") |
| `VITE_ENVIRONMENT` | Environment label | No |

Set `VITE_API_URL` in Replit Secrets or env vars when a backend is available.

## User preferences

- Keep the existing project structure under `project/frontend/` — do not move or restructure.
