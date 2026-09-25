import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/db-url";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE, serializeSiteContent } from "@/lib/site-content";
import { rateCardHtml } from "@/lib/print-docs";

export const dynamic = "force-dynamic";

export async function GET() {
  let site = DEFAULT_SITE;
  if (hasDatabaseUrl()) {
    try {
      const row = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
      if (row) site = serializeSiteContent(row);
    } catch (error) {
      console.error("[rate-card]", error);
    }
  }

  const html = rateCardHtml({
    rates: site.rates,
    note: site.ratesNote,
    bookingUrl: site.bookingUrl,
    bookingLabel: site.bookingLabel,
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
