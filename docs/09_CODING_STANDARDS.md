# Coding Standards

> **Status:** Living document · Last updated: 2026-06-26

---

## Principles

Follow SOLID, DRY, KISS. Match existing conventions before introducing new patterns. Minimize scope — the simplest correct diff wins.

See [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md) for decision-level principles.

---

## Language & Framework

| Rule | Standard |
|------|----------|
| Language | TypeScript strict mode |
| Framework | Next.js 16 App Router |
| React | React 19 — prefer Server Components by default |
| Validation | Zod at all API boundaries |
| ORM | Prisma — no raw SQL unless performance-critical |
| Styling | Custom CSS in `src/styles/` (existing pattern) |
| Paths | `@/` alias maps to `src/` |

---

## File & Folder Conventions

```
web/src/
├── app/                    # Routes only — minimal logic
├── components/
│   ├── home/               # Homepage sections
│   ├── forms/              # Form components
│   ├── layout/             # Nav, Footer, etc.
│   ├── admin/              # Admin UI (future)
│   └── ui/                 # Reusable primitives
├── config/                 # Static configuration (site.ts)
├── content/                # Static content (legal HTML)
├── lib/
│   ├── services/           # Business logic
│   ├── payments/           # Payment provider adapters
│   ├── email/              # Email provider adapters
│   ├── cms/                # CMS provider adapters
│   └── analytics/          # Analytics provider adapters
└── styles/                 # CSS files
```

### Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `InquiryForm.tsx` |
| Files (non-component) | kebab-case or camelCase | `inquiry.service.ts` |
| API routes | kebab-case directories | `api/webhooks/razorpay/` |
| CSS classes | kebab-case | `.beat-card`, `.section-head` |
| Env vars | SCREAMING_SNAKE | `RAZORPAY_KEY_ID` |
| Prisma models | PascalCase singular | `Inquiry`, `Order` |
| DB columns | camelCase | `customerEmail` |

---

## Component Guidelines

### Server vs Client

```typescript
// DEFAULT: Server Component (no directive)
export function Production() { ... }

// ONLY when needed: Client Component
"use client";
export function InquiryForm() { ... }
```

Use `"use client"` only for:
- Event handlers (onClick, onSubmit)
- React hooks (useState, useEffect, useRef)
- Browser APIs (IntersectionObserver, audio)

### Component Structure

```typescript
// 1. Imports
// 2. Types (if not imported)
// 3. Constants
// 4. Component
// 5. Sub-components (if small and private)
```

Keep components focused. A homepage section = one component file. Don't split prematurely.

---

## API Route Standards

Every POST route must follow this pattern:

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  // define all expected fields
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    
    // Business logic via service layer (target pattern)
    // await inquiryService.create(body);
    
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("[route-name]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### Rules

- Validate all input with Zod — never trust client data
- Return generic errors in production — no stack traces
- Log errors with route context prefix
- Use appropriate HTTP status codes (400, 401, 429, 500, 503)
- Business logic belongs in `lib/services/`, not in route handlers (target)

---

## Database Standards

- All schema changes via `prisma migrate dev` — never manual SQL
- Use enums for status fields (not free strings)
- Add indexes for query patterns documented in [03_DATABASE_DESIGN.md](./03_DATABASE_DESIGN.md)
- Amounts stored in smallest currency unit (paise for INR)
- Timestamps: `createdAt` on all models, `updatedAt` where mutable

---

## Provider Adapter Pattern

```typescript
// lib/payments/types.ts
export interface PaymentProvider {
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  verifyWebhook(body: string, signature: string): boolean;
}

// lib/payments/razorpay.ts
export class RazorpayProvider implements PaymentProvider { ... }

// lib/payments/index.ts
export function getPaymentProvider(): PaymentProvider {
  return new RazorpayProvider();
}
```

All external services follow this pattern. UI and API routes import from `index.ts`, never from provider-specific files directly.

---

## Configuration

- **Brand, pricing, license tiers:** `src/config/site.ts` — never hardcode in components
- **Secrets:** Environment variables only — never in code or docs
- **Feature flags (future):** Environment variables (`ENABLE_ADMIN=true`)

---

## CSS Standards

- Design tokens in `:root` variables (`site.css`)
- Component styles in `site.css` (existing pattern)
- Form-specific styles in `forms.css`
- Legal page styles in `legal.css`
- Use existing classes: `.btn`, `.glass`, `.wrap`, `.section-head`
- Mobile breakpoints: 760px, 820px (match existing)
- Support `prefers-reduced-motion` (already implemented)

---

## Error Handling

| Context | Pattern |
|---------|---------|
| API routes | try/catch → generic 500, log details |
| Client forms | try/catch → user-friendly message in state |
| Server components | try/catch → fallback UI or static fallback (see beats fetch) |
| Webhooks | Verify first, then process — always return 200 to prevent retries storm after logging failure |

---

## Git Conventions

| Rule | Standard |
|------|----------|
| Branch naming | `feat/`, `fix/`, `docs/`, `chore/` — see [CONTRIBUTING.md](../../CONTRIBUTING.md) |
| Commits | Imperative mood, focus on why |
| PR size | One sprint deliverable or less |
| Do not commit | `.env`, `dev.db`, `node_modules`, `.next` |

---

## Testing Standards

Testing is introduced in Sprint 1+ for critical paths:

| Priority | What to test |
|----------|-------------|
| P0 | Payment webhook handler (signature, idempotency, amount) |
| P0 | Inquiry API (validation, DB write, email trigger) |
| P1 | Newsletter API (validation, upsert, MailerLite call) |
| P1 | Order creation (correct amounts, product mapping) |
| P2 | Component render tests (forms, beat store) |

Framework: Vitest + Testing Library (add when first tests written).

---

## Documentation Standards

When making significant changes:

1. Update relevant `/docs` file in the same PR
2. Add ADR to [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md) for architectural choices
3. Append to [11_DECISION_LOG.md](./11_DECISION_LOG.md) for product/business decisions
4. Update [08_TECHNICAL_DEBT.md](./08_TECHNICAL_DEBT.md) if debt introduced or resolved

---

## Code Review Checklist

- [ ] Input validated server-side
- [ ] No secrets in code
- [ ] No placeholder content
- [ ] Pricing from `site.ts`, not hardcoded
- [ ] Provider accessed through adapter
- [ ] Error handling follows standards
- [ ] Mobile responsive
- [ ] Docs updated if needed

---

## Related Documents

- [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
- [04_SECURITY_GUIDELINES.md](./04_SECURITY_GUIDELINES.md)
- [10_AI_INSTRUCTIONS.md](./10_AI_INSTRUCTIONS.md)
