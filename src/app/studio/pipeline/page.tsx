import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DELIVERABLE_STATUSES, statusLabel } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const session = await auth();
  const items = await prisma.deliverable.findMany({
    where: { deal: { ownerId: session!.user!.id } },
    include: { deal: { include: { brand: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-rose">Production</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Deliverable pipeline
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          From todo → filming → editing → review → delivered → live. Built around
          Kayla&apos;s ~4-day turnaround rhythm.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {DELIVERABLE_STATUSES.map((status) => {
          const column = items.filter((i) => i.status === status);
          return (
            <div
              key={status}
              className="min-w-[220px] flex-1 rounded-2xl border border-ink/8 bg-white/50 p-3"
            >
              <p className="px-1 text-xs uppercase tracking-[0.16em] text-ink/45">
                {statusLabel(status)} · {column.length}
              </p>
              <div className="mt-3 space-y-2">
                {column.map((item) => (
                  <Link
                    key={item.id}
                    href={`/studio/deals/${item.dealId}`}
                    className="block rounded-xl border border-ink/8 bg-white/90 p-3 text-sm hover:border-rose/40"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-ink/50">{item.deal.brand.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
