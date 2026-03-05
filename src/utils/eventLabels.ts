export const EVENT_LABELS: Record<string, string> = {
  push: "Pushes",
  pull_request: "Pull Requests",
  issues: "Issues",
  issue_comment: "Comments",
  pull_request_review: "Reviews",
  create: "Branches/Tags Created",
  delete: "Branches/Tags Deleted",
  fork: "Forks",
  watch: "Stars",
  release: "Releases",
};

export function labelFor(eventType: string): string {
  return EVENT_LABELS[eventType] ?? eventType.replaceAll("_", " ");
}
