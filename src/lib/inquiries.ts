import { prisma } from "@/lib/prisma";
import { publishInquiryEvent } from "@/lib/inquiry-bus";

export type CreateInquiryInput = {
  brandName: string;
  contactName: string;
  email: string;
  budget?: string | null;
  platforms?: string | null;
  message: string;
  source?: string;
  igSenderId?: string | null;
  externalThreadId?: string | null;
  ownerId?: string | null;
};

export async function logInquiryEvent(
  inquiryId: string,
  type: string,
  message: string,
  meta?: Record<string, unknown>,
) {
  await prisma.inquiryEvent.create({
    data: {
      inquiryId,
      type,
      message,
      meta: meta ? JSON.stringify(meta) : null,
    },
  });
}

export async function createInquiry(input: CreateInquiryInput) {
  const ownerId =
    input.ownerId ??
    (await prisma.user.findFirst({ where: { role: "owner" } }))?.id ??
    null;

  const inquiry = await prisma.inquiry.create({
    data: {
      brandName: input.brandName,
      contactName: input.contactName,
      email: input.email,
      budget: input.budget ?? null,
      platforms: input.platforms ?? null,
      message: input.message,
      source: input.source ?? "web",
      igSenderId: input.igSenderId ?? null,
      externalThreadId: input.externalThreadId ?? null,
      ownerId,
      status: "new",
    },
  });

  await logInquiryEvent(
    inquiry.id,
    "created",
    `Inquiry received via ${inquiry.source}`,
    { source: inquiry.source },
  );

  publishInquiryEvent("inquiry.created", inquiry.id);
  return inquiry;
}

export async function setInquiryStatus(
  inquiryId: string,
  status: string,
  note?: string,
) {
  const inquiry = await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { status },
  });
  await logInquiryEvent(
    inquiryId,
    "status_changed",
    note ?? `Status set to ${status}`,
    { status },
  );
  publishInquiryEvent("inquiry.updated", inquiryId);
  return inquiry;
}

export async function convertInquiryToDeal(inquiryId: string, ownerId: string) {
  const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
  if (!inquiry) throw new Error("Inquiry not found");
  if (inquiry.convertedDealId) {
    return { dealId: inquiry.convertedDealId, alreadyConverted: true as const };
  }

  let brand = await prisma.brand.findFirst({
    where: { name: { equals: inquiry.brandName } },
  });
  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: inquiry.brandName,
        contactEmail: inquiry.email.includes("@") ? inquiry.email : null,
        notes: `Converted from ${inquiry.source} inquiry`,
      },
    });
  }

  const platform = inquiry.platforms?.split(",")[0]?.trim() || "TikTok + Instagram";
  const title = `${inquiry.brandName} collab brief`;

  const deal = await prisma.deal.create({
    data: {
      title,
      brandId: brand.id,
      ownerId,
      platform,
      contentType: "UGC Video",
      rateCents: 10000,
      status: "negotiating",
      briefSummary: inquiry.message,
      guidelines: "Confirm talking points, disclosure, and usage rights before filming.",
      deliverables: {
        create: [
          {
            title: `${platform} primary cut`,
            format: "video",
            status: "todo",
          },
        ],
      },
      checklistItems: {
        create: [
          { label: "Reply to brand with availability + rates", sortOrder: 0 },
          { label: "Confirm brief + talking points", sortOrder: 1 },
          { label: "Track product shipment", sortOrder: 2 },
          { label: "Film primary deliverable", sortOrder: 3 },
          { label: "Self-QC against guidelines", sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      status: "converted",
      convertedDealId: deal.id,
    },
  });

  await logInquiryEvent(
    inquiryId,
    "converted",
    `Converted to deal ${deal.title}`,
    { dealId: deal.id },
  );
  publishInquiryEvent("inquiry.converted", inquiryId);

  return { dealId: deal.id, alreadyConverted: false as const };
}

export function serializeInquiry<
  T extends {
    id: string;
    brandName: string;
    contactName: string;
    email: string;
    budget: string | null;
    platforms: string | null;
    message: string;
    status: string;
    source: string;
    igSenderId: string | null;
    autoRepliedAt: Date | null;
    convertedDealId: string | null;
    createdAt: Date;
    updatedAt: Date;
    events?: { id: string; type: string; message: string; createdAt: Date }[];
  },
>(inquiry: T) {
  return {
    ...inquiry,
    autoRepliedAt: inquiry.autoRepliedAt?.toISOString() ?? null,
    createdAt: inquiry.createdAt.toISOString(),
    updatedAt: inquiry.updatedAt.toISOString(),
    events: inquiry.events?.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    })),
  };
}
