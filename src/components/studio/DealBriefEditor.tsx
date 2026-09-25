"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";

export function DealBriefEditor({
  dealId,
  briefSummary,
  guidelines,
  talkingPoints,
  publishDate,
  dueDate,
  usageRightsDays,
  paymentLinkUrl,
  invoiceNumber,
}: {
  dealId: string;
  briefSummary: string;
  guidelines: string;
  talkingPoints: string;
  publishDate: string;
  dueDate: string;
  usageRightsDays: string;
  paymentLinkUrl: string;
  invoiceNumber: string | null;
}) {
  const router = useRouter();
  const [brief, setBrief] = useState(briefSummary);
  const [guide, setGuide] = useState(guidelines);
  const [talk, setTalk] = useState(talkingPoints);
  const [goLive, setGoLive] = useState(publishDate);
  const [due, setDue] = useState(dueDate);
  const [rights, setRights] = useState(usageRightsDays);
  const [payLink, setPayLink] = useState(paymentLinkUrl);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/studio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "deal_brief",
        id: dealId,
        briefSummary: brief,
        guidelines: guide,
        talkingPoints: talk,
        publishDate: goLive || null,
        dueDate: due || null,
        usageRightsDays: rights ? Number(rights) : null,
        paymentLinkUrl: payLink || null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg("Could not save brief.");
      return;
    }
    setMsg("Brief saved.");
    router.refresh();
  }

  async function openInvoice() {
    window.open(`/api/deals/${dealId}/invoice`, "_blank");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Editable brief</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openInvoice}
            className="rounded-full border border-ink/10 px-3 py-1.5 text-xs"
          >
            {invoiceNumber ? `Invoice ${invoiceNumber}` : "Generate invoice"}
          </button>
          <a
            href="/api/rate-card"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/10 px-3 py-1.5 text-xs"
          >
            Rate card PDF
          </a>
        </div>
      </div>

      <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
        Summary
        <textarea
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal text-ink"
          rows={4}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
      </label>
      <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
        Talking points
        <textarea
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal text-ink"
          rows={3}
          value={talk}
          onChange={(e) => setTalk(e.target.value)}
        />
      </label>
      <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
        Guidelines
        <textarea
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal text-ink"
          rows={4}
          value={guide}
          onChange={(e) => setGuide(e.target.value)}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
          Due date
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
          Go-live / publish
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal"
            value={goLive}
            onChange={(e) => setGoLive(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
          Usage rights (days)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal"
            value={rights}
            onChange={(e) => setRights(e.target.value)}
          />
        </label>
      </div>
      <label className="block space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
        Payment link
        <input
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm normal-case tracking-normal"
          value={payLink}
          onChange={(e) => setPayLink(e.target.value)}
          placeholder="https://pay.example.com/…"
        />
      </label>
      {msg && <p className="text-sm text-berry">{msg}</p>}
      <button
        disabled={busy}
        className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save brief"}
      </button>
      <p className="text-xs text-ink/45">
        Calendar uses due + go-live dates. Current go-live: {formatDate(goLive || null)}.
      </p>
    </form>
  );
}

export function DeliverablePublishDate({
  id,
  publishDate,
}: {
  id: string;
  publishDate: string;
}) {
  const router = useRouter();
  return (
    <input
      type="date"
      defaultValue={publishDate}
      onChange={async (e) => {
        await fetch("/api/studio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "deliverable",
            id,
            publishDate: e.target.value || null,
          }),
        });
        router.refresh();
      }}
      className="rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs"
      title="Go-live date"
    />
  );
}
