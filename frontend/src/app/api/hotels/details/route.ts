import { NextRequest, NextResponse } from "next/server";
import { liteapi, isIsoDate } from "@/lib/liteapi";

// ── Mock hotel detail data for when LITEAPI_KEY is not configured ─────────────
const MOCK_HOTELS: Record<string, any> = {
  "RA-HOTEL-001": {
    name: "The Oberoi Grand Palace",
    description: "A magnificent heritage property blending Mughal architecture with contemporary luxury. Set amidst sprawling gardens, The Oberoi Grand Palace offers an unrivalled blend of history, art, and impeccable service.",
    address: "15, Jawaharlal Nehru Marg", city: "Jaipur", country: "India", stars: 5,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1601918774516-31ee5f1c3d56?w=800&q=80",
    ],
    amenities: ["Infinity Pool", "Spa & Wellness", "Fine Dining", "Butler Service", "Helipad", "Concierge", "Fitness Centre", "Business Lounge"],
    checkinTime: "15:00", checkoutTime: "12:00",
  },
  "RA-HOTEL-002": {
    name: "Taj Lake Palace Resort",
    description: "Rising magnificently from the shimmering waters of Lake Pichola, the Taj Lake Palace is a marvel of white marble and coloured stone mosaics. One of India's most iconic heritage hotels offering royal suites with panoramic lake views.",
    address: "Pichola Lake, Old City", city: "Udaipur", country: "India", stars: 5,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    ],
    amenities: ["Lake-View Suites", "Heritage Spa", "Rooftop Dining", "Boat Transfers", "Royal Butler", "Cultural Evenings", "Yoga Pavilion"],
    checkinTime: "14:00", checkoutTime: "12:00",
  },
  "RA-HOTEL-003": {
    name: "The Leela Palace",
    description: "An architectural masterpiece in the heart of the capital, The Leela Palace New Delhi reflects the grandeur of India's rich architectural heritage. Experience unmatched luxury with world-class cuisine and an award-winning spa.",
    address: "Diplomatic Enclave, Chanakyapuri", city: "New Delhi", country: "India", stars: 5,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    ],
    amenities: ["Rooftop Pool", "ESPA Spa", "Multiple Restaurants", "Club Lounge", "Personal Butler", "Concierge Desk"],
    checkinTime: "15:00", checkoutTime: "12:00",
  },
  "RA-HOTEL-004": {
    name: "ITC Grand Chola",
    description: "A celebration of South Indian grandeur, ITC Grand Chola is India's largest luxury hotel inspired by the medieval Chola temples. With 600 rooms and residences and over 10 restaurants, it represents the pinnacle of responsible luxury.",
    address: "63, Mount Road, Guindy", city: "Chennai", country: "India", stars: 5,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80",
    ],
    amenities: ["Olympic Pool", "Kaya Kalp Spa", "10+ Restaurants", "Business Centre", "LEED Platinum", "Luxury Residences"],
    checkinTime: "15:00", checkoutTime: "12:00",
  },
  "RA-HOTEL-005": {
    name: "Aman-i-Khás Wilderness Camp",
    description: "Immersed in the wilderness of Ranthambhore, Aman-i-Khás offers ten tented pavilions with views over a pristine nature reserve. The ideal base for tiger safaris with an intimate luxury atmosphere.",
    address: "Sherpur, Ranthambhore National Park", city: "Ranthambhore", country: "India", stars: 5,
    images: [
      "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=800&q=80",
      "https://images.unsplash.com/photo-1607868894064-2b6e7ed1b324?w=800&q=80",
    ],
    amenities: ["Game Drives", "Luxury Tents", "Stargazing Deck", "Outdoor Spa", "Yoga Deck", "All-Inclusive Dining"],
    checkinTime: "14:00", checkoutTime: "11:00",
  },
  "RA-HOTEL-006": {
    name: "Samode Palace Heritage Hotel",
    description: "An exquisite 475-year-old palace nestled in the Aravalli Hills, Samode Palace is a living museum of Rajput art and craftsmanship. Elaborately painted chambers, inlaid mirrors and zenana courtyards create a sense of timeless splendour.",
    address: "Samode Village, Chomu", city: "Jaipur", country: "India", stars: 4,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80",
    ],
    amenities: ["Heritage Pool", "Palace Dining", "Elephant Rides", "Cultural Workshops", "In-room Jacuzzi", "Yoga Sessions"],
    checkinTime: "14:00", checkoutTime: "11:00",
  },
};

function getMockOffers(hotelId: string, checkin: string, checkout: string, currency = "INR") {
  const nightCount = (() => {
    const d1 = new Date(checkin), d2 = new Date(checkout);
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
  })();

  const baseRates: Record<string, number> = {
    "RA-HOTEL-001": 28500, "RA-HOTEL-002": 42000, "RA-HOTEL-003": 19800,
    "RA-HOTEL-004": 15600, "RA-HOTEL-005": 85000, "RA-HOTEL-006": 12000,
  };
  const base = (baseRates[hotelId] || 20000) * nightCount;
  return [
    { offerId: `${hotelId}-STD`, roomName: "Deluxe Room", boardName: "Room Only", maxOccupancy: 2, refundable: false, cancelBy: null, price: base, currency },
    { offerId: `${hotelId}-BB`, roomName: "Premier Room", boardName: "Breakfast Included", maxOccupancy: 2, refundable: true, cancelBy: checkin, price: Math.round(base * 1.15), currency },
    { offerId: `${hotelId}-SUITE`, roomName: "Signature Suite", boardName: "Full Board", maxOccupancy: 3, refundable: true, cancelBy: checkin, price: Math.round(base * 1.9), currency },
  ];
}

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

    // Return curated mock when no API key configured
    if (!process.env.LITEAPI_KEY) {
      const mockInfo = MOCK_HOTELS[hotelId] || {
        name: "Luxury Heritage Hotel", description: "A premium luxury property offering world-class amenities and unmatched hospitality.",
        address: "City Centre", city: "India", country: "India", stars: 5,
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"],
        amenities: ["Pool", "Spa", "Restaurant", "Concierge"], checkinTime: "14:00", checkoutTime: "12:00",
      };
      return NextResponse.json({
        hotel: { id: hotelId, ...mockInfo },
        offers: getMockOffers(hotelId, checkin, checkout, currency),
        mock: true,
      });
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
