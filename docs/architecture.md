# Frontend Architecture

## File Map

### Entry Points

| File | Purpose |
|------|---------|
| `src/main.tsx` | React mount, StrictMode |
| `src/App.tsx` | Router + provider tree: `AuthProvider → ToastProvider → NotificationsProvider → Routes` |

### Pages (6)

| File | Route | Guard | Layout |
|------|-------|-------|--------|
| `src/pages/LoginPage.tsx` | `/login` | GuestRoute | none |
| `src/pages/SignupPage.tsx` | `/signup` | GuestRoute | none |
| `src/pages/Dashboard.tsx` | `/` | ProtectedRoute | RootLayout |
| `src/pages/SettingsPage.tsx` | `/settings` | ProtectedRoute | RootLayout (includes notification preferences) |
| `src/pages/GitHubCallbackPage.tsx` | `/github/callback` | ProtectedRoute | none |
| `src/pages/GoogleCalendarCallbackPage.tsx` | `/google-calendar/callback` | ProtectedRoute | none |

### Widgets (dashboard)

| File | Data Source | Key Behavior |
|------|-------------|--------------|
| `src/widgets/WidgetGrid.tsx` | children | Responsive grid: 1/2/3 cols |
| `src/widgets/NotificationsWidget.tsx` | `useNotifications()` | List with mark-read, filtering, load more pagination |
| `src/widgets/SubscriptionsWidget.tsx` | `githubApi.getSubscriptions()` | List with unsubscribe action, load more pagination, link to settings |
| `src/widgets/ActivitySummaryWidget.tsx` | `useNotifications()` | Event type breakdown bar chart |
| `src/widgets/RecentCommitsWidget.tsx` | `githubApi.getCommits()` | Recent commits list, load more pagination, spans 2 cols |
| `src/widgets/PrStatusWidget.tsx` | `useNotifications()` | PR status from pull_request events, colored badges |

### Components

| File | Purpose |
|------|---------|
| `src/components/AuthProvider.tsx` | Auth state, token persistence, login/signup/logout |
| `src/components/NotificationsProvider.tsx` | Fetch + poll notifications (30s), optimistic updates, filtering |
| `src/components/ToastProvider.tsx` | Toast state management, auto-dismiss (4s) |
| `src/components/ToastContainer.tsx` | Fixed bottom-right toast rendering |
| `src/components/ToastItem.tsx` | Individual toast with success/error styling |
| `src/components/Header.tsx` | Top nav: logo, user email, notification badge, settings link |
| `src/components/ProtectedRoute.tsx` | Redirects unauthenticated → `/login` |
| `src/components/GuestRoute.tsx` | Redirects authenticated → `/` |
| `src/components/LoadingScreen.tsx` | Full-screen loading indicator |

### Hooks

| File | Provides |
|------|----------|
| `src/hooks/useAuth.ts` | `user`, `token`, `isLoading`, `login()`, `signup()`, `logout()`, `refreshUser()` |
| `src/hooks/useNotifications.ts` | `notifications[]`, `unreadCount`, `isLoading`, `error`, `filters`, `setFilters()`, `markRead()`, `markAllRead()`, `refresh()`, `hasMore`, `loadMore()` |
| `src/hooks/useToast.ts` | `addToast(type, message)` |

### API Layer

| File | Endpoints |
|------|-----------|
| `src/api/client.ts` | Generic `get/post/patch/del` with Bearer auth and query params, `ApiError` class |
| `src/api/auth.ts` | `login`, `signup`, `getMe` |
| `src/api/github.ts` | OAuth flow, repositories, subscriptions CRUD, notifications CRUD (with filters), stats, commits, user preferences |
| `src/api/googleCalendar.ts` | Google Calendar OAuth flow (auth URL, callback, disconnect) |

### Types

| File | Exports |
|------|---------|
| `src/types/api.ts` | `User` (with `google_email`, `google_calendar_connected`), `AuthenticatedUser`, `GitHubRepository`, `GitHubSubscription`, `GitHubNotification`, `NotificationFilters`, `GitHubStats`, `GitHubCommit`, `PaginationMeta`, `PaginatedResponse`, `UserPreferences`, API response wrappers |
| `src/types/auth.ts` | `LoginCredentials`, `SignupCredentials` |
| `src/types/toast.ts` | `ToastType`, `Toast` |

### Utils

| File | Exports |
|------|---------|
| `src/utils/storage.ts` | `getStoredToken()`, `setStoredToken()`, `removeStoredToken()` |
| `src/utils/eventLabels.ts` | `EVENT_LABELS`, `labelFor()` |

### Other

| File | Purpose |
|------|---------|
| `src/layouts/RootLayout.tsx` | Header + centered `max-w-7xl` container |
| `src/styles/index.css` | Tailwind directives, global border/body styles |

## State Management

Context-based (no external state library):

```
AuthProvider          → user, token, auth methods
  ToastProvider       → toast queue, auto-dismiss
    NotificationsProvider → notifications[], polling, optimistic updates, filtering
```

- `AuthProvider` validates token on mount via `getMe()`, persists to localStorage
- `ToastProvider` manages toast array with 4s auto-dismiss, renders fixed bottom-right container
- `NotificationsProvider` fetches on mount (if GitHub connected), polls every 30s, supports optimistic mark-read with rollback, supports server-side filtering

## Routing

```
BrowserRouter
├─ /login              GuestRoute     → LoginPage
├─ /signup             GuestRoute     → SignupPage
├─ /                   ProtectedRoute → RootLayout → Dashboard
├─ /settings           ProtectedRoute → RootLayout → SettingsPage
├─ /github/callback    ProtectedRoute → GitHubCallbackPage
└─ /google-calendar/callback  ProtectedRoute → GoogleCalendarCallbackPage
```

## Widget Pattern

All dashboard widgets follow this structure:

```tsx
<div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light">
  {/* Header: icon + title + optional badge */}
  {/* Body: loading → error → empty → content */}
</div>
```

- Loading state: `<Loader2 className="h-4 w-4 animate-spin" />`
- Icons from `lucide-react`, sized `h-4 w-4`, colored `text-accent`
- Count badges: `rounded-full bg-accent/bg-danger px-1.5 py-0.5 text-xs font-medium text-white`
