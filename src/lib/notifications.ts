import { prisma } from "@/lib/prisma";
import { publishInquiryEvent } from "@/lib/inquiry-bus";
import { dispatchNotificationChannels } from "@/lib/alerts";

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
}) {
  const note = await prisma.notification.create({ data: input });
  publishInquiryEvent("notification.created", note.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: {
        email: true,
        alertEmail: true,
        alertPhone: true,
        emailAlertsOn: true,
        smsAlertsOn: true,
      },
    });
    if (user) {
      const channels = await dispatchNotificationChannels({
        user,
        title: input.title,
        body: input.body,
        href: input.href,
      });
      if (channels.emailed || channels.sms) {
        await prisma.notification.update({
          where: { id: note.id },
          data: {
            emailedAt: channels.emailed ? new Date() : null,
            smsSentAt: channels.sms ? new Date() : null,
          },
        });
      }
    }
  } catch (error) {
    console.error("[notifications] channel dispatch failed", error);
  }

  return note;
}

export async function syncDeadlineNotifications(userId: string) {
  const soon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);
  const deals = await prisma.deal.findMany({
    where: {
      ownerId: userId,
      status: { in: ["active", "negotiating"] },
      OR: [
        { dueDate: { lte: soon, gte: new Date() } },
        { publishDate: { lte: soon, gte: new Date() } },
      ],
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
    const when = deal.dueDate || deal.publishDate;
    await createNotification({
      userId,
      type: "deadline",
      title: `Due soon · ${deal.brand.name}`,
      body: when
        ? `${deal.title} · ${when.toLocaleDateString("en-US")}`
        : deal.title,
      href: `/studio/deals/${deal.id}`,
    });
  }
}
