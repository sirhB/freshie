/**
 * Email via Resend when RESEND_API_KEY is set; SMS via Twilio when configured.
 * Otherwise logs (so Studio still works in demo).
 */

export async function sendAlertEmail(opts: {
  to: string;
  subject: string;
  text: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_FROM_EMAIL || "Kayla Studio <onboarding@resend.dev>";
  if (!key) {
    console.info("[alerts:email:demo]", opts.to, opts.subject);
    return { ok: true, demo: true as const };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[alerts:email]", err);
    return { ok: false as const, demo: false as const, error: err };
  }
  return { ok: true as const, demo: false as const };
}

export async function sendAlertSms(opts: { to: string; body: string }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    console.info("[alerts:sms:demo]", opts.to, opts.body.slice(0, 80));
    return { ok: true, demo: true as const };
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const body = new URLSearchParams({ To: opts.to, From: from, Body: opts.body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[alerts:sms]", err);
    return { ok: false as const, demo: false as const, error: err };
  }
  return { ok: true as const, demo: false as const };
}

export async function dispatchNotificationChannels(opts: {
  user: {
    alertEmail?: string | null;
    email?: string;
    alertPhone?: string | null;
    emailAlertsOn?: boolean;
    smsAlertsOn?: boolean;
  };
  title: string;
  body: string;
  href?: string | null;
}) {
  const site = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const link = opts.href ? `${site.replace(/\/$/, "")}${opts.href}` : site;
  const text = `${opts.title}\n\n${opts.body}\n\n${link}`;
  let emailed = false;
  let sms = false;

  if (opts.user.emailAlertsOn !== false) {
    const to = opts.user.alertEmail || opts.user.email;
    if (to) {
      const r = await sendAlertEmail({ to, subject: opts.title, text });
      emailed = r.ok;
    }
  }
  if (opts.user.smsAlertsOn && opts.user.alertPhone) {
    const r = await sendAlertSms({
      to: opts.user.alertPhone,
      body: `${opts.title}: ${opts.body}`.slice(0, 320),
    });
    sms = r.ok;
  }
  return { emailed, sms };
}
