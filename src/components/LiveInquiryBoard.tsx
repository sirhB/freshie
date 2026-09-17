"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type InquiryEvent = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

export type InquiryRow = {
  id: string;
  brandName: string;
  contactName: string;
  email: string;
  budget: string | null;
  platforms: string | null;
  message: string;
  status: string;
  source: string;
  igSenderId: string | null;
  autoRepliedAt: string | null;
  convertedDealId: string | null;
  createdAt: string;
  updatedAt: string;
  events?: InquiryEvent[];
};

const STATUSES = ["all", "new", "reviewed", "replied", "converted", "archived"] as const;
const SOURCES = ["all", "web", "instagram", "demo"] as const;

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function LiveInquiryBoard({
  initialInquiries,
  instagramConfigured,
}: {
  initialInquiries: InquiryRow[];
  instagramConfigured: boolean;
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [source, setSource] = useState<(typeof SOURCES)[number]>("all");
  const [live, setLive] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);

  const refresh = useCallback(async () => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (source !== "all") params.set("source", source);
    const res = await fetch(`/api/inquiries?${params.toString()}`);
    if (!res.ok) return;
    const data = await res.json();
    setInquiries(data.inquiries || []);
  }, [status, source]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const es = new EventSource("/api/inquiries/stream");
    es.addEventListener("ready", () => setLive(true));
    es.addEventListener("inquiry", () => {
      setFlash("New inquiry activity");
      void refresh();
      window.setTimeout(() => setFlash(null), 2500);
    });
    es.onerror = () => setLive(false);
    return () => es.close();
  }, [refresh]);

  const counts = useMemo(() => {
    const base = { new: 0, reviewed: 0, replied: 0, converted: 0 };
    for (const item of inquiries) {
      if (item.status in base) {
        base[item.status as keyof typeof base] += 1;
      }
    }
    return base;
  }, [inquiries]);

  async function updateStatus(id: string, next: string) {
    setBusyId(id);
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    await refresh();
    setBusyId(null);
  }

  async function convert(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/inquiries/${id}/convert`, { method: "POST" });
    const data = await res.json();
    setBusyId(null);
    if (res.ok && data.dealId) {
      window.location.href = `/studio/deals/${data.dealId}`;
      return;
    }
    await refresh();
  }

  async function simulateIgDm() {
    setSimulating(true);
    await fetch("/api/instagram/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName: "Lumen Hair Co.",
        senderName: "Lumen partnerships",
        text: "Hey Kayla! Loved your hair how-tos. We need 2 soft glam TikTok UGC videos for our new leave-in mist — can you share rates + turnaround?",
      }),
    });
    setSimulating(false);
    setFlash("Instagram DM ingested");
    await refresh();
    window.setTimeout(() => setFlash(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`status-pill ${live ? "bg-success/15 text-success" : "bg-ink/5 text-ink/50"}`}
          >
            {live ? "Live" : "Reconnecting…"}
          </span>
          {flash && <span className="status-pill bg-blush/50 text-berry">{flash}</span>}
          <span className="text-ink/45">
            {counts.new} new · {counts.reviewed} reviewed · {counts.converted} converted
          </span>
        </div>
        <button
          onClick={simulateIgDm}
          disabled={simulating}
          className="rounded-full border border-berry/30 bg-white/70 px-4 py-2 text-sm font-medium text-berry hover:bg-blush/40 disabled:opacity-60"
        >
          {simulating ? "Ingesting DM…" : "Simulate Instagram DM"}
        </button>
      </div>

      <div className="rounded-2xl border border-ink/8 bg-white/70 p-4 text-sm text-ink/70">
        <p className="font-medium text-ink">
          Instagram bot:{" "}
          {instagramConfigured ? (
            <span className="text-success">connected</span>
          ) : (
            <span className="text-warning">demo mode</span>
          )}
        </p>
        <p className="mt-1">
          Webhook: <code className="text-xs">/api/instagram/webhook</code>. Without Meta tokens,
          use Simulate to watch live intake + auto-reply logging. With tokens, DMs create inquiries
          and send Kayla&apos;s collab auto-reply.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="text-xs uppercase tracking-[0.14em] text-ink/45">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
            className="ml-2 rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-sm normal-case tracking-normal text-ink"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.14em] text-ink/45">
          Source
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as (typeof SOURCES)[number])}
            className="ml-2 rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-sm normal-case tracking-normal text-ink"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <article key={inq.id} className="rounded-2xl border border-ink/8 bg-white/70 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{inq.brandName}</h2>
                  <span className="status-pill bg-blush/40">{inq.source}</span>
                  <span className="status-pill">{inq.status}</span>
                </div>
                <p className="mt-1 text-sm text-ink/55">
                  {inq.contactName} · {inq.email} · {formatWhen(inq.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={inq.status}
                  disabled={busyId === inq.id}
                  onChange={(e) => updateStatus(inq.id, e.target.value)}
                  className="rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs capitalize"
                >
                  {["new", "reviewed", "replied", "converted", "archived"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {inq.convertedDealId ? (
                  <Link
                    href={`/studio/deals/${inq.convertedDealId}`}
                    className="rounded-full bg-berry px-3 py-1 text-xs font-semibold text-pearl"
                  >
                    Open deal
                  </Link>
                ) : (
                  <button
                    disabled={busyId === inq.id}
                    onClick={() => convert(inq.id)}
                    className="rounded-full bg-berry px-3 py-1 text-xs font-semibold text-pearl disabled:opacity-60"
                  >
                    Convert to deal
                  </button>
                )}
              </div>
            </div>

            <p className="mt-3 text-sm text-ink/75">{inq.message}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/50">
              {inq.budget && <span>Budget: {inq.budget}</span>}
              {inq.platforms && <span>Platforms: {inq.platforms}</span>}
              {inq.autoRepliedAt && <span>Auto-replied {formatWhen(inq.autoRepliedAt)}</span>}
              {inq.igSenderId && <span>IG sender: {inq.igSenderId}</span>}
            </div>

            {inq.events && inq.events.length > 0 && (
              <div className="mt-4 border-t border-ink/8 pt-3">
                <p className="text-xs uppercase tracking-[0.14em] text-rose">Activity</p>
                <ul className="mt-2 space-y-1.5 text-xs text-ink/60">
                  {inq.events.map((event) => (
                    <li key={event.id} className="flex flex-wrap gap-2">
                      <span className="font-medium text-ink/80">{event.type}</span>
                      <span>{event.message}</span>
                      <span className="text-ink/40">{formatWhen(event.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
        {inquiries.length === 0 && (
          <p className="text-sm text-ink/50">
            No inquiries for this filter. Submit the public hire form or simulate an Instagram DM.
          </p>
        )}
      </div>
    </div>
  );
}
