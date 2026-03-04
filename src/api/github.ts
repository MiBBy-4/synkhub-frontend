import type {
  GitHubCommit,
  GitHubNotification,
  GitHubRepository,
  GitHubStats,
  GitHubSubscription,
  NotificationFilters,
  User,
} from "../types/api";
import { del, get, patch, post } from "./client";

export function getGitHubAuthUrl(): Promise<{ url: string }> {
  return get<{ url: string }>("/github/auth");
}

export function postGitHubCallback(params: {
  code: string;
  state: string;
}): Promise<User> {
  return post<User>("/github/callback", params);
}

export function disconnectGitHub(): Promise<User> {
  return del<User>("/github/disconnect");
}

export function getRepositories(): Promise<GitHubRepository[]> {
  return get<GitHubRepository[]>("/github/repositories");
}

export function getSubscriptions(): Promise<GitHubSubscription[]> {
  return get<GitHubSubscription[]>("/github/subscriptions");
}

export function createSubscription(params: {
  github_repo_id: number;
  repo_full_name: string;
}): Promise<GitHubSubscription> {
  return post<GitHubSubscription>("/github/subscriptions", params);
}

export function deleteSubscription(id: number): Promise<void> {
  return del<void>(`/github/subscriptions/${id}`);
}

export function getNotifications(
  filters?: NotificationFilters,
): Promise<GitHubNotification[]> {
  const params: Record<string, string> = {};
  if (filters?.event_type) params.event_type = filters.event_type;
  if (filters?.repo) params.repo = filters.repo;
  if (filters?.read) params.read = filters.read;
  return get<GitHubNotification[]>("/github/notifications", params);
}

export function markNotificationRead(id: number): Promise<GitHubNotification> {
  return patch<GitHubNotification>(`/github/notifications/${id}/read`);
}

export function markAllNotificationsRead(): Promise<void> {
  return patch<void>("/github/notifications/read_all");
}

export function getStats(): Promise<GitHubStats> {
  return get<GitHubStats>("/github/stats");
}

export function getCommits(): Promise<GitHubCommit[]> {
  return get<GitHubCommit[]>("/github/commits");
}
