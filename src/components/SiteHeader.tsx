import Link from "next/link";

const links = [
  { href: "#work", label: "Work" },
  { href: "#offer", label: "Offer" },
  { href: "#hire", label: "Hire" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl tracking-[0.04em] text-pearl md:text-2xl"
        >
          kaylathecreateher
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-pearl/85 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-pearl">
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="rounded-full border border-pearl/30 px-4 py-2 text-pearl transition hover:bg-pearl/10"
          >
            Studio
          </Link>
        </nav>
        <Link
          href="/login"
          className="rounded-full border border-pearl/30 px-3 py-1.5 text-sm text-pearl md:hidden"
        >
          Studio
        </Link>
      </div>
    </header>
  );
}
