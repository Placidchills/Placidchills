import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToMailerLite } from "@/lib/mailerlite";
import { prisma } from "@/lib/prisma";
import { checkNewsletterRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(254),
  source: z.string().optional().default("newsletter"),
  website: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await checkNewsletterRateLimit(request);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = schema.parse(await request.json());

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    await prisma.lead.upsert({
      where: { email: body.email },
      create: { email: body.email, source: body.source },
      update: { source: body.source },
    });

    const mailer = await subscribeToMailerLite(body.email, body.source);
    if (!mailer.ok && process.env.MAILERLITE_API_KEY) {
      return NextResponse.json({ error: mailer.error }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("[newsletter]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
