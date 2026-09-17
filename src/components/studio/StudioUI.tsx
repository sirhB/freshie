import Link from "next/link";

export function StudioPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-rose">{eyebrow}</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-berry/25 bg-white/50 px-6 py-12 text-center">
      <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">{body}</p>
      {href && cta && (
        <Link
          href={href}
          className="mt-6 inline-flex rounded-full bg-berry px-5 py-2.5 text-sm font-semibold text-pearl hover:bg-violet"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

export function StudioCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-ink/8 bg-white/75 p-4 shadow-[0_1px_0_rgba(30,20,40,0.03)] ${className}`}>
      {children}
    </div>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <StudioCard>
      <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </StudioCard>
  );
}
