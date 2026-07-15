import { NextRequest, NextResponse } from "next/server";
import { liteapi } from "@/lib/liteapi";

export async function POST(req: NextRequest) {
  try {
    const { prebookId, transactionId, holder, guests } = await req.json();

    if (!prebookId || !transactionId || !holder?.firstName || !holder?.lastName || !holder?.email) {
      return NextResponse.json(
        { error: "prebookId, transactionId and holder {firstName,lastName,email} are required" },
        { status: 400 }
      );
    }

    const out = await liteapi("/rates/book", {
      method: "POST",
      body: {
        prebookId,
        holder,
        payment: { method: "TRANSACTION_ID", transactionId },
        guests:
          guests && guests.length
            ? guests
            : [{ occupancyNumber: 1, firstName: holder.firstName, lastName: holder.lastName }],
      },
    });

    const d = out?.data || {};
    return NextResponse.json({
      bookingId: d.bookingId,
      status: d.status,
      hotelConfirmationCode: d.hotelConfirmationCode || null,
      hotel: d.hotel?.name || null,
      checkin: d.checkin || null,
      checkout: d.checkout || null,
      price: d.price ?? null,
      currency: d.currency || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
