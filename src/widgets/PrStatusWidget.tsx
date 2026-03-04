import { GitPullRequest, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useNotifications } from "../hooks/useNotifications";

const MAX_VISIBLE = 8;

interface PrInfo {
  key: string;
  number: number;
  repo: string;
  title: string;
  status: "open" | "closed" | "merged";
  url: string;
}

function deriveStatus(notification: {
  title: string;
  action: string | null;
}): "open" | "closed" | "merged" {
  const title = notification.title.toLowerCase();
  const action = notification.action?.toLowerCase() ?? "";
  if (
    title.includes("merged") ||
    (action === "closed" && title.includes("merge"))
  )
    return "merged";
  if (action === "closed" || title.includes("closed")) return "closed";
  return "open";
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-green-900 text-green-300",
  closed: "bg-red-900 text-red-300",
  merged: "bg-purple-900 text-purple-300",
};

export function PrStatusWidget() {
  const { notifications, isLoading } = useNotifications();

  const prs = useMemo(() => {
    const prNotifications = notifications.filter(
      (n) => n.event_type === "pull_request",
    );

    const grouped = new Map<string, PrInfo>();
    for (const n of prNotifications) {
      const prMatch = n.title.match(/#(\d+)/);
      if (!prMatch) continue;
      const prNumber = parseInt(prMatch[1], 10);
      const key = `${n.repo_full_name}#${prNumber}`;

      grouped.set(key, {
        key,
        number: prNumber,
        repo: n.repo_full_name,
        title: n.title,
        status: deriveStatus(n),
        url: n.url,
      });
    }

    return [...grouped.values()];
  }, [notifications]);

  return (
    <div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light">
      <div className="mb-4 flex items-center gap-2">
        <GitPullRequest className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-medium text-text-primary">Pull Requests</h3>
        {prs.length > 0 && (
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs font-medium text-white">
            {prs.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : prs.length === 0 ? (
        <p className="text-sm text-text-secondary">No pull requests yet.</p>
      ) : (
        <ul className="space-y-2">
          {prs.slice(0, MAX_VISIBLE).map((pr) => (
            <li
              key={pr.key}
              className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_STYLES[pr.status]}`}
                  >
                    {pr.status}
                  </span>
                  <span className="truncate font-medium text-text-primary">
                    {pr.repo}#{pr.number}
                  </span>
                </div>
              </div>
              {pr.url && (
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-text-secondary transition-colors hover:text-text-primary"
                >
                  Open
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
