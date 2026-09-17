import { createHmac, timingSafeEqual } from "crypto";

const GRAPH_VERSION = "v21.0";

export function instagramConfigured() {
  return Boolean(
    process.env.INSTAGRAM_PAGE_ACCESS_TOKEN &&
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  );
}

export function getInstagramConfig() {
  return {
    configured: instagramConfigured(),
    verifyToken: process.env.INSTAGRAM_VERIFY_TOKEN || "kayla-createher-verify",
    appSecret: process.env.INSTAGRAM_APP_SECRET || "",
    pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || "",
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "",
    autoReplyEnabled: process.env.INSTAGRAM_AUTO_REPLY !== "false",
    siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  };
}

export function defaultAutoReplyText(siteUrl: string) {
  return [
    "Hey! Thanks for reaching out to kaylathecreateher ✨",
    "I create soft glam UGC for hair, beauty, wellness & lifestyle — how-tos, unboxings, demos, and reviews (usually ~4 day turnaround).",
    `Send a brief here and I’ll triage it in studio: ${siteUrl}/#hire`,
    "Rates typically start around $60–$100 per video. Looking forward to collabing!",
  ].join("\n\n");
}

export function verifyMetaSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.INSTAGRAM_APP_SECRET;
  if (!secret) {
    // Dev/demo without app secret: allow payloads (simulate + local webhook tests)
    return true;
  }
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signatureHeader.slice("sha256=".length);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch {
    return false;
  }
}

export type IncomingIgMessage = {
  senderId: string;
  messageId: string;
  text: string;
  timestamp: number;
};

type MetaMessagingPayload = {
  object?: string;
  entry?: Array<{
    id?: string;
    time?: number;
    messaging?: Array<{
      sender?: { id?: string };
      recipient?: { id?: string };
      timestamp?: number;
      message?: {
        mid?: string;
        text?: string;
        is_echo?: boolean;
      };
    }>;
  }>;
};

export function extractIncomingMessages(body: MetaMessagingPayload): IncomingIgMessage[] {
  const messages: IncomingIgMessage[] = [];
  if (!body?.entry) return messages;

  for (const entry of body.entry) {
    for (const event of entry.messaging || []) {
      const text = event.message?.text?.trim();
      const senderId = event.sender?.id;
      const mid = event.message?.mid;
      if (!text || !senderId || !mid) continue;
      if (event.message?.is_echo) continue;
      messages.push({
        senderId,
        messageId: mid,
        text,
        timestamp: event.timestamp || Date.now(),
      });
    }
  }
  return messages;
}

export async function sendInstagramMessage(recipientId: string, text: string) {
  const { pageAccessToken, configured } = getInstagramConfig();
  if (!configured) {
    return { ok: false as const, demo: true as const, error: "Instagram not configured" };
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/me/messages?access_token=${encodeURIComponent(pageAccessToken)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false as const,
      demo: false as const,
      error: typeof json?.error?.message === "string" ? json.error.message : "Graph API error",
    };
  }
  return { ok: true as const, demo: false as const, data: json };
}

export function guessBrandFromMessage(text: string, fallbackName: string) {
  const brandMatch = text.match(
    /(?:brand|from|with)\s+([A-Z][\w&'.]*(?:\s+[A-Z][\w&'.]*){0,3})/,
  );
  if (brandMatch?.[1]) return brandMatch[1].trim();
  return fallbackName;
}
