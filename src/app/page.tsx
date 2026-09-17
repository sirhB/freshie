import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { InquiryForm } from "@/components/InquiryForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const portfolio = await prisma.portfolioItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="overflow-x-hidden">
      <section className="relative min-h-[100svh] hero-wash text-pearl">
        <SiteHeader />
        <div className="absolute inset-0 opacity-30 soft-grid" aria-hidden />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:pb-24">
          <p className="reveal text-sm uppercase tracking-[0.28em] text-champagne/90">
            UGC · Lincoln, NH
          </p>
          <h1 className="reveal-delay mt-4 max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            <span className="brand-sheen">kaylathecreateher</span>
          </h1>
          <p className="reveal-delay-2 mt-6 max-w-xl text-base text-pearl/85 md:text-lg">
            Soft, on-camera beauty storytelling for hair, wellness, and lifestyle brands —
            how-tos, unboxings, demos, and reviews that follow the brief and feel like a
            friend recommending a favorite.
          </p>
          <div className="reveal-delay-2 mt-8 flex flex-wrap gap-3">
            <a
              href="#hire"
              className="rounded-full bg-pearl px-6 py-3 text-sm font-semibold text-berry transition hover:bg-blush"
            >
              Hire Kayla
            </a>
            <a
              href="#work"
              className="rounded-full border border-pearl/35 px-6 py-3 text-sm text-pearl transition hover:bg-pearl/10"
            >
              View content styles
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="bg-pearl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.22em] text-rose">The work</p>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Built for briefs that need beauty, clarity, and care.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item, i) => (
              <article
                key={item.id}
                className="group border-t border-ink/10 pt-5 transition"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-rose">
                  {item.category} · {item.platform}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offer" className="relative overflow-hidden bg-mist px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-berry">What brands get</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
              A creator who treats campaign guidelines like a craft.
            </h2>
            <p className="mt-5 max-w-xl text-ink/70">
              Kayla specializes in hair, beauty, wellness, and fashion content across TikTok,
              Instagram, YouTube Shorts, and Amazon — typically turning projects around in
              about four days.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-ink/80">
              {[
                "How-to videos, unboxings, product demos, and reviews",
                "On-camera + selfie-style product storytelling",
                "Guideline-first QC before every delivery",
                "Usage-ready cuts for organic social and Amazon",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="self-end rounded-[2rem] bg-berry px-8 py-10 text-pearl">
            <p className="text-sm uppercase tracking-[0.2em] text-champagne">Starting rates</p>
            <div className="mt-6 space-y-5">
              <Rate row="UGC video" value="$60–$100" />
              <Rate row="Sponsored post" value="$100" />
              <Rate row="UGC images" value="$15+" />
            </div>
            <p className="mt-8 text-sm text-pearl/75">
              Brands she has worked with include BioSchwartz, Thinbi, Dr. Arthritis, MPG,
              Unlockt, and Simply Nature&apos;s Pledge.
            </p>
          </div>
        </div>
      </section>

      <section id="hire" className="bg-pearl px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-rose">Collaborate</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
              Send a brief. She&apos;ll manage the obligations in studio.
            </h2>
            <p className="mt-5 text-ink/70">
              Public inquiries land directly in Kayla&apos;s private portal — deadlines,
              deliverables, product tracking, guideline checklists, and payments in one place.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex text-sm font-semibold text-berry underline-offset-4 hover:underline"
            >
              Creator studio login →
            </Link>
          </div>
          <div className="rounded-[2rem] border border-ink/8 bg-white/60 p-6 md:p-8">
            <InquiryForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/8 px-6 py-10 text-sm text-ink/55">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-[family-name:var(--font-display)] text-xl text-ink">
            kaylathecreateher
          </p>
          <p>Beauty · Hair · Wellness · Lifestyle · Fashion</p>
        </div>
      </footer>
    </main>
  );
}

function Rate({ row, value }: { row: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-pearl/15 pb-3">
      <span className="text-pearl/80">{row}</span>
      <span className="font-[family-name:var(--font-display)] text-2xl">{value}</span>
    </div>
  );
}
