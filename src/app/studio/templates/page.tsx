import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_DEAL_TEMPLATES } from "@/lib/deal-templates";
import { StudioPageHeader } from "@/components/studio/StudioUI";
import { TemplatesClient } from "@/components/studio/TemplatesClient";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  await auth();
  let templates = await prisma.dealTemplate.findMany({ orderBy: { sortOrder: "asc" } });
  if (templates.length === 0) {
    await prisma.dealTemplate.createMany({ data: DEFAULT_DEAL_TEMPLATES });
    templates = await prisma.dealTemplate.findMany({ orderBy: { sortOrder: "asc" } });
  }

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Playbooks"
        title="Deal templates"
        description="One-click briefs with deliverables, checklists, and starting rates for common UGC packages."
      />
      <TemplatesClient initial={templates} />
    </div>
  );
}
