# Project Context

> **Status:** Living document · Last updated: 2026-06-26  
> **Authority:** This file + `/docs` are the single source of truth for the Placidchills platform.

---

## What This Project Is

**Placidchills** is the digital operating system for Soumyajit's music business — not a portfolio website.

It exists to:

- Generate leads
- Convert visitors into paying clients
- Build trust
- Collect emails
- Automate customer communication
- Accept secure payments
- Deliver digital products
- Manage clients
- Build long-term customer relationships

The repository will evolve from a marketing site with basic backend scaffolding into a full music business platform over 5–10 years.

---

## What This Project Is Not

- A static portfolio
- A beat marketplace for other producers
- An enterprise SaaS product (yet)
- A reason to pay for infrastructure before revenue exists

---

## Repository Layout

```
Artist_Website/
├── docs/                 ← Operating blueprint (you are here)
├── legacy/               ← Original HTML mockups (reference only, do not extend)
├── web/                  ← Next.js application (all production code)
│   ├── prisma/           ← Database schema & migrations
│   └── src/
│       ├── app/          ← Routes & API
│       ├── components/   ← UI
│       ├── config/       ← Brand, pricing (site.ts)
│       ├── content/      ← Legal page HTML
│       ├── lib/          ← Integrations & services
│       └── styles/       ← Design system CSS
└── README.md             ← Quick start (points to /docs for architecture)
```

---

## Current Maturity

| Area | Status |
|------|--------|
| Marketing homepage | Built — testimonials hidden until real quotes |
| Inquiry form | Saves to DB + sends Resend confirmation & admin notification |
| Newsletter capture | DB + MailerLite sync + rate limiting |
| Beat store UI | Built — Payhip checkout, static/Airtable beats |
| Mastering payments | API only — no frontend checkout |
| Admin dashboard | Not started |
| Client portal | Not started |
| Analytics | Not implemented |
| Production deployment | Configured — awaiting founder Vercel + Neon setup |

**Phase:** 0.5 — pre-revenue scaffolding with strong marketing foundation.

---

## Business Priority Order

1. Custom Music Production (highest ticket)
2. Mastering (fast turnaround, self-serve potential)
3. Beat Licensing (volume, self-serve via Payhip)
4. Newsletter (audience building)
5. Digital Products (future)
6. Community (future)
7. Client Portal (future)

Every technical decision should optimize these priorities in order.

---

## Technology Stack (Current)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19, custom CSS (+ Tailwind imported, minimal use) |
| Validation | Zod |
| ORM | Prisma 6 |
| Database (dev) | PostgreSQL (Neon branch or local) |
| Database (prod) | PostgreSQL (Neon free tier) |
| Beat CMS | Airtable (optional) |
| Beat checkout | Payhip |
| Payments | Razorpay |
| Email marketing | MailerLite |
| Hosting target | Vercel |

See [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md) and [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md) for rationale.

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `web/src/config/site.ts` | Brand, pricing, license tiers — single source of truth |
| `web/prisma/schema.prisma` | Database models |
| `web/.env.example` | Required environment variables |
| `web/src/lib/beats.ts` | Beat catalogue (Airtable + static fallback) |
| `web/src/lib/razorpay.ts` | Payment provider |
| `web/src/lib/mailerlite.ts` | Email list provider |
| `web/src/app/api/inquiries/route.ts` | Lead capture endpoint |
| `web/src/app/api/payments/razorpay/route.ts` | Order creation |
| `web/src/app/api/webhooks/razorpay/route.ts` | Payment confirmation |

---

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL          # Public site URL
DATABASE_URL                  # PostgreSQL (Neon pooled connection in prod)
AIRTABLE_TOKEN                # Beat CMS (optional)
AIRTABLE_BASE
AIRTABLE_TABLE
RAZORPAY_KEY_ID               # Payments (optional until wired)
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
MAILERLITE_API_KEY            # Email (optional)
MAILERLITE_GROUP_ID
RESEND_API_KEY                # Transactional email
EMAIL_FROM                    # Verified sender in Resend
ADMIN_EMAIL                   # Founder notification inbox
UPSTASH_REDIS_REST_URL        # Rate limiting (optional in dev)
UPSTASH_REDIS_REST_TOKEN
```

Never commit `.env`. Never commit secrets to docs.

---

## Documentation Index

| Doc | Purpose |
|-----|---------|
| [00_PROJECT_CONTEXT.md](./00_PROJECT_CONTEXT.md) | This file — project overview |
| [01_PRODUCT_VISION.md](./01_PRODUCT_VISION.md) | Mission, goals, success metrics |
| [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md) | Technical architecture |
| [03_DATABASE_DESIGN.md](./03_DATABASE_DESIGN.md) | Schema current + target |
| [04_SECURITY_GUIDELINES.md](./04_SECURITY_GUIDELINES.md) | Security standards |
| [05_CUSTOMER_JOURNEY.md](./05_CUSTOMER_JOURNEY.md) | End-to-end customer flows |
| [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md) | Phased feature roadmap |
| [07_SPRINT_BACKLOG.md](./07_SPRINT_BACKLOG.md) | Executable sprint plans |
| [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md) | Known debt register |
| [09_CODING_STANDARDS.md](./09_CODING_STANDARDS.md) | Code conventions |
| [10_AI_INSTRUCTIONS.md](./10_AI_INSTRUCTIONS.md) | Instructions for AI assistants |
| [11_DECISION_LOG.md](./11_DECISION_LOG.md) | Chronological decision log |
| [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md) | Engineering principles |
| [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md) | Architecture Decision Records |

---

## How to Use This Documentation

1. **Before any feature work:** Read 00, 06, 07, and 12.
2. **Before schema changes:** Read 03 and update it in the same PR.
3. **Before adding a dependency or service:** Read 13, add an ADR if significant.
4. **After any major decision:** Append to 11_DECISION_LOG.md.
5. **When debt is introduced or resolved:** Update 08_TECHNICAL_DEBT.md.

---

## Open Decisions (Founder Input Required)

These block or shape Sprint 0 implementation. See [11_DECISION_LOG.md](./11_DECISION_LOG.md).

| # | Decision | Options | Default if no answer |
|---|----------|---------|---------------------|
| D-001 | Beat checkout provider for MVP | Keep Payhip / Migrate to Razorpay | Keep Payhip |
| D-002 | Transactional email provider | Resend / MailerLite / SMTP | Resend (free tier) |
| D-003 | Admin auth for MVP | Password gate / NextAuth / Defer | Password gate |
| D-004 | Mastering purchase flow | Pay-first self-serve / Inquiry-then-invoice | Pay-first self-serve |
| D-005 | Free beat delivery | MailerLite automation + file URL | MailerLite automation |
| D-006 | Testimonials section | Real quotes / Hide until ready | Hide until ready |

---

## CTO Sign-Off Criteria

Engineering may begin sprint-by-sprint when:

- [x] Architecture documented and stable for MVP
- [x] MVP scope clearly separated from future scope
- [x] Sprint backlog defined with acceptance criteria
- [x] Security guidelines established
- [x] Database target schema designed (implementation phased)
- [ ] Open decisions D-001 through D-006 confirmed by founder

**Architecture status:** Stable for MVP. Evolutionary, not rewrite.
