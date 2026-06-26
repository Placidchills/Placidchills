# Sprint Backlog

> **Status:** Living document · Last updated: 2026-06-26  
> **Audience:** Solo founder + engineering (human or AI)

Each sprint is **independently deployable**. Complete sprints in order unless blocked by an open decision (see [00_PROJECT_CONTEXT.md](./00_PROJECT_CONTEXT.md)).

---

## Sprint Overview

| Sprint | Name | Duration | Deployable Outcome |
|--------|------|----------|-------------------|
| 0 | Pre-Launch Blockers | 1–2 weeks | Trustworthy site, prod infra, emails on inquiry |
| 1 | Revenue Activation | 1–2 weeks | Mastering checkout live, payment emails, analytics |
| 2 | Content & Polish | 1 week | Beat store functional, SEO, performance |
| 3 | Operations Foundation | 2 weeks | Read-only admin, pipeline, monitoring |
| 4 | Email Automation | 1–2 weeks | Full lifecycle email sequences |
| 5 | Growth & SEO | 2 weeks | Landing pages, blog foundation |

---

## Sprint 0: Pre-Launch Blockers

### Goal

Make the site trustworthy and operational — no placeholder content, production database, inquiry emails working.

### Deliverables

1. Fix `#contact` anchor on inquiry section (not footer)
2. Hide testimonials section OR replace with real quotes
3. PostgreSQL on Neon + Vercel production deployment
4. Transactional email provider configured (Resend recommended)
5. Inquiry confirmation email to client
6. Admin notification email on new inquiry
7. Rate limiting on `/api/inquiries` and `/api/newsletter`
8. Honeypot field on inquiry and newsletter forms
9. Security headers in `next.config.ts`
10. Update `README.md` to point to `/docs`
11. GitHub repo + basic CI (lint + build)

### Acceptance Criteria

- [x] Clicking any "Request Quote" / `#contact` CTA scrolls to inquiry form
- [x] No placeholder text visible to visitors (testimonials hidden)
- [ ] Site deployed to production URL with HTTPS *(founder action: Vercel + DNS)*
- [ ] `DATABASE_URL` points to Neon PostgreSQL in production *(founder action: Vercel env)*
- [ ] Submitting inquiry sends email to client AND founder within 60 seconds *(requires Resend + domain verification)*
- [x] Submitting 6 inquiries in 1 minute returns 429 on the 6th *(implemented — verify in prod)*
- [x] Honeypot submission returns 200 but does not save to DB
- [x] Security headers visible in browser dev tools
- [x] `npm run build` passes in CI

### Expected Business Outcome

Founder can share the live URL without embarrassment. Inquiries are captured AND notified — no leads lost to silent form submissions.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Email deliverability (SPF/DKIM) | Configure Resend domain verification before launch |
| Neon connection on Vercel serverless | Use pooled connection string |
| Founder hasn't provided testimonials | Hide section — do not ship placeholders |

### Dependencies

- Founder decision D-002 (email provider)
- Founder decision D-006 (testimonials)
- Domain DNS pointed to Vercel
- Neon account created

---

## Sprint 1: Revenue Activation

### Goal

Mastering payments work end-to-end. Payment webhooks are production-safe.

### Deliverables

1. Razorpay Checkout modal on mastering section (single, EP, rush)
2. `PaymentEvent` model + migration for webhook idempotency
3. Webhook: verify amount matches order, handle `payment.failed`
4. Payment confirmation email to client (with upload instructions)
5. Payment notification email to admin
6. Order status enum (`CREATED`, `PAID`, `FAILED`, `REFUNDED`)
7. MailerLite automation: free beat delivery on newsletter signup
8. Analytics provider integrated (Plausible or Umami)
9. Core analytics events: inquiry, newsletter, checkout, payment

### Acceptance Criteria

- [ ] Mastering "Pay now" button opens Razorpay checkout with correct amount
- [ ] Successful payment updates order status to `PAID` via webhook
- [ ] Duplicate webhook delivery does not double-process (idempotent)
- [ ] Payment amount mismatch rejected (logged, not marked paid)
- [ ] Client receives payment confirmation email with upload instructions
- [ ] Founder receives admin notification on payment
- [ ] Newsletter signup triggers free beat email via MailerLite
- [ ] Analytics pageviews and custom events visible in dashboard
- [ ] Failed payment marks order as `FAILED` and notifies admin

### Expected Business Outcome

First mastering payment can be accepted without manual invoicing. Lead magnet (free beat) actually delivers. Funnel is measurable.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Razorpay test vs live keys confusion | Separate env vars per environment |
| Webhook not reaching localhost | Use Razorpay dashboard webhook URL pointing to production |
| Razorpay modal UX on mobile | Test on mobile before marking done |

### Dependencies

- Sprint 0 complete
- Razorpay live account approved
- Founder decision D-004 (pay-first flow)
- Founder decision D-005 (free beat file + MailerLite automation)
- Upload instructions copy written by founder

---

## Sprint 2: Content & Polish

### Goal

Beat store is functional. Site is SEO-ready and performant.

### Deliverables

1. Airtable connected with real beats + per-tier Payhip URLs
2. Beat preview audio hosted (R2 or CDN) and linked in Airtable
3. Before/after mastering audio samples configured
4. `sitemap.ts` and `robots.ts` in App Router
5. OG image for social sharing
6. JSON-LD structured data (MusicGroup + Service)
7. Font consolidation (remove duplicate CDN loads, use `next/font`)
8. Spotify embed optimization (lazy load or link cards)
9. Privacy policy updated to reflect actual analytics provider

### Acceptance Criteria

