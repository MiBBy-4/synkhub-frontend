import type { ReactNode } from "react";

interface WidgetGridProps {
  children: ReactNode;
}

export function WidgetGrid({ children }: WidgetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
