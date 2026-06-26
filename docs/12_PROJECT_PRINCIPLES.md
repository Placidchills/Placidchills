# Project Principles

> **Status:** Living document · Last updated: 2026-06-26  
> Every future engineering, product, and infrastructure decision must align with these principles.

---

## Core Philosophy

This project starts with **zero customers**. Every recommendation, feature, and dependency must respect that reality. We build a world-class digital business platform that starts lean, costs almost nothing initially, delights customers, and scales naturally as revenue grows.

---

## Engineering Principles

### 1. Ship Value Before Adding Complexity

Build the smallest thing that moves a customer forward or saves founder time. A working inquiry confirmation email beats a half-built admin dashboard.

**Test:** Does this change help the next paying customer or the next lead? If not, defer it.

---

### 2. Optimize for Customer Value

Technical elegance is secondary to customer outcomes. Conversion, trust, delivery speed, and communication quality are the primary metrics.

**Test:** Will a customer notice and care about this change?

---

### 3. Keep Operational Costs Close to Zero Until Revenue Justifies Spend

Prefer free tiers, open source, and serverless. Do not pay for scalability before it exists.

**Test:** Can this run on a free tier for the first 100 customers? If yes, use the free tier.

---

### 4. Every Paid Dependency Must Justify Itself

Before adding any paid service, document: what problem it solves, free alternatives considered, monthly cost, and the revenue trigger that justifies upgrading.

**Test:** Is there a free tier or self-hosted alternative? Have we outgrown it?

---

### 5. Prefer Replaceable Services

Every external provider (payments, email, CMS, analytics, storage) must sit behind an abstraction layer. Swapping Razorpay for Stripe or MailerLite for Resend should require changes in one directory, not across the codebase.

**Test:** Could we swap this provider in a day without touching UI components?

---

### 6. Avoid Vendor Lock-In

Own your customer data. Store leads, inquiries, and orders in our database. Treat external services as pipes, not systems of record — except where they legally must be (payment processors).

**Test:** If this vendor shut down tomorrow, do we lose customer data?

---

### 7. Security Over Convenience

Assume real customer payments from day one of production. Never trust client-side data. Validate everything server-side. Verify webhooks. Protect secrets.

**Test:** Would this be acceptable if a competitor tried to exploit it?

---

### 8. Measure Before Optimizing

Do not optimize bundle size, database queries, or infrastructure until analytics show a problem. Ship first, profile second.

**Test:** Do we have evidence this is slow, expensive, or broken?

---

### 9. Every Feature Should Increase Customer Value or Reduce Founder Workload

No feature exists for its own sake. If it doesn't generate leads, convert sales, deliver products, automate communication, or save Soumyajit time — it doesn't ship.

**Test:** Which business metric does this move?

---

### 10. Evolutionary Improvement Over Rewrites

Prefer extending the current Next.js monolith over greenfield rewrites. Split services only when measurable pain demands it.

**Test:** Can we achieve 80% of the value with 20% of a rewrite's effort?

---

## Product Principles

| Principle | Meaning |
|-----------|---------|
| **Trust before conversion** | Never show placeholder content to paying visitors |
| **Self-serve where possible** | Beats and mastering should not require DMs |
| **Manual is OK at zero customers** | Drive/WeTransfer delivery is fine until volume demands automation |
| **One revenue path at a time** | Perfect mastering checkout before building a client portal |
| **Founder voice, not corporate** | Copy and UX reflect Placidchills' direct, credible DHH identity |

---

## Architecture Principles

| Principle | Meaning |
|-----------|---------|
| **Monolith first** | Next.js handles frontend + API until team/size demands split |
| **PostgreSQL as system of record** | All business entities live in our DB |
| **Serverless deployment** | Vercel + managed DB — no VPS babysitting |
| **Config as code** | Pricing and brand in `site.ts`, not scattered in components |
| **Typed boundaries** | Zod at API edges, TypeScript everywhere, Prisma for DB |
| **Idempotent webhooks** | Every payment event processed exactly once |

---

## What We Will Not Do (Until Conditions Change)

See [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md) for full deferral list. Summary:

- Microservices
- Custom beat checkout (while Payhip works)
- Client portal (until 10+ active projects)
- Community features (until newsletter > 1,000)
- Enterprise tools (Salesforce, HubSpot, etc.)
- Kubernetes / self-hosted infra
- AI chatbot replacing personal contact

---

## Principle Conflict Resolution

When principles conflict, resolve in this order:

1. **Security** — never compromise
2. **Customer value** — revenue and trust win
3. **Founder workload** — automate pain points
4. **Cost** — stay free/cheap unless 1–3 require spend
5. **Developer experience** — optimize last

---

## Updating This Document

Add a principle only when a repeated decision pattern emerges. Remove or revise when a principle consistently leads to bad outcomes. Log changes in [11_DECISION_LOG.md](./11_DECISION_LOG.md).
