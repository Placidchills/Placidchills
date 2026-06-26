# Security Guidelines

> **Status:** Living document · Last updated: 2026-06-26  
> **Standard:** Production-grade from first paying customer.

---

## Security Philosophy

Assume real customer payments from day one of production. Never trust client-side data. Security over convenience. Every external input is validated, every webhook is verified, every secret is protected.

---

## Threat Model

| Threat | Vector | Mitigation |
|--------|--------|------------|
| Form spam | `/api/inquiries`, `/api/newsletter` | Rate limiting, honeypot, IP throttling |
| Payment tampering | Razorpay checkout | Server-side amount, webhook verification |
| Webhook replay | `/api/webhooks/razorpay` | Idempotency keys, event log |
| XSS | User input rendering | No user-generated HTML rendered (currently) |
| CSRF | Form submissions | SameSite cookies when auth added; JSON API mitigates |
| SQL injection | API → DB | Prisma parameterized queries |
| Secret exposure | Env vars, git | `.env` gitignored, Vercel secrets, no secrets in docs |
| Admin unauthorized access | `/admin/*` | Auth gate before any admin route |
| File upload abuse | Future portal | Type validation, size limits, virus scan (V2) |
| DDoS | Public API | Vercel edge protection + rate limiting |

---

## Authentication & Authorization

### Current State

No authentication implemented. All API routes are public.

### MVP Admin Auth

- Password-protected `/admin` routes via middleware
- Single admin user (founder) — env var `ADMIN_PASSWORD` or `ADMIN_SECRET`
- Session cookie with `httpOnly`, `secure`, `sameSite: strict`
- **Do not** build custom crypto — use established patterns or NextAuth when multi-user needed

### V2 Client Portal Auth

- Magic link email login (preferred — no passwords to manage)
- Or NextAuth with email provider
- Role-based access: `ADMIN`, `CLIENT`
- Clients see only their own projects/orders/files

### Authorization Rules

| Resource | Public | Client | Admin |
|----------|--------|--------|-------|
| Marketing pages | Read | Read | Read |
| Inquiry form | Create | — | — |
| Newsletter | Create | — | — |
| Own orders | — | Read | Read |
| All inquiries | — | — | CRUD |
| All orders | — | — | Read |
| Project files | — | Own only | All |
| Admin dashboard | — | — | Full |
| Webhook endpoints | Provider only | — | — |

---

## Input Validation

**Rule:** Every API route MUST validate input with Zod before any business logic.

```typescript
// Required pattern for all POST routes
const schema = z.object({ /* ... */ });

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    // business logic
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    // ...
  }
}
```

### Validation Requirements

| Field | Rules |
|-------|-------|
| Email | Valid email format, max 254 chars |
| Name | 1–120 chars, strip HTML |
| Message | 10–5000 chars |
| Service | Enum or allowlist |
| Payment product | Server-side enum only — never trust client amount |
| File uploads (future) | MIME type allowlist, max size, scan |

---

## Payment Security

### Order Creation

- Product and amount defined **server-side only** in `PRODUCTS` constant
- Client sends product ID + email — never amount
- Order record created before Razorpay order

### Webhook Handling

Required checks (in order):

1. Verify `x-razorpay-signature` HMAC-SHA256 ✅ (implemented)
2. Parse and validate event structure
3. Check idempotency via `PaymentEvent.eventId` (target)
4. Verify payment amount matches stored `Order.amount` (target)
5. Update order status atomically
6. Store raw payload in `PaymentEvent` for audit
7. Trigger confirmation email only after steps 1–6 pass

### Events to Handle

| Event | Action |
|-------|--------|
| `payment.captured` | Mark order paid, send confirmation |
| `payment.failed` | Mark order failed, notify admin |
| `refund.created` | Mark order refunded, notify admin |
| `order.paid` | Alternative capture event — handle idempotently |

### Refund Readiness

- Store full payment metadata in Order + PaymentEvent
- Admin can initiate refund via Razorpay dashboard
- Webhook updates order status — no manual DB edits needed

