"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Brand = {
  id: string;
  name: string;
  niche: string | null;
  website: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  notes: string | null;
  logoUrl: string | null;
  _count?: { deals: number };
};

const empty = {
  name: "",
  niche: "",
  website: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
  logoUrl: "",
};

export function BrandsClient({ initial }: { initial: Brand[] }) {
  const router = useRouter();
  const [brands, setBrands] = useState(initial);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(b: Brand) {
    setEditingId(b.id);
    setForm({
      name: b.name,
      niche: b.niche || "",
      website: b.website || "",
      contactName: b.contactName || "",
      contactEmail: b.contactEmail || "",
      contactPhone: b.contactPhone || "",
      notes: b.notes || "",
      logoUrl: b.logoUrl || "",
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      ...(editingId ? { id: editingId } : {}),
      name: form.name,
      niche: form.niche || null,
      website: form.website || null,
      contactName: form.contactName || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
      notes: form.notes || null,
      logoUrl: form.logoUrl || null,
    };
    const res = await fetch("/api/brands", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save brand.");
      return;
    }
    const data = await res.json();
    if (editingId) {
      setBrands((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...data.brand } : b)));
    } else {
      setBrands((prev) => [{ ...data.brand, _count: { deals: 0 } }, ...prev]);
    }
    setEditingId(null);
    setForm(empty);
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-3">
        {brands.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => startEdit(b)}
            className="block w-full rounded-2xl border border-ink/8 bg-white/70 p-4 text-left hover:border-berry/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="mt-1 text-sm text-ink/55">
                  {[b.niche, b.contactName, b.contactEmail].filter(Boolean).join(" · ") ||
                    "No contact yet"}
                </p>
                {b.notes && <p className="mt-2 line-clamp-2 text-xs text-ink/50">{b.notes}</p>}
              </div>
              <span className="status-pill bg-blush/40">{b._count?.deals ?? 0} deals</span>
            </div>
          </button>
        ))}
        {brands.length === 0 && (
          <p className="text-sm text-ink/50">No brands yet — add your first CRM contact.</p>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-ink/8 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          {editingId ? "Edit brand" : "Add brand"}
        </h2>
        {(
          [
            ["name", "Brand name", true],
            ["niche", "Niche", false],
            ["website", "Website", false],
            ["contactName", "Contact name", false],
            ["contactEmail", "Contact email", false],
            ["contactPhone", "Contact phone", false],
            ["logoUrl", "Logo URL", false],
          ] as const
        ).map(([key, label, required]) => (
          <label key={key} className="block text-xs uppercase tracking-[0.14em] text-ink/45">
            {label}
            <input
              required={required}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}
        <label className="block text-xs uppercase tracking-[0.14em] text-ink/45">
          Notes
          <textarea
            rows={3}
            className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </label>
        {error && <p className="text-sm text-rose">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
          >
            {busy ? "Saving…" : editingId ? "Update brand" : "Add brand"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
              className="rounded-full border border-ink/10 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
