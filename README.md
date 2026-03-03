# SynkHub — Frontend

SynkHub is a personal productivity dashboard that aggregates information from GitHub, Google Calendar, and Shortcut into a unified interface. This repository contains the standalone frontend application built with React, TypeScript, and Vite.

The frontend communicates with the Rails backend via a JSON API and renders modular widgets that display real-time data from external services.

---

## Overview

The purpose of the SynkHub frontend is to provide a clean, minimalistic, developer-oriented interface for viewing aggregated data from multiple platforms:

- **GitHub** — pull requests requiring attention, authored PRs, review status.
- **Google Calendar** — today's events, weekly schedule, upcoming meetings.
- **Shortcut** — assigned tasks, active stories, project progress.

The UI is designed to feel like a modern developer tool: dark, minimal, fast, and distraction-free.

---

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS v3**
- **Lucide Icons**
- **ESLint 9 + Prettier**
- **Docker Compose**
- **yarn**

---

## Design System

SynkHub uses a dark-mode-first design inspired by tools like Linear, Vercel, and Raycast.

### Color Palette

- `#0D0D0D` — background
- `#1A1A1A` — surface
- `#1F1F1F` — light surface
- `#2A2A2A` — borders
- `#F5F5F5` — primary text
- `#A3A3A3` — secondary text
- `#3B82F6` — accent
- `#2563EB` — accent hover

### Typography

- **Inter**

### Icons

- **Lucide React**

Full design rules are documented in `docs/design-patterns/design-system.md`.

---

## Project Structure

```
src/
  api/          # API client and request helpers
  components/   # Shared, reusable UI components
  hooks/        # Custom React hooks
  layouts/      # Page layout shells
  pages/        # Top-level page components
  styles/       # Global CSS and Tailwind entry
  types/        # Shared TypeScript types and interfaces
  utils/        # Pure utility functions
  widgets/      # Dashboard widget components
```

This structure is optimized for modular widget development and long-term scalability.

---

## Running with Docker

### Start the environment

```bash
docker compose -f docker/development/compose.yml up --build
```

The frontend will be available at `http://localhost:5173`.

### Linting

```bash
docker exec synkhub-frontend-development-vite yarn lint
```

### Type check and build

```bash
docker exec synkhub-frontend-development-vite yarn build
```

### Format code

```bash
docker exec synkhub-frontend-development-vite yarn format
```

### Local development without Docker

```bash
yarn install
yarn dev
```

---

## Documentation

- `CLAUDE.md` — rules and conventions for AI-assisted development in this repository
- `docs/design-patterns/design-system.md` — design system and UI guidelines
- `instruction.md` (parent directory) — shared conceptual architecture

---

## Future Development

- GitHub PR widget
- Google Calendar widget
- Shortcut tasks widget
- Drag-and-drop dashboard layout
- User-configurable widget settings
- Light mode (optional)
