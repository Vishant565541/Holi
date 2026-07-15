import { NextRequest, NextResponse } from "next/server";
import { liteapi, isIsoDate } from "@/lib/liteapi";

export async function POST(req: NextRequest) {
  try {
    const {
      cityName,
      countryCode = "IN",
      checkin,
      checkout,
      adults = 2,
      children = [],
      currency = "INR",
      guestNationality = "IN",
      limit = 20,
    } = await req.json();

    if (!cityName || !isIsoDate(checkin) || !isIsoDate(checkout)) {
      return NextResponse.json(
        { error: "cityName, checkin (YYYY-MM-DD) and checkout are required" },
        { status: 400 }
      );
    }

    // 1) hotels in this city (static content: name, photo, stars, address)
    const qs = new URLSearchParams({
      countryCode,
      cityName,
      limit: String(limit),
    });
    const hotelData = await liteapi(`/data/hotels?${qs}`);
    const hotels = hotelData?.data || [];
    if (!hotels.length) return NextResponse.json({ hotels: [] });

    const byId = Object.fromEntries(hotels.map((h: any) => [h.id, h]));

    // 2) live rates for those hotel ids
    const rates = await liteapi("/hotels/rates", {
      method: "POST",
      body: {
        hotelIds: hotels.map((h: any) => h.id),
        occupancies: [{ rooms: 1, adults: Number(adults), ...(children.length ? { children } : {}) }],
        currency,
        guestNationality,
        checkin,
        checkout,
        timeout: 6,
      },
    });

    // 3) merge: cheapest offer per hotel
    const results: any[] = [];
    for (const r of rates?.data || []) {
      const info = byId[r.hotelId] || {};
      let min: any = null;
      for (const rt of r.roomTypes || []) {
        const amount = rt?.offerRetailRate?.amount ?? rt?.rates?.[0]?.retailRate?.total?.[0]?.amount;
        if (amount != null && (min === null || amount < min.amount)) {
          min = {
            amount,
            currency: rt?.offerRetailRate?.currency || currency,
            offerId: rt.offerId,
            roomName: rt?.rates?.[0]?.name || "Room",
            boardName: rt?.rates?.[0]?.boardName || null,
            refundable: rt?.rates?.[0]?.cancellationPolicies?.refundableTag === "RFN",
          };
        }
      }
      if (!min) continue;
      results.push({
        hotelId: r.hotelId,
        name: info.name || r.hotelId,
        address: info.address || "",
        city: info.city || cityName,
        stars: info.stars ?? info.starRating ?? null,
        image: info.main_photo || info.thumbnail || null,
        cheapest: min,
      });
    }
    results.sort((a, b) => a.cheapest.amount - b.cheapest.amount);

    return NextResponse.json({ hotels: results, checkin, checkout, adults, currency });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