---

## HTTP Security Headers

Add to `next.config.ts` before production launch:

```typescript
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];
```

CSP to be added once analytics and third-party scripts are finalized.

---

## Rate Limiting

Implement before production on all public POST routes.

| Route | Limit | Window |
|-------|-------|--------|
| `/api/inquiries` | 5 requests | 15 min / IP |
| `/api/newsletter` | 3 requests | 15 min / IP |
| `/api/payments/razorpay` | 10 requests | 15 min / IP |
| `/api/webhooks/razorpay` | No limit | Verified by signature |
| `/api/admin/*` | 100 requests | 15 min / session |

**Provider:** Upstash Redis free tier with `@upstash/ratelimit`.

---

## Spam Protection

| Layer | Implementation |
|-------|----------------|
| Honeypot field | Hidden input in forms — reject if filled |
| Rate limiting | Per IP (above) |
| Email validation | Zod + disposable email blocklist (optional) |
| Timestamp check | Reject submissions < 2s after page load |

---

## Secrets Management

| Secret | Storage | Rotation |
|--------|---------|----------|
| `DATABASE_URL` | Vercel env | On compromise |
| `RAZORPAY_KEY_SECRET` | Vercel env | Annual |
| `RAZORPAY_WEBHOOK_SECRET` | Vercel env | On compromise |
| `MAILERLITE_API_KEY` | Vercel env | On compromise |
| `ADMIN_PASSWORD` | Vercel env | Quarterly |
| `AIRTABLE_TOKEN` | Vercel env | On compromise |

**Rules:**
- Never commit secrets to git
- Never log secrets or full webhook payloads containing PII in production logs
- Use separate Razorpay test/live keys per environment
- `.env.example` contains keys only, never values

---

## Error Handling & Logging

| Environment | Error detail exposed | Logging |
|-------------|---------------------|---------|
| Development | Full stack traces | Console |
| Production | Generic "Server error" | Sentry (V1) |

**Never expose in production responses:**
- Stack traces
- Database errors
- Internal file paths
- Provider API error details

---

## File Upload Security (Future — Client Portal)

- Allowlist MIME types: `audio/wav`, `audio/x-wav`, `audio/mpeg`, `application/zip`
- Max file size: 500MB per file (configurable)
- Store in R2 with signed URLs — never public buckets
- Generate unique object keys — no user-controlled paths
- Virus scan via ClamAV or Cloudflare (when volume justifies)

---

## Dependency Security

- Run `npm audit` before each sprint release
- Pin major dependency versions in `package.json`
- Review new dependencies against [12_PROJECT_PRINCIPLES.md](./12_PROJECT_PRINCIPLES.md)
- Enable Dependabot on GitHub (V1)

---

## Security Checklist (Pre-Launch)

- [ ] PostgreSQL in production (not SQLite)
- [ ] All secrets in Vercel env vars
- [ ] Security headers configured
- [ ] Rate limiting on public POST routes
- [ ] Honeypot on forms
- [ ] Webhook signature verification
- [ ] Webhook idempotency
- [ ] Payment amount verification on webhook
- [ ] No placeholder/test content live
- [ ] HTTPS enforced (Vercel default)
- [ ] Admin routes password-protected
- [ ] Error monitoring configured
- [ ] Privacy policy matches actual data collection

---

## Incident Response

1. **Detect** — Sentry alert or customer report
2. **Contain** — Disable affected route/feature via Vercel env flag
3. **Assess** — Check AuditLog and PaymentEvent tables
4. **Notify** — Affected customers if PII/payment data involved
5. **Remediate** — Fix, rotate secrets if needed
6. **Document** — Append to [11_DECISION_LOG.md](./11_DECISION_LOG.md)

---

## Related Documents

- [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md)
- [03_DATABASE_DESIGN.md](./03_DATABASE_DESIGN.md)
- [13_ARCHITECTURE_DECISIONS.md](./13_ARCHITECTURE_DECISIONS.md) — ADR-006 Payment Security
