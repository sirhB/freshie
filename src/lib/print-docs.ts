import { formatDate, formatMoney } from "@/lib/format";

export function rateCardHtml(opts: {
  rates: { label: string; value: string }[];
  note: string;
  bookingUrl?: string;
  bookingLabel?: string;
}) {
  const rows = opts.rates
    .map(
      (r) =>
        `<tr><td style="padding:12px 0;border-bottom:1px solid #e8dce8">${escapeHtml(r.label)}</td><td style="padding:12px 0;border-bottom:1px solid #e8dce8;text-align:right;font-family:Georgia,serif;font-size:22px">${escapeHtml(r.value)}</td></tr>`,
    )
    .join("");
  const booking =
    opts.bookingUrl
      ? `<p style="margin-top:28px"><a href="${escapeHtml(opts.bookingUrl)}" style="display:inline-block;background:#6b2d5b;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none">${escapeHtml(opts.bookingLabel || "Book a call")}</a></p>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>kaylathecreateher — Rate card</title>
<style>
  body{font-family:system-ui,sans-serif;color:#2a1a2e;margin:0;background:#f7f1f6}
  .sheet{max-width:720px;margin:40px auto;background:#fff;padding:48px;border-radius:24px;box-shadow:0 20px 60px rgba(74,37,112,.12)}
  h1{font-family:Georgia,serif;font-size:42px;margin:0;color:#6b2d5b}
  .meta{color:#7a6678;margin:8px 0 28px;letter-spacing:.12em;text-transform:uppercase;font-size:12px}
  table{width:100%;border-collapse:collapse}
  .note{margin-top:24px;color:#5c4a5a;line-height:1.55}
  @media print{body{background:#fff}.sheet{box-shadow:none;margin:0;border-radius:0}}
</style></head>
<body>
  <div class="sheet">
    <p class="meta">Media kit · UGC · NYC</p>
    <h1>kaylathecreateher</h1>
    <p style="color:#5c4a5a;max-width:36rem">Natural hair, beauty, wellness, lifestyle &amp; fashion — English &amp; Spanish on camera. Typical delivery ~4 days.</p>
    <table>${rows}</table>
    <p class="note">${escapeHtml(opts.note)}</p>
    ${booking}
    <p style="margin-top:40px;font-size:12px;color:#9a8798">Print this page or Save as PDF from your browser.</p>
  </div>
  <script>window.addEventListener('load',()=>{setTimeout(()=>window.print(),400)})</script>
</body></html>`;
}

export function invoiceHtml(opts: {
  invoiceNumber: string;
  brandName: string;
  dealTitle: string;
  platform: string;
  contentType: string;
  rateCents: number;
  dueDate?: Date | null;
  publishDate?: Date | null;
  paymentLinkUrl?: string | null;
  briefSummary?: string | null;
}) {
  const payment = opts.paymentLinkUrl
    ? `<p style="margin-top:24px"><a href="${escapeHtml(opts.paymentLinkUrl)}" style="display:inline-block;background:#6b2d5b;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none">Pay invoice</a></p>`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Invoice ${escapeHtml(opts.invoiceNumber)}</title>
<style>
  body{font-family:system-ui,sans-serif;color:#2a1a2e;margin:0;background:#f7f1f6}
  .sheet{max-width:720px;margin:40px auto;background:#fff;padding:48px;border-radius:24px;box-shadow:0 20px 60px rgba(74,37,112,.12)}
  h1{font-family:Georgia,serif;font-size:36px;margin:0;color:#6b2d5b}
  .meta{color:#7a6678;margin:8px 0 28px;letter-spacing:.12em;text-transform:uppercase;font-size:12px}
  .row{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #eee}
  .amount{font-family:Georgia,serif;font-size:36px;margin-top:24px}
  @media print{body{background:#fff}.sheet{box-shadow:none;margin:0;border-radius:0}}
</style></head>
<body>
  <div class="sheet">
    <p class="meta">Invoice · kaylathecreateher</p>
    <h1>${escapeHtml(opts.invoiceNumber)}</h1>
    <p style="color:#5c4a5a">Bill to: <strong>${escapeHtml(opts.brandName)}</strong></p>
    <div class="row"><span>Project</span><span>${escapeHtml(opts.dealTitle)}</span></div>
    <div class="row"><span>Deliverable</span><span>${escapeHtml(opts.platform)} · ${escapeHtml(opts.contentType)}</span></div>
    <div class="row"><span>Due</span><span>${escapeHtml(formatDate(opts.dueDate))}</span></div>
    <div class="row"><span>Go-live</span><span>${escapeHtml(formatDate(opts.publishDate))}</span></div>
    ${opts.briefSummary ? `<p style="margin-top:20px;color:#5c4a5a;line-height:1.5">${escapeHtml(opts.briefSummary)}</p>` : ""}
    <p class="amount">${escapeHtml(formatMoney(opts.rateCents))}</p>
    <p style="color:#7a6678;font-size:13px">Payable to Kayla / kaylathecreateher · USD</p>
    ${payment}
    <p style="margin-top:40px;font-size:12px;color:#9a8798">Print or Save as PDF from your browser.</p>
  </div>
  <script>window.addEventListener('load',()=>{setTimeout(()=>window.print(),400)})</script>
</body></html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function nextInvoiceNumber(dealId: string) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `KTC-${stamp}-${dealId.slice(-4).toUpperCase()}`;
}
