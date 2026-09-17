"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/studio", label: "Today" },
  { href: "/studio/deals", label: "Deals" },
  { href: "/studio/inquiries", label: "Inquiries" },
  { href: "/studio/pipeline", label: "Pipeline" },
  { href: "/studio/calendar", label: "Calendar" },
  { href: "/studio/payments", label: "Payments" },
];

export function StudioNav({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();

  function active(href: string) {
    if (href === "/studio") return pathname === "/studio";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm">
      {nav.map((item) => {
        const isActive = active(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 transition ${
              isActive
                ? "bg-berry text-pearl shadow-sm"
                : "text-ink/65 hover:bg-blush/60 hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/studio/notifications"
        className={`relative rounded-full px-3 py-1.5 transition ${
          pathname.startsWith("/studio/notifications")
            ? "bg-berry text-pearl"
            : "text-ink/65 hover:bg-blush/60"
        }`}
      >
        Alerts
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-pearl">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
    </nav>
  );
}
