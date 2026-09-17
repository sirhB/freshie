import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syncDeadlineNotifications } from "@/lib/notifications";
import { StudioPageHeader, EmptyState } from "@/components/studio/StudioUI";
import { NotificationsClient } from "@/components/studio/NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  await syncDeadlineNotifications(session!.user!.id);

  const notifications = await prisma.notification.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Deadlines, inbound inquiries, and studio system notes — stay ahead of brand obligations."
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="You're all clear"
          body="When deals are due soon or new inquiries arrive, they'll land here."
        />
      ) : (
        <NotificationsClient
          initial={notifications.map((n) => ({
            ...n,
            createdAt: n.createdAt.toISOString(),
            readAt: n.readAt?.toISOString() ?? null,
          }))}
        />
      )}
    </div>
  );
}
