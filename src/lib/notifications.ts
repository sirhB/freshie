import { prisma } from "@/lib/prisma";
import { publishInquiryEvent } from "@/lib/inquiry-bus";

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
}) {
  const note = await prisma.notification.create({ data: input });
  publishInquiryEvent("notification.created", note.id);
  return note;
}

export async function syncDeadlineNotifications(userId: string) {
  const soon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);
  const deals = await prisma.deal.findMany({
    where: {
      ownerId: userId,
      status: { in: ["active", "negotiating"] },
      dueDate: { lte: soon, gte: new Date() },
    },
    include: { brand: true },
  });

  for (const deal of deals) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: "deadline",
        href: `/studio/deals/${deal.id}`,
        createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      },
    });
    if (existing) continue;
    await createNotification({
      userId,
      type: "deadline",
      title: `Due soon · ${deal.brand.name}`,
      body: deal.title,
      href: `/studio/deals/${deal.id}`,
    });
  }
}
