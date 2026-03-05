import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as githubApi from "../api/github";
import { useAuth } from "../hooks/useAuth";

export function GitHubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

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

    let cancelled = false;

    githubApi
      .postGitHubCallback({ code, state })
      .then(() => refreshUser())
      .then(() => {
        if (!cancelled) {
          navigate("/settings", { replace: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to connect GitHub account.");
        }
      });

    return () => {
      cancelled = true;
    };
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
      <p className="text-text-secondary">Connecting GitHub account…</p>
    </div>
  );
}
