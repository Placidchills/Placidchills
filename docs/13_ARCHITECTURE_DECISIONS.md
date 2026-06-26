# Architecture Decision Records (ADRs)

> **Status:** Living document · Last updated: 2026-06-26  
> Format based on [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

---

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](#adr-001-nextjs-monolith) | Next.js Monolith | Accepted |
| [ADR-002](#adr-002-zero-cost-infrastructure-stack) | Zero-Cost Infrastructure Stack | Accepted |
| [ADR-003](#adr-003-payhip-for-beat-checkout-mvp) | Payhip for Beat Checkout (MVP) | Proposed |
| [ADR-004](#adr-004-transactional-email-via-resend) | Transactional Email via Resend | Proposed |
| [ADR-005](#adr-005-mastering-pay-first-self-serve) | Mastering Pay-First Self-Serve | Proposed |
| [ADR-006](#adr-006-provider-adapter-pattern) | Provider Adapter Pattern | Accepted |
| [ADR-007](#adr-007-admin-password-gate-for-v1) | Admin Password Gate for V1 | Proposed |
| [ADR-008](#adr-008-airtable-as-interim-beat-cms) | Airtable as Interim Beat CMS | Accepted |
| [ADR-009](#adr-009-razorpay-for-payments) | Razorpay for Payments | Accepted |
| [ADR-010](#adr-010-sqlite-dev-postgresql-prod) | SQLite Dev / PostgreSQL Prod | Accepted |
| [ADR-011](#adr-011-custom-css-over-tailwind) | Custom CSS Over Tailwind | Accepted |
| [ADR-012](#adr-012-static-html-for-legal-pages) | Static HTML for Legal Pages | Accepted |
| [ADR-013](#adr-013-defer-client-portal) | Defer Client Portal | Accepted |
| [ADR-014](#adr-014-prisma-as-orm) | Prisma as ORM | Accepted |
| [ADR-015](#adr-015-webhook-idempotency-via-paymentevent) | Webhook Idempotency via PaymentEvent | Accepted |

---

## ADR-001: Next.js Monolith

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Placidchills needs a web application that serves marketing pages, handles form submissions, processes payments, and will eventually host an admin dashboard and client portal. The team is a solo founder with AI-assisted development. Zero customers exist.

### Decision

Use a single Next.js 16 application (App Router) deployed on Vercel. Frontend, API routes, and future admin UI all live in `web/`.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Separate frontend + backend (Express/Fastify) | Two deploy units, more ops, no benefit at zero scale |
| Serverless functions only (no framework) | Lose SSR, routing, and React ecosystem |
| WordPress + plugins | Poor developer experience, plugin security, not scalable for custom platform |
| Remix / SvelteKit | Team knows React; existing codebase is Next.js |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Single deploy unit | All code in one repo — can become large |
| SSR + API + static in one framework | Vercel vendor coupling (mitigated: Next.js runs anywhere) |
| Fastest path from zero to revenue | Monolith may need splitting at extreme scale (10K+ users) |

### Risks

- Monolith becomes unwieldy if admin + portal + marketing all grow complex
- Vercel serverless cold starts (negligible at low traffic)

### Migration Strategy

If splitting becomes necessary (Year 3+):
1. Extract admin API to separate service first
2. Keep marketing site on Next.js
3. Shared Prisma schema as npm package

### Revisit Conditions

- Dedicated backend team hired
- API response times degrade due to monolith size
- 10,000+ concurrent users

---

## ADR-002: Zero-Cost Infrastructure Stack

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Zero customers, zero revenue. Every rupee spent on infrastructure is wasted until revenue justifies it.

### Decision

| Service | Provider | Tier |
|---------|----------|------|
| Hosting | Vercel | Hobby (free) |
| Database | Neon | Free (0.5 GB) |
| Email marketing | MailerLite | Free (1,000 subs) |
| Email transactional | Resend | Free (3,000/month) |
| Rate limiting | Upstash Redis | Free (10K/day) |
| Analytics | Plausible Cloud or Umami self-hosted | Free tier / self-hosted |
| File storage (future) | Cloudflare R2 | Free (10 GB) |
| Error monitoring | Sentry | Free (5K events/month) |

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| AWS full stack | Complex, expensive, over-engineered |
| Railway / Render paid | Unnecessary cost at zero customers |
| Supabase Pro | Free tier sufficient; adds auth complexity prematurely |
| Self-hosted VPS | Ops burden for solo founder |

### Trade-offs

| Benefit | Cost |
|---------|------|
| ~$1/month total (domain only) | Free tier limits (Neon storage, Vercel bandwidth) |
| Managed services — no ops | Vendor dependency (mitigated by adapter pattern) |
| Instant scaling when needed | Must monitor usage to avoid surprise limits |

### Risks

- Neon free tier storage limit (0.5 GB) — sufficient for years at this scale
- Vercel hobby bandwidth — sufficient until significant traffic

### Migration Strategy

Upgrade individual services to paid tiers independently as revenue triggers are hit. No wholesale migration needed.

### Revisit Conditions

- Neon storage > 400 MB
- MailerLite subscribers > 800
- Resend emails > 2,500/month
- Revenue > ₹50,000/month (justify paid tiers across the board)

---

## ADR-003: Payhip for Beat Checkout (MVP)

**Status:** Proposed (pending D-001)  
**Date:** 2026-06-26

### Context

Beat licensing requires instant digital delivery (MP3/WAV/stems files + license agreement PDF). Building custom checkout + delivery is significant effort. Payhip already handles this.

### Decision

Use Payhip product URLs for beat checkout in MVP. Beat store links directly to Payhip per-tier product pages. No native beat checkout until volume justifies.

### Alternatives Considered

| Alternative | Why rejected (for MVP) |
|-------------|----------------------|
| Razorpay + custom delivery | Must build file delivery, license generation, email — weeks of work |
| Stripe + custom delivery | Same as above + international focus unnecessary |
| Gumroad | Similar to Payhip but less established in producer space |
| Native checkout | Correct long-term, premature now |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Instant beat sales with zero dev effort | 5% transaction fee |
| Payhip handles delivery + licensing | Beat order data lives in Payhip, not our DB |
| Proven producer platform | Vendor lock-in on beat delivery |
| Can launch beat store this week | Cannot track beat conversions in our analytics initially |

### Risks

- No visibility into beat sales from admin dashboard
- Payhip downtime = beat store down
- 5% fee higher than Razorpay's ~2%

### Migration Strategy

1. MVP: Payhip links from Airtable
2. V2: Payhip webhook → Order table sync
3. V3+: Native checkout with R2 file delivery when 50+ sales/month justify the 5% savings

### Revisit Conditions

- 50+ beat sales per month
- Need beat analytics in admin dashboard
- Payhip fee exceeds cost of native checkout development

---

## ADR-004: Transactional Email via Resend

**Status:** Proposed (pending D-002)  
**Date:** 2026-06-26

### Context

Inquiry confirmations, payment confirmations, and admin notifications require reliable transactional email. MailerLite is configured for marketing/list management.

### Decision

Use **Resend** for transactional email. Keep **MailerLite** for marketing email and newsletter list management. Separate providers for separate concerns.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| MailerLite for everything | Transactional email not MailerLite's strength; mixing concerns |
| SendGrid | Free tier too limited (100/day); complex setup |
| AWS SES | Requires AWS account, DNS setup complexity |
| Self-hosted SMTP | Deliverability issues, ops burden |
| Postmark | Paid only ($15/month minimum) |

### Trade-offs

| Benefit | Cost |
|---------|------|
| 3,000 emails/month free | Two email providers to manage |
| Excellent DX (React Email support) | Two sets of DNS records (SPF/DKIM) |
| Clean separation of marketing vs transactional | — |
| Easy to test with preview URLs | — |

### Risks

- Email deliverability requires domain verification (SPF, DKIM, DMARC)
- Two providers = two potential failure points

### Migration Strategy

Adapter pattern in `lib/email/`. Resend adapter for transactional, MailerLite adapter for marketing. Swapping Resend for Postmark = change one file.

### Revisit Conditions

- Email volume exceeds Resend free tier
- Need advanced email analytics
- Consolidation desired (move transactional to MailerLite if they add good transactional support)

---

## ADR-005: Mastering Pay-First Self-Serve

**Status:** Proposed (pending D-004)  
**Date:** 2026-06-26

### Context

Mastering section promises "without the back-and-forth" and fixed pricing (₹1,000/track). Two flows are possible: pay-first or inquiry-then-invoice.

### Decision

Mastering follows a **pay-first self-serve** flow: visitor pays via Razorpay → receives upload instructions email → uploads mix manually → receives master.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Inquiry-then-invoice | Adds friction, contradicts "without back-and-forth" positioning |
| Payhip for mastering | Already using Razorpay; mastering is a service not a digital product |
| Subscription model | No recurring demand signal |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Instant revenue — no waiting for quote | Some customers may prefer to discuss first |
| Matches fixed pricing on site | Complex projects (stems, unusual formats) need inquiry fallback |
| Automated confirmation + upload instructions | Manual fulfillment still required |

### Risks

- Customer pays then sends unsuitable material (wrong format, poor mix)
- EP bundle + rush add-on combinations need clear UX

### Migration Strategy

Keep inquiry form as fallback for complex mastering projects. Mastering section primary CTA = Razorpay. Secondary link = "Complex project? Get in touch."

### Revisit Conditions

- High refund rate on mastering orders
- Customers consistently prefer inquiry-first (track in analytics)

---

## ADR-006: Provider Adapter Pattern

**Status:** Accepted  
**Date:** 2026-06-26

### Context

External services (Razorpay, MailerLite, Airtable) are directly imported in API routes and lib files. Swapping providers requires changes across the codebase.

### Decision

All external services accessed through adapter interfaces in `lib/[category]/`. Routes and services import from `index.ts` factory, never from provider-specific files.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Direct imports (current) | Vendor lock-in, untestable |
| Dependency injection framework | Over-engineering for monolith |
| GraphQL gateway | Absurd at this scale |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Swap providers in one directory | Initial refactor effort (Sprint 3) |
| Mock providers for testing | Slight indirection |
| Clear integration boundaries | — |

### Risks

- Abstraction over-engineering if interfaces are too generic
- Sprint 0–2 code may not follow pattern until Sprint 3 refactor

### Migration Strategy

1. Sprint 0–2: Direct integrations acceptable for speed
2. Sprint 3: Refactor existing integrations to adapters
3. Sprint 3+: All new integrations must use adapter pattern

### Revisit Conditions

- Never — this pattern scales indefinitely

---

## ADR-007: Admin Password Gate for V1

**Status:** Proposed (pending D-003)  
**Date:** 2026-06-26

### Context

Admin dashboard needs authentication. Solo founder is the only admin user. Full auth system (NextAuth, Clerk) is over-engineering.

### Decision

Protect `/admin/*` routes with middleware checking a session cookie set after password verification against `ADMIN_PASSWORD` env var.

### Alternatives Considered

| Alternative | Why rejected (for V1) |
|-------------|----------------------|
| NextAuth | Complex setup for single user |
| Clerk | Paid, over-engineering |
| HTTP Basic Auth | Poor UX, no session management |
| No auth (obscure URL) | Security through obscurity — unacceptable |

### Trade-offs

| Benefit | Cost |
|---------|------|
| 2 hours to implement | Single password — no multi-user |
| Zero dependencies | Must upgrade for client portal auth |
| Sufficient for solo founder | Password rotation is manual |

### Risks

- Weak password chosen by founder
- No audit trail of admin login (mitigated by AuditLog in V1)

### Migration Strategy

When client portal needs auth (V2), implement NextAuth with email magic links. Admin role assigned to founder's email. Password gate removed.

### Revisit Conditions

- Second admin user needed
- Client portal auth required (V2)

---

## ADR-008: Airtable as Interim Beat CMS

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Beat catalogue changes frequently (new beats, sold exclusives, price changes). Founder needs to manage beats without editing code or redeploying.

### Decision

Use Airtable as beat CMS with fields: Name, Genre, BPM, Key, Gradient, PayhipMP3, PayhipWAV, PayhipStems, PreviewURL, Status. Fallback to static beats if Airtable not configured.

### Alternatives Considered

| Alternative | Why rejected (for now) |
|-------------|----------------------|
| Hardcoded in code | Requires redeploy for every beat change |
| Admin CMS (built) | Weeks of dev, premature |
| Sanity/Contentful | Additional service, over-engineering |
| Database-only | No friendly UI for non-developer founder |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Founder manages beats in spreadsheet UI | External dependency |
| Free tier (1,200 records) | API rate limits (5 req/sec) |
| Already partially implemented | Dual system (Airtable + static fallback) |
| 5-min ISR cache | Beat data not real-time |

### Risks

- Airtable API downtime → fallback to static beats
- Field name changes break mapping

### Migration Strategy

1. MVP–V1: Airtable with adapter pattern
2. V2: Admin beat management UI writing to Beat model in PostgreSQL
3. Deprecate Airtable when admin CMS is stable

### Revisit Conditions

- Admin dashboard built with beat management
- Airtable free tier limits hit
- Need real-time beat status updates

---

## ADR-009: Razorpay for Payments

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Mastering and custom production payments require an India-native payment gateway supporting INR, UPI, cards, and netbanking.

### Decision

Use Razorpay for all platform-processed payments (mastering, future production deposits).

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Stripe | Higher fees in India, no UPI, international focus unnecessary |
| PayU | Less developer-friendly API |
| Cashfree | Less ecosystem support |
| Manual UPI/bank transfer | Unprofessional, no automation, no webhook |

### Trade-offs

| Benefit | Cost |
|---------|------|
| ~2% transaction fee | India-only (acceptable for now) |
| UPI, cards, netbanking, wallets | Razorpay vendor coupling (mitigated by adapter) |
| Webhook support | KYC required for live mode |
| Already partially implemented | — |

### Risks

- Razorpay account approval delay
- Webhook delivery failures (mitigated by idempotency)

### Migration Strategy

Adapter pattern allows adding Stripe later for international payments without changing business logic.

### Revisit Conditions

- International customers > 10% of revenue
- Razorpay fee structure changes unfavorably

---

## ADR-010: SQLite Dev / PostgreSQL Prod

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Need a database for development and production. Solo developer, zero customers.

### Decision

SQLite for local development (`file:./dev.db`). PostgreSQL (Neon free tier) for production.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| PostgreSQL everywhere | Requires local Postgres install, slower dev setup |
| SQLite everywhere | SQLite on Vercel serverless is problematic |
| MongoDB | Wrong tool — relational data model fits better |
| Supabase | Adds auth/storage complexity prematurely |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Zero-config local dev | Two database engines to test against |
| Free production database | Must ensure Prisma schema works on both |
| Fast local migrations | Minor dialect differences possible |

### Risks

- SQLite vs PostgreSQL behavior differences (rare with Prisma)
- Forgetting to migrate production after schema change

### Migration Strategy

- CI runs `prisma migrate deploy` against PostgreSQL test instance
- Production deploy checklist includes migration step

### Revisit Conditions

- Team grows beyond solo founder (use PostgreSQL everywhere with Docker)

---

## ADR-011: Custom CSS Over Tailwind

**Status:** Accepted  
**Date:** 2026-06-26

### Context

The site design was ported from legacy HTML mockups with a custom design system (glass morphism, amber palette, custom animations). Tailwind CSS is installed but barely used.

### Decision

Continue using custom CSS in `src/styles/site.css` as the primary styling approach. Remove unused Tailwind import in Sprint 2 unless a deliberate migration is planned.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Full Tailwind migration | Large effort, no business value, risk visual regression |
| CSS Modules | Would require rewriting all existing styles |
| Styled Components | Adds runtime overhead, inconsistent with current approach |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Design fidelity preserved | No utility-class productivity |
| No build-time CSS processing issues | Larger CSS file (acceptable at ~440 lines) |
| Consistent with legacy mockups | New components require manual CSS |

### Risks

- CSS file grows large over time (mitigated: component-scoped files if needed)

### Migration Strategy

No migration planned. If Tailwind is removed, delete from `package.json` and `globals.css`.

### Revisit Conditions

- Admin dashboard UI needs rapid component building (consider Tailwind for admin only)
- CSS file exceeds 2,000 lines

---

## ADR-012: Static HTML for Legal Pages

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Legal pages (licensing, terms, privacy, refunds, disclaimer) contain long-form legal content that changes infrequently.

### Decision

Store legal content as static HTML files in `src/content/`. Render via `LegalPage` component with `dangerouslySetInnerHTML`.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| MDX | Adds complexity for infrequently changed content |
| CMS | Over-engineering |
| Hardcoded in TSX | Poor editing experience for long legal text |
| External PDF links | Bad SEO, poor UX |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Easy to edit legal copy | No component reusability in legal content |
| Already implemented | `dangerouslySetInnerHTML` (safe — trusted static files) |
| Version controlled | Harder to diff than Markdown |

### Risks

- Low — content is author-controlled, not user-generated

### Migration Strategy

Optional MDX migration in V2 if admin content management is built. Not required.

### Revisit Conditions

- Legal pages need frequent updates from admin dashboard
- Multiple languages needed

---

## ADR-013: Defer Client Portal

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Client portal (login, upload stems, download masters, view invoices) is a major feature set. Zero clients exist.

### Decision

Defer client portal to V2. Manual file exchange (Drive/WeTransfer) + email communication for MVP and V1.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Build portal in MVP | Months of work, zero users to serve |
| Use existing platform (Frame.io, etc.) | Additional cost, another tool to manage |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Focus on revenue-generating features | Manual file management |
| Zero auth complexity in MVP | Less professional for high-ticket clients |
| WhatsApp/Drive works in DHH scene | Doesn't scale past ~20 active projects |

### Risks

- High-ticket production clients expect portal experience
- Manual process becomes bottleneck

### Migration Strategy

Design User/Client models now ([03_DATABASE_DESIGN.md](./03_DATABASE_DESIGN.md)). Build portal in V2 when 10+ active projects justify it.

### Revisit Conditions

- 10+ concurrent active projects
- Clients request self-service status tracking
- Manual file management exceeds 1 hour/day

---

## ADR-014: Prisma as ORM

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Need a type-safe database access layer for TypeScript.

### Decision

Use Prisma ORM with PostgreSQL (production) and SQLite (development).

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Drizzle ORM | Less mature ecosystem, no existing schema |
| Raw SQL (pg) | No type safety, more boilerplate |
| TypeORM | Heavier, less Next.js-friendly |
| Kysely | Less schema management tooling |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Type-safe queries | Prisma bundle size |
| Migration management | Abstraction over SQL |
| Already implemented | Serverless connection pooling needs attention |

### Risks

- Connection pool exhaustion on Vercel (use Neon pooler)

### Migration Strategy

N/A — already in use.

### Revisit Conditions

- Performance-critical queries needing raw SQL (use Prisma `$queryRaw` first)

---

## ADR-015: Webhook Idempotency via PaymentEvent

**Status:** Accepted  
**Date:** 2026-06-26

### Context

Razorpay webhooks may be delivered multiple times. Processing a payment twice could cause duplicate confirmation emails and incorrect order state.

### Decision

Store every webhook event in a `PaymentEvent` table with a unique `eventId`. Reject duplicate events. Verify payment amount matches stored order before updating status.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Status check only ("if already paid, skip") | Doesn't log attempts, no audit trail |
| Redis dedup | Adds dependency for simple DB check |
| No idempotency | Unacceptable for payments |

### Trade-offs

| Benefit | Cost |
|---------|------|
| Full audit trail | Additional table and write per webhook |
| Safe against replay attacks | Slight processing overhead |
| Debugging payment issues | Storage grows (7-year retention) |

### Risks

- Low — standard payment processing pattern

### Migration Strategy

Add `PaymentEvent` model in Sprint 1 migration. Update webhook handler.

### Revisit Conditions

- Never — idempotency is permanent requirement

---

## ADR Template (For Future Decisions)

```markdown
## ADR-XXX: Title

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYY
**Date:** YYYY-MM-DD

### Context
[What is the issue that we're seeing that is motivating this decision?]

### Decision
[What is the change that we're proposing and/or doing?]

### Alternatives Considered
[What other options were evaluated?]

### Trade-offs
[Benefits and costs]

### Risks
[What could go wrong?]

### Migration Strategy
[How do we get from current state to decided state?]

### Revisit Conditions
[When should this decision be reconsidered?]
```

---

## Related Documents

- [11_DECISION_LOG.md](./11_DECISION_LOG.md)
- [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md)
- [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
