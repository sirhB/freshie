# kaylathecreateher

Public media-kit site + private brand-obligations studio for UGC creator **kaylathecreateher**.

## Stack

- Next.js (App Router)
- Auth.js (credentials)
- Prisma + SQLite

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
- Hire / inquiry form → saved to DB

**Private studio**
- Today dashboard (deadlines, production queue, product transit, outstanding pay)
- Deals CRM with briefs, guidelines, checklists
- Deliverable pipeline (todo → live)
- Inquiry triage
- Payment tracking

## Env

Copy `.env.example` to `.env` if needed.
