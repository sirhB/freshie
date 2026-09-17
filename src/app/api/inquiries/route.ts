import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createInquiry, serializeInquiry, setInquiryStatus } from "@/lib/inquiries";

const schema = z.object({
  brandName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  budget: z.string().optional(),
  platforms: z.string().optional(),
  message: z.string().min(10),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");

  const inquiries = await prisma.inquiry.findMany({
    where: {
      ...(status && status !== "all" ? { status } : {}),
      ...(source && source !== "all" ? { source } : {}),
    },
    include: {
      events: { orderBy: { createdAt: "desc" }, take: 8 },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    ok: true,
    inquiries: inquiries.map(serializeInquiry),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const inquiry = await createInquiry({ ...data, source: "web" });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid inquiry" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = z
      .object({ id: z.string(), status: z.string() })
      .parse(body);
    const inquiry = await setInquiryStatus(data.id, data.status);
    return NextResponse.json({ ok: true, inquiry: serializeInquiry(inquiry) });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
