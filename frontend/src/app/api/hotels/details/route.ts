import { NextRequest, NextResponse } from "next/server";
import { liteapi, isIsoDate } from "@/lib/liteapi";

export async function POST(req: NextRequest) {
  try {
    const {
      hotelId,
      checkin,
      checkout,
      adults = 2,
      children = [],
      currency = "INR",
      guestNationality = "IN",
    } = await req.json();

    if (!hotelId || !isIsoDate(checkin) || !isIsoDate(checkout)) {
      return NextResponse.json(
        { error: "hotelId, checkin and checkout are required" },
        { status: 400 }
      );
    }

    const [info, rates] = await Promise.all([
      liteapi(`/data/hotel?hotelId=${encodeURIComponent(hotelId)}`),
      liteapi("/hotels/rates", {
        method: "POST",
        body: {
          hotelIds: [hotelId],
          occupancies: [{ rooms: 1, adults: Number(adults), ...(children.length ? { children } : {}) }],
          currency,
          guestNationality,
          checkin,
          checkout,
          timeout: 6,
        },
      }),
    ]);

    const hotel = info?.data || {};
    const offers: any[] = [];
    for (const r of rates?.data || []) {
      for (const rt of r.roomTypes || []) {
        const rate = rt?.rates?.[0] || {};
        offers.push({
          offerId: rt.offerId,
          roomName: rate.name || "Room",
          boardName: rate.boardName || null,
          maxOccupancy: rate.maxOccupancy || null,
          refundable: rate?.cancellationPolicies?.refundableTag === "RFN",
          cancelBy: rate?.cancellationPolicies?.cancelPolicyInfos?.[0]?.cancelTime || null,
          price: rt?.offerRetailRate?.amount ?? rate?.retailRate?.total?.[0]?.amount ?? null,
          currency: rt?.offerRetailRate?.currency || currency,
        });
      }
    }
    offers.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

    return NextResponse.json({
      hotel: {
        id: hotel.id || hotelId,
        name: hotel.name,
        description: hotel.hotelDescription || hotel.description || "",
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        stars: hotel.stars ?? hotel.starRating ?? null,
        images: (hotel.hotelImages || []).slice(0, 12).map((i: any) => i.url || i.urlHd || i),
        amenities: (hotel.hotelFacilities || hotel.facilities || []).slice(0, 20),
        checkinTime: hotel.checkinCheckoutTimes?.checkin || null,
        checkoutTime: hotel.checkinCheckoutTimes?.checkout || null,
      },
      offers,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
