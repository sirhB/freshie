import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StudioPageHeader, EmptyState } from "@/components/studio/StudioUI";
import { PipelineBoard } from "@/components/studio/PipelineBoard";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const session = await auth();
  const items = await prisma.deliverable.findMany({
    where: { deal: { ownerId: session!.user!.id } },
    include: { deal: { include: { brand: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Production"
        title="Deliverable pipeline"
        description="Drag cards across stages — todo → filming → editing → review → revisions → delivered → live."
      />

      {items.length === 0 ? (
        <EmptyState
          title="No deliverables yet"
          body="Create a deal and the starter deliverable will show up here for drag-and-drop tracking."
          href="/studio/deals/new"
          cta="New deal"
        />
      ) : (
        <PipelineBoard
          initialItems={items.map((i) => ({
            id: i.id,
            title: i.title,
            status: i.status,
            dealId: i.dealId,
            brandName: i.deal.brand.name,
          }))}
        />
      )}
    </div>
  );
}
