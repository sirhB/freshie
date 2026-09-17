import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/db-url";
import { StudioNav } from "@/components/studio/StudioNav";
import { syncDeadlineNotifications } from "@/lib/notifications";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let unread = 0;
  if (hasDatabaseUrl()) {
    try {
      await syncDeadlineNotifications(session.user.id);
      unread = await prisma.notification.count({
        where: { userId: session.user.id, readAt: null },
      });
    } catch (error) {
      console.error("[studio] notification sync failed", error);
    }
  }

  return (
    <div className="studio-shell min-h-[100svh]">
      <header className="sticky top-0 z-30 border-b border-berry/10 bg-pearl/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Link
                href="/"
                className="font-[family-name:var(--font-display)] text-xl text-berry"
              >
                kaylathecreateher
              </Link>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                Creator studio
              </p>
            </div>
          </div>
          <StudioNav unread={unread} />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-sm text-ink/50 transition hover:text-berry">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">{children}</div>
    </div>
  );
}
