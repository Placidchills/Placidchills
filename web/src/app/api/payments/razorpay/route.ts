import { NextResponse } from "next/server";
import { z } from "zod";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  product: z.enum(["mastering-single", "mastering-ep", "mastering-rush"]),
  email: z.string().email(),
  name: z.string().optional(),
});

const PRODUCTS = {
  "mastering-single": { name: "Mastering — Single Track", amount: 100000 },
  "mastering-ep": { name: "Mastering — EP Bundle", amount: 400000 },
  "mastering-rush": { name: "Mastering — Rush Add-on", amount: 50000 },
} as const;

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments not configured yet" },
      { status: 503 },
    );
  }

  try {
    const body = schema.parse(await request.json());
    const product = PRODUCTS[body.product];
    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json({ error: "Razorpay unavailable" }, { status: 503 });
    }

    const order = await razorpay.orders.create({
      amount: product.amount,
      currency: "INR",
      receipt: `pc_${Date.now()}`,
      notes: {
        product: body.product,
        email: body.email,
      },
    });

    await prisma.order.create({
      data: {
        razorpayId: order.id,
        amount: product.amount,
        product: product.name,
        productMeta: body.product,
        customerEmail: body.email,
        customerName: body.name,
        status: "created",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 });
  }
}
