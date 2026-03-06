import type { User } from "../types/api";
import { del, get, post } from "./client";

export function getGoogleCalendarAuthUrl(): Promise<{ url: string }> {
  return get<{ url: string }>("/google_calendar/auth");
}

export function postGoogleCalendarCallback(params: {
  code: string;
  state: string;
}): Promise<User> {
  return post<User>("/google_calendar/callback", params);
}

export function disconnectGoogleCalendar(): Promise<User> {
  return del<User>("/google_calendar/disconnect");
}
