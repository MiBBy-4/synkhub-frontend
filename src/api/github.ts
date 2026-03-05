import type {
  GitHubCommit,
  GitHubNotification,
  GitHubRepository,
  GitHubStats,
  GitHubSubscription,
  NotificationFilters,
  PaginatedResponse,
  User,
  UserPreferences,
} from "../types/api";
import { del, get, getWithMeta, patch, post } from "./client";

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

export function getRepositories(
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<GitHubRepository[]>> {
  const params: Record<string, string> = {};
  if (page) params.page = String(page);
  if (limit) params.limit = String(limit);
  return getWithMeta<GitHubRepository[]>("/github/repositories", params);
}

export function getSubscriptions(
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<GitHubSubscription[]>> {
  const params: Record<string, string> = {};
  if (page) params.page = String(page);
  if (limit) params.limit = String(limit);
  return getWithMeta<GitHubSubscription[]>("/github/subscriptions", params);
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
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<GitHubNotification[]>> {
  const params: Record<string, string> = {};
  if (filters?.event_type) params.event_type = filters.event_type;
  if (filters?.repo) params.repo = filters.repo;
  if (filters?.read) params.read = filters.read;
  if (page) params.page = String(page);
  if (limit) params.limit = String(limit);
  return getWithMeta<GitHubNotification[]>("/github/notifications", params);
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

export function getCommits(
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<GitHubCommit[]>> {
  const params: Record<string, string> = {};
  if (page) params.page = String(page);
  if (limit) params.limit = String(limit);
  return getWithMeta<GitHubCommit[]>("/github/commits", params);
}

export function getPreferences(): Promise<UserPreferences> {
  return get<UserPreferences>("/users/preferences");
}

export function updatePreferences(
  prefs: Partial<UserPreferences>,
): Promise<UserPreferences> {
  return patch<UserPreferences>("/users/preferences", prefs);
}
