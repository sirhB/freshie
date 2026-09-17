import { NextResponse } from "next/server";
import {
  createInquiry,
  logInquiryEvent,
  serializeInquiry,
} from "@/lib/inquiries";
import { publishInquiryEvent } from "@/lib/inquiry-bus";
import {
  defaultAutoReplyText,
  extractIncomingMessages,
  getInstagramConfig,
  guessBrandFromMessage,
  sendInstagramMessage,
  verifyMetaSignature,
} from "@/lib/instagram";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const { verifyToken } = getInstagramConfig();

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Verification failed",
      hint: "Set INSTAGRAM_VERIFY_TOKEN to match Meta webhook verify token",
    },
    { status: 403 },
  );
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const config = getInstagramConfig();
  const messages = extractIncomingMessages(body as never);
  const createdIds: string[] = [];

  for (const msg of messages) {
    const existing = await prisma.inquiry.findFirst({
      where: { externalThreadId: msg.messageId },
    });
    if (existing) continue;

    const brandName = guessBrandFromMessage(msg.text, `IG lead ${msg.senderId.slice(-4)}`);
    const inquiry = await createInquiry({
      brandName,
      contactName: `Instagram ${msg.senderId.slice(-6)}`,
      email: `ig.${msg.senderId}@instagram.local`,
      platforms: "Instagram DM",
      message: msg.text,
      source: "instagram",
      igSenderId: msg.senderId,
      externalThreadId: msg.messageId,
    });
    createdIds.push(inquiry.id);

    if (config.autoReplyEnabled) {
      const reply = defaultAutoReplyText(config.siteUrl);
      const sent = await sendInstagramMessage(msg.senderId, reply);

      if (sent.ok || sent.demo) {
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
          sent.demo
            ? "Demo mode: auto-reply queued (connect Meta tokens to send live)"
            : "Auto-reply sent via Instagram Messaging API",
          { demo: Boolean(sent.demo), replyPreview: reply.slice(0, 120) },
        );
        publishInquiryEvent("inquiry.updated", inquiry.id);
      } else {
        await logInquiryEvent(
          inquiry.id,
          "note",
          `Auto-reply failed: ${sent.error}`,
        );
      }
    }
  }

  return NextResponse.json({ ok: true, created: createdIds.length, ids: createdIds });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
