import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { deals: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ ok: true, brands });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = z
    .object({
      name: z.string().min(1),
      niche: z.string().optional().nullable(),
      website: z.string().optional().nullable(),
      contactName: z.string().optional().nullable(),
      contactEmail: z.string().optional().nullable(),
      contactPhone: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
      logoUrl: z.string().optional().nullable(),
    })
    .parse(await req.json());

  const brand = await prisma.brand.create({
    data: {
      name: data.name,
      niche: data.niche || null,
      website: data.website || null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      notes: data.notes || null,
      logoUrl: data.logoUrl || null,
    },
  });
  revalidatePath("/studio/brands");
  return NextResponse.json({ ok: true, brand });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = z
    .object({
      id: z.string(),
      name: z.string().min(1).optional(),
      niche: z.string().optional().nullable(),
      website: z.string().optional().nullable(),
      contactName: z.string().optional().nullable(),
      contactEmail: z.string().optional().nullable(),
      contactPhone: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
      logoUrl: z.string().optional().nullable(),
    })
    .parse(await req.json());

  const brand = await prisma.brand.update({
    where: { id: data.id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.niche !== undefined ? { niche: data.niche } : {}),
      ...(data.website !== undefined ? { website: data.website } : {}),
      ...(data.contactName !== undefined ? { contactName: data.contactName } : {}),
      ...(data.contactEmail !== undefined ? { contactEmail: data.contactEmail } : {}),
      ...(data.contactPhone !== undefined ? { contactPhone: data.contactPhone } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
    },
  });
  revalidatePath("/studio/brands");
  return NextResponse.json({ ok: true, brand });
}
