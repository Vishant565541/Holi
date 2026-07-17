"use client";

/**
 * /hotels — Search form + results + room offers powered by liteAPI.
 * Selecting a room offer sends the user to /hotels/book?offerId=...
 * Restyled to match the premium glassmorphism styling of the site.
 */

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Calendar, Users, Building, ArrowLeft, RefreshCw, MapPin, Check, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

interface FormState {
  cityName: string;
  countryCode: string;
  checkin: string;
  checkout: string;
  adults: number;
}

interface CheapestOffer {
  amount: number;
  currency: string;
  offerId: string;
  roomName: string;
  boardName: string | null;
  refundable: boolean;
}

interface HotelResult {
  hotelId: string;
  name: string;
  address: string;
  city: string;
  stars: number | null;
  image: string | null;
  cheapest: CheapestOffer;
}

interface SelectedHotelDetails {
  hotel: {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    stars: number | null;
    images: string[];
    amenities: string[];
    checkinTime: string | null;
    checkoutTime: string | null;
  };
  offers: Array<{
    offerId: string;
    roomName: string;
    boardName: string | null;
    maxOccupancy: number | null;
    refundable: boolean;
    cancelBy: string | null;
    price: number | null;
    currency: string;
  }>;
}

function HotelsListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Populate from searchParams or defaults (supporting both direct keys and home search panel fallbacks)
  const initialCity = searchParams.get("cityName") || searchParams.get("destination") || "";
  const initialCheckin = searchParams.get("checkin") || searchParams.get("date") || plusDays(today(), 7);
  const initialCheckout = searchParams.get("checkout") || plusDays(initialCheckin, 2);
  const initialAdults = Number(searchParams.get("adults")) || Number(searchParams.get("passengers")) || 2;

  const [form, setForm] = useState<FormState>({
    cityName: initialCity,
    countryCode: searchParams.get("countryCode") || "IN",
    checkin: initialCheckin,
    checkout: initialCheckout,
    adults: initialAdults,
  });

  const [hotels, setHotels] = useState<HotelResult[] | null>(null);
  const [selected, setSelected] = useState<SelectedHotelDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMockMode, setIsMockMode] = useState(false);

  // Auto-trigger search if cityName is pre-filled from searchParams (or destination fallback)
  useEffect(() => {
    const searchCity = searchParams.get("cityName") || searchParams.get("destination");
    if (searchCity) {
      const triggerSearch = async () => {
        setLoading(true);
        setError("");
        const checkinParam = searchParams.get("checkin") || searchParams.get("date") || plusDays(today(), 7);
        const checkoutParam = searchParams.get("checkout") || plusDays(checkinParam, 2);
        const adultsParam = Number(searchParams.get("adults")) || Number(searchParams.get("passengers")) || 2;
        try {
          const r = await fetch("/api/hotels/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cityName: searchCity,
              countryCode: searchParams.get("countryCode") || "IN",
              checkin: checkinParam,
              checkout: checkoutParam,
              adults: adultsParam,
            }),
          });
          const data = await r.json();
          if (!r.ok) throw new Error(data.error || "Search failed");
          setHotels(data.hotels);
          setIsMockMode(!!data.mock);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      triggerSearch();
    }
  }, [searchParams]);

  const setVal = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [k]: e.target.value });
  };

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSelected(null);
    setHotels(null);

    // Update address bar with queries
    const q = new URLSearchParams({
      cityName: form.cityName,
      countryCode: form.countryCode,
      checkin: form.checkin,
      checkout: form.checkout,
      adults: String(form.adults),
    });
    router.push(`/hotels?${q.toString()}`);

    try {
      const r = await fetch("/api/hotels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Search failed");
      setHotels(data.hotels);
      setIsMockMode(!!data.mock);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openHotel(hotelId: string) {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/hotels/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId, ...form }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not load hotel");
      setSelected(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function book(offer: any) {
    if (!selected) return;
    sessionStorage.setItem(
      "bookingContext",
      JSON.stringify({
        offer,
        hotel: selected.hotel,
        checkin: form.checkin,
        checkout: form.checkout,
      })
    );
    router.push(`/hotels/book?offerId=${encodeURIComponent(offer.offerId)}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title Header */}
      <div className="border-b border-white/5 pb-6 mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold tracking-tight">Luxury Hotel Suites</h1>
          <p className="font-luxury text-sm text-grey-text mt-1">
            Elite palace stays, premium resorts, and wilderness villas powered by live pricing.
          </p>
        </div>
      </div>

      {/* Elegant Search Form */}
      <form onSubmit={search} className="glass-card rounded-2xl p-6 mb-10 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">City</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              required
              placeholder="e.g. Jaipur, Dubai, London"
              value={form.cityName}
              onChange={setVal("cityName")}
              className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury"
            />
          </div>
        </div>

        <div className="w-[120px]">
          <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">Country Code</label>
          <input
            required
            placeholder="IN"
            maxLength={2}
            value={form.countryCode}
            onChange={setVal("countryCode")}
            className="w-full px-3 py-3 bg-[#05070D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury uppercase text-center"
          />
        </div>

        <div className="w-[170px]">
          <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              required
              type="date"
              value={form.checkin}
              onChange={setVal("checkin")}
              className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury cursor-pointer"
            />
          </div>
        </div>

        <div className="w-[170px]">
          <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              required
              type="date"
              value={form.checkout}
              onChange={setVal("checkout")}
              className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury cursor-pointer"
            />
          </div>
        </div>

        <div className="w-[100px]">
          <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">Adults</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="number"
              min="1"
              max="8"
              value={form.adults}
              onChange={setVal("adults")}
              className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 bg-gold hover:bg-gold-hover text-background font-space font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Real payment gateway logos and SSL secure badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/5 bg-white/2 rounded-xl text-[10px] uppercase font-space text-grey-text mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-gold" />
          <span>SSL 256-bit Encrypted Checkout | Safe & Secure Bookings</span>
        </div>
        <div className="flex items-center gap-3 grayscale opacity-60">
          <span className="text-[9px] font-bold">Razorpay</span>
          <span className="text-[9px] font-bold">PayU</span>
          <span className="text-[9px] font-bold">Stripe</span>
        </div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-luxury"
          >
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {loading && (
        <div className="py-20 text-center text-xs font-luxury text-grey-text">
          <RefreshCw className="h-6 w-6 text-gold animate-spin mx-auto mb-2" />
          Fetching live luxury rates…
        </div>
      )}

      {/* Mock mode info banner */}
      {isMockMode && hotels && (
        <div className="mb-6 flex items-center gap-3 bg-gold/5 border border-gold/20 rounded-xl px-4 py-3 text-xs font-luxury text-gold/80">
          <Star className="w-4 h-4 shrink-0 text-gold" />
          <span>
            <strong>Sample Properties</strong> — Showing curated showcase hotels. Live hotel inventory will appear once the hotel API is connected.
          </span>
        </div>
      )}

      {/* Results grid */}
      {!loading && hotels && !selected && (
        <div className="flex flex-col gap-6">
          {hotels.length === 0 && (
            <p className="text-center py-10 font-luxury text-grey-text">
              No hotels with availability found — try other dates or check the city name.
            </p>
          )}
          {hotels.map((h) => (
            <div
              key={h.hotelId}
              onClick={() => openHotel(h.hotelId)}
              className="glass-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 transition-all hover:border-gold/20 duration-300 cursor-pointer"
            >
              {/* Hotel Main Image */}
              <div className="lg:col-span-4 h-48 lg:h-full min-h-[160px] relative rounded-xl overflow-hidden bg-secondary">
                {h.image ? (
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-600">
                    <Building className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-gold text-xs mb-2">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span className="font-bold">{h.stars ? h.stars.toFixed(1) : "5.0"} Stars</span>
                  </div>
                  <h3 className="font-space text-xl font-bold text-white mb-2">{h.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-grey-text mb-4 font-luxury">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{h.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-luxury text-slate-400 bg-white/5 border border-white/5 rounded px-2.5 py-0.5">
                    {h.cheapest.refundable ? "Free Cancellation" : "Non-refundable"}
                  </span>
                  {h.cheapest.boardName && (
                    <span className="text-[10px] font-luxury text-slate-400 bg-white/5 border border-white/5 rounded px-2.5 py-0.5">
                      {h.cheapest.boardName}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Action Column */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-5 lg:pt-0 lg:pl-6 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-4">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-grey-text font-space">From</span>
                  <div className="font-space text-2xl font-bold text-gold">
                    {h.cheapest.currency} {Math.round(h.cheapest.amount).toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-grey-text block font-luxury">{h.cheapest.roomName}</span>
                </div>

                <button className="py-2.5 px-5 bg-gold hover:bg-gold-hover text-background rounded-lg font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer">
                  View Rooms
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hotel full details + room selection */}
      {!loading && selected && (
        <div className="space-y-8">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to results
          </button>

          {/* Header Info */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-1.5 text-gold text-xs mb-2">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-bold">{selected.hotel.stars ? selected.hotel.stars.toFixed(1) : "5.0"} Star Hotel</span>
            </div>
            <h2 className="font-space text-3xl font-bold text-white mb-2">{selected.hotel.name}</h2>
            <div className="flex items-center gap-2 text-sm text-grey-text font-luxury mb-6">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{selected.hotel.address}, {selected.hotel.city}, {selected.hotel.country}</span>
            </div>

            {/* Image strip */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {selected.hotel.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-32 w-48 object-cover rounded-xl border border-white/5 shrink-0"
                />
              ))}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h4 className="font-space text-sm uppercase tracking-widest text-gold mb-2">Description</h4>
              <p
                className="font-luxury text-sm text-grey-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selected.hotel.description }}
              />
            </div>

            {/* Amenities list */}
            {selected.hotel.amenities && selected.hotel.amenities.length > 0 && (
              <div className="mt-6 border-t border-white/5 pt-6">
                <h4 className="font-space text-sm uppercase tracking-widest text-gold mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.hotel.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-luxury text-slate-400 border border-white/10 rounded-full px-3 py-1 bg-white/5"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rooms Grid */}
          <div className="space-y-4">
            <h3 className="font-space text-xl font-bold text-white">Available Room Packages</h3>
            {selected.offers.map((o) => (
              <div
                key={o.offerId}
                className="glass-card rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div>
                  <h4 className="font-space text-lg font-bold text-white">{o.roomName}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-grey-text font-luxury">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {o.boardName || "Room only"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {o.refundable ? "Free cancellation" : "Non-refundable"}
                    </span>
                    {o.maxOccupancy && (
                      <span>• Max occupancy: {o.maxOccupancy} adults</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:flex-col items-end w-full md:w-auto gap-4">
                  <div className="text-left md:text-right">
                    <div className="font-mono text-xl font-bold text-gold">
                      {o.currency} {o.price != null ? Math.round(o.price).toLocaleString("en-IN") : "—"}
                    </div>
                    <span className="text-[10px] text-slate-500 font-luxury">Total stay price</span>
                  </div>
                  <button
                    onClick={() => book(o)}
                    className="py-2.5 px-6 bg-gold hover:bg-gold-hover text-background rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all cursor-pointer glow-gold"
                  >
                    Book suite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HOTEL BOOKING FAQ SECTION ──────────────────────────────────────── */}
      <div className="mt-20 border-t border-white/5 pt-16 text-left max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 mb-10 text-center">
          <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Resort Help Desk</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">Hotel Booking FAQs</h2>
          <div className="h-[1px] w-12 bg-gold mx-auto mt-2" />
        </div>

        <div className="flex flex-col gap-4 text-xs font-sans text-slate-300">
          {[
            {
              q: "Does my reservation include direct private helipad access?",
              a: "Many of our partner hotels, including Aman-i-Khas Wilds and luxury estates, feature private landing clearances. During checkout, you can request custom flight coordinates to land directly on the resort helipads."
            },
            {
              q: "Can I cancel my hotel suite booking with a full refund?",
              a: "Cancellation rules depend strictly on the selected room offer. Offers marked with 'Free cancellation' can be cancelled without penalty up to the cancelBy date shown. Non-refundable offers are ineligible for refunds upon lock-in."
            },
            {
              q: "Are airport tarmac limousine transfers included?",
              a: "Limousine tarmac transfers are available as premium add-ons at checkout or complimentary when booked as part of our high-end spiritual and coastal tour packages."
            },
            {
              q: "What documentation is required at resort check-in?",
              a: "Guests must present a valid physical passport, Aadhaar card, or government photo ID matching the names logged in the booking manifest. PAN cards are not accepted."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/2 border border-white/10 rounded-lg p-5">
              <h4 className="font-space text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-gold">Q.</span> {item.q}
              </h4>
              <p className="leading-relaxed text-slate-300 pl-4">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HotelsListingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="font-space text-gold text-sm tracking-wider animate-pulse">
            Configuring Luxury Resort Suites...
          </span>
        </div>
      }
    >
      <HotelsListingContent />
    </Suspense>
  );
}
