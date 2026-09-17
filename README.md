# kaylathecreateher

Public media-kit site + private brand-obligations studio for UGC creator **kaylathecreateher**.

## Stack

- Next.js (App Router)
- Auth.js (credentials)
- Prisma + SQLite
- Instagram Messaging API webhook (official Meta)

## Setup

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Studio login (seeded)

- Email: `kayla@kaylathecreateher.com`
- Password: `createher2026`

## What it includes

**Public**
- Brand-first landing / media kit
- Portfolio content styles
- Rates + niches
- Hire / inquiry form → saved to DB + live studio stream

**Private studio**
- Today dashboard (deadlines, production queue, product transit, outstanding pay)
- Deals CRM with briefs, guidelines, checklists
- Deliverable pipeline (todo → live)
- **Live inquiries** (SSE): status filters, activity log, convert-to-deal
- **Instagram bot** (official webhook + auto-reply)
- Payment tracking

## Live inquiry tracking

- Public form and Instagram DMs publish into an in-process event bus
- Studio `/studio/inquiries` opens an SSE stream at `/api/inquiries/stream`
- Status changes and conversions write `InquiryEvent` activity rows
- **Convert to deal** creates a negotiating deal + starter checklist

## Instagram bot (official)

Webhook endpoint: `GET/POST /api/instagram/webhook`

1. Create a Meta app with Instagram Messaging
2. Connect Kayla’s Instagram Professional account + Page
3. Set callback URL to `https://YOUR_DOMAIN/api/instagram/webhook`
4. Use verify token matching `INSTAGRAM_VERIFY_TOKEN`
5. Fill env vars from `.env.example`

Without tokens, studio stays in **demo mode** — use **Simulate Instagram DM** to exercise intake + auto-reply logging.

Auto-reply copy points brands to `/#hire` and shares Kayla’s rate range / turnaround.

## Env

Copy `.env.example` to `.env` and fill Instagram values when ready to go live.
