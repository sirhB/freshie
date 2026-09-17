import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/db-url";
import {
  DEFAULT_SITE,
  FALLBACK_PORTFOLIO,
  serializeSiteContent,
  type PortfolioShape,
} from "@/lib/site-content";
import { StudioPageHeader } from "@/components/studio/StudioUI";
import { SiteEditor } from "@/components/studio/SiteEditor";

export const dynamic = "force-dynamic";

async function loadSite() {
  if (!hasDatabaseUrl()) return DEFAULT_SITE;
  try {
    const row = await prisma.siteContent.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        heroEyebrow: DEFAULT_SITE.heroEyebrow,
        heroImageUrl: DEFAULT_SITE.heroImageUrl,
        aboutEyebrow: DEFAULT_SITE.aboutEyebrow,
        aboutHeadline: DEFAULT_SITE.aboutHeadline,
        aboutBody: DEFAULT_SITE.aboutBody,
        aboutBullets: JSON.stringify(DEFAULT_SITE.aboutBullets),
        ratesJson: JSON.stringify(DEFAULT_SITE.rates),
        ratesNote: DEFAULT_SITE.ratesNote,
        socialsJson: JSON.stringify(DEFAULT_SITE.socials),
        workHeadline: DEFAULT_SITE.workHeadline,
        footerLine: DEFAULT_SITE.footerLine,
      },
    });
    return serializeSiteContent(row);
  } catch {
    return DEFAULT_SITE;
  }
}

async function loadItems(): Promise<PortfolioShape[]> {
  if (!hasDatabaseUrl()) return FALLBACK_PORTFOLIO;
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return items.length > 0 ? items : FALLBACK_PORTFOLIO;
  } catch {
    return FALLBACK_PORTFOLIO;
  }
}

export default async function SiteCmsPage() {
  await auth();
  const [site, items] = await Promise.all([loadSite(), loadItems()]);

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Public site"
        title="Edit homepage"
        description="Visual WYSIWYG editor — click text to edit, upload hero and reel images, then save to publish."
      />
      <SiteEditor initialSite={site} initialItems={items} />
    </div>
  );
}
