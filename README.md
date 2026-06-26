# Placidchills — Producer Business Platform

Official website and business infrastructure for **Placidchills** (Soumyajit) — music producer, beat licensing, custom production, and mastering services in the desi hip hop scene.

## What this is

A production-ready **Next.js** application that scales from a marketing site to a full commerce platform:

| Layer | Tech | Purpose |
|-------|------|---------|
| Frontend | Next.js 16, React, TypeScript | Marketing site, beat store UI, legal pages |
| Backend | Next.js API Routes | Beats, leads, inquiries, payments |
| Database | Prisma + PostgreSQL (Neon) | Leads, inquiries, orders |
| Beat CMS | Airtable (optional) | Live beat catalogue with Payhip links |
| Beat checkout | Payhip | Instant download + licensing |
| Payments | Razorpay | Mastering & custom production |
| Email marketing | MailerLite | Free beat funnel + newsletter |
| Email transactional | Resend | Inquiry confirmations, payment emails |

## Documentation

**Operating blueprint:** [`/docs`](./docs/) — architecture, roadmap, sprints, ADRs, and AI instructions.  
Start with [`docs/00_PROJECT_CONTEXT.md`](./docs/00_PROJECT_CONTEXT.md) and [`docs/10_AI_INSTRUCTIONS.md`](./docs/10_AI_INSTRUCTIONS.md).

## Project structure

```
Artist_Website/
├── docs/                # Operating blueprint (single source of truth)
├── legacy/              # Original HTML mockups (reference)
├── web/                 # Next.js application
│   ├── src/
│   │   ├── app/         # Routes & API
│   │   ├── components/  # UI components
│   │   ├── config/      # Brand, pricing (single source of truth)
│   │   ├── content/     # Legal page HTML
│   │   ├── lib/         # Integrations (Airtable, Razorpay, MailerLite, Resend)
│   │   └── styles/      # Design system CSS from mockups
│   └── prisma/          # Database schema
└── README.md
```

## Quick start

```bash
cd web
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Neon for prod) |
| `RESEND_API_KEY` | Transactional email (inquiry confirmations) |
| `EMAIL_FROM` | Sender address (must be verified in Resend) |
| `ADMIN_EMAIL` | Founder inbox for new inquiry notifications |
| `UPSTASH_REDIS_*` | Rate limiting (optional in dev — in-memory fallback) |
| `AIRTABLE_*` | Beat catalogue CMS |
| `RAZORPAY_*` | Mastering payments (India) |
| `MAILERLITE_*` | Email capture for free beat funnel |

## Pricing (configured in `src/config/site.ts`)

| Service | Price |
|---------|-------|
| MP3 Lease | ₹2,500 |
| WAV Lease | ₹5,000 |
| Stems Lease | ₹10,000 |
| Exclusive Rights | ₹15,000–20,000 |
| Mastering (single) | ₹1,000 |
| Mastering EP | ₹4,000 |
| Rush add-on | ₹500 |

Update `src/config/site.ts` to change pricing site-wide.

## Deployment

**Recommended:** Vercel + Neon PostgreSQL

1. Create a [Neon](https://neon.tech) project and copy the **pooled** connection string
2. Import the repo to [Vercel](https://vercel.com) with root directory `web`
3. Set environment variables in Vercel dashboard (see `.env.example`)
4. Verify Resend domain (SPF/DKIM) before going live
5. Point domain DNS to Vercel

Vercel runs `prisma migrate deploy` automatically via `vercel.json` before each build.

## CI

GitHub Actions runs lint and build on every push/PR to `main`. See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch strategy, sprint workflow, and PR checklist.

**Branch model:** `main` is always deployable (production). Sprint work happens on `feat/sprint-N-*` branches and merges via PR when acceptance criteria are met.

## Legacy files

Original single-file HTML designs are preserved in `/legacy` for reference.
