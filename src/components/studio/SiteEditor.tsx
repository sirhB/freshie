"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioShape, SiteContentShape } from "@/lib/site-content";

const field =
  "mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-berry/40";
const label = "block text-xs uppercase tracking-[0.14em] text-ink/45";

export function SiteEditor({
  initialSite,
  initialItems,
}: {
  initialSite: SiteContentShape;
  initialItems: PortfolioShape[];
}) {
  const router = useRouter();
  const [site, setSite] = useState(initialSite);
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [newItem, setNewItem] = useState({
    title: "",
    category: "Hair",
    description: "",
    platform: "Instagram",
    mediaUrl: "",
    thumbnailUrl: "",
    kind: "reel",
  });

  function setField<K extends keyof SiteContentShape>(key: K, value: SiteContentShape[K]) {
    setSite((s) => ({ ...s, [key]: value }));
  }

  async function saveSite(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setBusy(false);
    setMessage(res.ok ? "Homepage copy saved." : "Could not save site content.");
    if (res.ok) router.refresh();
  }

  async function addItem(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("Could not add work item.");
      return;
    }
    const data = await res.json();
    setItems((prev) => [...prev, data.item]);
    setNewItem({
      title: "",
      category: "Hair",
      description: "",
      platform: "Instagram",
      mediaUrl: "",
      thumbnailUrl: "",
      kind: "reel",
    });
    setMessage("Work item added.");
    router.refresh();
  }

  async function updateItem(item: PortfolioShape, patch: Partial<PortfolioShape>) {
    const next = { ...item, ...patch };
    setItems((prev) => prev.map((i) => (i.id === item.id ? next : i)));
    await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, ...patch }),
    });
    router.refresh();
  }

  async function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-12">
      {message && (
        <p className="rounded-full bg-blush/50 px-4 py-2 text-sm text-berry">{message}</p>
      )}

      <form onSubmit={saveSite} className="space-y-8">
        <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Hero</h2>
          <label className={label}>
            Eyebrow
            <input
              className={field}
              value={site.heroEyebrow}
              onChange={(e) => setField("heroEyebrow", e.target.value)}
            />
          </label>
          <label className={label}>
            Brand headline
            <input
              className={field}
              value={site.heroHeadline}
              onChange={(e) => setField("heroHeadline", e.target.value)}
            />
          </label>
          <label className={label}>
            Tagline
            <textarea
              className={field}
              rows={3}
              value={site.heroTagline}
              onChange={(e) => setField("heroTagline", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Work section</h2>
          <label className={label}>
            Eyebrow
            <input
              className={field}
              value={site.workEyebrow}
              onChange={(e) => setField("workEyebrow", e.target.value)}
            />
          </label>
          <label className={label}>
            Headline
            <input
              className={field}
              value={site.workHeadline}
              onChange={(e) => setField("workHeadline", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">About & rates</h2>
          <label className={label}>
            About eyebrow
            <input
              className={field}
              value={site.aboutEyebrow}
              onChange={(e) => setField("aboutEyebrow", e.target.value)}
            />
          </label>
          <label className={label}>
            About headline
            <input
              className={field}
              value={site.aboutHeadline}
              onChange={(e) => setField("aboutHeadline", e.target.value)}
            />
          </label>
          <label className={label}>
            About body
            <textarea
              className={field}
              rows={4}
              value={site.aboutBody}
              onChange={(e) => setField("aboutBody", e.target.value)}
            />
          </label>
          <label className={label}>
            About bullets (one per line)
            <textarea
              className={field}
              rows={4}
              value={site.aboutBullets.join("\n")}
              onChange={(e) =>
                setField(
                  "aboutBullets",
                  e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                )
              }
            />
          </label>
          <label className={label}>
            Rates eyebrow
            <input
              className={field}
              value={site.ratesEyebrow}
              onChange={(e) => setField("ratesEyebrow", e.target.value)}
            />
          </label>
          <label className={label}>
            Rates (label | value per line)
            <textarea
              className={field}
              rows={3}
              value={site.rates.map((r) => `${r.label} | ${r.value}`).join("\n")}
              onChange={(e) =>
                setField(
                  "rates",
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [labelPart, ...rest] = line.split("|");
                      return {
                        label: (labelPart || "").trim(),
                        value: rest.join("|").trim() || "",
                      };
                    }),
                )
              }
            />
          </label>
          <label className={label}>
            Rates note
            <textarea
              className={field}
              rows={2}
              value={site.ratesNote}
              onChange={(e) => setField("ratesNote", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Socials</h2>
          <label className={label}>
            Eyebrow
            <input
              className={field}
              value={site.socialEyebrow}
              onChange={(e) => setField("socialEyebrow", e.target.value)}
            />
          </label>
          <label className={label}>
            Headline
            <input
              className={field}
              value={site.socialHeadline}
              onChange={(e) => setField("socialHeadline", e.target.value)}
            />
          </label>
          <label className={label}>
            Links (platform | label | url per line)
            <textarea
              className={field}
              rows={4}
              value={site.socials
                .map((s) => `${s.platform} | ${s.label} | ${s.url}`)
                .join("\n")}
              onChange={(e) =>
                setField(
                  "socials",
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const parts = line.split("|").map((p) => p.trim());
                      return {
                        platform: parts[0] || "Link",
                        label: parts[1] || parts[0] || "Link",
                        url: parts[2] || "#",
                      };
                    }),
                )
              }
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/8 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Hire & footer</h2>
          <label className={label}>
            Hire eyebrow
            <input
              className={field}
              value={site.hireEyebrow}
              onChange={(e) => setField("hireEyebrow", e.target.value)}
            />
          </label>
          <label className={label}>
            Hire headline
            <input
              className={field}
              value={site.hireHeadline}
              onChange={(e) => setField("hireHeadline", e.target.value)}
            />
          </label>
          <label className={label}>
            Hire body
            <textarea
              className={field}
              rows={3}
              value={site.hireBody}
              onChange={(e) => setField("hireBody", e.target.value)}
            />
          </label>
          <label className={label}>
            Footer line
            <input
              className={field}
              value={site.footerLine}
              onChange={(e) => setField("footerLine", e.target.value)}
            />
          </label>
        </section>

        <button
          disabled={busy}
          className="rounded-full bg-berry px-6 py-2.5 text-sm font-semibold text-pearl disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save homepage copy"}
        </button>
      </form>

      <section className="space-y-6">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Work / reels</h2>
          <p className="mt-1 text-sm text-ink/55">
            Paste Instagram reel URLs and optional thumbnail paths (e.g. /reels/my-thumb.jpg).
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-2xl border border-ink/8 bg-white/70 p-4 md:grid-cols-[1fr_auto]"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={field}
                  value={item.title}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((i) => (i.id === item.id ? { ...i, title: e.target.value } : i)),
                    )
                  }
                  onBlur={(e) => updateItem(item, { title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  className={field}
                  value={item.mediaUrl || ""}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, mediaUrl: e.target.value } : i,
                      ),
                    )
                  }
                  onBlur={(e) => updateItem(item, { mediaUrl: e.target.value })}
                  placeholder="Instagram reel URL"
                />
                <input
                  className={field}
                  value={item.thumbnailUrl || ""}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, thumbnailUrl: e.target.value } : i,
                      ),
                    )
                  }
                  onBlur={(e) => updateItem(item, { thumbnailUrl: e.target.value })}
                  placeholder="Thumbnail path"
                />
                <input
                  className={field}
                  value={item.category}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, category: e.target.value } : i,
                      ),
                    )
                  }
                  onBlur={(e) => updateItem(item, { category: e.target.value })}
                  placeholder="Category"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-ink/60">
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(e) => updateItem(item, { published: e.target.checked })}
                  />
                  Live
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-full border border-ink/10 px-3 py-1 text-xs text-rose"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={addItem}
          className="grid gap-2 rounded-2xl border border-dashed border-berry/25 bg-blush/20 p-4 sm:grid-cols-2"
        >
          <input
            className={field}
            required
            placeholder="Title"
            value={newItem.title}
            onChange={(e) => setNewItem((s) => ({ ...s, title: e.target.value }))}
          />
          <input
            className={field}
            required
            placeholder="Instagram reel URL"
            value={newItem.mediaUrl}
            onChange={(e) => setNewItem((s) => ({ ...s, mediaUrl: e.target.value }))}
          />
          <input
            className={field}
            placeholder="Thumbnail path (/reels/...)"
            value={newItem.thumbnailUrl}
            onChange={(e) => setNewItem((s) => ({ ...s, thumbnailUrl: e.target.value }))}
          />
          <input
            className={field}
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}
          />
          <input
            className={`${field} sm:col-span-2`}
            placeholder="Short description"
            value={newItem.description}
            onChange={(e) => setNewItem((s) => ({ ...s, description: e.target.value }))}
          />
          <button
            disabled={busy}
            className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl sm:col-span-2"
          >
            Add reel / work item
          </button>
        </form>
      </section>
    </div>
  );
}
