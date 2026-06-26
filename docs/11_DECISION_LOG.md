# Decision Log

> **Status:** Living document · Last updated: 2026-06-26  
> Append new entries at the top. Never delete — mark superseded decisions as such.

---

## How to Use

Record any decision that affects product direction, architecture, tooling, or process. For architectural decisions, also create/update an ADR in [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md).

### Entry Format

```
### DEC-XXX — Title (YYYY-MM-DD)
**Status:** Proposed | Accepted | Superseded by DEC-YYY
**Context:** Why this decision was needed
**Decision:** What was decided
**Consequences:** Impact on the project
```

---

## Open Decisions (Awaiting Founder Input)

### D-001 — Beat Checkout Provider for MVP

**Status:** Proposed  
**Date:** 2026-06-26  
**Context:** Beats currently checkout via Payhip external links. Native checkout would unify revenue data but requires significant dev effort.  
**Options:**
- A) Keep Payhip for MVP (recommended)
- B) Migrate beats to Razorpay now

**Recommendation:** A — Payhip handles delivery, licensing PDF, and tax. Revisit at 50+ beat sales/month.  
**ADR:** [ADR-003](./13_ARCHITECTURE_DECISIONS.md#adr-003-payhip-for-beat-checkout-mvp)

---

### D-002 — Transactional Email Provider

**Status:** Proposed  
**Date:** 2026-06-26  
**Context:** Inquiry confirmations and payment emails require a transactional email provider. MailerLite is configured for marketing only.  
**Options:**
- A) Resend (recommended — 3,000 emails/month free, excellent DX)
- B) MailerLite transactional (keep one provider)
- C) Self-hosted SMTP

**Recommendation:** A — Resend for transactional, MailerLite for marketing. Clean separation.  
**ADR:** [ADR-004](./13_ARCHITECTURE_DECISIONS.md#adr-004-transactional-email-via-resend)

---

### D-003 — Admin Authentication for MVP

**Status:** Proposed  
**Date:** 2026-06-26  
**Context:** Admin dashboard needs protection. Full auth system is over-engineering for a solo founder.  
**Options:**
- A) Simple password gate via middleware (recommended)
- B) NextAuth with email login
- C) Defer admin until V1

**Recommendation:** A — env var password, session cookie, upgrade to NextAuth when client portal needs auth.  
**ADR:** [ADR-007](./13_ARCHITECTURE_DECISIONS.md#adr-007-admin-password-gate-for-v1)

---

### D-004 — Mastering Purchase Flow

**Status:** Proposed  
**Date:** 2026-06-26  
**Context:** Mastering can be self-serve (pay first, upload later) or inquiry-based (discuss first, invoice later).  
**Options:**
- A) Pay-first self-serve via Razorpay (recommended)
- B) Inquiry-then-invoice (current de facto flow)

**Recommendation:** A — lower friction, faster revenue, matches "without the back-and-forth" positioning.  
**ADR:** [ADR-005](./13_ARCHITECTURE_DECISIONS.md#adr-005-mastering-pay-first-self-serve)

---

### D-005 — Free Beat Delivery Method

**Status:** Proposed  
**Date:** 2026-06-26  
**Context:** Early capture section promises a free beat on email signup. No delivery mechanism exists.  
**Options:**
- A) MailerLite automation with download link (recommended)
- B) Manual email from founder
- C) Redirect to Payhip free product

**Recommendation:** A — fully automated, scales to zero founder time. Requires beat file hosted at stable URL.  
**Needs from founder:** Which beat file to give away + MailerLite automation setup.

---

### D-006 — Testimonials Section

**Status:** Proposed  
**Date:** 2026-06-26  
**Context:** Testimonials section contains explicit placeholder text visible to visitors.  
**Options:**
- A) Replace with real quotes from GAUSH, KALAM INK, Filth Inc., etc.
- B) Hide section until real quotes available (recommended if no quotes ready)

**Recommendation:** B if quotes not ready within Sprint 0 — placeholder text destroys trust with the exact audience you're targeting.

---

## Accepted Decisions

### DEC-007 — Sprint 0 Defaults Applied (2026-06-26)

**Status:** Accepted  
**Context:** Open decisions D-002 and D-006 block Sprint 0. Founder has not yet confirmed.  
**Decision:** Apply documented defaults: Resend for transactional email (D-002), hide testimonials section (D-006).  
**Consequences:** Sprint 0 implementation proceeds. Founder may override later (e.g. provide real testimonials).

---

### DEC-001 — Documentation-First Development (2026-06-26)

**Status:** Accepted  
**Context:** Project requires stable architecture before implementation begins. Solo founder needs persistent context across conversations.  
**Decision:** Create `/docs` as single source of truth. No production code until founder approves roadmap.  
**Consequences:** Implementation deferred but architectural uncertainty eliminated. All future work references docs.

---

### DEC-002 — Evolutionary Architecture Over Rewrite (2026-06-26)

**Status:** Accepted  
**Context:** Existing Next.js app has working marketing site and partial backend. Architecture review considered full rewrite.  
**Decision:** Evolve current codebase. No rewrite. Next.js monolith remains until 10K+ users.  
**Consequences:** Some technical debt accepted (see [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md)). Faster time to revenue.  
**ADR:** [ADR-001](./13_ARCHITECTURE_DECISIONS.md#adr-001-nextjs-monolith)

---

### DEC-003 — Zero-Cost Infrastructure for MVP (2026-06-26)

**Status:** Accepted  
**Context:** Zero customers — no revenue to fund infrastructure.  
**Decision:** Vercel hobby + Neon free + MailerLite free + Upstash free + Resend free. No paid services until revenue justifies.  
**Consequences:** Free tier limits accepted (Neon 0.5GB, Vercel bandwidth, MailerLite 1K subs). Sufficient for first 100+ customers.  
**ADR:** [ADR-002](./13_ARCHITECTURE_DECISIONS.md#adr-002-zero-cost-infrastructure-stack)

---

### DEC-004 — PostgreSQL for Production (2026-06-26)

**Status:** Accepted  
**Context:** Schema uses SQLite in development. Production requires a real database.  
**Decision:** Neon PostgreSQL free tier for production. SQLite remains for local dev.  
**Consequences:** Sprint 0 must migrate provider before launch. Connection pooling needed on Vercel.  
**ADR:** [ADR-002](./13_ARCHITECTURE_DECISIONS.md#adr-002-zero-cost-infrastructure-stack)

---

### DEC-005 — Provider Abstraction Layer (2026-06-26)

**Status:** Accepted  
**Context:** Current integrations (Razorpay, MailerLite, Airtable) are direct imports with no interface.  
**Decision:** Refactor to adapter pattern in Sprint 3. All new integrations must use adapter pattern from day one.  
**Consequences:** Sprint 0–2 may add direct integrations for speed. Sprint 3 refactors. New code after Sprint 3 must use adapters.  
**ADR:** [ADR-006](./13_ARCHITECTURE_DECISIONS.md#adr-006-provider-adapter-pattern)

---

### DEC-006 — Separate CTO and Implementation Conversations (2026-06-26)

**Status:** Accepted  
**Context:** Architecture decisions and sprint execution have different contexts and lifetimes.  
**Decision:** CTO conversation owns `/docs`. Implementation conversation executes sprints referencing docs.  
**Consequences:** Docs must be self-contained enough for a fresh AI session to begin implementation immediately.

---

## Superseded Decisions

*(None yet.)*

---

## Related Documents

- [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md)
- [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
- [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md)
