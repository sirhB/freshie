import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeInquiry } from "@/lib/inquiries";
import { getInstagramConfig } from "@/lib/instagram";
import { LiveInquiryBoard } from "@/components/LiveInquiryBoard";
import { StudioPageHeader } from "@/components/studio/StudioUI";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  await auth();
  const inquiries = await prisma.inquiry.findMany({
    include: { events: { orderBy: { createdAt: "desc" }, take: 8 } },
    orderBy: { createdAt: "desc" },
  });
  const { configured } = getInstagramConfig();
  const fresh = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Inbound"
        title="Live brand inquiries"
        description={
          fresh > 0
            ? `${fresh} new lead${fresh === 1 ? "" : "s"} waiting — triage status, auto-replies, and convert to deals.`
            : "Web briefs and Instagram DMs stream here in real time. Triage, reply, and convert warm leads into studio deals."
        }
      />

      <LiveInquiryBoard
        initialInquiries={inquiries.map(serializeInquiry)}
        instagramConfigured={configured}
      />
    </div>
  );
}
