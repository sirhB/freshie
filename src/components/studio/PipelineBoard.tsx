"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DELIVERABLE_STATUSES, statusLabel } from "@/lib/format";

type Item = {
  id: string;
  title: string;
  status: string;
  dealId: string;
  brandName: string;
};

export function PipelineBoard({ initialItems }: { initialItems: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [dragging, setDragging] = useState<string | null>(null);

  async function move(id: string, status: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch("/api/studio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "deliverable", id, status }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {DELIVERABLE_STATUSES.map((status) => {
        const column = items.filter((i) => i.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/deliverable-id") || dragging;
              if (id) void move(id, status);
              setDragging(null);
            }}
            className="min-w-[230px] flex-1 rounded-2xl border border-berry/15 bg-white/60 p-3"
          >
            <p className="px-1 text-xs uppercase tracking-[0.16em] text-ink/45">
              {statusLabel(status)} · {column.length}
            </p>
            <div className="mt-3 min-h-[120px] space-y-2">
              {column.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    setDragging(item.id);
                    e.dataTransfer.setData("text/deliverable-id", item.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className="cursor-grab rounded-xl border border-ink/8 bg-white p-3 text-sm shadow-sm active:cursor-grabbing"
                >
                  <Link href={`/studio/deals/${item.dealId}`} className="font-medium hover:text-berry">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink/50">{item.brandName}</p>
                </div>
              ))}
              {column.length === 0 && (
                <p className="px-1 py-6 text-center text-xs text-ink/35">Drop here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
