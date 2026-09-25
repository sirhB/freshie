# kaylathecreateher

Public media-kit site + private brand-obligations studio for UGC creator **kaylathecreateher**.

## Stack

- Next.js (App Router)
- Auth.js (credentials)
- Prisma + **PostgreSQL** (Vercel DB prefix: `DB_`)
- Vercel Blob for durable uploads (`BLOB_READ_WRITE_TOKEN`)
- Instagram Messaging API webhook (official Meta)

## Setup

```bash
npm install
cp .env.example .env   # fill DB_URL + AUTH_SECRET
npx prisma migrate deploy
SEED_RESET=true npm run db:seed   # local/dev only — wipes then seeds
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

After first login, change the password under **Studio → Settings**.

### Seed safety

| Command | Behavior |
|---|---|
| `npm run db:seed` | Upserts owner + site content; adds demo deals **only if none exist** |
| `SEED_RESET=true npm run db:seed` | **Wipes** DB then seeds (local/dev only — never on production with real data) |

Production: run migrate via build; seed **once** on an empty DB, then have Kayla change her password. Do **not** re-run `SEED_RESET` in production.

## Vercel environment

| Variable | Required | Notes |
|---|---|---|
| `DB_URL` | yes | Vercel Postgres (`DB_` prefix). Aliases: `DB_POSTGRES_PRISMA_URL`, `DB_POSTGRES_URL`, `DATABASE_URL` |
| `AUTH_SECRET` | yes | Required in production (no insecure fallback) |
| `NEXTAUTH_URL` | yes | Exact public origin, e.g. `https://kaylathecreateher.vercel.app` or custom domain |
| `BLOB_READ_WRITE_TOKEN` | yes (prod) | Vercel Blob — site images + deal files |
| `INSTAGRAM_VERIFY_TOKEN` | for IG | Must match Meta webhook verify token |
| `INSTAGRAM_APP_SECRET` | for IG | Required in production to accept webhooks |
| `INSTAGRAM_PAGE_ACCESS_TOKEN` | for IG | Page token for sending replies |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | for IG | Marks Instagram as “connected” in Settings |
| `INSTAGRAM_AUTO_REPLY` | optional | Default on; set `false` to disable |

Build runs `prisma migrate deploy` when a DB URL is present.

## Instagram Messaging checklist

1. Instagram Professional account linked to a Facebook Page.
2. Meta Developer App → subscribe to `messages`.
3. Callback URL: `{NEXTAUTH_URL}/api/instagram/webhook` (copy from **Studio → Settings**).
4. Verify token = `INSTAGRAM_VERIFY_TOKEN`.
5. Set the Instagram env vars on Vercel and redeploy.
6. Test DM → appears in **Inquiries** → auto-reply (if enabled) → **Convert to deal**.

Until tokens are set, use **Simulate Instagram DM** on the Inquiries board.

Webhook routes: `GET/POST /api/instagram/webhook`. Studio reply: `POST /api/instagram/reply`.

## What it includes

**Public**
- Brand-first landing / media kit (editable in Studio → Site)
- Instagram reels, socials (IG / YouTube / Threads / email), About me, rates
- Hire / inquiry form → DB + live studio stream

**Private studio**
- Today, deals CRM, guideline checklists, deliverable pipeline, calendar, payments, alerts
- Live inquiries (SSE) + convert-to-deal + Instagram reply
- Site CMS (WYSIWYG + image uploads via Blob)
- Settings (password + Instagram connection status)
- Getting Started guide (`/studio/getting-started`)
