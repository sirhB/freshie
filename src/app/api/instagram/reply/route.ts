import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addInquiryMessage, logInquiryEvent } from "@/lib/inquiries";
import { publishInquiryEvent } from "@/lib/inquiry-bus";
import { sendInstagramMessage } from "@/lib/instagram";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = z
      .object({
        inquiryId: z.string().min(1),
        message: z.string().min(1).max(1000),
      })
      .parse(body);

    const inquiry = await prisma.inquiry.findUnique({ where: { id: data.inquiryId } });
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!inquiry.igSenderId) {
      return NextResponse.json(
        { ok: false, error: "This inquiry has no Instagram sender id" },
        { status: 400 },
      );
    }

    const sent = await sendInstagramMessage(inquiry.igSenderId, data.message);
    if (!sent.ok && !sent.demo) {
      return NextResponse.json({ ok: false, error: sent.error }, { status: 502 });
    }

    await addInquiryMessage({
      inquiryId: inquiry.id,
      direction: "outbound",
      body: data.message,
    });
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { status: inquiry.status === "converted" ? inquiry.status : "replied" },
    });
    await logInquiryEvent(
      inquiry.id,
      "note",
      sent.demo
        ? `Demo reply logged (connect Meta tokens to send live): ${data.message.slice(0, 160)}`
        : `Studio reply sent: ${data.message.slice(0, 160)}`,
      { demo: Boolean(sent.demo) },
    );
    publishInquiryEvent("inquiry.updated", inquiry.id);

    return NextResponse.json({ ok: true, demo: Boolean(sent.demo) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }
    console.error("[instagram/reply]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
