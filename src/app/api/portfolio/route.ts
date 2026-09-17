import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const itemSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional().nullable(),
  platform: z.string().min(1),
  mediaUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  kind: z.string().default("reel"),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.portfolioItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = itemSchema.parse(await req.json());
    const max = await prisma.portfolioItem.aggregate({ _max: { sortOrder: true } });
    const item = await prisma.portfolioItem.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description ?? null,
        platform: data.platform,
        mediaUrl: data.mediaUrl || null,
        thumbnailUrl: data.thumbnailUrl || null,
        kind: data.kind || "reel",
        featured: data.featured ?? true,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? (max._max.sortOrder ?? -1) + 1,
      },
    });
    revalidatePath("/");
    revalidatePath("/studio/site");
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid item" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = z.string().parse(body.id);
    const data = itemSchema.partial().parse(body);
    const item = await prisma.portfolioItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.platform !== undefined ? { platform: data.platform } : {}),
        ...(data.mediaUrl !== undefined ? { mediaUrl: data.mediaUrl || null } : {}),
        ...(data.thumbnailUrl !== undefined
          ? { thumbnailUrl: data.thumbnailUrl || null }
          : {}),
        ...(data.kind !== undefined ? { kind: data.kind } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });
    revalidatePath("/");
    revalidatePath("/studio/site");
    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.portfolioItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/studio/site");
  return NextResponse.json({ ok: true });
}
