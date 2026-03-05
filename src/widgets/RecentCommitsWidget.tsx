import { ExternalLink, GitCommitHorizontal, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCommits } from "../api/github";
import { useAuth } from "../hooks/useAuth";
import type { GitHubCommit } from "../types/api";

const MAX_VISIBLE = 8;

export function RecentCommitsWidget() {
  const { user } = useAuth();
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.github_connected) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await getCommits();
        if (!cancelled) setCommits(data);
      } catch {
        if (!cancelled) setError("Failed to load commits.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.github_connected]);

  return (
    <div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light sm:col-span-2">
      <div className="mb-4 flex items-center gap-2">
        <GitCommitHorizontal className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-medium text-text-primary">
          Recent Commits
        </h3>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : commits.length === 0 ? (
        <p className="text-sm text-text-secondary">No commits yet.</p>
      ) : (
        <ul className="space-y-2">
          {commits.slice(0, MAX_VISIBLE).map((c) => (
            <li
              key={c.sha}
              className="flex items-start justify-between gap-2 rounded-lg border border-border p-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">
                  {c.message.split("\n")[0]}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {c.repo_full_name}:{c.branch} ·{" "}
                  {c.author_login ?? c.author_name} ·{" "}
                  <span className="font-mono">{c.sha.slice(0, 7)}</span>
                </p>
              </div>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded p-1 text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary"
                  title="Open on GitHub"
                  aria-label="Open commit on GitHub"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
