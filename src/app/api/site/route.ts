import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE, serializeSiteContent } from "@/lib/site-content";

async function ensureSite() {
  return prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: {},
      create: {
        id: "singleton",
        heroEyebrow: DEFAULT_SITE.heroEyebrow,
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
}

export async function GET() {
  try {
    const row = await ensureSite();
    return NextResponse.json({ ok: true, site: serializeSiteContent(row) });
  } catch (error) {
    console.error("[site] GET failed", error);
    return NextResponse.json({ ok: true, site: DEFAULT_SITE });
  }
}

const siteSchema = z.object({
  heroEyebrow: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroTagline: z.string().min(1),
  workEyebrow: z.string().min(1),
  workHeadline: z.string().min(1),
  aboutEyebrow: z.string().min(1),
  aboutHeadline: z.string().min(1),
  aboutBody: z.string().min(1),
  aboutBullets: z.array(z.string()).min(1),
  ratesEyebrow: z.string().min(1),
  rates: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  ratesNote: z.string().min(1),
  hireEyebrow: z.string().min(1),
  hireHeadline: z.string().min(1),
  hireBody: z.string().min(1),
  socialEyebrow: z.string().min(1),
  socialHeadline: z.string().min(1),
  socials: z
    .array(z.object({ platform: z.string(), label: z.string(), url: z.string() }))
    .min(1),
  footerLine: z.string().min(1),
});

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = siteSchema.parse(await req.json());
    await ensureSite();
    const row = await prisma.siteContent.update({
      where: { id: "singleton" },
      data: {
        heroEyebrow: data.heroEyebrow,
        heroHeadline: data.heroHeadline,
        heroTagline: data.heroTagline,
        workEyebrow: data.workEyebrow,
        workHeadline: data.workHeadline,
        aboutEyebrow: data.aboutEyebrow,
        aboutHeadline: data.aboutHeadline,
        aboutBody: data.aboutBody,
        aboutBullets: JSON.stringify(data.aboutBullets),
        ratesEyebrow: data.ratesEyebrow,
        ratesJson: JSON.stringify(data.rates),
        ratesNote: data.ratesNote,
        hireEyebrow: data.hireEyebrow,
        hireHeadline: data.hireHeadline,
        hireBody: data.hireBody,
        socialEyebrow: data.socialEyebrow,
        socialHeadline: data.socialHeadline,
        socialsJson: JSON.stringify(data.socials),
        footerLine: data.footerLine,
      },
    });
    revalidatePath("/");
    revalidatePath("/studio/site");
    return NextResponse.json({ ok: true, site: serializeSiteContent(row) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid site content" }, { status: 400 });
    }
    console.error("[site] PUT failed", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
