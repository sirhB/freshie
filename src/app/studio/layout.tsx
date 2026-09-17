import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

const nav = [
  { href: "/studio", label: "Today" },
  { href: "/studio/deals", label: "Deals" },
  { href: "/studio/inquiries", label: "Inquiries" },
  { href: "/studio/payments", label: "Payments" },
  { href: "/studio/pipeline", label: "Pipeline" },
];

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="studio-shell min-h-[100svh]">
      <header className="border-b border-ink/8 bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="font-[family-name:var(--font-display)] text-xl text-berry">
              kaylathecreateher
            </Link>
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Creator studio</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-ink/70 transition hover:bg-blush/50 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-sm text-ink/55 hover:text-ink">Sign out</button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
