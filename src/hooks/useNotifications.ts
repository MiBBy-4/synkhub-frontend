import { createContext, useContext } from "react";
import type { GitHubNotification, NotificationFilters } from "../types/api";

export interface NotificationsContextValue {
  notifications: GitHubNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filters: NotificationFilters;
  setFilters: (filters: NotificationFilters) => void;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}
