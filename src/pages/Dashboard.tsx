import { useAuth } from "../hooks/useAuth";
import { ActivitySummaryWidget } from "../widgets/ActivitySummaryWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { PrStatusWidget } from "../widgets/PrStatusWidget";
import { RecentCommitsWidget } from "../widgets/RecentCommitsWidget";
import { SubscriptionsWidget } from "../widgets/SubscriptionsWidget";
import { WidgetGrid } from "../widgets/WidgetGrid";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-text-primary">
        Dashboard
      </h2>
      <WidgetGrid>
        <NotificationsWidget />
        {user?.github_connected && <SubscriptionsWidget />}
        {user?.github_connected && <ActivitySummaryWidget />}
        {user?.github_connected && <RecentCommitsWidget />}
        {user?.github_connected && <PrStatusWidget />}
      </WidgetGrid>
    </div>
  );
}
