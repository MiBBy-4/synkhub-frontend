import { Activity } from "lucide-react";

interface ExampleWidgetProps {
  title: string;
}

export function ExampleWidget({ title }: ExampleWidgetProps) {
  return (
    <div className="rounded-widget border border-border bg-surface p-5 transition-colors hover:bg-surface-light">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">
        Widget content will be rendered here.
      </p>
    </div>
  );
}
