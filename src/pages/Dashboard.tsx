import { ExampleWidget } from "../widgets/ExampleWidget";
import { WidgetGrid } from "../widgets/WidgetGrid";

export function Dashboard() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-text-primary">
        Dashboard
      </h2>
      <WidgetGrid>
        <ExampleWidget title="Recent Activity" />
        <ExampleWidget title="System Status" />
        <ExampleWidget title="Quick Stats" />
      </WidgetGrid>
    </div>
  );
}