- [ ] Beat store shows "Live" badge with real beats from Airtable
- [ ] Beat preview play button plays audio
- [ ] Each beat tier links to correct Payhip product URL
- [ ] Before/after mastering player plays both tracks
- [ ] `/sitemap.xml` and `/robots.txt` accessible
- [ ] Social share preview shows OG image
- [ ] Lighthouse performance score > 85 on mobile
- [ ] No duplicate font network requests

### Expected Business Outcome

Beat store generates real sales. Mastering section demonstrates quality. Site is discoverable via search and shareable on social.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Audio file hosting costs | Use R2 free tier or serve from Airtable attachments |
| Airtable API rate limits | Keep 5-min ISR cache on beat fetch |

### Dependencies

- Sprint 0 complete (production deploy)
- Founder provides beat preview files and Payhip product URLs
- Founder provides before/after mastering audio files
- OG image designed (can be simple: logo + tagline on dark background)

---

## Sprint 3: Operations Foundation

### Goal

Founder can view and manage inquiries without querying the database directly.

### Deliverables

1. Admin auth middleware (password gate)
2. `/admin` route with inquiry list (newest first)
3. `/admin/inquiries/[id]` detail view
4. Inquiry status update (enum: NEW → CONTACTED → ... → COMPLETED)
5. `Client` model — auto-create from inquiry email
6. Admin overview page: inquiry count, order count, recent activity
7. Sentry error monitoring
8. Provider abstraction refactor (`lib/payments/`, `lib/email/`, `lib/cms/`)
9. `AuditLog` model for admin actions

### Acceptance Criteria

- [ ] `/admin` requires password — unauthenticated requests redirect to login
- [ ] Admin can view all inquiries with status, date, service type
- [ ] Admin can update inquiry status
- [ ] Client record auto-created when inquiry submitted
- [ ] Overview shows: total inquiries, new inquiries, paid orders, revenue sum
- [ ] Sentry captures and reports production errors
- [ ] All external providers accessed through adapter interfaces

### Expected Business Outcome

Founder spends less time tracking leads in email/DMs. Pipeline visibility enables faster follow-up and higher conversion.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Weak admin password | Enforce strong password, HTTPS only |
| Scope creep into full CRM | Read-only + status update only — no notes/tags yet |

### Dependencies

- Sprint 0 + 1 complete
- Founder decision D-003 (admin auth approach)

---

## Sprint 4: Email Automation

### Goal

Automated customer communication for the full project lifecycle.

### Deliverables

1. Email template system (React Email or HTML templates)
2. Templates: inquiry confirmation (enhanced), payment confirmation, project kickoff, delivery, review request
3. `EmailQueue` model for reliable delivery
4. Admin: resend email from inquiry/order detail
5. MailerLite: new beat drop automation setup
6. Post-delivery review request (manual trigger from admin)

### Acceptance Criteria

- [ ] All email templates render correctly on mobile and desktop
- [ ] Failed email sends logged in EmailQueue with error
- [ ] Admin can resend any template from inquiry detail page
- [ ] Review request email sendable from admin with one click
- [ ] EmailQueue processes pending emails (or sends synchronously with logging)

### Expected Business Outcome

Professional communication at every touchpoint. Founder sends review requests consistently. Repeat business increases.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Email template maintenance burden | Keep templates minimal — plain, on-brand |
| Over-automation feels impersonal | Founder voice in copy, manual triggers for key moments |

### Dependencies

- Sprint 3 complete (admin exists to trigger emails)

---

## Sprint 5: Growth & SEO

### Goal

Organic discovery and dedicated conversion pages for each service.

### Deliverables

1. `/mastering` landing page (SEO-optimized)
2. `/production` landing page (SEO-optimized)
3. `/beats` landing page (or enhance existing section as page)
4. Blog foundation (MDX, `/blog/[slug]`)
5. First 2 blog posts (founder-written or AI-assisted)
6. Referral tracking parameter (`?ref=`)
7. Conversion funnel report in admin (basic)

### Acceptance Criteria

- [ ] Each service page has unique title, description, JSON-LD
- [ ] Service pages linked from homepage and sitemap
- [ ] Blog renders MDX posts with proper metadata
- [ ] Referral parameter captured in analytics events
- [ ] Admin shows inquiry source breakdown

### Expected Business Outcome

Organic traffic to service-specific pages. Content marketing foundation for long-term SEO.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Content creation bottleneck | Founder writes 2 posts, not 20 |
| SEO expectations vs timeline | SEO takes months — set expectations |

### Dependencies

- Sprint 2 complete (SEO foundation)
- Founder provides service page copy and blog content

---

## Sprint Execution Rules

1. **One sprint at a time** — do not start Sprint N+1 until Sprint N acceptance criteria met
2. **Deploy after every sprint** — each sprint produces a production-deployable increment
3. **Update docs** — mark features complete in [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md), debt in [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md)
4. **Log decisions** — append to [11_DECISION_LOG.md](./11_DECISION_LOG.md) when choices are made
5. **No scope creep** — if a task isn't in the sprint, it waits for the next one

---

## Backlog (Unscheduled)

Items identified but not yet assigned to a sprint:

| Item | Notes |
|------|-------|
| Invoice PDF generation | V1 — after admin dashboard |
| Payhip webhook integration | V2 — after 50+ beat sales |
| Client portal | V2 — after 10+ active projects |
| WhatsApp contact button | Quick win — any sprint |
| Mobile hamburger nav | Sprint 2 or 3 |
| Beat toast → direct Payhip link | Sprint 2 |
| Disposable email blocklist | Sprint 1 or 3 |

---

## Related Documents

- [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md)
- [05_CUSTOMER_JOURNEY.md](./05_CUSTOMER_JOURNEY.md)
- [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md)
- [10_AI_INSTRUCTIONS.md](./10_AI_INSTRUCTIONS.md)
