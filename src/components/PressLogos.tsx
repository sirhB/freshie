import Link from "next/link";

export function PressLogos({
  logos,
}: {
  logos: { name: string; url: string }[];
}) {
  if (!logos.length) return null;
  return (
    <section className="border-y border-berry/10 bg-mist/30 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-ink/45">
          Brands she&apos;s created with
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo) =>
            logo.url ? (
              <a
                key={logo.name}
                href={logo.url}
                target="_blank"
                rel="noreferrer"
                className="font-[family-name:var(--font-display)] text-xl text-ink/55 transition hover:text-berry"
              >
                {logo.name}
              </a>
            ) : (
              <span
                key={logo.name}
                className="font-[family-name:var(--font-display)] text-xl text-ink/55"
              >
                {logo.name}
              </span>
            ),
          )}
        </div>
        <p className="mt-6 text-center text-sm text-ink/45">
          <Link href="/api/rate-card" className="text-berry hover:underline">
            Download rate card
          </Link>
        </p>
      </div>
    </section>
  );
}
