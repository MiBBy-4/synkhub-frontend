import type { ApiErrorResponse, ApiSuccessResponse } from "../types/api";
import { getStoredToken } from "../utils/storage";

const BASE_URL = "/api/v1";

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, errors: string[]) {
    super(errors[0] || "An unknown error occurred");
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = getStoredToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const data = (await response.json()) as ApiErrorResponse;
    throw new ApiError(response.status, data.errors);
  }

  const json = (await response.json()) as ApiSuccessResponse<T>;
  return json.data;
}

export function get<T>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export function del<T>(path: string): Promise<T> {
  return request<T>("DELETE", path);
}
