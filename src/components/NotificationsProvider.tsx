import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [filters, setFilters] = useState<NotificationFilters>({});

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  useEffect(() => {
    if (!githubConnected) {
      setNotifications([]);
      setError(null);
      setIsLoading(false);
      setFilters({});
    }
  }, [githubConnected]);

  const fetchNotifications = useCallback(
    async (currentFilters?: NotificationFilters) => {
      try {
        const data = await githubApi.getNotifications(currentFilters);
        setNotifications(data);
        setError(null);
      } catch {
        setError("Failed to load notifications.");
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
        const data = await githubApi.getNotifications(filters);
        if (!cancelled) {
          setNotifications(data);
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
  }, [githubConnected, filters]);

  useEffect(() => {
    if (!githubConnected) return;

    const id = setInterval(() => fetchNotifications(filters), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [githubConnected, fetchNotifications, filters]);

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
    await fetchNotifications(filters);
  }, [fetchNotifications, filters]);

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
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      error,
      filters,
      markRead,
      markAllRead,
      refresh,
    ],
  );

  return <NotificationsContext value={value}>{children}</NotificationsContext>;
}
