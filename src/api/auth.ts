import type { AuthenticatedUser, User } from "../types/api";
import type { LoginCredentials, SignupCredentials } from "../types/auth";
import { get, post } from "./client";

export function login(
  credentials: LoginCredentials,
): Promise<AuthenticatedUser> {
  return post<AuthenticatedUser>("/login", credentials);
}

export function signup(
  credentials: SignupCredentials,
): Promise<AuthenticatedUser> {
  return post<AuthenticatedUser>("/signup", credentials);
}

export function getMe(): Promise<User> {
  return get<User>("/me");
}
