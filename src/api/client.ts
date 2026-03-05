import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginatedResponse,
} from "../types/api";
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

  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json()) as ApiSuccessResponse<T>;
  return json.data;
}

async function requestWithMeta<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<PaginatedResponse<T>> {
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

  const json = (await response.json()) as PaginatedResponse<T>;
  return json;
}

export function get<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  if (params) {
    const query = new URLSearchParams(params).toString();
    if (query) return request<T>("GET", `${path}?${query}`);
  }
  return request<T>("GET", path);
}

export function getWithMeta<T>(
  path: string,
  params?: Record<string, string>,
): Promise<PaginatedResponse<T>> {
  let fullPath = path;
  if (params) {
    const query = new URLSearchParams(params).toString();
    if (query) fullPath = `${path}?${query}`;
  }
  return requestWithMeta<T>("GET", fullPath);
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export function del<T>(path: string): Promise<T> {
  return request<T>("DELETE", path);
}

export function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("PATCH", path, body);
}
