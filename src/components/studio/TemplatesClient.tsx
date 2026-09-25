"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/format";

type Template = {
  id: string;
  name: string;
  platform: string;
  contentType: string;
  rateCents: number;
  briefSummary: string | null;
  guidelines: string | null;
  talkingPoints: string | null;
  usageRightsDays: number | null;
};

export function TemplatesClient({ initial }: { initial: Template[] }) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    platform: "TikTok",
    contentType: "How-To",
    rate: "100",
    briefSummary: "",
  });

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        platform: form.platform,
        contentType: form.contentType,
        rateCents: Math.round(Number(form.rate || 0) * 100),
        briefSummary: form.briefSummary || null,
      }),
    });
    setBusy(false);
    if (!res.ok) return;
    const data = await res.json();
    setTemplates((prev) => [...prev, data.template]);
    setForm({ name: "", platform: "TikTok", contentType: "How-To", rate: "100", briefSummary: "" });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((t) => (
          <article key={t.id} className="rounded-2xl border border-ink/8 bg-white/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
                <p className="mt-1 text-sm text-ink/55">
                  {t.platform} · {t.contentType} · {formatMoney(t.rateCents)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="text-xs text-ink/40 hover:text-rose"
              >
                Delete
              </button>
            </div>
            {t.briefSummary && (
              <p className="mt-3 line-clamp-3 text-sm text-ink/70">{t.briefSummary}</p>
            )}
            <Link
              href={`/studio/deals/new?template=${t.id}`}
              className="mt-4 inline-flex rounded-full bg-berry px-4 py-2 text-sm font-semibold text-pearl"
            >
              Use template
            </Link>
          </article>
        ))}
      </div>

      <form onSubmit={create} className="max-w-xl space-y-3 rounded-2xl border border-ink/8 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">New template</h2>
        <input
          required
          placeholder="Name"
          className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            required
            placeholder="Platform"
            className="rounded-xl border border-ink/10 px-3 py-2 text-sm"
            value={form.platform}
            onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
          />
          <input
            required
            placeholder="Content type"
            className="rounded-xl border border-ink/10 px-3 py-2 text-sm"
            value={form.contentType}
            onChange={(e) => setForm((f) => ({ ...f, contentType: e.target.value }))}
          />
          <input
            type="number"
            required
            placeholder="Rate USD"
            className="rounded-xl border border-ink/10 px-3 py-2 text-sm"
            value={form.rate}
            onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
          />
        </div>
        <textarea
          rows={3}
          placeholder="Brief summary"
          className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm"
          value={form.briefSummary}
          onChange={(e) => setForm((f) => ({ ...f, briefSummary: e.target.value }))}
        />
        <button
          disabled={busy}
          className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save template"}
        </button>
      </form>
    </div>
  );
}
