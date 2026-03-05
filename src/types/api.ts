export interface User {
  id: number;
  email: string;
  github_username: string | null;
  github_connected: boolean;
}

export interface AuthenticatedUser extends User {
  token: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  errors: string[];
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  next_page: number | null;
  previous_page: number | null;
  total_pages?: number;
  total_count?: number;
}

export interface PaginatedResponse<T> {
  data: T;
  meta: { pagination: PaginationMeta };
}

export interface GitHubRepository {
  id: number;
  full_name: string;
  name: string;
  private: boolean;
  owner_login: string;
}

export interface GitHubSubscription {
  id: number;
  github_repo_id: number;
  repo_full_name: string;
  created_at: string;
}

export interface GitHubNotification {
  id: number;
  event_type: string;
  action: string | null;
  title: string;
  url: string;
  repo_full_name: string;
  actor_login: string;
  read: boolean;
  created_at: string;
}

export interface NotificationFilters {
  event_type?: string;
  repo?: string;
  read?: string;
}

export interface GitHubStats {
  total: number;
  unread: number;
  by_event_type: Record<string, number>;
  by_repo: Record<string, number>;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author_name: string;
  author_login: string;
  url: string;
  timestamp: string;
  repo_full_name: string;
  branch: string;
  pusher: string;
}

export interface UserPreferences {
  notification_event_types: string[];
  email_digest_enabled: boolean;
  email_digest_frequency: string;
}
