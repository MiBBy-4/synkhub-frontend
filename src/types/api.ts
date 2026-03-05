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
