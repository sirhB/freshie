import type { SiteSocial } from "@/lib/site-content";

export function SocialLinksSection({
  eyebrow,
  headline,
  socials,
}: {
  eyebrow: string;
  headline: string;
  socials: SiteSocial[];
}) {
  return (
    <section id="socials" className="relative overflow-hidden px-6 py-20 md:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-r from-violet via-berry to-violet"
        aria-hidden
      />
      <div className="hero-grain absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl text-pearl">
        <p className="text-sm uppercase tracking-[0.22em] text-champagne">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          {headline}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {socials.map((s) => (
            <li key={`${s.platform}-${s.url}`}>
              <a
                href={s.url}
                target={s.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={s.url.startsWith("mailto:") ? undefined : "noreferrer"}
                className="flex h-full flex-col justify-between border-t border-pearl/25 pt-4 transition hover:border-champagne"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-champagne/90">
                  {s.platform}
                </span>
                <span className="mt-3 font-[family-name:var(--font-display)] text-xl md:text-2xl">
                  {s.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
