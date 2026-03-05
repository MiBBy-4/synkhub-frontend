import { Github, Settings, Unplug } from "lucide-react";
import { useState } from "react";
import * as githubApi from "../api/github";
import { useAuth } from "../hooks/useAuth";

export function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const { url } = await githubApi.getGitHubAuthUrl();
      window.location.href = url;
    } catch {
      setError("Failed to start GitHub connection.");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setError(null);
    setIsDisconnecting(true);
    try {
      await githubApi.disconnectGitHub();
      await refreshUser();
    } catch {
      setError("Failed to disconnect GitHub.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
      </div>

      <section>
        <h3 className="mb-4 text-lg font-medium text-text-primary">
          Integrations
        </h3>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6 text-text-secondary" />
              <div>
                <p className="font-medium text-text-primary">GitHub</p>
                <p className="text-sm text-text-secondary">
                  {user?.github_connected
                    ? `Connected as ${user.github_username}`
                    : "Not connected"}
                </p>
              </div>
            </div>

            {user?.github_connected ? (
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary disabled:opacity-50"
              >
                <Unplug className="h-4 w-4" />
                {isDisconnecting ? "Disconnecting…" : "Disconnect"}
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                <Github className="h-4 w-4" />
                {isConnecting ? "Connecting…" : "Connect"}
              </button>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </div>
      </section>
    </div>
  );
}
