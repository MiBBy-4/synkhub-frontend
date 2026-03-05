import { BarChart3, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { labelFor } from "../utils/eventLabels";

export function ActivitySummaryWidget() {
  const { notifications, isLoading } = useNotifications();

  const breakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of notifications) {
      counts.set(n.event_type, (counts.get(n.event_type) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [notifications]);

  const maxCount = breakdown[0]?.count ?? 1;

  return (
    <div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-medium text-text-primary">
          Activity Summary
        </h3>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-text-secondary">No activity yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {breakdown.map(({ type, count }) => (
              <li key={type} className="text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-text-primary">{labelFor(type)}</span>
                  <span className="text-xs text-text-secondary">{count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-text-secondary">
            {notifications.length} total notification
            {notifications.length === 1 ? "" : "s"}
          </p>
        </>
      )}
    </div>
  );
}
