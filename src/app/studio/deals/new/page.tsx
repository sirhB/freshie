"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewDealPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const rate = Number(form.get("rate") || 0);
    const res = await fetch("/api/studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        brandName: form.get("brandName"),
        platform: form.get("platform"),
        contentType: form.get("contentType"),
        rateCents: Math.round(rate * 100),
        dueDate: form.get("dueDate") || undefined,
        briefSummary: form.get("briefSummary") || undefined,
        guidelines: form.get("guidelines") || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not create deal.");
      return;
    }
    const data = await res.json();
    router.push(`/studio/deals/${data.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/studio/deals" className="text-sm text-ink/55 hover:text-ink">
        ← Deals
      </Link>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">New brand deal</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-6">
        <Field name="title" label="Deal title" required placeholder="Hair serum How-To" />
        <Field name="brandName" label="Brand" required placeholder="Thinbi" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="platform" label="Platform" required placeholder="TikTok + Instagram" />
          <Field name="contentType" label="Content type" required placeholder="How-To" />
          <Field name="rate" label="Rate (USD)" type="number" required placeholder="100" />
          <Field name="dueDate" label="Due date" type="date" />
        </div>
        <label className="block space-y-2 text-sm">
          <span>Brief summary</span>
          <textarea
            name="briefSummary"
            rows={3}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Campaign guidelines</span>
          <textarea
            name="guidelines"
            rows={4}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
          />
        </label>
        {error && <p className="text-sm text-rose">{error}</p>}
        <button
          disabled={loading}
          className="rounded-full bg-berry px-5 py-2.5 text-sm font-semibold text-pearl disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create deal"}
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
      />
    </label>
  );
}
