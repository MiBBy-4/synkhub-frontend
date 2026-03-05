import { Bookmark, ChevronDown, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubscriptions, deleteSubscription } from "../api/github";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import type { GitHubSubscription } from "../types/api";

export function SubscriptionsWidget() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<GitHubSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribingId, setUnsubscribingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!user?.github_connected) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await getSubscriptions(1);
        if (!cancelled) {
          setSubscriptions(response.data);
          setHasMore(response.meta.pagination.next_page !== null);
          setPage(1);
        }
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

  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const response = await getSubscriptions(nextPage);
      setSubscriptions((prev) => [...prev, ...response.data]);
      setHasMore(response.meta.pagination.next_page !== null);
      setPage(nextPage);
    } catch {
      /* keep existing data */
    } finally {
      setLoadingMore(false);
    }
  }, [page]);

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
            {subscriptions.map((sub) => (
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
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
            >
              {loadingMore ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              Load more
            </button>
          )}
          <Link
            to="/settings"
            className="mt-3 block text-center text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            Manage in Settings
          </Link>
        </>
      )}
    </div>
  );
}
