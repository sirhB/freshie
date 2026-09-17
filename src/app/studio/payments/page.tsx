import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";

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
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-rose">Money</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Payments</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Booked" value={formatMoney(totals.all)} />
        <Tile label="Collected" value={formatMoney(totals.paid)} />
        <Tile label="Outstanding" value={formatMoney(totals.open)} />
      </div>

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
                  <p className="font-medium">{deal.brand.name}</p>
                  <p className="text-ink/50">{deal.title}</p>
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
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">{value}</p>
    </div>
  );
}
