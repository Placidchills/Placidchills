import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendInquiryAdminNotification,
  sendInquiryConfirmation,
} from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkInquiryRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  service: z.string().min(1).max(80),
  message: z.string().min(10).max(5000),
  website: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await checkInquiryRateLimit(request);
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

    await prisma.inquiry.create({
      data: {
        name: body.name,
        email: body.email,
        service: body.service,
        message: body.message,
      },
    });

    const emailData = {
      name: body.name,
      email: body.email,
      service: body.service,
      message: body.message,
    };

    const [clientEmail, adminEmail] = await Promise.all([
      sendInquiryConfirmation(emailData),
      sendInquiryAdminNotification(emailData),
    ]);

    if (!clientEmail.ok) {
      console.error("[inquiries] Client confirmation failed:", clientEmail.error);
    }
    if (!adminEmail.ok) {
      console.error("[inquiries] Admin notification failed:", adminEmail.error);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    console.error("[inquiries]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
