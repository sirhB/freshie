import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeInquiry } from "@/lib/inquiries";
import { getInstagramConfig } from "@/lib/instagram";
import { LiveInquiryBoard } from "@/components/LiveInquiryBoard";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  await auth();
  const inquiries = await prisma.inquiry.findMany({
    include: { events: { orderBy: { createdAt: "desc" }, take: 8 } },
    orderBy: { createdAt: "desc" },
  });
  const { configured } = getInstagramConfig();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-rose">Inbound</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Live brand inquiries
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Web briefs and Instagram DMs stream here in real time. Triage status, review activity,
          auto-replies, and convert warm leads straight into studio deals.
        </p>
      </div>

      <LiveInquiryBoard
        initialInquiries={inquiries.map(serializeInquiry)}
        instagramConfigured={configured}
      />
    </div>
  );
}
