import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = { success: boolean; remaining: number };

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): LimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

function createUpstashLimiter(requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: "placidchills",
  });
}

const inquiryUpstash = createUpstashLimiter(5, "15 m");
const newsletterUpstash = createUpstashLimiter(3, "15 m");

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function checkInquiryRateLimit(
  request: Request,
): Promise<LimitResult> {
  const ip = getClientIp(request);

  if (inquiryUpstash) {
    const result = await inquiryUpstash.limit(`inquiry:${ip}`);
    return { success: result.success, remaining: result.remaining };
  }

  return memoryRateLimit(`inquiry:${ip}`, 5, FIFTEEN_MINUTES_MS);
}

export async function checkNewsletterRateLimit(
  request: Request,
): Promise<LimitResult> {
  const ip = getClientIp(request);

  if (newsletterUpstash) {
    const result = await newsletterUpstash.limit(`newsletter:${ip}`);
    return { success: result.success, remaining: result.remaining };
  }

  return memoryRateLimit(`newsletter:${ip}`, 3, FIFTEEN_MINUTES_MS);
}
