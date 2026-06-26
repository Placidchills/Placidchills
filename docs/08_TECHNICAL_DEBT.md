# Technical Debt Register

> **Status:** Living document · Last updated: 2026-06-26  
> Update this file when debt is introduced, resolved, or reprioritized.

---

## Debt Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| **Critical** | Blocks revenue, security risk, or trust damage | Fix in current sprint |
| **High** | Significant risk or friction | Fix within 2 sprints |
| **Medium** | Maintainability or performance concern | Schedule in roadmap |
| **Low** | Cosmetic or minor inefficiency | Fix when touching related code |

---

## Active Debt

### Critical

| ID | Description | Location | Impact | Resolution | Sprint |
|----|-------------|----------|--------|------------|--------|
| TD-003 | Razorpay checkout API exists but no frontend UI | `api/payments/razorpay/`, `Mastering.tsx` | Mastering revenue blocked | Wire Razorpay Checkout modal | 1 |
| TD-004 | Free beat promise with no delivery mechanism | `EarlyCapture.tsx`, MailerLite | Broken lead magnet promise | MailerLite automation | 1 |

### High

| ID | Description | Location | Impact | Resolution | Sprint |
|----|-------------|----------|--------|------------|--------|
| TD-009 | Webhook lacks idempotency + amount verification | `api/webhooks/razorpay/` | Payment integrity risk | PaymentEvent model + checks | 1 |
| TD-010 | Beat preview URLs empty on static beats | `lib/beats.ts` | Beat store feels broken | Upload previews + Airtable | 2 |
| TD-011 | Before/after mastering audio not configured | `Mastering.tsx` | Mastering conversion weak | Add audio URLs to config | 2 |
| TD-012 | No tests for payment or inquiry flows | — | Regression risk on critical paths | Add integration tests | 1–3 |
| TD-013 | Order status inconsistency (`"created"` vs `"pending"`) | `schema.prisma`, `payments/route.ts` | Confusion in order tracking | Standardize on enum | 1 |

### Medium

| ID | Description | Location | Impact | Resolution | Sprint |
|----|-------------|----------|--------|------------|--------|
| TD-014 | No provider abstraction layer | `lib/razorpay.ts`, `lib/mailerlite.ts` | Vendor lock-in, hard to test | Refactor to adapters | 3 |
| TD-015 | Tailwind imported but design is custom CSS | `globals.css`, `site.css` | Unused bundle overhead | Remove Tailwind or migrate | 2 |
| TD-016 | Triple font loading (next/font + 2 CDNs) | `layout.tsx` | Performance, LCP impact | Consolidate to next/font | 2 |
| TD-017 | 3 Spotify iframes on homepage | `Listen.tsx` | Heavy third-party load | Lazy load or link cards | 2 |
| TD-018 | Status fields are free strings, not enums | `schema.prisma` | Invalid states possible | Add Prisma enums | 1 |
| TD-019 | No error monitoring | — | Blind to production errors | Sentry | 3 |
| TD-021 | `web/README.md` is create-next-app boilerplate | `web/README.md` | Misleading for contributors | Replace with project pointer | 0 |
| TD-022 | Legal content as raw HTML files | `src/content/*.html` | Hard to diff/review | MDX migration (optional) | Future |
| TD-023 | No Client/Inquiry relationship | Schema | CRM will need migration | Client model in V1 | 3 |
| TD-024 | Beat orders not tracked (Payhip external) | — | No beat revenue visibility | Payhip webhook in V2 | Future |
| TD-025 | Privacy policy mentions analytics not yet implemented | `privacy-policy.html` | Legal inaccuracy | Add analytics or update policy | 1–2 |
| TD-026 | ScrollReveal wraps most sections as client components | Multiple components | Unnecessary hydration | Consider CSS-only reveal | Future |

### Low

| ID | Description | Location | Impact | Resolution | Sprint |
|----|-------------|----------|--------|------------|--------|
| TD-027 | `/api/beats` route unused by frontend | `api/beats/route.ts` | Dead code | Remove or use for client refresh | Future |
| TD-028 | No mobile navigation menu | `Nav.tsx` | Mobile UX — links hidden <820px | Hamburger menu | 2–3 |
| TD-029 | Payhip links point to store homepage, not products | `lib/beats.ts` STATIC_BEATS | Beat purchase friction | Per-product URLs in Airtable | 2 |

---

## Resolved Debt

| ID | Description | Resolved | Sprint |
|----|-------------|----------|--------|
| TD-001 | Placeholder testimonials visible to visitors | 2026-06-26 — section hidden from homepage | 0 |
| TD-002 | Inquiry form saves silently — no email | 2026-06-26 — Resend confirmation + admin notification | 0 |
| TD-005 | `#contact` anchor points to footer | 2026-06-26 — moved to inquiry section | 0 |
| TD-006 | SQLite hardcoded in Prisma schema | 2026-06-26 — switched to PostgreSQL | 0 |
| TD-007 | No rate limiting on public API routes | 2026-06-26 — Upstash + in-memory fallback | 0 |
| TD-008 | No security headers | 2026-06-26 — added to next.config.ts | 0 |
| TD-020 | No CI/CD pipeline | 2026-06-26 — GitHub Actions lint + build | 0 |
| TD-030 | No honeypot on forms | 2026-06-26 — hidden field on inquiry + newsletter | 0 |
| TD-031 | README version mismatch | 2026-06-26 — updated to Next.js 16 | 0 |

---

## Debt Introduction Policy

Before introducing new debt:

1. Document it in this file with ID, severity, and planned resolution sprint
2. Do not introduce Critical debt intentionally
3. If debt is unavoidable, note why in [11_DECISION_LOG.md](./11_DECISION_LOG.md)

---

## Debt Review Schedule

| When | Action |
|------|--------|
| End of each sprint | Update statuses, move resolved items |
| Sprint planning | Pull High/Critical items into sprint if not scheduled |
| Monthly | Review Medium items for reprioritization |

---

## Related Documents

- [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md)
- [07_SPRINT_BACKLOG.md](./07_SPRINT_BACKLOG.md)
- [11_DECISION_LOG.md](./11_DECISION_LOG.md)
