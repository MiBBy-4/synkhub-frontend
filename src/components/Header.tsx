import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <LayoutDashboard className="h-5 w-5 text-accent" />
        <h1 className="text-lg font-semibold text-text-primary">SynkHub</h1>

        {user && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-text-secondary">{user.email}</span>
            <Link
              to="/settings"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
