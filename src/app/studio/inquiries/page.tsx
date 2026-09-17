import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { InquiryStatusSelect } from "@/components/StudioActions";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  await auth();
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-rose">Inbound</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Brand inquiries</h1>
        <p className="mt-2 text-sm text-ink/60">
          Leads from the public hire form land here for triage.
        </p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <article
            key={inq.id}
            className="rounded-2xl border border-ink/8 bg-white/70 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{inq.brandName}</h2>
                <p className="text-sm text-ink/55">
                  {inq.contactName} · {inq.email} · {formatDate(inq.createdAt)}
                </p>
              </div>
              <InquiryStatusSelect id={inq.id} status={inq.status} />
            </div>
            <p className="mt-3 text-sm text-ink/75">{inq.message}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/50">
              {inq.budget && <span>Budget: {inq.budget}</span>}
              {inq.platforms && <span>Platforms: {inq.platforms}</span>}
            </div>
          </article>
        ))}
        {inquiries.length === 0 && (
          <p className="text-sm text-ink/50">No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}
