# AI Instructions

> **Status:** Living document · Last updated: 2026-06-26  
> **Purpose:** Enable any AI assistant to work on this project immediately without rediscovering context.

---

## Read This First

You are working on **Placidchills** — the digital operating system for a music business (production, mastering, beat licensing). This is **NOT a portfolio website**.

Before writing any code:

1. Read [00_PROJECT_CONTEXT.md](./00_PROJECT_CONTEXT.md)
2. Read [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
3. Check [07_SPRINT_BACKLOG.md](./07_SPRINT_BACKLOG.md) for current sprint scope
4. Check [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md) for known issues
5. Check [11_DECISION_LOG.md](./11_DECISION_LOG.md) for open decisions

**Do not implement features outside the current sprint scope without explicit approval.**

---

## Project Summary

| Attribute | Value |
|-----------|-------|
| Owner | Soumyajit (Placidchills) |
| Business | Music producer — DHH, custom production, mastering, beat licensing |
| Market | India (INR), desi hip hop scene |
| Customers | Zero — building for first customers |
| Code location | `web/` directory (Next.js app) |
| Docs location | `docs/` directory (you are here) |
| Legacy | `legacy/` — reference HTML only, do not modify or extend |

---

## What to Optimize For

Every change must optimize for (in order):

1. Generate leads
2. Convert visitors to paying clients
3. Build trust
4. Automate customer communication
5. Accept secure payments
6. Reduce founder workload

If a change doesn't serve one of these, don't make it.

---

## Current Sprint

**Active sprint:** Sprint 0 — Pre-Launch Blockers (implementation complete — awaiting founder review & production deploy)

See [07_SPRINT_BACKLOG.md](./07_SPRINT_BACKLOG.md) for deliverables and acceptance criteria.

**Do not start Sprint 1 until Sprint 0 acceptance criteria are met.**

---

## Architecture Quick Reference

- **Pattern:** Next.js monolith (App Router + API routes)
- **Database:** Prisma ORM, SQLite (dev), PostgreSQL/Neon (prod)
- **Payments:** Razorpay (mastering) — API exists, UI not wired
- **Beat checkout:** Payhip (external links) — keep for MVP
- **Email marketing:** MailerLite
- **Email transactional (target):** Resend
- **Beat CMS:** Airtable (optional, falls back to static)
- **Config:** `web/src/config/site.ts` — pricing, brand, licenses
- **Deploy target:** Vercel + Neon PostgreSQL

Full architecture: [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md)

---

## Key Rules

### Do

- Follow [09_CODING_STANDARDS.md](./09_CODING_STANDARDS.md)
- Validate all API input with Zod
- Keep pricing in `site.ts` — never hardcode amounts in components
- Use provider adapter pattern for external services
- Minimize diff scope — simplest correct change
- Update docs when making architectural changes
- Match existing CSS patterns and component structure
- Use Server Components by default
- Test payment and inquiry flows when touching them

### Do Not

- Implement features marked as "Future" or "Postponed" in [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md)
- Add paid services without documenting justification
- Ship placeholder content to production
- Trust client-side data for payments or business logic
- Rewrite working code without clear benefit
- Add microservices, Kubernetes, or enterprise tools
- Create git commits unless explicitly asked
- Modify `legacy/` directory
- Over-engineer — zero customers means manual processes are fine

---

## File Map (Most Important)

| Need to change... | File(s) |
|-------------------|---------|
| Pricing | `web/src/config/site.ts` |
| Brand/stats/social | `web/src/config/site.ts` |
| Homepage sections | `web/src/components/home/*.tsx` |
| Inquiry form | `web/src/components/forms/InquiryForm.tsx` |
| Inquiry API | `web/src/app/api/inquiries/route.ts` |
| Newsletter API | `web/src/app/api/newsletter/route.ts` |
| Payment creation | `web/src/app/api/payments/razorpay/route.ts` |
| Payment webhook | `web/src/app/api/webhooks/razorpay/route.ts` |
| Database schema | `web/prisma/schema.prisma` |
| Beat catalogue | `web/src/lib/beats.ts` |
| Razorpay integration | `web/src/lib/razorpay.ts` |
| MailerLite integration | `web/src/lib/mailerlite.ts` |
| Site-wide styles | `web/src/styles/site.css` |
| Legal page content | `web/src/content/*.html` |
| Environment vars | `web/.env.example` (document), `web/.env` (never commit) |

---

## Common Tasks

### Add a new API route

1. Create `web/src/app/api/[name]/route.ts`
2. Add Zod schema for input validation
3. Use service layer if business logic is non-trivial
4. Add rate limiting if public POST route
5. Update [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md) API table

### Change pricing

1. Edit `web/src/config/site.ts` → `pricing` object
2. Update Razorpay `PRODUCTS` constant in `api/payments/razorpay/route.ts` (amounts in paise)
3. Update legal HTML if license terms affected

### Add a database model

1. Edit `web/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name describe_change`
3. Update [03_DATABASE_DESIGN.md](./03_DATABASE_DESIGN.md)

### Add an external service

1. Create adapter in `web/src/lib/[category]/`
2. Define interface in `types.ts`
3. Add ADR to [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md)
4. Add env vars to `.env.example`
5. Document in [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md)

---

## Known Bugs (Fix Before Feature Work)

| Bug | Location | Sprint |
|-----|----------|--------|
| `#contact` → footer not form | Footer vs contact section | 0 | ✅ Fixed |
| Placeholder testimonials live | Testimonials.tsx | 0 | ✅ Hidden from homepage |
| Order status `"created"` vs `"pending"` | schema + payments route | 1 |
| Beat previews empty | beats.ts STATIC_BEATS | 2 |

Full list: [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md)

---

## Open Decisions (Check Before Implementing)

| ID | Question | Default |
|----|----------|---------|
| D-001 | Keep Payhip for beats? | Yes |
| D-002 | Transactional email provider? | Resend |
| D-003 | Admin auth approach? | Password gate |
| D-004 | Mastering: pay-first or inquiry? | Pay-first |
| D-005 | Free beat delivery method? | MailerLite automation |
| D-006 | Testimonials: real or hidden? | Hidden until ready |

See [11_DECISION_LOG.md](./11_DECISION_LOG.md) for details.

---

## Testing Commands

```bash
cd web
npm install
npx prisma migrate dev
npm run dev          # http://localhost:3000
npm run build        # Production build check
npm run lint         # ESLint
```

---

## When Uncertain

1. Check `/docs` first — the answer is probably documented
2. Prefer the simpler approach aligned with [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
3. If the decision is architectural, propose an ADR — don't silently choose
4. If the decision is product/business, ask the founder — don't assume
5. If it's out of current sprint scope, note it in backlog — don't implement

---

## Conversation Roles

| Conversation | Role |
|-------------|------|
| Architecture / CTO conversation | Strategy, docs, roadmap, decisions |
| Implementation conversation | Sprint execution, code, tests, deploy |

This documentation was created in the CTO conversation and is the authority for the implementation conversation.

---

## Related Documents

- [00_PROJECT_CONTEXT.md](./00_PROJECT_CONTEXT.md)
- [07_SPRINT_BACKLOG.md](./07_SPRINT_BACKLOG.md)
- [09_CODING_STANDARDS.md](./09_CODING_STANDARDS.md)
- [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
