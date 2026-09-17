import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { StudioPageHeader, EmptyState, StudioCard } from "@/components/studio/StudioUI";

export const dynamic = "force-dynamic";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export default async function CalendarPage() {
  const session = await auth();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const totalDays = daysInMonth(now);

  const deals = await prisma.deal.findMany({
    where: {
      ownerId: session!.user!.id,
      dueDate: {
        gte: monthStart,
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    },
    include: { brand: true },
  });

  const deliverables = await prisma.deliverable.findMany({
    where: {
      deal: { ownerId: session!.user!.id },
      dueDate: {
        gte: monthStart,
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    },
    include: { deal: { include: { brand: true } } },
  });

  const byDay = new Map<number, { label: string; href: string; tone: string }[]>();
  for (const deal of deals) {
    if (!deal.dueDate) continue;
    const day = deal.dueDate.getDate();
    const list = byDay.get(day) || [];
    list.push({
      label: `${deal.brand.name}: ${deal.title}`,
      href: `/studio/deals/${deal.id}`,
      tone: "deal",
    });
    byDay.set(day, list);
  }
  for (const item of deliverables) {
    if (!item.dueDate) continue;
    const day = item.dueDate.getDate();
    const list = byDay.get(day) || [];
    list.push({
      label: `${item.deal.brand.name}: ${item.title}`,
      href: `/studio/deals/${item.dealId}`,
      tone: "deliverable",
    });
    byDay.set(day, list);
  }

  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });
  const startWeekday = monthStart.getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Schedule"
        title={monthLabel}
        description="Deal and deliverable due dates for the month — tap any item to open the brief."
      />

      {deals.length === 0 && deliverables.length === 0 ? (
        <EmptyState
          title="No due dates this month"
          body="Add due dates on deals and deliverables to fill Kayla’s obligation calendar."
          href="/studio/deals"
          cta="View deals"
        />
      ) : (
        <StudioCard className="overflow-hidden p-0">
          <div className="grid grid-cols-7 border-b border-ink/8 text-center text-[11px] uppercase tracking-[0.14em] text-ink/45">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-1 py-3">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => (
              <div
                key={idx}
                className="min-h-[110px] border-b border-r border-ink/6 p-2 last:border-r-0"
              >
                {day && (
                  <>
                    <p
                      className={`text-xs font-semibold ${
                        day === now.getDate() ? "text-berry" : "text-ink/55"
                      }`}
                    >
                      {day}
                    </p>
                    <div className="mt-1 space-y-1">
                      {(byDay.get(day) || []).slice(0, 3).map((ev, i) => (
                        <Link
                          key={`${ev.href}-${i}`}
                          href={ev.href}
                          className={`block truncate rounded-md px-1.5 py-0.5 text-[10px] leading-tight ${
                            ev.tone === "deal"
                              ? "bg-berry/15 text-berry"
                              : "bg-lilac/50 text-violet"
                          }`}
                        >
                          {ev.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </StudioCard>
      )}

      <div className="space-y-2 text-sm text-ink/55">
        <p>Upcoming this month</p>
        <ul className="space-y-2">
          {[...deals]
            .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
            .map((d) => (
              <li key={d.id}>
                <Link href={`/studio/deals/${d.id}`} className="text-berry hover:underline">
                  {formatDate(d.dueDate)} · {d.brand.name} — {d.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
