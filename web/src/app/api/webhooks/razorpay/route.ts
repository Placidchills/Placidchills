import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as {
    event: string;
    payload: {
      payment?: { entity: { order_id: string; status: string } };
    };
  };

  if (payload.event === "payment.captured") {
    const orderId = payload.payload.payment?.entity.order_id;
    if (orderId) {
      await prisma.order.updateMany({
        where: { razorpayId: orderId },
        data: { status: "paid" },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
