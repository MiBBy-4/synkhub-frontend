import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as googleCalendarApi from "../api/googleCalendar";
import { useAuth } from "../hooks/useAuth";

export function GoogleCalendarCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const calledRef = useRef(false);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const state = useMemo(() => searchParams.get("state"), [searchParams]);
  const paramsMissing = !code || !state;

  const [error, setError] = useState<string | null>(
    paramsMissing ? "Missing authorization parameters." : null,
  );

  useEffect(() => {
    if (!code || !state) {
      return;
    }

    if (calledRef.current) {
      return;
    }
    calledRef.current = true;

    googleCalendarApi
      .postGoogleCalendarCallback({ code, state })
      .then(() => refreshUser())
      .then(() => {
        navigate("/settings", { replace: true });
      })
      .catch(() => {
        setError("Failed to connect Google Calendar.");
      });
  }, [code, state, navigate, refreshUser]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-danger">{error}</p>
          <button
            onClick={() => navigate("/settings", { replace: true })}
            className="text-sm text-accent hover:underline"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-text-secondary">Connecting Google Calendar…</p>
    </div>
  );
}
