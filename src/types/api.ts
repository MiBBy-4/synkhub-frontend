export interface User {
  id: number;
  email: string;
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
