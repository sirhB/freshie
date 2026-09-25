import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StudioPageHeader } from "@/components/studio/StudioUI";
import { BrandsClient } from "@/components/studio/BrandsClient";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  await auth();
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { deals: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="CRM"
        title="Brand contacts"
        description="Keep niches, contacts, and notes on every partner — reusable when converting inquiries or opening deals."
      />
      <BrandsClient initial={brands} />
    </div>
  );
}
