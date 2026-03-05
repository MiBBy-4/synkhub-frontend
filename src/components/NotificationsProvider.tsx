import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as githubApi from "../api/github";
import { useAuth } from "../hooks/useAuth";
import { NotificationsContext } from "../hooks/useNotifications";
import { useToast } from "../hooks/useToast";
import type { GitHubNotification, NotificationFilters } from "../types/api";

const POLL_INTERVAL = 30_000;

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const githubConnected = user?.github_connected ?? false;

  const [notifications, setNotifications] = useState<GitHubNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersRaw] = useState<NotificationFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const filtersRef = useRef(filters);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  useEffect(() => {
    if (!githubConnected) {
      setNotifications([]);
      setError(null);
      setIsLoading(false);
      setFiltersRaw({});
      setPage(1);
      setHasMore(false);
    }
  }, [githubConnected]);

  const setFilters = useCallback((newFilters: NotificationFilters) => {
    setFiltersRaw(newFilters);
    filtersRef.current = newFilters;
    setPage(1);
    setNotifications([]);
  }, []);

  const fetchPage = useCallback(
    async (currentFilters: NotificationFilters, pageNum: number) => {
      try {
        const response = await githubApi.getNotifications(
          currentFilters,
          pageNum,
        );
        return response;
      } catch {
        throw new Error("Failed to load notifications.");
      }
    },
    [],
  );

  useEffect(() => {
    if (!githubConnected) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const response = await fetchPage(filters, 1);
        if (!cancelled) {
          setNotifications(response.data);
          setHasMore(response.meta.pagination.next_page !== null);
          setPage(1);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load notifications.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [githubConnected, filters, fetchPage]);

  useEffect(() => {
    if (!githubConnected) return;

    const id = setInterval(async () => {
      try {
        const response = await fetchPage(filtersRef.current, 1);
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newItems = response.data.filter((n) => !existingIds.has(n.id));
          if (newItems.length > 0) {
            return [...newItems, ...prev];
          }
          return prev.map((n) => response.data.find((r) => r.id === n.id) ?? n);
        });
        setHasMore(response.meta.pagination.next_page !== null);
        setError(null);
      } catch {
        /* keep existing data on poll failure */
      }
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [githubConnected, fetchPage]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    try {
      const response = await fetchPage(filtersRef.current, nextPage);
      setNotifications((prev) => [...prev, ...response.data]);
      setHasMore(response.meta.pagination.next_page !== null);
      setPage(nextPage);
    } catch {
      addToast("error", "Failed to load more notifications.");
    }
  }, [page, fetchPage, addToast]);

  const markRead = useCallback(
    async (notificationId: number) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      try {
        await githubApi.markNotificationRead(notificationId);
      } catch {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: false } : n,
          ),
        );
        addToast("error", "Failed to mark notification as read.");
      }
    },
    [addToast],
  );

  const markAllRead = useCallback(async () => {
    const unreadIds = new Set<number>();
    setNotifications((prev) => {
      for (const n of prev) {
        if (!n.read) unreadIds.add(n.id);
      }
      return prev.map((n) => ({ ...n, read: true }));
    });
    try {
      await githubApi.markAllNotificationsRead();
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (unreadIds.has(n.id) ? { ...n, read: false } : n)),
      );
      addToast("error", "Failed to mark all notifications as read.");
    }
  }, [addToast]);

  const refresh = useCallback(async () => {
    try {
      const response = await fetchPage(filtersRef.current, 1);
      setNotifications(response.data);
      setHasMore(response.meta.pagination.next_page !== null);
      setPage(1);
      setError(null);
    } catch {
      setError("Failed to load notifications.");
    }
  }, [fetchPage]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      error,
      filters,
      setFilters,
      markRead,
      markAllRead,
      refresh,
      hasMore,
      loadMore,
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      error,
      filters,
      setFilters,
      markRead,
      markAllRead,
      refresh,
      hasMore,
      loadMore,
    ],
  );

  return <NotificationsContext value={value}>{children}</NotificationsContext>;
}
