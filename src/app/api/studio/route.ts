import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function PATCH(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const type = body.type as string;

  if (type === "checklist") {
    const data = z
      .object({ id: z.string(), done: z.boolean() })
      .parse(body);
    const item = await prisma.checklistItem.findUnique({
      where: { id: data.id },
      include: { deal: true },
    });
    if (!item || item.deal.ownerId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.checklistItem.update({
      where: { id: data.id },
      data: { done: data.done },
    });
    revalidatePath(`/studio/deals/${item.dealId}`);
    revalidatePath("/studio");
    return NextResponse.json({ ok: true });
  }

  if (type === "deliverable") {
    const data = z
      .object({ id: z.string(), status: z.string() })
      .parse(body);
    const item = await prisma.deliverable.findUnique({
      where: { id: data.id },
      include: { deal: true },
    });
    if (!item || item.deal.ownerId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.deliverable.update({
      where: { id: data.id },
      data: {
        status: data.status,
        deliveredAt:
          data.status === "delivered" || data.status === "live"
            ? new Date()
            : item.deliveredAt,
      },
    });
    revalidatePath(`/studio/deals/${item.dealId}`);
    revalidatePath("/studio");
    return NextResponse.json({ ok: true });
  }

  if (type === "deal") {
    const data = z
      .object({
        id: z.string(),
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
        productReceived: z.boolean().optional(),
        productShipped: z.boolean().optional(),
      })
      .parse(body);
    const deal = await prisma.deal.findFirst({
      where: { id: data.id, ownerId: user.id },
    });
    if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.deal.update({
      where: { id: data.id },
      data: {
        status: data.status ?? deal.status,
        paymentStatus: data.paymentStatus ?? deal.paymentStatus,
        productReceived: data.productReceived ?? deal.productReceived,
        productShipped: data.productShipped ?? deal.productShipped,
        paidAt:
          data.paymentStatus === "paid" && deal.paymentStatus !== "paid"
            ? new Date()
            : deal.paidAt,
      },
    });
    revalidatePath(`/studio/deals/${deal.id}`);
    revalidatePath("/studio");
    revalidatePath("/studio/payments");
    return NextResponse.json({ ok: true });
  }

  if (type === "inquiry") {
    const data = z.object({ id: z.string(), status: z.string() }).parse(body);
    await prisma.inquiry.update({
      where: { id: data.id },
      data: { status: data.status },
    });
    revalidatePath("/studio/inquiries");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = z
    .object({
      title: z.string().min(2),
      brandName: z.string().min(2),
      platform: z.string().min(2),
      contentType: z.string().min(2),
      rateCents: z.number().int().nonnegative(),
      dueDate: z.string().optional(),
      briefSummary: z.string().optional(),
      guidelines: z.string().optional(),
    })
    .parse(body);

  let brand = await prisma.brand.findFirst({
    where: { name: { equals: data.brandName } },
  });
  if (!brand) {
    brand = await prisma.brand.create({ data: { name: data.brandName } });
  }

  const deal = await prisma.deal.create({
    data: {
      title: data.title,
      brandId: brand.id,
      ownerId: user.id,
      platform: data.platform,
      contentType: data.contentType,
      rateCents: data.rateCents,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      briefSummary: data.briefSummary,
      guidelines: data.guidelines,
      status: "active",
      deliverables: {
        create: [
          {
            title: `${data.platform} ${data.contentType}`,
            format: "video",
            status: "todo",
          },
        ],
      },
      checklistItems: {
        create: [
          { label: "Confirm brief + talking points", sortOrder: 0 },
          { label: "Track product shipment", sortOrder: 1 },
          { label: "Film primary deliverable", sortOrder: 2 },
          { label: "Self-QC against guidelines", sortOrder: 3 },
          { label: "Send for brand review", sortOrder: 4 },
        ],
      },
    },
  });

  revalidatePath("/studio");
  revalidatePath("/studio/deals");
  return NextResponse.json({ ok: true, id: deal.id });
}
