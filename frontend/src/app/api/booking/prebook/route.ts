import { NextRequest, NextResponse } from "next/server";
import { liteapi } from "@/lib/liteapi";

export async function POST(req: NextRequest) {
  try {
    const { offerId } = await req.json();
    if (!offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 });
    }

    const out = await liteapi("/rates/prebook", {
      method: "POST",
      body: { offerId, usePaymentSdk: true },
    });

    const d = out?.data || {};
    return NextResponse.json({
      prebookId: d.prebookId,
      transactionId: d.transactionId,
      secretKey: d.secretKey,
      price: d.price ?? d.suggestedSellingPrice ?? null,
      currency: d.currency || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
