"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SettingsUser = { id: string; email: string; name: string; role: string };
type InstagramStatus = {
  configured: boolean;
  autoReplyEnabled: boolean;
  verifyToken: string;
  webhookUrl: string;
  hasAppSecret: boolean;
  hasPageToken: boolean;
  hasBusinessId: boolean;
};

export function SettingsClient({
  user,
  instagram,
}: {
  user: SettingsUser;
  instagram: InstagramStatus;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not update profile.");
      return;
    }
    setMessage("Profile saved.");
    router.refresh();
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not change password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setMessage("Password updated.");
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="space-y-10">
      {(message || error) && (
        <p
          className={`rounded-full px-4 py-2 text-sm ${
            error ? "bg-rose/15 text-berry" : "bg-blush/50 text-berry"
          }`}
        >
          {error || message}
        </p>
      )}

      <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Account</h2>
        <p className="text-sm text-ink/55">
          Signed in as <span className="font-medium text-ink">{user.email}</span> · {user.role}
        </p>
        <form onSubmit={saveProfile} className="max-w-md space-y-3">
          <label className="block text-xs uppercase tracking-[0.14em] text-ink/45">
            Display name
            <input
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button
            disabled={busy}
            className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
          >
            Save name
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Change password</h2>
        <form onSubmit={changePassword} className="max-w-md space-y-3">
          <label className="block text-xs uppercase tracking-[0.14em] text-ink/45">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.14em] text-ink/45">
            New password
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.14em] text-ink/45">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <button
            disabled={busy}
            className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
          >
            Update password
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Instagram Messaging</h2>
          <span
            className={`status-pill ${
              instagram.configured ? "bg-success/15 text-success" : "bg-ink/5 text-ink/50"
            }`}
          >
            {instagram.configured ? "Connected" : "Not connected"}
          </span>
        </div>
        <p className="max-w-2xl text-sm text-ink/60">
          Brand DMs create studio inquiries automatically. Tokens stay in Vercel env — this panel
          only shows connection status and the webhook URL Meta needs.
        </p>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-ink/8 bg-pearl/60 px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">App secret</dt>
            <dd>{instagram.hasAppSecret ? "Set" : "Missing"}</dd>
          </div>
          <div className="rounded-xl border border-ink/8 bg-pearl/60 px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">Page access token</dt>
            <dd>{instagram.hasPageToken ? "Set" : "Missing"}</dd>
          </div>
          <div className="rounded-xl border border-ink/8 bg-pearl/60 px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">Business account ID</dt>
            <dd>{instagram.hasBusinessId ? "Set" : "Missing"}</dd>
          </div>
          <div className="rounded-xl border border-ink/8 bg-pearl/60 px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">Auto-reply</dt>
            <dd>{instagram.autoReplyEnabled ? "On" : "Off"}</dd>
          </div>
        </dl>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-ink/45">Webhook callback URL</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="max-w-full flex-1 truncate rounded-xl bg-ink/5 px-3 py-2 text-xs">
              {instagram.webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => copy(instagram.webhookUrl, "url")}
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs"
            >
              {copied === "url" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink/45">Verify token</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-xl bg-ink/5 px-3 py-2 text-xs">{instagram.verifyToken}</code>
            <button
              type="button"
              onClick={() => copy(instagram.verifyToken, "token")}
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs"
            >
              {copied === "token" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <ol className="list-decimal space-y-2 pl-5 text-sm text-ink/70">
          <li>Use an Instagram Professional account linked to a Facebook Page.</li>
          <li>
            In Meta Developer App → Instagram / Messenger, subscribe to <code>messages</code>.
          </li>
          <li>Paste the webhook URL and verify token above into Meta.</li>
          <li>
            Set Vercel env: <code>INSTAGRAM_APP_SECRET</code>,{" "}
            <code>INSTAGRAM_PAGE_ACCESS_TOKEN</code>, <code>INSTAGRAM_BUSINESS_ACCOUNT_ID</code>,{" "}
            <code>INSTAGRAM_VERIFY_TOKEN</code>, <code>INSTAGRAM_AUTO_REPLY=true</code>.
          </li>
          <li>Send a test DM → it appears under Inquiries → convert to a deal.</li>
        </ol>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/studio/inquiries"
            className="rounded-full bg-berry px-4 py-2 text-sm font-semibold text-pearl"
          >
            Open inquiries
          </Link>
          <Link href="/studio/getting-started" className="rounded-full border border-ink/10 px-4 py-2 text-sm">
            Getting started guide
          </Link>
        </div>
      </section>
    </div>
  );
}
