import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/format";
import {
  ChecklistToggle,
  DealControls,
  DeliverableStatusSelect,
} from "@/components/StudioActions";
import { UploadPanel } from "@/components/studio/UploadPanel";

export const dynamic = "force-dynamic";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const deal = await prisma.deal.findFirst({
    where: { id, ownerId: session!.user!.id },
    include: {
      brand: true,
      deliverables: { orderBy: { sortOrder: "asc" } },
      checklistItems: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!deal) notFound();

  const attachments = await prisma.attachment.findMany({
    where: { dealId: deal.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/studio/deals" className="text-sm text-ink/55 hover:text-ink">
          ← Deals
        </Link>
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-rose">
          {deal.brand.name}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          {deal.title}
        </h1>
        <p className="mt-2 text-ink/60">
          {deal.platform} · {deal.contentType} · {formatMoney(deal.rateCents)} · due{" "}
          {formatDate(deal.dueDate)}
        </p>
      </div>

      <DealControls
        id={deal.id}
        status={deal.status}
        paymentStatus={deal.paymentStatus}
        productShipped={deal.productShipped}
        productReceived={deal.productReceived}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Brief</h2>
          <div className="rounded-2xl border border-ink/8 bg-white/70 p-5 text-sm leading-relaxed text-ink/75">
            <p>{deal.briefSummary || "No summary yet."}</p>
            {deal.talkingPoints && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-rose">Talking points</p>
                <pre className="mt-2 whitespace-pre-wrap font-[family-name:var(--font-body)]">
                  {deal.talkingPoints}
                </pre>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-ink/8 bg-white/70 p-5 text-sm leading-relaxed">
            <p className="text-xs uppercase tracking-[0.16em] text-rose">Guidelines</p>
            <p className="mt-2 text-ink/75">{deal.guidelines || "No guidelines attached."}</p>
          </div>
          {(deal.trackingNumber || deal.usageRightsDays) && (
            <div className="rounded-2xl border border-ink/8 bg-white/70 p-5 text-sm">
              {deal.trackingNumber && (
                <p>
                  Tracking: <span className="font-medium">{deal.trackingNumber}</span>
                </p>
              )}
              {deal.usageRightsDays && (
                <p className="mt-1 text-ink/60">Usage rights: {deal.usageRightsDays} days</p>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-ink/8 bg-white/70 p-5">
            <UploadPanel dealId={deal.id} attachments={attachments} />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Guideline checklist
            </h2>
            <p className="mt-1 text-sm text-ink/55">
              Kayla&apos;s edge — follow every campaign rule before send-off.
            </p>
            <div className="mt-4 space-y-2">
              {deal.checklistItems.map((item) => (
                <ChecklistToggle
                  key={item.id}
                  id={item.id}
                  done={item.done}
                  label={item.label}
                />
              ))}
              {deal.checklistItems.length === 0 && (
                <p className="text-sm text-ink/45">No checklist items yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl">Deliverables</h2>
            <div className="mt-4 space-y-3">
              {deal.deliverables.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-white/70 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-ink/50">
                      {item.format} · due {formatDate(item.dueDate)}
                    </p>
                  </div>
                  <DeliverableStatusSelect id={item.id} status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
