"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function UploadPanel({
  dealId,
  deliverableId,
  attachments,
}: {
  dealId: string;
  deliverableId?: string;
  attachments: { id: string; fileName: string; fileUrl: string; kind: string; sizeBytes: number }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("dealId", dealId);
    if (deliverableId) data.set("deliverableId", deliverableId);
    const res = await fetch("/api/uploads", { method: "POST", body: data });
    setBusy(false);
    if (!res.ok) {
      setError("Upload failed.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <h3 className="font-[family-name:var(--font-display)] text-xl">Files</h3>
      <ul className="space-y-2 text-sm">
        {attachments.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-2 rounded-xl border border-ink/8 bg-white/70 px-3 py-2">
            <a href={a.fileUrl} target="_blank" rel="noreferrer" className="truncate text-berry hover:underline">
              {a.fileName}
            </a>
            <span className="shrink-0 text-xs text-ink/45">
              {a.kind} · {Math.round(a.sizeBytes / 1024)}kb
            </span>
          </li>
        ))}
        {attachments.length === 0 && (
          <li className="text-sm text-ink/45">No files yet — upload briefs, drafts, or finals.</li>
        )}
      </ul>
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
        <label className="text-xs">
          Kind
          <select
            name="kind"
            className="ml-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm"
            defaultValue="draft"
          >
            <option value="brief">brief</option>
            <option value="draft">draft</option>
            <option value="final">final</option>
            <option value="file">file</option>
          </select>
        </label>
        <input
          type="file"
          name="file"
          required
          className="max-w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blush file:px-3 file:py-1.5 file:text-sm file:text-berry"
        />
        <button
          disabled={busy}
          className="rounded-full bg-berry px-4 py-2 text-sm font-semibold text-pearl disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>
      {error && <p className="text-sm text-rose">{error}</p>}
    </div>
  );
}
