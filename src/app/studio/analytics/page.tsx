import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { StatTile, StudioPageHeader, StudioCard } from "@/components/studio/StudioUI";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [deals, inquiries, deliverables] = await Promise.all([
    prisma.deal.findMany({
      where: { ownerId: userId },
      include: { brand: true },
    }),
    prisma.inquiry.findMany({
      select: {
        source: true,
        leadTier: true,
        leadScore: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.deliverable.findMany({
      where: { deal: { ownerId: userId } },
      select: { status: true },
    }),
  ]);

  const revenue = deals.reduce(
    (acc, d) => {
      acc.booked += d.rateCents;
      if (d.paymentStatus === "paid") acc.paid += d.rateCents;
      else if (d.status !== "archived") acc.open += d.rateCents;
      return acc;
    },
    { booked: 0, paid: 0, open: 0 },
  );

  const bySource: Record<string, number> = {};
  const byTier: Record<string, number> = {};
  let scoreSum = 0;
  for (const i of inquiries) {
    bySource[i.source] = (bySource[i.source] || 0) + 1;
    byTier[i.leadTier] = (byTier[i.leadTier] || 0) + 1;
    scoreSum += i.leadScore;
  }
  const avgScore = inquiries.length ? Math.round(scoreSum / inquiries.length) : 0;

  const brandSpend = new Map<string, number>();
  for (const d of deals) {
    brandSpend.set(d.brand.name, (brandSpend.get(d.brand.name) || 0) + d.rateCents);
  }
  const topBrands = [...brandSpend.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const delivByStatus: Record<string, number> = {};
  for (const d of deliverables) {
    delivByStatus[d.status] = (delivByStatus[d.status] || 0) + 1;
  }
  const maxSource = Math.max(1, ...Object.values(bySource));
  const maxTier = Math.max(1, ...Object.values(byTier));

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Insights"
        title="Studio analytics"
        description="Lead quality, booked revenue, and production mix — a quick pulse on the createher business."
        action={
          <Link
            href="/studio/inquiries"
            className="rounded-full border border-berry/25 bg-white/70 px-4 py-2 text-sm font-semibold text-berry"
          >
            Open inquiries
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Booked" value={formatMoney(revenue.booked)} />
        <StatTile label="Collected" value={formatMoney(revenue.paid)} />
        <StatTile label="Outstanding" value={formatMoney(revenue.open)} />
        <StatTile label="Avg lead score" value={String(avgScore)} hint={`${byTier.hot || 0} hot leads`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudioCard>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Inquiries by source</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(bySource).map(([key, n]) => (
              <div key={key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  <span className="text-ink/50">{n}</span>
                </div>
                <div className="h-2 rounded-full bg-ink/5">
                  <div
                    className="h-2 rounded-full bg-berry/70"
                    style={{ width: `${(n / maxSource) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(bySource).length === 0 && (
              <p className="text-sm text-ink/45">No inquiries yet.</p>
            )}
          </div>
        </StudioCard>

        <StudioCard>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Lead tiers</h2>
          <div className="mt-4 space-y-3">
            {["hot", "maybe", "pass"].map((key) => {
              const n = byTier[key] || 0;
              return (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className="text-ink/50">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink/5">
                    <div
                      className={`h-2 rounded-full ${
                        key === "hot" ? "bg-rose/70" : key === "pass" ? "bg-ink/25" : "bg-lilac"
                      }`}
                      style={{ width: `${(n / maxTier) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </StudioCard>

        <StudioCard>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Top brands by spend</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {topBrands.map(([name, cents]) => (
              <li key={name} className="flex justify-between border-b border-ink/6 py-2">
                <span>{name}</span>
                <span className="font-medium">{formatMoney(cents)}</span>
              </li>
            ))}
            {topBrands.length === 0 && (
              <li className="text-ink/45">Create deals to see brand spend.</li>
            )}
          </ul>
        </StudioCard>

        <StudioCard>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Deliverables</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {Object.entries(delivByStatus).map(([status, n]) => (
              <li key={status} className="status-pill bg-blush/40 capitalize">
                {status}: {n}
              </li>
            ))}
            {Object.keys(delivByStatus).length === 0 && (
              <li className="text-sm text-ink/45">No deliverables yet.</li>
            )}
          </ul>
          <p className="mt-4 text-sm text-ink/55">
            {inquiries.filter((i) => i.status === "new").length} new inquiries waiting ·{" "}
            <Link href="/studio/calendar" className="text-berry hover:underline">
              Calendar
            </Link>
          </p>
        </StudioCard>
      </div>
    </div>
  );
}
