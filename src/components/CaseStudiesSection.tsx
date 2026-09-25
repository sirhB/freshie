import Link from "next/link";
import type { PortfolioShape } from "@/lib/site-content";

export function CaseStudiesSection({ items }: { items: PortfolioShape[] }) {
  const cases = items.filter((i) => i.kind === "case_study" && i.published);
  if (cases.length === 0) return null;

  return (
    <section id="cases" className="bg-pearl px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.22em] text-rose">Case studies</p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          Campaign stories brands can share internally.
        </h2>
        <div className="mt-10 space-y-10">
          {cases.map((item) => (
            <article
              key={item.id}
              className="grid gap-6 border-b border-ink/8 pb-10 last:border-0 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-berry">
                  {item.brandName || item.platform} · {item.category}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-3 text-ink/65">{item.description}</p>
                )}
                {item.resultsNote && (
                  <p className="mt-4 text-sm font-medium text-berry">{item.resultsNote}</p>
                )}
                {item.mediaUrl && (
                  <Link
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-berry underline-offset-4 hover:underline"
                  >
                    Watch deliverable →
                  </Link>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink/70">
                {item.caseBody || item.description}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
