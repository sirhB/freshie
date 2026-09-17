import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  brandName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  budget: z.string().optional(),
  platforms: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const owner = await prisma.user.findFirst({ where: { role: "owner" } });

    const inquiry = await prisma.inquiry.create({
      data: {
        ...data,
        ownerId: owner?.id,
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid inquiry" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
