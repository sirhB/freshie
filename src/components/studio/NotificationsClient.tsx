"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Note = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export function NotificationsClient({ initial }: { initial: Note[] }) {
  const router = useRouter();
  const [notes, setNotes] = useState(initial);

  async function mark(id?: string, markAll?: boolean) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(markAll ? { markAll: true } : { id }),
    });
    if (markAll) {
      setNotes((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    } else if (id) {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
      );
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => mark(undefined, true)}
          className="text-sm text-berry hover:underline"
        >
          Mark all read
        </button>
      </div>
      {notes.map((n) => (
        <article
          key={n.id}
          className={`rounded-2xl border px-4 py-3 ${
            n.readAt ? "border-ink/8 bg-white/50" : "border-berry/25 bg-blush/30"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-rose">{n.type}</p>
              <h3 className="font-semibold text-ink">{n.title}</h3>
              <p className="mt-1 text-sm text-ink/65">{n.body}</p>
              <p className="mt-2 text-xs text-ink/40">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              {n.href && (
                <Link
                  href={n.href}
                  onClick={() => mark(n.id)}
                  className="rounded-full bg-berry px-3 py-1 text-xs font-semibold text-pearl"
                >
                  Open
                </Link>
              )}
              {!n.readAt && (
                <button
                  onClick={() => mark(n.id)}
                  className="rounded-full border border-ink/10 px-3 py-1 text-xs"
                >
                  Read
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
