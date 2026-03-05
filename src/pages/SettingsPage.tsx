import {
  Bell,
  BookMarked,
  ChevronDown,
  Github,
  Loader2,
  Save,
  Search,
  Settings,
  Unplug,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as githubApi from "../api/github";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import type {
  GitHubRepository,
  GitHubSubscription,
  UserPreferences,
} from "../types/api";
import { labelFor } from "../utils/eventLabels";

const SUPPORTED_EVENTS = [
  "push",
  "pull_request",
  "pull_request_review",
  "pull_request_review_comment",
  "issues",
  "issue_comment",
  "check_run",
  "check_suite",
  "create",
  "delete",
  "release",
  "workflow_run",
];

export function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [subscriptions, setSubscriptions] = useState<GitHubSubscription[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [togglingRepoIds, setTogglingRepoIds] = useState<Set<number>>(
    new Set(),
  );
  const [subsError, setSubsError] = useState<string | null>(null);
  const [repoSearch, setRepoSearch] = useState("");
  const [repoPage, setRepoPage] = useState(1);
  const [hasMoreRepos, setHasMoreRepos] = useState(false);
  const [loadingMoreRepos, setLoadingMoreRepos] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const filteredRepos = useMemo(
    () =>
      repoSearch
        ? repos.filter((r) =>
            r.full_name.toLowerCase().includes(repoSearch.toLowerCase()),
          )
        : repos,
    [repos, repoSearch],
  );

  useEffect(() => {
    if (!user?.github_connected) return;

    setLoadingRepos(true);
    Promise.all([githubApi.getRepositories(1), githubApi.getSubscriptions()])
      .then(([repoResponse, subResponse]) => {
        setRepos(repoResponse.data);
        setHasMoreRepos(repoResponse.meta.pagination.next_page !== null);
        setRepoPage(1);
        setSubscriptions(subResponse.data);
      })
      .catch(() => setSubsError("Failed to load repositories."))
      .finally(() => setLoadingRepos(false));
  }, [user?.github_connected]);

  useEffect(() => {
    if (!user?.github_connected) return;

    setLoadingPrefs(true);
    githubApi
      .getPreferences()
      .then((data) => setPreferences(data))
      .catch(() => addToast("error", "Failed to load preferences."))
      .finally(() => setLoadingPrefs(false));
  }, [user?.github_connected, addToast]);

  const handleLoadMoreRepos = useCallback(async () => {
    const nextPage = repoPage + 1;
    setLoadingMoreRepos(true);
    try {
      const response = await githubApi.getRepositories(nextPage);
      setRepos((prev) => [...prev, ...response.data]);
      setHasMoreRepos(response.meta.pagination.next_page !== null);
      setRepoPage(nextPage);
    } catch {
      /* keep existing data */
    } finally {
      setLoadingMoreRepos(false);
    }
  }, [repoPage]);

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
      addToast("success", "GitHub disconnected.");
    } catch {
      setError("Failed to disconnect GitHub.");
      addToast("error", "Failed to disconnect GitHub.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const subscriptionForRepo = (repoId: number) =>
    subscriptions.find((s) => s.github_repo_id === repoId);

  const handleToggleSubscription = async (repo: GitHubRepository) => {
    setSubsError(null);
    setTogglingRepoIds((prev) => new Set(prev).add(repo.id));
    const existing = subscriptionForRepo(repo.id);
    try {
      if (existing) {
        await githubApi.deleteSubscription(existing.id);
        setSubscriptions((prev) => prev.filter((s) => s.id !== existing.id));
      } else {
        const sub = await githubApi.createSubscription({
          github_repo_id: repo.id,
          repo_full_name: repo.full_name,
        });
        setSubscriptions((prev) => [...prev, sub]);
      }
    } catch {
      const msg = existing
        ? "Failed to unsubscribe from repository."
        : "Failed to subscribe to repository.";
      setSubsError(msg);
      addToast("error", msg);
    } finally {
      setTogglingRepoIds((prev) => {
        const next = new Set(prev);
        next.delete(repo.id);
        return next;
      });
    }
  };

  const handleToggleEventType = (eventType: string) => {
    if (!preferences) return;
    const current = preferences.notification_event_types;
    const updated = current.includes(eventType)
      ? current.filter((t) => t !== eventType)
      : [...current, eventType];
    setPreferences({ ...preferences, notification_event_types: updated });
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;
    setSavingPrefs(true);
    try {
      const updated = await githubApi.updatePreferences(preferences);
      setPreferences(updated);
      addToast("success", "Preferences saved.");
    } catch {
      addToast("error", "Failed to save preferences.");
    } finally {
      setSavingPrefs(false);
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

      {user?.github_connected && (
        <section className="mt-8">
          <h3 className="mb-4 text-lg font-medium text-text-primary">
            Repository Subscriptions
          </h3>

          {subsError && <p className="mb-3 text-sm text-danger">{subsError}</p>}

          {loadingRepos ? (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading repositories…
            </div>
          ) : repos.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No repositories found.
            </p>
          ) : (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search repositories…"
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                {filteredRepos.map((repo) => {
                  const sub = subscriptionForRepo(repo.id);
                  const isToggling = togglingRepoIds.has(repo.id);
                  return (
                    <div
                      key={repo.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex items-center gap-3">
                        <BookMarked className="h-4 w-4 text-text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {repo.full_name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {repo.private ? "Private" : "Public"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleSubscription(repo)}
                        disabled={isToggling}
                        className={
                          sub
                            ? "flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-light hover:text-text-primary disabled:opacity-50"
                            : "flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                        }
                      >
                        {isToggling ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        {sub ? "Unsubscribe" : "Subscribe"}
                      </button>
                    </div>
                  );
                })}
              </div>
              {hasMoreRepos && (
                <button
                  onClick={handleLoadMoreRepos}
                  disabled={loadingMoreRepos}
                  className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                >
                  {loadingMoreRepos ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  Load more repositories
                </button>
              )}
            </>
          )}
        </section>
      )}

      {user?.github_connected && (
        <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-text-primary">
            <Bell className="h-5 w-5 text-accent" />
            Notification Preferences
          </h3>

          {loadingPrefs ? (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading preferences…
            </div>
          ) : preferences ? (
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-text-primary">
                  Event types that generate notifications
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SUPPORTED_EVENTS.map((eventType) => (
                    <label
                      key={eventType}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <input
                        type="checkbox"
                        checked={preferences.notification_event_types.includes(
                          eventType,
                        )}
                        onChange={() => handleToggleEventType(eventType)}
                        className="rounded border-border accent-accent"
                      />
                      {labelFor(eventType)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4 border-t border-border pt-4">
                <label className="flex items-center gap-2 text-sm text-text-primary">
                  <input
                    type="checkbox"
                    checked={preferences.email_digest_enabled}
                    onChange={() =>
                      setPreferences({
                        ...preferences,
                        email_digest_enabled: !preferences.email_digest_enabled,
                      })
                    }
                    className="rounded border-border accent-accent"
                  />
                  Enable email digest
                </label>
              </div>

              {preferences.email_digest_enabled && (
                <div className="mb-4">
                  <label className="mb-1 block text-sm text-text-secondary">
                    Digest frequency
                  </label>
                  <select
                    value={preferences.email_digest_frequency}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        email_digest_frequency: e.target.value,
                      })
                    }
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}

              <button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {savingPrefs ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Preferences
              </button>
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
