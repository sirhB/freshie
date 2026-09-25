import { NextResponse } from "next/server";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getInstagramConfig } from "@/lib/instagram";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      alertEmail: true,
      alertPhone: true,
      emailAlertsOn: true,
      smsAlertsOn: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ig = getInstagramConfig();
  return NextResponse.json({
    ok: true,
    user,
    instagram: {
      configured: ig.configured,
      autoReplyEnabled: ig.autoReplyEnabled,
      verifyToken: ig.verifyToken,
      webhookUrl: `${ig.siteUrl.replace(/\/$/, "")}/api/instagram/webhook`,
      hasAppSecret: Boolean(ig.appSecret),
      hasPageToken: Boolean(ig.pageAccessToken),
      hasBusinessId: Boolean(ig.businessAccountId),
    },
    alertsConfigured: {
      resend: Boolean(process.env.RESEND_API_KEY),
      twilio: Boolean(
        process.env.TWILIO_ACCOUNT_SID &&
          process.env.TWILIO_AUTH_TOKEN &&
          process.env.TWILIO_FROM_NUMBER,
      ),
    },
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = z
      .object({
        name: z.string().min(1).max(80).optional(),
        currentPassword: z.string().min(1).optional(),
        newPassword: z.string().min(8).max(128).optional(),
        alertEmail: z.string().email().nullable().optional().or(z.literal("")),
        alertPhone: z.string().max(40).nullable().optional().or(z.literal("")),
        emailAlertsOn: z.boolean().optional(),
        smsAlertsOn: z.boolean().optional(),
      })
      .parse(body);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (data.newPassword) {
      if (!data.currentPassword) {
        return NextResponse.json(
          { ok: false, error: "Current password required" },
          { status: 400 },
        );
      }
      const valid = await compare(data.currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { ok: false, error: "Current password is incorrect" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.newPassword
          ? { passwordHash: await hash(data.newPassword, 10) }
          : {}),
        ...(data.alertEmail !== undefined
          ? { alertEmail: data.alertEmail || null }
          : {}),
        ...(data.alertPhone !== undefined
          ? { alertPhone: data.alertPhone || null }
          : {}),
        ...(data.emailAlertsOn !== undefined
          ? { emailAlertsOn: data.emailAlertsOn }
          : {}),
        ...(data.smsAlertsOn !== undefined ? { smsAlertsOn: data.smsAlertsOn } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        alertEmail: true,
        alertPhone: true,
        emailAlertsOn: true,
        smsAlertsOn: true,
      },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }
    console.error("[settings]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
