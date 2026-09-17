# kaylathecreateher

Public media-kit site + private brand-obligations studio for UGC creator **kaylathecreateher**.

## Stack

- Next.js (App Router)
- Auth.js (credentials)
- Prisma + **PostgreSQL** (Vercel DB prefix: `DB_`)
- Instagram Messaging API webhook (official Meta)

## Setup

```bash
npm install
# Set DB_URL (see .env.example)
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Studio login (seeded)

- Email: `kayla@kaylathecreateher.com`
- Password: `createher2026`

## Vercel database (`DB_` prefix)

This app expects the Vercel storage prefix **`DB_`**, so the connection string is:

| Prisma / app env | Typical aliases (auto-mapped) |
|---|---|
| `DB_URL` | `DB_POSTGRES_PRISMA_URL`, `DB_POSTGRES_URL`, `DATABASE_URL` |

Also set on Vercel:

- `AUTH_SECRET` (required for login)
- `NEXTAUTH_URL` = `https://kaylathecreateher.vercel.app`

The public homepage will still render with fallback portfolio content if the DB URL is missing; studio/auth need a working Postgres URL.

Build runs `prisma migrate deploy` automatically when a DB URL is present.

After first deploy, seed once:

```bash
npx prisma db seed
```

(or run the seed script against production with the same `DB_*` URLs)

## What it includes

**Public**
- Brand-first landing / media kit
- Portfolio content styles
- Rates + niches
- Hire / inquiry form → saved to DB + live studio stream

**Private studio**
- Today dashboard, deals CRM, guideline checklists, deliverable pipeline, payments
- Live inquiries (SSE) + convert-to-deal
- Instagram bot (official webhook + auto-reply, demo simulate without tokens)

## Instagram bot

Webhook: `GET/POST /api/instagram/webhook`  
See `.env.example` for `INSTAGRAM_*` values.
