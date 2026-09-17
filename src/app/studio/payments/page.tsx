import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";
import { EmptyState, StatTile, StudioPageHeader } from "@/components/studio/StudioUI";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await auth();
  const deals = await prisma.deal.findMany({
    where: { ownerId: session!.user!.id, status: { not: "archived" } },
    include: { brand: true },
    orderBy: { updatedAt: "desc" },
  });

  const totals = deals.reduce(
    (acc, d) => {
      acc.all += d.rateCents;
      if (d.paymentStatus === "paid") acc.paid += d.rateCents;
      else acc.open += d.rateCents;
      return acc;
    },
    { all: 0, paid: 0, open: 0 },
  );

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Money"
        title="Payments"
        description="Track booked rates, invoiced balances, and collected payouts across active deals."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Booked" value={formatMoney(totals.all)} />
        <StatTile label="Collected" value={formatMoney(totals.paid)} />
        <StatTile label="Outstanding" value={formatMoney(totals.open)} />
      </div>

      {deals.length === 0 ? (
        <EmptyState
          title="No payment rows yet"
          body="Rates appear here once deals are created or converted from inquiries."
          href="/studio/deals"
          cta="View deals"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white/70">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 text-xs uppercase tracking-[0.14em] text-ink/45">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="hidden px-4 py-3 sm:table-cell">Paid</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/studio/deals/${deal.id}`} className="hover:text-berry">
                      <p className="font-medium">{deal.brand.name}</p>
                      <p className="text-ink/50">{deal.title}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">{formatMoney(deal.rateCents)}</td>
                  <td className="px-4 py-3">
                    <span className="status-pill bg-blush/30">
                      {statusLabel(deal.paymentStatus)}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">{formatDate(deal.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
