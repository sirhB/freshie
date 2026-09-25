"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

export default function NewDealForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState(searchParams.get("template") || "");
  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [rate, setRate] = useState("100");
  const [dueDate, setDueDate] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [talkingPoints, setTalkingPoints] = useState("");
  const [usageRightsDays, setUsageRightsDays] = useState("90");

  useEffect(() => {
    void fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.templates || []) as Template[];
        setTemplates(list);
        const preset = searchParams.get("template");
        if (preset) applyTemplate(list.find((t) => t.id === preset) || null, preset);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTemplate(t: Template | null | undefined, id?: string) {
    if (!t) {
      setTemplateId(id || "");
      return;
    }
    setTemplateId(t.id);
    setTitle(t.name);
    setPlatform(t.platform);
    setContentType(t.contentType);
    setRate(String(t.rateCents / 100));
    setBriefSummary(t.briefSummary || "");
    setGuidelines(t.guidelines || "");
    setTalkingPoints(t.talkingPoints || "");
    setUsageRightsDays(String(t.usageRightsDays ?? 90));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        brandName,
        platform,
        contentType,
        rateCents: Math.round(Number(rate || 0) * 100),
        dueDate: dueDate || undefined,
        publishDate: publishDate || undefined,
        briefSummary: briefSummary || undefined,
        guidelines: guidelines || undefined,
        talkingPoints: talkingPoints || undefined,
        usageRightsDays: usageRightsDays ? Number(usageRightsDays) : undefined,
        templateId: templateId || undefined,
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
        {templates.length > 0 && (
          <label className="block space-y-2 text-sm">
            <span>Start from template</span>
            <select
              value={templateId}
              onChange={(e) => {
                const id = e.target.value;
                applyTemplate(templates.find((t) => t.id === id), id);
              }}
              className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
            >
              <option value="">Blank deal</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <Field label="Deal title" value={title} onChange={setTitle} required placeholder="Hair serum How-To" />
        <Field label="Brand" value={brandName} onChange={setBrandName} required placeholder="Thinbi" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Platform" value={platform} onChange={setPlatform} required placeholder="TikTok + Instagram" />
          <Field label="Content type" value={contentType} onChange={setContentType} required placeholder="How-To" />
          <Field label="Rate (USD)" value={rate} onChange={setRate} type="number" required placeholder="100" />
          <Field label="Due date" value={dueDate} onChange={setDueDate} type="date" />
          <Field label="Go-live / publish" value={publishDate} onChange={setPublishDate} type="date" />
          <Field label="Usage rights (days)" value={usageRightsDays} onChange={setUsageRightsDays} type="number" />
        </div>
        <label className="block space-y-2 text-sm">
          <span>Brief summary</span>
          <textarea
            rows={3}
            value={briefSummary}
            onChange={(e) => setBriefSummary(e.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Talking points</span>
          <textarea
            rows={3}
            value={talkingPoints}
            onChange={(e) => setTalkingPoints(e.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Campaign guidelines</span>
          <textarea
            rows={4}
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
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
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span>{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
      />
    </label>
  );
}
