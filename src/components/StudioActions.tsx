"use client";

import { useRouter } from "next/navigation";
import { DELIVERABLE_STATUSES, DEAL_STATUSES } from "@/lib/format";

export function ChecklistToggle({ id, done, label }: { id: string; done: boolean; label: string }) {
  const router = useRouter();

  async function toggle() {
    await fetch("/api/studio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "checklist", id, done: !done }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="flex w-full items-center gap-3 rounded-xl border border-ink/8 bg-white/60 px-3 py-2.5 text-left text-sm transition hover:border-rose/40"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
          done ? "border-success bg-success text-pearl" : "border-ink/20"
        }`}
      >
        {done ? "✓" : ""}
      </span>
      <span className={done ? "text-ink/45 line-through" : ""}>{label}</span>
    </button>
  );
}

export function DeliverableStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      onChange={async (e) => {
        await fetch("/api/studio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "deliverable", id, status: e.target.value }),
        });
        router.refresh();
      }}
      className="rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs capitalize outline-none"
    >
      {DELIVERABLE_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function DealControls({
  id,
  status,
  paymentStatus,
  productShipped,
  productReceived,
}: {
  id: string;
  status: string;
  paymentStatus: string;
  productShipped: boolean;
  productReceived: boolean;
}) {
  const router = useRouter();

  async function patch(payload: Record<string, unknown>) {
    await fetch("/api/studio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "deal", id, ...payload }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
        Deal status
        <select
          defaultValue={status}
          onChange={(e) => patch({ status: e.target.value })}
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm capitalize text-ink normal-case tracking-normal"
        >
          {DEAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1 text-xs uppercase tracking-[0.14em] text-ink/45">
        Payment
        <select
          defaultValue={paymentStatus}
          onChange={(e) => patch({ paymentStatus: e.target.value })}
          className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm capitalize text-ink normal-case tracking-normal"
        >
          {["unpaid", "invoiced", "paid", "overdue"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={() => patch({ productShipped: !productShipped })}
        className="rounded-xl border border-ink/10 bg-white/70 px-3 py-2 text-sm"
      >
        Product shipped: {productShipped ? "Yes" : "No"}
      </button>
      <button
        onClick={() => patch({ productReceived: !productReceived })}
        className="rounded-xl border border-ink/10 bg-white/70 px-3 py-2 text-sm"
      >
        Product received: {productReceived ? "Yes" : "No"}
      </button>
    </div>
  );
}

export function InquiryStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  return (
    <select
      defaultValue={status}
      onChange={async (e) => {
        await fetch("/api/studio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "inquiry", id, status: e.target.value }),
        });
        router.refresh();
      }}
      className="rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs capitalize"
    >
      {["new", "reviewed", "replied", "archived"].map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
