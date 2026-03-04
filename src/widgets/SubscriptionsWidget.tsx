import { Bookmark, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubscriptions, deleteSubscription } from "../api/github";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import type { GitHubSubscription } from "../types/api";

const MAX_VISIBLE = 10;

export function SubscriptionsWidget() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<GitHubSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribingId, setUnsubscribingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.github_connected) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await getSubscriptions();
        if (!cancelled) setSubscriptions(data);
      } catch {
        if (!cancelled) setError("Failed to load subscriptions.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.github_connected]);

  const handleUnsubscribe = useCallback(
    async (id: number) => {
      setUnsubscribingId(id);
      try {
        await deleteSubscription(id);
        setSubscriptions((prev) => prev.filter((s) => s.id !== id));
        addToast("success", "Unsubscribed successfully.");
      } catch {
        addToast("error", "Failed to unsubscribe.");
      } finally {
        setUnsubscribingId(null);
      }
    },
    [addToast],
  );

  return (
    <div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light">
      <div className="mb-4 flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-medium text-text-primary">Subscriptions</h3>
        {!isLoading && subscriptions.length > 0 && (
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs font-medium text-white">
            {subscriptions.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-sm text-text-secondary">No subscriptions yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {subscriptions.slice(0, MAX_VISIBLE).map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
              >
                <span className="truncate font-medium text-text-primary">
                  {sub.repo_full_name}
                </span>
                <button
                  onClick={() => handleUnsubscribe(sub.id)}
                  disabled={unsubscribingId === sub.id}
                  className="shrink-0 rounded p-1 text-text-secondary transition-colors hover:bg-surface-light hover:text-danger disabled:opacity-50"
                  title="Unsubscribe"
                  aria-label={`Unsubscribe from ${sub.repo_full_name}`}
                >
                  {unsubscribingId === sub.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          {subscriptions.length > MAX_VISIBLE && (
            <Link
              to="/settings"
              className="mt-3 block text-center text-xs text-text-secondary transition-colors hover:text-text-primary"
            >
              Manage in Settings
            </Link>
          )}
        </>
      )}
    </div>
  );
}
