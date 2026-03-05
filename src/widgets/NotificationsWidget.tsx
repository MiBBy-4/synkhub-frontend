import {
  Bell,
  CheckCheck,
  ChevronDown,
  ExternalLink,
  Eye,
  Filter,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { labelFor } from "../utils/eventLabels";

export function NotificationsWidget() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    filters,
    setFilters,
    markRead,
    markAllRead,
    hasMore,
    loadMore,
  } = useNotifications();
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const repos = useMemo(() => {
    const set = new Set(notifications.map((n) => n.repo_full_name));
    return [...set].sort();
  }, [notifications]);

  const eventTypes = useMemo(() => {
    const set = new Set(notifications.map((n) => n.event_type));
    return [...set].sort();
  }, [notifications]);

  const handleMarkAllRead = async () => {
    setMarkingAllRead(true);
    try {
      await markAllRead();
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-medium text-text-primary">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-danger px-1.5 py-0.5 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`rounded p-1 text-text-secondary transition-colors hover:text-text-primary ${showFilters ? "bg-surface-light" : ""}`}
            title="Toggle filters"
            aria-label="Toggle filters"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={filters.event_type ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                event_type: e.target.value || undefined,
              })
            }
            className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary"
          >
            <option value="">All events</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {labelFor(type)}
              </option>
            ))}
          </select>
          <select
            value={filters.repo ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, repo: e.target.value || undefined })
            }
            className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary"
          >
            <option value="">All repos</option>
            {repos.map((repo) => (
              <option key={repo} value={repo}>
                {repo}
              </option>
            ))}
          </select>
          <select
            value={filters.read ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, read: e.target.value || undefined })
            }
            className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary"
          >
            <option value="">All</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-text-secondary">No notifications yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start justify-between gap-2 rounded-lg border border-border p-3 text-sm ${n.read ? "opacity-50" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {n.repo_full_name}
                    {n.actor_login ? ` · ${n.actor_login}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="rounded p-1 text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary"
                      title="Mark as read"
                      aria-label="Mark notification as read"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {n.url && (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-1 text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary"
                      title="Open on GitHub"
                      aria-label="Open on GitHub"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
            >
              {loadingMore ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
}
