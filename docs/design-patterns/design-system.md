# SynkHub Design System

## Design Philosophy

SynkHub follows a **dark-mode-first, minimalistic, developer-tool aesthetic**.
The interface should feel quiet and focused — content takes priority over decoration.
Every element earns its place through utility, not ornamentation.

Principles:
- **Clarity over cleverness** — UI should be immediately understandable.
- **Density without clutter** — information-rich layouts with clear visual hierarchy.
- **Restraint** — monochrome base with a single accent color for emphasis.

---

## Color Palette

All colors are defined as Tailwind tokens in `tailwind.config.ts`.
Always use token names — never hardcode hex values.

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0D0D0D` | Page background |
| `surface` | `#1A1A1A` | Cards, panels, widgets |
| `surface-light` | `#1F1F1F` | Hover states, elevated surfaces |
| `border` | `#2A2A2A` | Borders, dividers |
| `text-primary` | `#F5F5F5` | Headings, primary content |
| `text-secondary` | `#A3A3A3` | Labels, secondary content, captions |
| `accent` | `#3B82F6` | Interactive elements, icons, focus rings |
| `accent-hover` | `#2563EB` | Hover state for accent elements |

### Usage Rules

- Background → `bg-background`
- Widget/card backgrounds → `bg-surface`
- Hover states on surfaces → `hover:bg-surface-light`
- All borders → `border-border`
- Primary text → `text-text-primary`
- Secondary/muted text → `text-text-secondary`
- Accent elements (buttons, active icons, links) → `text-accent` or `bg-accent`

---

## Typography

**Font Family:** Inter (loaded via Google Fonts, configured as `font-sans` in Tailwind).

### Scale

| Role | Class | Weight |
|------|-------|--------|
| Page heading | `text-xl font-semibold` | 600 |
| Section heading | `text-lg font-semibold` | 600 |
| Widget title | `text-sm font-medium` | 500 |
| Body text | `text-sm` | 400 |
| Caption / label | `text-xs text-text-secondary` | 400 |

### Rules

- Use `antialiased` rendering (applied globally on `<body>`).
- Never use font sizes larger than `text-2xl` in the dashboard.
- Headings use `text-text-primary`. Body and labels use `text-text-secondary`.

---

## Spacing

Use Tailwind's default spacing scale. Preferred values:

| Context | Value |
|---------|-------|
| Page padding (horizontal) | `px-4 sm:px-6 lg:px-8` |
| Page padding (vertical) | `py-8` |
| Widget internal padding | `p-5` |
| Gap between widgets in grid | `gap-4` |
| Gap between heading and content | `mb-4` or `mb-6` |
| Gap between icon and label | `gap-2` or `gap-3` |

### Rules

- Use `4` as the base spacing unit (1rem = 16px).
- Maintain consistent inner padding across all widget types.
- Use `max-w-7xl mx-auto` for the main content container.

---

## Component Style Conventions

### Cards / Widgets

```
rounded-widget border border-border bg-surface p-5
```

- All widgets use `rounded-widget` (0.75rem) for corners.
- Hover effect: `transition-colors hover:bg-surface-light`.
- Widget header: icon + title in a flex row with `gap-2`, using `text-sm font-medium`.

### Buttons (future)

- Primary: `bg-accent text-white hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-medium`
- Ghost: `text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-md px-3 py-1.5 text-sm`

### Inputs (future)

- `bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none`

---

## Widget Layout Conventions

Widgets are arranged in a responsive grid:

```
grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3
```

- Each widget occupies one grid cell by default.
- Wide widgets can span columns with `sm:col-span-2` or `lg:col-span-3`.
- Grid auto-flows rows. No masonry layout.

---

## Interaction Patterns

- **Hover:** Surface elements transition to `surface-light`. Use `transition-colors` for smooth effect.
- **Focus:** Interactive elements show `focus:border-accent focus:outline-none` or `focus:ring-2 focus:ring-accent`.
- **Active state:** Accent background with white text.
- **Transitions:** Keep them fast — `duration-150` or Tailwind default.
- **Loading:** Use subtle skeleton placeholders matching `surface-light` on `surface` background.
- **No animations on page load.** Content should appear instantly.

---

## Iconography

**Library:** Lucide React

### Rules

- Default icon size: `h-4 w-4` for inline, `h-5 w-5` for header/nav.
- Icon color follows its context: `text-accent` for emphasis, `text-text-secondary` for decorative.
- Always pair icons with text labels — no icon-only buttons without tooltips.
- Import icons individually: `import { Activity } from "lucide-react"`.
- Do not use icon fonts. SVG components only.
