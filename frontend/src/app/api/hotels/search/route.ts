import { NextRequest, NextResponse } from "next/server";
import { liteapi, isIsoDate } from "@/lib/liteapi";

// ── Curated fallback hotels shown when LITEAPI_KEY is not configured ──────────
function getMockHotels(cityName: string, checkin: string, checkout: string, adults: number) {
  const nightCount = (() => {
    const d1 = new Date(checkin), d2 = new Date(checkout);
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
  })();

  const base = [
    {
      hotelId: "RA-HOTEL-001",
      name: "The Oberoi Grand Palace",
      address: "15, Jawaharlal Nehru Marg",
      city: cityName,
      stars: 5,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      cheapest: {
        amount: 28500 * nightCount,
        currency: "INR",
        offerId: "RA-OFFER-001",
        roomName: "Deluxe Heritage Suite",
        boardName: "Breakfast Included",
        refundable: true,
      },
    },
    {
      hotelId: "RA-HOTEL-002",
      name: "Taj Lake Palace Resort",
      address: "Pichola Lake, Old City",
      city: cityName,
      stars: 5,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      cheapest: {
        amount: 42000 * nightCount,
        currency: "INR",
        offerId: "RA-OFFER-002",
        roomName: "Royal Lake View Suite",
        boardName: "Full Board",
        refundable: true,
      },
    },
    {
      hotelId: "RA-HOTEL-003",
      name: "The Leela Palace",
      address: "Diplomatic Enclave, Chanakyapuri",
      city: cityName,
      stars: 5,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      cheapest: {
        amount: 19800 * nightCount,
        currency: "INR",
        offerId: "RA-OFFER-003",
        roomName: "Premier Grand Room",
        boardName: "Bed & Breakfast",
        refundable: false,
      },
    },
    {
      hotelId: "RA-HOTEL-004",
      name: "ITC Grand Chola",
      address: "63, Mount Road, Guindy",
      city: cityName,
      stars: 5,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      cheapest: {
        amount: 15600 * nightCount,
        currency: "INR",
        offerId: "RA-OFFER-004",
        roomName: "Executive Club Room",
        boardName: "Room Only",
        refundable: true,
      },
    },
    {
      hotelId: "RA-HOTEL-005",
      name: "Aman-i-Khás Wilderness Camp",
      address: "Sherpur, Ranthambhore National Park",
      city: cityName,
      stars: 5,
      image: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=800&q=80",
      cheapest: {
        amount: 85000 * nightCount,
        currency: "INR",
        offerId: "RA-OFFER-005",
        roomName: "Canvas Wilderness Tent",
        boardName: "All Inclusive",
        refundable: true,
      },
    },
    {
      hotelId: "RA-HOTEL-006",
      name: "Samode Palace Heritage Hotel",
      address: "Samode Village, Chomu",
      city: cityName,
      stars: 4,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      cheapest: {
        amount: 12000 * nightCount,
        currency: "INR",
        offerId: "RA-OFFER-006",
        roomName: "Heritage Haveli Room",
        boardName: "Breakfast Included",
        refundable: true,
      },
    },
  ];
  return base;
}

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

    // If no LiteAPI key is configured, return curated mock results
    if (!process.env.LITEAPI_KEY) {
      const mockHotels = getMockHotels(cityName, checkin, checkout, adults);
      return NextResponse.json({
        hotels: mockHotels,
        checkin,
        checkout,
        adults,
        currency,
        mock: true,
      });
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
