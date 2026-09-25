import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { invoiceHtml, nextInvoiceNumber } from "@/lib/print-docs";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deal = await prisma.deal.findFirst({
    where: { id, ownerId: session.user.id },
    include: { brand: true },
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let invoiceNumber = deal.invoiceNumber;
  if (!invoiceNumber) {
    invoiceNumber = nextInvoiceNumber(deal.id);
    await prisma.deal.update({
      where: { id: deal.id },
      data: {
        invoiceNumber,
        paymentStatus:
          deal.paymentStatus === "unpaid" ? "invoiced" : deal.paymentStatus,
      },
    });
    revalidatePath(`/studio/deals/${deal.id}`);
    revalidatePath("/studio/payments");
  }

  const { searchParams } = new URL(req.url);
  if (searchParams.get("json") === "1") {
    return NextResponse.json({
      ok: true,
      invoiceNumber,
      url: `/api/deals/${deal.id}/invoice`,
    });
  }

  const html = invoiceHtml({
    invoiceNumber,
    brandName: deal.brand.name,
    dealTitle: deal.title,
    platform: deal.platform,
    contentType: deal.contentType,
    rateCents: deal.rateCents,
    dueDate: deal.dueDate,
    publishDate: deal.publishDate,
    paymentLinkUrl: deal.paymentLinkUrl,
    briefSummary: deal.briefSummary,
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = z
    .object({ paymentLinkUrl: z.string().url().nullable().optional() })
    .parse(await req.json());

  const deal = await prisma.deal.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.deal.update({
    where: { id },
    data: {
      paymentLinkUrl:
        body.paymentLinkUrl !== undefined ? body.paymentLinkUrl : deal.paymentLinkUrl,
    },
  });

  revalidatePath(`/studio/deals/${id}`);
  return NextResponse.json({ ok: true, paymentLinkUrl: updated.paymentLinkUrl });
}
