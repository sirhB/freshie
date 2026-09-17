export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function daysUntil(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const ms = d.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export const DEAL_STATUSES = [
  "inquiry",
  "negotiating",
  "active",
  "delivered",
  "paid",
  "archived",
] as const;

export const DELIVERABLE_STATUSES = [
  "todo",
  "filming",
  "editing",
  "review",
  "revisions",
  "delivered",
  "live",
] as const;

export function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}
