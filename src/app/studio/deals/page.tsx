import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const session = await auth();
  const deals = await prisma.deal.findMany({
    where: { ownerId: session!.user!.id },
    include: { brand: true, deliverables: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose">Brand obligations</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl">All deals</h1>
        </div>
        <Link
          href="/studio/deals/new"
          className="rounded-full bg-berry px-5 py-2.5 text-sm font-semibold text-pearl"
        >
          New deal
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-[0.14em] text-ink/45">
            <tr>
              <th className="px-4 py-3 font-medium">Brand / deal</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Platform</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Due</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Rate</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/studio/deals/${deal.id}`} className="hover:text-berry">
                    <p className="font-medium">{deal.brand.name}</p>
                    <p className="text-ink/55">{deal.title}</p>
                  </Link>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{deal.platform}</td>
                <td className="hidden px-4 py-3 sm:table-cell">{formatDate(deal.dueDate)}</td>
                <td className="px-4 py-3">
                  <span className="status-pill bg-blush/30">{statusLabel(deal.status)}</span>
                </td>
                <td className="px-4 py-3">{formatMoney(deal.rateCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
