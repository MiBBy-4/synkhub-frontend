import type { User } from "../types/api";
import { del, get, post } from "./client";

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
