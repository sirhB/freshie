import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
  createInquiry,
  logInquiryEvent,
  serializeInquiry,
} from "@/lib/inquiries";
import { publishInquiryEvent } from "@/lib/inquiry-bus";
import {
  defaultAutoReplyText,
  getInstagramConfig,
  sendInstagramMessage,
} from "@/lib/instagram";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  text: z.string().min(3),
  senderName: z.string().optional(),
  brandName: z.string().optional(),
  senderId: z.string().optional(),
});

/** Studio-only helper to demo IG DM intake when Meta tokens aren't connected yet. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.parse(await req.json());
  const config = getInstagramConfig();
  const senderId = body.senderId || `demo_${Date.now()}`;
  const brandName = body.brandName || "Glow Ritual Co.";
  const contactName = body.senderName || "IG Brand Scout";

  const inquiry = await createInquiry({
    brandName,
    contactName,
    email: `ig.${senderId}@instagram.local`,
    platforms: "Instagram DM",
    message: body.text,
    source: config.configured ? "instagram" : "demo",
    igSenderId: senderId,
    externalThreadId: `sim_${Date.now()}`,
    ownerId: session.user.id,
  });

  const reply = defaultAutoReplyText(config.siteUrl);
  const sent = await sendInstagramMessage(senderId, reply);

  await prisma.inquiry.update({
    where: { id: inquiry.id },
    data: {
      autoRepliedAt: new Date(),
      status: "reviewed",
    },
  });

  await logInquiryEvent(
    inquiry.id,
    "auto_replied",
    sent.ok
      ? "Auto-reply sent via Instagram Messaging API"
      : "Demo auto-reply logged (connect INSTAGRAM_PAGE_ACCESS_TOKEN to send live)",
    { demo: !sent.ok, reply },
  );
  publishInquiryEvent("inquiry.updated", inquiry.id);

  const full = await prisma.inquiry.findUnique({
    where: { id: inquiry.id },
    include: { events: { orderBy: { createdAt: "desc" }, take: 8 } },
  });

  return NextResponse.json({
    ok: true,
    configured: config.configured,
    inquiry: full ? serializeInquiry(full) : null,
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    ...getInstagramConfig(),
    pageAccessToken: undefined,
    appSecret: undefined,
  });
}
