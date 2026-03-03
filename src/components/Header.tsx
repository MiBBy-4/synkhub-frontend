import { LayoutDashboard } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <LayoutDashboard className="h-5 w-5 text-accent" />
        <h1 className="text-lg font-semibold text-text-primary">SynkHub</h1>
      </div>
    </header>
  );
}
