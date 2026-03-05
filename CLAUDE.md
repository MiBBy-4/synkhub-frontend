# SynkHub Frontend — Agent Guidelines

## Project Overview

SynkHub frontend is a React + TypeScript dashboard application built with Vite and TailwindCSS.
It communicates with the Rails backend exclusively via JSON API. It owns no business logic, data, or authentication — only presentation and user interaction.

For a high-level understanding of the project's goals, scope, and future direction, refer to `README.md`.

## Tech Stack

- **Runtime:** Node 22+
- **Framework:** React 19, TypeScript
- **Build:** Vite
- **Styling:** TailwindCSS v3 (dark-mode-first, class strategy)
- **Icons:** Lucide React
- **Linting:** ESLint 9 (flat config) + Prettier
- **Package Manager:** yarn

## Running

Dockerized development. Container name: `synkhub-frontend-development-vite`.

All commands run inside the container:

```bash
docker exec synkhub-frontend-development-vite yarn lint      # ESLint
docker exec synkhub-frontend-development-vite yarn build     # TypeScript check + Vite build
docker exec synkhub-frontend-development-vite yarn format    # Prettier
```

**After each implementation**, run both commands inside the container:

```bash
docker exec synkhub-frontend-development-vite yarn lint
docker exec synkhub-frontend-development-vite yarn build
```

Fix any lint errors or type errors before considering the task done.

## Backend API Reference

When implementing any fetch to or from the backend, always read `../synkhub-api/docs/routes.md` first to understand the API structure, request/response shapes, and authentication requirements.

## Project Structure

```
src/
  api/          # API client and request helpers (backend communication)
  components/   # Shared, reusable UI components
  hooks/        # Custom React hooks
  layouts/      # Page layout shells
  pages/        # Top-level page components
  styles/       # Global CSS and Tailwind entry
  types/        # Shared TypeScript types and interfaces
  utils/        # Pure utility functions
  widgets/      # Dashboard widget components
```

## Architecture Reference

For a detailed file map, routing, state management, and widget patterns, see `docs/architecture.md`.

## Conventions

- Follow the design system defined in `docs/design-patterns/design-system.md`.
- Use the custom Tailwind color tokens (`background`, `surface`, `accent`, etc.) — never hardcode hex values.
- Components are named exports in PascalCase files.
- Keep components small and focused. Extract shared logic into hooks.
- No `any` types. Prefer explicit interfaces over inline types.
- All API communication goes through `src/api/`. Components never call `fetch` directly.
