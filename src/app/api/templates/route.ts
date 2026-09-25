import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_DEAL_TEMPLATES } from "@/lib/deal-templates";

async function ensureTemplates() {
  const count = await prisma.dealTemplate.count();
  if (count === 0) {
    await prisma.dealTemplate.createMany({ data: DEFAULT_DEAL_TEMPLATES });
  }
  return prisma.dealTemplate.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const templates = await ensureTemplates();
  return NextResponse.json({ ok: true, templates });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = z
    .object({
      name: z.string().min(1),
      platform: z.string().min(1),
      contentType: z.string().min(1),
      rateCents: z.number().int().nonnegative().default(10000),
      briefSummary: z.string().optional().nullable(),
      guidelines: z.string().optional().nullable(),
      talkingPoints: z.string().optional().nullable(),
      usageRightsDays: z.number().int().optional().nullable(),
      deliverablesJson: z.string().optional(),
      checklistJson: z.string().optional(),
    })
    .parse(await req.json());

  const max = await prisma.dealTemplate.aggregate({ _max: { sortOrder: true } });
  const template = await prisma.dealTemplate.create({
    data: {
      name: data.name,
      platform: data.platform,
      contentType: data.contentType,
      rateCents: data.rateCents,
      briefSummary: data.briefSummary || null,
      guidelines: data.guidelines || null,
      talkingPoints: data.talkingPoints || null,
      usageRightsDays: data.usageRightsDays ?? 90,
      deliverablesJson:
        data.deliverablesJson ||
        JSON.stringify([{ title: `${data.platform} ${data.contentType}`, format: "video" }]),
      checklistJson:
        data.checklistJson ||
        JSON.stringify(["Confirm brief", "Film", "Self-QC", "Deliver"]),
      sortOrder: (max._max.sortOrder ?? -1) + 1,
    },
  });
  revalidatePath("/studio/templates");
  return NextResponse.json({ ok: true, template });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.dealTemplate.delete({ where: { id } });
  revalidatePath("/studio/templates");
  return NextResponse.json({ ok: true });
}
