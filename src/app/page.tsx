import Image from "next/image";
import Link from "next/link";
import { hasDatabaseUrl } from "@/lib/db-url";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SITE,
  FALLBACK_PORTFOLIO,
  serializeSiteContent,
  type PortfolioShape,
  type SiteContentShape,
} from "@/lib/site-content";
import { SiteHeader } from "@/components/SiteHeader";
import { InquiryForm } from "@/components/InquiryForm";
import { WorkReelGrid } from "@/components/WorkReelGrid";
import { SocialLinksSection } from "@/components/SocialLinksSection";

export const dynamic = "force-dynamic";

async function getSite(): Promise<SiteContentShape> {
  if (!hasDatabaseUrl()) return DEFAULT_SITE;
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
    return row ? serializeSiteContent(row) : DEFAULT_SITE;
  } catch (error) {
    console.error("[home] site content failed", error);
    return DEFAULT_SITE;
  }
}

async function getPortfolio(): Promise<PortfolioShape[]> {
  if (!hasDatabaseUrl()) {
    return FALLBACK_PORTFOLIO;
  }

  try {
    const items = await prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    return items.length > 0 ? items : FALLBACK_PORTFOLIO;
  } catch (error) {
    console.error("[home] portfolio query failed; using fallback", error);
    return FALLBACK_PORTFOLIO;
  }
}

export default async function HomePage() {
  const [site, portfolio] = await Promise.all([getSite(), getPortfolio()]);

  return (
    <main className="overflow-x-hidden">
      <section className="relative min-h-[100svh] overflow-hidden text-pearl">
        <Image
          src="/kayla-hero.jpg"
          alt="Kayla — kaylathecreateher, natural hair and beauty creator in New York City"
          fill
          priority
          sizes="100vw"
          className="hero-portrait object-cover object-[center_20%] md:object-[72%_18%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-violet/95 via-violet/55 to-violet/20 md:via-violet/40 md:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-violet/40"
          aria-hidden
        />
        <div className="hero-grain absolute inset-0 opacity-[0.18]" aria-hidden />
        <SiteHeader />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:justify-center md:pb-24">
          <div className="max-w-xl md:max-w-lg">
            <p className="reveal text-sm uppercase tracking-[0.28em] text-champagne/90">
              {site.heroEyebrow}
            </p>
            <h1 className="reveal-delay mt-4 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              <span className="brand-sheen">{site.heroHeadline}</span>
            </h1>
            <p className="reveal-delay-2 mt-6 text-base text-pearl/90 md:text-lg">
              {site.heroTagline}
            </p>
            <div className="reveal-delay-2 mt-8 flex flex-wrap gap-3">
              <a
                href="#hire"
                className="rounded-full bg-pearl px-6 py-3 text-sm font-semibold text-violet transition hover:bg-lilac"
              >
                Hire Kayla
              </a>
              <a
                href="#work"
                className="rounded-full border border-pearl/35 px-6 py-3 text-sm text-pearl transition hover:bg-pearl/10"
              >
                Watch reels
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden>
          <span className="scroll-cue block h-8 w-px bg-gradient-to-b from-pearl/0 via-pearl/70 to-pearl/0" />
        </div>
      </section>

      <section id="work" className="relative bg-pearl px-6 py-20 md:py-28">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.22em] text-rose">{site.workEyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            {site.workHeadline}
          </h2>
          <WorkReelGrid items={portfolio} />
          <p className="mt-8 text-sm text-ink/50">
            More on{" "}
            <a
              href="https://www.instagram.com/kaylathecreateher/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-berry hover:underline"
            >
              Instagram @kaylathecreateher
            </a>
          </p>
        </div>
      </section>

      <SocialLinksSection
        eyebrow={site.socialEyebrow}
        headline={site.socialHeadline}
        socials={site.socials}
      />

      <section id="offer" className="relative overflow-hidden px-6 py-20 md:py-28">
        <div
          className="absolute inset-0 bg-gradient-to-br from-mist via-blush/40 to-lilac/30"
          aria-hidden
        />
        <div
          className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-rose/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-berry">{site.aboutEyebrow}</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
              {site.aboutHeadline}
            </h2>
            <p className="mt-5 max-w-xl text-ink/70">{site.aboutBody}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-berry/80">
              <span>New York City</span>
              <span>English &amp; Spanish</span>
              <span>On camera</span>
              <span>~4 day delivery</span>
            </div>
            <ul className="mt-8 space-y-4 text-sm text-ink/80">
              {site.aboutBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-berry" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rate-panel rounded-[2rem] bg-violet px-8 py-10 text-pearl shadow-[0_24px_60px_-28px_rgba(74,37,112,0.55)]">
            <p className="text-sm uppercase tracking-[0.2em] text-champagne">{site.ratesEyebrow}</p>
            <div className="mt-6 space-y-5">
              {site.rates.map((rate) => (
                <Rate key={rate.label} row={rate.label} value={rate.value} />
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-pearl/75">{site.ratesNote}</p>
          </div>
        </div>
      </section>

      <section id="hire" className="relative bg-pearl px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-rose">{site.hireEyebrow}</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
              {site.hireHeadline}
            </h2>
            <p className="mt-5 text-ink/70">{site.hireBody}</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink/55">
              <span>TikTok · Instagram · YouTube · Amazon</span>
              <span>NYC-based · English &amp; Spanish</span>
            </div>
            <Link
              href="/login"
              className="mt-8 inline-flex text-sm font-semibold text-berry underline-offset-4 hover:underline"
            >
              Creator studio login →
            </Link>
          </div>
          <div className="rounded-[2rem] border border-berry/15 bg-gradient-to-b from-white/90 to-mist/80 p-6 md:p-8">
            <InquiryForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-berry/10 bg-mist/40 px-6 py-12 text-sm text-ink/55">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl text-berry">
              {site.heroHeadline}
            </p>
            <p className="mt-1">{site.footerLine}</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="#work" className="hover:text-berry">
              Work
            </a>
            <a href="#socials" className="hover:text-berry">
              Socials
            </a>
            <a href="#hire" className="hover:text-berry">
              Hire
            </a>
            <Link href="/login" className="hover:text-berry">
              Studio
            </Link>
          </div>
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
