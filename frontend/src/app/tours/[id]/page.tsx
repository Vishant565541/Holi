"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TOUR_PACKAGES, TourPackage } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { Check, X, Calendar, Users, Star, MapPin, ArrowLeft, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

function TourDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  const pkgId = params.id as string;
  const pkg = TOUR_PACKAGES.find((p) => p.id === pkgId) || TOUR_PACKAGES[0];

  // ── Booking state (user-controlled) ─────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  const paramDate = searchParams.get("date") || today;
  const paramPassengers = Number(searchParams.get("passengers")) || 1;

  const [selectedDate, setSelectedDate] = useState<string>(paramDate);
  const [passengers, setPassengers] = useState<number>(paramPassengers);
  const [activeDay, setActiveDay] = useState<number>(1);

  const EXTRA_GUEST_FEE = 75000;
  const baseTotal = pkg.price + (passengers - 1) * EXTRA_GUEST_FEE;

  const handleDecrease = () => setPassengers((p) => Math.max(1, p - 1));
  const handleIncrease = () => setPassengers((p) => Math.min(12, p + 1));

  const handleBookTour = () => {
    setItem({
      type: "package",
      id: pkg.id,
      name: pkg.name,
      price: baseTotal,
      date: selectedDate,
      passengers: passengers,
      details: `${pkg.duration} Premium Luxury Retreat`,
      duration: pkg.duration,
      image: pkg.image,
    });
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Return link */}
      <Link
        href="/tours"
        className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-gold hover:text-white transition-colors mb-8 self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to luxury tours catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-space text-xs uppercase tracking-widest text-gold font-bold px-2 py-0.5 bg-gold/5 border border-gold/15 rounded">
                {pkg.duration}
              </span>
              <div className="flex items-center gap-1 text-gold text-sm font-semibold">
                <Star className="h-4 w-4 fill-gold" />
                <span>{pkg.rating} Rating</span>
              </div>
            </div>
            <h1 className="font-space text-3xl md:text-4xl font-bold tracking-tight text-white mt-3 leading-tight">
              {pkg.name}
            </h1>
            <p className="font-luxury text-sm text-grey-text italic mt-1">{pkg.tagline}</p>
          </div>

          {/* Panoramic photo banner */}
          <div className="h-96 w-full relative rounded-xl overflow-hidden bg-secondary border border-white/5 shadow-lg">
            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />
          </div>

          {/* Interactive Day timeline */}
          <div className="flex flex-col gap-4">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
              Day-by-Day Scheduled Itinerary
            </h3>
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
              {pkg.itinerary.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`py-2 px-4 font-space text-xs font-bold uppercase rounded cursor-pointer transition-colors ${
                    activeDay === day.day
                      ? "bg-gold text-black font-extrabold"
                      : "bg-white/5 border border-white/10 text-grey-text hover:text-white"
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            <div className="bg-white/2 p-6 rounded-lg border border-white/5 min-h-36">
              {pkg.itinerary.map((day) => {
                if (day.day !== activeDay) return null;
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-space text-gold uppercase tracking-widest block font-bold">
                        Phase {day.day} of Journey
                      </span>
                      <h4 className="font-space text-lg font-bold text-white mt-1">{day.title}</h4>
                    </div>
                    <p className="font-luxury text-xs md:text-sm text-grey-text leading-relaxed">
                      {day.desc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-wider text-grey-text">Lodging stay</span>
                        <span className="font-space text-xs font-semibold text-white">{day.stay}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-wider text-grey-text">Transit model</span>
                        <span className="font-space text-xs font-semibold text-teal">{day.transport}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 border border-white/5 flex flex-col gap-4">
              <h4 className="font-space text-xs uppercase tracking-wider font-bold text-gold border-b border-white/5 pb-2">
                Executive Inclusions
              </h4>
              <div className="flex flex-col gap-3">
                {pkg.inclusions.map((inc, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs font-luxury">
                    <Check className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                    <span className="text-grey-text">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/5 flex flex-col gap-4">
              <h4 className="font-space text-xs uppercase tracking-wider font-bold text-red-400 border-b border-white/5 pb-2">
                Exclusions &amp; Terms
              </h4>
              <div className="flex flex-col gap-3">
                {pkg.exclusions.map((exc, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs font-luxury">
                    <X className="h-4 w-4 text-red-400/70 shrink-0 mt-0.5" />
                    <span className="text-grey-text">{exc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Booking Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="glass-card rounded-xl p-6 border border-white/10 shadow-xl flex flex-col gap-5">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
              Book Package
            </h3>

            {/* ── Date Picker ────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tour-departure-date"
                className="flex items-center gap-1.5 text-[10px] font-space uppercase tracking-widest text-gold font-bold"
              >
                <Calendar className="h-3.5 w-3.5" />
                Departure Date
              </label>
              <input
                id="tour-departure-date"
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs font-space focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                style={{ colorScheme: "dark" }}
              />
            </div>

            {/* ── Passenger Selector ────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-[10px] font-space uppercase tracking-widest text-gold font-bold">
                <Users className="h-3.5 w-3.5" />
                Number of Guests
              </label>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <button
                  id="tour-passengers-decrease"
                  onClick={handleDecrease}
                  disabled={passengers <= 1}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold border border-white/10 hover:border-gold/30 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease passengers"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="font-space text-2xl font-bold text-white tabular-nums leading-none">
                    {passengers}
                  </span>
                  <span className="text-[9px] text-grey-text uppercase tracking-wider mt-0.5">
                    {passengers === 1 ? "Guest" : "Guests"}
                  </span>
                </div>

                <button
                  id="tour-passengers-increase"
                  onClick={handleIncrease}
                  disabled={passengers >= 12}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold border border-white/10 hover:border-gold/30 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase passengers"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[9px] text-grey-text font-luxury leading-relaxed">
                +₹{EXTRA_GUEST_FEE.toLocaleString("en-IN")} per additional guest &nbsp;·&nbsp; Max 12 guests
              </p>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* VIP Concierge note */}
            <div className="flex gap-2.5 items-start bg-teal/5 border border-teal/10 p-3.5 rounded text-[10px] font-luxury text-grey-text leading-relaxed">
              <MapPin className="h-4 w-4 text-teal shrink-0 mt-0.5" />
              <div>
                <span className="text-teal font-semibold block mb-0.5">VIP Concierge Service</span>
                Our private flight concierges handle baggage, permits, and priority lane temple/resort entry.
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Live pricing breakdown */}
            <div className="flex flex-col gap-1.5 font-luxury">
              <div className="flex justify-between text-xs text-grey-text">
                <span>Base Package Cost</span>
                <span>₹{pkg.price.toLocaleString("en-IN")}</span>
              </div>
              {passengers > 1 && (
                <motion.div
                  key={passengers}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between text-xs text-grey-text"
                >
                  <span>Extra Guests ×{passengers - 1}</span>
                  <span>+₹{((passengers - 1) * EXTRA_GUEST_FEE).toLocaleString("en-IN")}</span>
                </motion.div>
              )}
              <div className="flex justify-between text-xs text-grey-text">
                <span>VIP Airport Limo Surcharges</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-white/5 mt-1">
                <span className="text-xs font-space uppercase text-white font-bold">Total Quote</span>
                <motion.span
                  key={baseTotal}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="font-space text-lg font-bold text-gold"
                >
                  ₹{baseTotal.toLocaleString("en-IN")}
                </motion.span>
              </div>
            </div>

            <button
              onClick={handleBookTour}
              className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded font-space font-bold text-xs uppercase tracking-widest glow-gold transition-all duration-300 border border-gold cursor-pointer"
            >
              Reserve Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="font-space text-gold text-sm tracking-wider animate-pulse">
            Configuring Luxury Experience Details...
          </span>
        </div>
      }
    >
      <TourDetailContent />
    </Suspense>
  );
}
