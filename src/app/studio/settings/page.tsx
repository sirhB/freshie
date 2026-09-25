import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getInstagramConfig } from "@/lib/instagram";
import { StudioPageHeader } from "@/components/studio/StudioUI";
import { SettingsClient } from "@/components/studio/SettingsClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) redirect("/login");

  const ig = getInstagramConfig();

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Account"
        title="Settings"
        description="Change your password, confirm Instagram connection status, and copy webhook details for Meta."
      />
      <SettingsClient
        user={user}
        instagram={{
          configured: ig.configured,
          autoReplyEnabled: ig.autoReplyEnabled,
          verifyToken: ig.verifyToken,
          webhookUrl: `${ig.siteUrl.replace(/\/$/, "")}/api/instagram/webhook`,
          hasAppSecret: Boolean(ig.appSecret),
          hasPageToken: Boolean(ig.pageAccessToken),
          hasBusinessId: Boolean(ig.businessAccountId),
        }}
      />
    </div>
  );
}
