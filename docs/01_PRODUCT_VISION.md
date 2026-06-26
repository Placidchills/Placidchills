# Product Vision

> **Status:** Living document · Last updated: 2026-06-26

---

## Mission

Build the digital operating system for the Placidchills music business — a platform that generates leads, converts visitors into paying clients, automates communication, and scales from zero customers to a complete music business infrastructure over 5–10 years.

---

## Vision Statement

**Today:** A credible, conversion-optimized website that captures leads and accepts payments.

**Year 1:** A lean business dashboard — inquiries, orders, email automation, and basic CRM in one place.

**Year 3:** A client portal where artists upload stems, track projects, download masters, and repurchase beats.

**Year 5–10:** A full music business platform — analytics, community, digital products, and repeatable systems that run with minimal founder overhead.

---

## Target Customer

**Primary:** Independent hip-hop / DHH artists in India (and diaspora) who need production, mastering, or beats for release-ready records.

**Secondary:** Labels and managers (Bantai Records tier) commissioning custom production or bulk mastering.

**Not targeting (yet):** Other producers, beat marketplace browsers, hobbyists without release intent.

---

## Value Proposition

| Service | Promise |
|---------|---------|
| **Custom Production** | Built for your record — not a type beat. Concept to master-ready instrumental. |
| **Mastering** | Release-ready master in 48 hours. No endless back-and-forth. |
| **Beat Licensing** | Preview, pick tier, checkout instantly. License included. |
| **Newsletter** | Free beat + first access to drops and openings. |

**Differentiator:** Proven DHH producer with 10M+ streams, editorial placements, and credits (GAUSH, KALAM INK, Bantai Records) — not a hobbyist selling loops.

---

## Business Goals (Ordered)

1. **Generate leads** — inquiry form, email capture, beat interest signals
2. **Convert to revenue** — mastering checkout, beat sales, production deposits
3. **Build trust** — real testimonials, audio proof, credentials, legal clarity
4. **Automate communication** — confirmations, status updates, delivery, review requests
5. **Retain customers** — newsletter, repeat purchase paths, CRM history
6. **Reduce founder workload** — admin dashboard, pipeline tracking, file delivery automation

---

## Success Metrics

### MVP (Launch → First 10 Customers)

| Metric | Target |
|--------|--------|
| Inquiry form submissions | > 0/week within 30 days of launch |
| Inquiry → response time | < 24 hours (manual) |
| Mastering self-serve checkout | Functional end-to-end |
| Email capture conversion | Track baseline |
| Site uptime | 99.9% (Vercel) |
| Zero placeholder content live | 100% |

### V1 (First 10 → 50 Customers)

| Metric | Target |
|--------|--------|
| Inquiry → paid conversion | Track and improve |
| Mastering revenue via Razorpay | > 50% of mastering sales self-serve |
| Newsletter subscribers | 200+ |
| Repeat customer rate | Track baseline |
| Admin time per inquiry | Decreasing (automation working) |

### V2 (50 → 500 Customers)

| Metric | Target |
|--------|--------|
| Monthly revenue | Track growth |
| Beat sales visibility | Unified in admin |
| Client portal adoption | > 30% of active projects |
| Email automation coverage | All major lifecycle events |

---

## Product Surfaces

### Public (MVP)

- Marketing homepage with three revenue paths
- Beat store with preview + Payhip checkout
- Mastering section with self-serve payment
- Inquiry / contact form
- Newsletter / free beat capture
- Legal pages (licensing, terms, privacy, refunds, disclaimer)

### Admin (V1+)

- Dashboard overview (inquiries, revenue, pending projects)
- CRM (clients, notes, tags, status)
- Inquiry pipeline (NEW → COMPLETED)
- Orders (payments, delivery, files)
- Content management (beats, services, testimonials)
- Newsletter (subscribers, segments)
- Analytics (traffic, funnel, revenue)
- Settings (pricing, branding, integrations)

### Client Portal (V2+)

- Login (magic link or password)
- Project status tracking
- Stem upload
- Master download
- Invoice view
- Revision requests
- Purchased beat access

---

## Brand & Voice

| Attribute | Guideline |
|-----------|-----------|
| **Visual** | Dark amber palette (#D98E3F), Clash Display + General Sans + Space Mono |
| **Voice** | Direct, credible, numbers-backed |
| **Tone** | Professional but not corporate — DHH scene fluency |
| **Trust signals** | Stream counts, editorial placements, named credits |
| **Avoid** | Generic producer clichés, placeholder content, over-promising |

Configuration lives in `web/src/config/site.ts`.

---

## Competitive Position

Placidchills competes on **credibility + speed + self-serve**, not on being the cheapest beat store.

| Competitor type | Our edge |
|-----------------|----------|
| BeatStars / Airbit producers | Proven releases, DHH specialization, mastering in-house |
| Fiverr mastering | Faster turnaround, scene credibility, fixed pricing |
| Instagram DM producers | Professional checkout, licensing clarity, no ghosting risk |

---

## Non-Goals

- Becoming a multi-producer marketplace
- Competing on beat quantity (quality + credits over volume)
- Building features no customer has asked for
- Optimizing for developers instead of customers

---

## Related Documents

- [05_CUSTOMER_JOURNEY.md](./05_CUSTOMER_JOURNEY.md) — how customers experience the product
- [06_PRODUCT_ROADMAP.md](./06_PRODUCT_ROADMAP.md) — when features ship
- [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md) — decision framework
