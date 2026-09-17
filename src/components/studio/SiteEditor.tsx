"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioShape, SiteContentShape, SiteRate, SiteSocial } from "@/lib/site-content";

const editRing =
  "rounded-md border border-transparent bg-transparent outline-none transition hover:border-dashed hover:border-berry/45 focus:border-berry/55 focus:bg-white/10";
const editRingDark =
  "rounded-md border border-transparent bg-transparent outline-none transition hover:border-dashed hover:border-pearl/40 focus:border-pearl/50 focus:bg-ink/10";

async function uploadSiteImage(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  const res = await fetch("/api/site/media", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

function EditableText({
  value,
  onChange,
  onBlur,
  className = "",
  multiline = false,
  rows = 3,
  placeholder,
  dark = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;
  className?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  dark?: boolean;
}) {
  const ring = dark ? editRingDark : editRing;
  const shared = `w-full resize-none ${ring} ${className}`;
  if (multiline) {
    return (
      <textarea
        className={shared}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
      />
    );
  }
  return (
    <input
      className={shared}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur?.(e.target.value)}
    />
  );
}

function ImageUploadButton({
  onUploaded,
  label = "Upload image",
  className = "",
}: {
  onUploaded: (url: string) => void | Promise<void>;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadSiteImage(file);
      await onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="rounded-full bg-pearl/95 px-4 py-2 text-xs font-semibold text-violet shadow-md backdrop-blur transition hover:bg-white disabled:opacity-60"
      >
        {busy ? "Uploading…" : label}
      </button>
      {error && <p className="mt-1 text-xs text-rose">{error}</p>}
    </div>
  );
}

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
  const [dirty, setDirty] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "New reel",
    category: "Hair",
    description: "",
    platform: "Instagram",
    mediaUrl: "",
    thumbnailUrl: "",
    kind: "reel",
  });

  function setField<K extends keyof SiteContentShape>(key: K, value: SiteContentShape[K]) {
    setSite((s) => ({ ...s, [key]: value }));
    setDirty(true);
  }

  function updateRate(index: number, patch: Partial<SiteRate>) {
    setField(
      "rates",
      site.rates.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  function updateSocial(index: number, patch: Partial<SiteSocial>) {
    setField(
      "socials",
      site.socials.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  async function saveSite(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("Could not save homepage.");
      return;
    }
    setDirty(false);
    setMessage("Homepage saved — live on the public site.");
    router.refresh();
  }

  async function addItem(e: FormEvent) {
    e.preventDefault();
    if (!newItem.thumbnailUrl) {
      setMessage("Upload a thumbnail image before adding a reel.");
      return;
    }
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
      title: "New reel",
      category: "Hair",
      description: "",
      platform: "Instagram",
      mediaUrl: "",
      thumbnailUrl: "",
      kind: "reel",
    });
    setAdding(false);
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
    <div className="space-y-4">
      <div className="sticky top-[4.5rem] z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-berry/15 bg-pearl/95 px-4 py-3 shadow-[0_8px_30px_-18px_rgba(74,37,112,0.45)] backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-rose">Visual editor</p>
          <p className="text-sm text-ink/65">
            Click any text to edit. Upload images for the hero and reel thumbnails.
            {dirty ? " · Unsaved changes" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {message && <p className="text-sm text-berry">{message}</p>}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink/70 hover:border-berry/30 hover:text-berry"
          >
            View live site
          </a>
          <button
            type="button"
            disabled={busy}
            onClick={() => saveSite()}
            className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save homepage"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white shadow-[0_24px_60px_-36px_rgba(74,37,112,0.35)]">
        {/* HERO */}
        <section className="relative min-h-[70vh] overflow-hidden text-pearl">
          <Image
            src={site.heroImageUrl || "/kayla-hero.jpg"}
            alt="Hero preview"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%] md:object-[72%_18%]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-violet/95 via-violet/55 to-violet/20"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-violet/40"
            aria-hidden
          />
          <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
            <ImageUploadButton
              label="Replace hero photo"
              onUploaded={(url) => setField("heroImageUrl", url)}
            />
          </div>
          <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 pb-12 pt-24 md:justify-center md:pb-16">
            <div className="max-w-xl md:max-w-lg">
              <EditableText
                dark
                className="text-sm uppercase tracking-[0.28em] text-champagne/90"
                value={site.heroEyebrow}
                onChange={(v) => setField("heroEyebrow", v)}
              />
              <EditableText
                dark
                className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-pearl md:text-7xl"
                value={site.heroHeadline}
                onChange={(v) => setField("heroHeadline", v)}
              />
              <EditableText
                dark
                multiline
                rows={3}
                className="mt-5 text-base text-pearl/90 md:text-lg"
                value={site.heroTagline}
                onChange={(v) => setField("heroTagline", v)}
              />
              <div className="mt-7 flex flex-wrap gap-3 opacity-80">
                <span className="rounded-full bg-pearl px-6 py-3 text-sm font-semibold text-violet">
                  Hire Kayla
                </span>
                <span className="rounded-full border border-pearl/35 px-6 py-3 text-sm text-pearl">
                  Watch reels
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section className="relative bg-pearl px-6 py-16 md:py-20">
          <div className="soft-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-6xl">
            <EditableText
              className="text-sm uppercase tracking-[0.22em] text-rose"
              value={site.workEyebrow}
              onChange={(v) => setField("workEyebrow", v)}
            />
            <EditableText
              multiline
              rows={2}
              className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl"
              value={site.workHeadline}
              onChange={(v) => setField("workHeadline", v)}
            />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-[1.25rem] border border-ink/8 bg-ink/5"
                >
                  <div className="relative aspect-[9/14] w-full">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-violet to-berry" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                    <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                      <ImageUploadButton
                        label="Upload thumb"
                        onUploaded={(url) => updateItem(item, { thumbnailUrl: url })}
                      />
                      <label className="flex items-center gap-1.5 rounded-full bg-ink/55 px-3 py-1.5 text-[11px] text-pearl backdrop-blur">
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
                        className="rounded-full bg-rose/90 px-3 py-1.5 text-[11px] font-semibold text-pearl"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 space-y-1 p-3 text-pearl">
                      <EditableText
                        dark
                        className="text-[10px] uppercase tracking-[0.18em] text-champagne"
                        value={item.category}
                        onChange={(v) =>
                          setItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, category: v } : i)),
                          )
                        }
                        onBlur={(v) => updateItem(item, { category: v })}
                      />
                      <EditableText
                        dark
                        className="font-[family-name:var(--font-display)] text-xl leading-tight"
                        value={item.title}
                        onChange={(v) =>
                          setItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, title: v } : i)),
                          )
                        }
                        onBlur={(v) => updateItem(item, { title: v })}
                      />
                      <EditableText
                        dark
                        multiline
                        rows={2}
                        className="text-xs text-pearl/80"
                        value={item.description || ""}
                        placeholder="Short description"
                        onChange={(v) =>
                          setItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id ? { ...i, description: v } : i,
                            ),
                          )
                        }
                        onBlur={(v) => updateItem(item, { description: v })}
                      />
                      <EditableText
                        dark
                        className="text-[11px] text-pearl/60"
                        value={item.mediaUrl || ""}
                        placeholder="Optional Instagram reel link"
                        onChange={(v) =>
                          setItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, mediaUrl: v } : i)),
                          )
                        }
                        onBlur={(v) => updateItem(item, { mediaUrl: v })}
                      />
                    </div>
                  </div>
                </article>
              ))}

              {adding ? (
                <form
                  onSubmit={addItem}
                  className="relative overflow-hidden rounded-[1.25rem] border-2 border-dashed border-berry/35 bg-blush/30"
                >
                  <div className="relative aspect-[9/14] w-full p-3">
                    {newItem.thumbnailUrl ? (
                      <Image
                        src={newItem.thumbnailUrl}
                        alt="New thumb"
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mist to-lilac/40">
                        <ImageUploadButton
                          label="Upload thumbnail"
                          onUploaded={(url) => setNewItem((s) => ({ ...s, thumbnailUrl: url }))}
                        />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-10">
                      {newItem.thumbnailUrl && (
                        <ImageUploadButton
                          label="Change thumb"
                          onUploaded={(url) => setNewItem((s) => ({ ...s, thumbnailUrl: url }))}
                        />
                      )}
                      <input
                        required
                        className={`${editRingDark} w-full font-[family-name:var(--font-display)] text-xl text-pearl`}
                        value={newItem.title}
                        onChange={(e) => setNewItem((s) => ({ ...s, title: e.target.value }))}
                        placeholder="Title"
                      />
                      <input
                        className={`${editRingDark} w-full text-xs text-pearl/80`}
                        value={newItem.category}
                        onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}
                        placeholder="Category"
                      />
                      <input
                        className={`${editRingDark} w-full text-xs text-pearl/70`}
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem((s) => ({ ...s, description: e.target.value }))
                        }
                        placeholder="Description"
                      />
                      <input
                        className={`${editRingDark} w-full text-[11px] text-pearl/55`}
                        value={newItem.mediaUrl}
                        onChange={(e) => setNewItem((s) => ({ ...s, mediaUrl: e.target.value }))}
                        placeholder="Optional Instagram reel link"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={busy}
                          className="rounded-full bg-pearl px-4 py-1.5 text-xs font-semibold text-violet"
                        >
                          Add reel
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdding(false)}
                          className="rounded-full border border-pearl/30 px-4 py-1.5 text-xs text-pearl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-[1.25rem] border-2 border-dashed border-berry/30 bg-blush/20 text-berry transition hover:border-berry/50 hover:bg-blush/35"
                >
                  <span className="text-3xl leading-none">+</span>
                  <span className="text-sm font-semibold">Add reel with image</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SOCIALS */}
        <section className="border-t border-berry/10 bg-mist/40 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <EditableText
              className="text-sm uppercase tracking-[0.22em] text-rose"
              value={site.socialEyebrow}
              onChange={(v) => setField("socialEyebrow", v)}
            />
            <EditableText
              className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink"
              value={site.socialHeadline}
              onChange={(v) => setField("socialHeadline", v)}
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {site.socials.map((social, index) => (
                <div
                  key={`${social.platform}-${index}`}
                  className="space-y-1 rounded-2xl border border-berry/15 bg-white/80 p-4"
                >
                  <EditableText
                    className="text-xs uppercase tracking-[0.16em] text-ink/45"
                    value={social.platform}
                    onChange={(v) => updateSocial(index, { platform: v })}
                  />
                  <EditableText
                    className="font-semibold text-berry"
                    value={social.label}
                    onChange={(v) => updateSocial(index, { label: v })}
                  />
                  <EditableText
                    className="text-xs text-ink/55"
                    value={social.url}
                    onChange={(v) => updateSocial(index, { url: v })}
                  />
                  <button
                    type="button"
                    className="text-[11px] text-rose"
                    onClick={() =>
                      setField(
                        "socials",
                        site.socials.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 rounded-full border border-berry/25 px-4 py-2 text-sm text-berry"
              onClick={() =>
                setField("socials", [
                  ...site.socials,
                  { platform: "Link", label: "New link", url: "https://" },
                ])
              }
            >
              + Add social link
            </button>
          </div>
        </section>

        {/* ABOUT + RATES */}
        <section className="relative overflow-hidden px-6 py-16 md:py-20">
          <div
            className="absolute inset-0 bg-gradient-to-br from-mist via-blush/40 to-lilac/30"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <EditableText
                className="text-sm uppercase tracking-[0.22em] text-berry"
                value={site.aboutEyebrow}
                onChange={(v) => setField("aboutEyebrow", v)}
              />
              <EditableText
                multiline
                rows={2}
                className="mt-2 font-[family-name:var(--font-display)] text-4xl md:text-5xl"
                value={site.aboutHeadline}
                onChange={(v) => setField("aboutHeadline", v)}
              />
              <EditableText
                multiline
                rows={5}
                className="mt-4 max-w-xl text-ink/70"
                value={site.aboutBody}
                onChange={(v) => setField("aboutBody", v)}
              />
              <ul className="mt-8 space-y-3">
                {site.aboutBullets.map((bullet, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-berry" />
                    <div className="flex-1 space-y-1">
                      <EditableText
                        multiline
                        rows={2}
                        className="text-sm text-ink/80"
                        value={bullet}
                        onChange={(v) =>
                          setField(
                            "aboutBullets",
                            site.aboutBullets.map((b, i) => (i === index ? v : b)),
                          )
                        }
                      />
                      <button
                        type="button"
                        className="text-[11px] text-rose"
                        onClick={() =>
                          setField(
                            "aboutBullets",
                            site.aboutBullets.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-berry"
                onClick={() => setField("aboutBullets", [...site.aboutBullets, "New highlight"])}
              >
                + Add bullet
              </button>
            </div>

            <div className="rate-panel rounded-[2rem] bg-violet px-8 py-10 text-pearl shadow-[0_24px_60px_-28px_rgba(74,37,112,0.55)]">
              <EditableText
                dark
                className="text-sm uppercase tracking-[0.2em] text-champagne"
                value={site.ratesEyebrow}
                onChange={(v) => setField("ratesEyebrow", v)}
              />
              <div className="mt-6 space-y-4">
                {site.rates.map((rate, index) => (
                  <div
                    key={index}
                    className="flex items-baseline justify-between gap-3 border-b border-pearl/15 pb-3"
                  >
                    <EditableText
                      dark
                      className="flex-1 text-pearl/80"
                      value={rate.label}
                      onChange={(v) => updateRate(index, { label: v })}
                    />
                    <EditableText
                      dark
                      className="w-28 text-right font-[family-name:var(--font-display)] text-2xl"
                      value={rate.value}
                      onChange={(v) => updateRate(index, { value: v })}
                    />
                    <button
                      type="button"
                      className="text-[11px] text-champagne/80"
                      onClick={() =>
                        setField(
                          "rates",
                          site.rates.filter((_, i) => i !== index),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-3 text-xs text-champagne"
                onClick={() => setField("rates", [...site.rates, { label: "New rate", value: "$" }])}
              >
                + Add rate
              </button>
              <EditableText
                dark
                multiline
                rows={3}
                className="mt-6 text-sm leading-relaxed text-pearl/75"
                value={site.ratesNote}
                onChange={(v) => setField("ratesNote", v)}
              />
            </div>
          </div>
        </section>

        {/* HIRE */}
        <section className="bg-pearl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <EditableText
              className="text-sm uppercase tracking-[0.22em] text-rose"
              value={site.hireEyebrow}
              onChange={(v) => setField("hireEyebrow", v)}
            />
            <EditableText
              multiline
              rows={2}
              className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-4xl md:text-5xl"
              value={site.hireHeadline}
              onChange={(v) => setField("hireHeadline", v)}
            />
            <EditableText
              multiline
              rows={3}
              className="mt-4 max-w-xl text-ink/70"
              value={site.hireBody}
              onChange={(v) => setField("hireBody", v)}
            />
            <p className="mt-6 text-sm text-ink/45">Hire form stays on the live site (not edited here).</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-berry/10 bg-mist/40 px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <p className="font-[family-name:var(--font-display)] text-2xl text-berry">
              {site.heroHeadline}
            </p>
            <EditableText
              className="mt-1 text-sm text-ink/55"
              value={site.footerLine}
              onChange={(v) => setField("footerLine", v)}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
