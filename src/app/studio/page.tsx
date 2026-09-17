import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { daysUntil, formatDate, formatMoney, statusLabel } from "@/lib/format";
import {
  EmptyState,
  StatTile,
  StudioPageHeader,
} from "@/components/studio/StudioUI";

export const dynamic = "force-dynamic";

export default async function StudioHome() {
  const session = await auth();
  const userId = session!.user!.id;

  const [deals, inquiries, deliverables, unreadAlerts] = await Promise.all([
    prisma.deal.findMany({
      where: { ownerId: userId, status: { in: ["active", "negotiating"] } },
      include: { brand: true, deliverables: true, checklistItems: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.deliverable.findMany({
      where: {
        deal: { ownerId: userId },
        status: { in: ["todo", "filming", "editing", "review", "revisions"] },
      },
      include: { deal: { include: { brand: true } } },
      orderBy: { dueDate: "asc" },
      take: 8,
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);

  const dueSoon = deals.filter((d) => {
    const days = daysUntil(d.dueDate);
    return days !== null && days <= 5;
  });

  const awaitingProduct = deals.filter((d) => d.productShipped && !d.productReceived);
  const unpaid = await prisma.deal.aggregate({
    where: {
      ownerId: userId,
      paymentStatus: { in: ["unpaid", "invoiced", "overdue"] },
      status: { not: "archived" },
    },
    _sum: { rateCents: true },
  });

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Today"
        title="Hey Kayla — here's what needs you."
        description={
          unreadAlerts > 0
            ? `${unreadAlerts} unread alert${unreadAlerts === 1 ? "" : "s"} waiting in notifications.`
            : "Deadlines, production, and inbound briefs — one glance."
        }
        action={
          <div className="flex flex-wrap gap-2">
            {unreadAlerts > 0 && (
              <Link
                href="/studio/notifications"
                className="rounded-full border border-berry/25 bg-blush/50 px-5 py-2.5 text-sm font-semibold text-berry hover:bg-blush"
              >
                View alerts
              </Link>
            )}
            <Link
              href="/studio/deals/new"
              className="rounded-full bg-berry px-5 py-2.5 text-sm font-semibold text-pearl hover:bg-violet"
            >
              New deal
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Due in 5 days" value={String(dueSoon.length)} hint="Active obligations" />
        <StatTile label="Open deliverables" value={String(deliverables.length)} hint="In production" />
        <StatTile label="New inquiries" value={String(inquiries)} hint="Needs triage" />
        <StatTile
          label="Outstanding pay"
          value={formatMoney(unpaid._sum.rateCents ?? 0)}
          hint="Unpaid + invoiced"
        />
      </div>

      {awaitingProduct.length > 0 && (
        <section className="rounded-[1.5rem] border border-warning/20 bg-warning/5 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Product in transit
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {awaitingProduct.map((d) => (
              <li key={d.id} className="flex flex-wrap justify-between gap-2">
                <Link href={`/studio/deals/${d.id}`} className="font-medium text-berry hover:underline">
                  {d.brand.name} · {d.title}
                </Link>
                <span className="text-ink/55">#{d.trackingNumber}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">Deadline radar</h2>
            <Link href="/studio/calendar" className="text-xs font-semibold text-berry hover:underline">
              Calendar →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {deals.length === 0 && (
              <EmptyState
                title="No active obligations"
                body="When deals are negotiating or active, they'll show here with due dates."
                href="/studio/deals/new"
                cta="Add a deal"
              />
            )}
            {deals.map((deal) => {
              const days = daysUntil(deal.dueDate);
              const checklistDone = deal.checklistItems.filter((c) => c.done).length;
              return (
                <Link
                  key={deal.id}
                  href={`/studio/deals/${deal.id}`}
                  className="block rounded-2xl border border-ink/8 bg-white/70 p-4 transition hover:border-rose/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-rose">
                        {deal.brand.name}
                      </p>
                      <h3 className="mt-1 font-semibold">{deal.title}</h3>
                      <p className="mt-1 text-sm text-ink/55">
                        {deal.platform} · {deal.contentType}
                      </p>
                    </div>
                    <span className="status-pill bg-blush/40">{statusLabel(deal.status)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/60">
                    <span>Due {formatDate(deal.dueDate)}</span>
                    {days !== null && (
                      <span className={days <= 2 ? "font-semibold text-rose" : ""}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                      </span>
                    )}
                    <span>
                      Checklist {checklistDone}/{deal.checklistItems.length}
                    </span>
                    <span>{formatMoney(deal.rateCents)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Production queue
            </h2>
            <Link href="/studio/pipeline" className="text-xs font-semibold text-berry hover:underline">
              Pipeline →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {deliverables.length === 0 && (
              <p className="rounded-2xl border border-dashed border-berry/20 bg-white/40 px-4 py-8 text-center text-sm text-ink/50">
                Nothing in production — drag deliverables on the pipeline board when you start.
              </p>
            )}
            {deliverables.map((item) => (
              <Link
                key={item.id}
                href={`/studio/deals/${item.dealId}`}
                className="flex items-center justify-between rounded-2xl border border-ink/8 bg-white/70 px-4 py-3 text-sm hover:border-rose/40"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-ink/55">
                    {item.deal.brand.name} · due {formatDate(item.dueDate)}
                  </p>
                </div>
                <span className="status-pill">{statusLabel(item.status)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
