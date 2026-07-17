"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TOUR_PACKAGES, TourPackage } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { Check, X, Calendar, Users, Star, MapPin, ArrowLeft, Minus, Plus, Award, ShieldCheck, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Configuration wizard states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedHeli, setSelectedHeli] = useState<string>("h-1"); // h-1: Airbus, h-2: Bell, h-3: AW
  const [selectedRoom, setSelectedRoom] = useState<string>("r-1"); // r-1: Deluxe, r-2: Suite, r-3: Canopy
  const [addonLimo, setAddonLimo] = useState<boolean>(false);
  const [addonGuide, setAddonGuide] = useState<boolean>(false);
  const [addonCatering, setAddonCatering] = useState<boolean>(false);

  const EXTRA_GUEST_FEE = 75000;

  // Helicopter details & offsets
  let heliName = "Airbus H145";
  let heliOffset = 0;
  if (selectedHeli === "h-2") {
    heliName = "Bell 429";
    heliOffset = -30000;
  } else if (selectedHeli === "h-3") {
    heliName = "Augusta AW109";
    heliOffset = -50000;
  }
  const totalHeliOffset = heliOffset * passengers;

  // Room details & offsets
  let roomName = "Deluxe Room";
  let hotelOffset = 0;
  if (selectedRoom === "r-2") {
    roomName = "Luxury Suite";
    hotelOffset = 40000;
  } else if (selectedRoom === "r-3") {
    roomName = "Presidential Canopy";
    hotelOffset = 90000;
  }

  // Addons details & offsets
  const limoCost = addonLimo ? 15000 : 0;
  const guideCost = addonGuide ? 10000 * passengers : 0;
  const cateringCost = addonCatering ? 12000 * passengers : 0;

  const totalPrice = pkg.price + (passengers - 1) * EXTRA_GUEST_FEE + totalHeliOffset + hotelOffset + limoCost + guideCost + cateringCost;

  const handleDecrease = () => setPassengers((p) => Math.max(1, p - 1));
  const handleIncrease = () => setPassengers((p) => Math.min(12, p + 1));

  const handleBookTour = () => {
    const activeAddonsList = [];
    if (addonLimo) activeAddonsList.push("VIP Limousine");
    if (addonGuide) activeAddonsList.push("Priority Guide");
    if (addonCatering) activeAddonsList.push("Gourmet Catering");

    const descDetails = `${pkg.duration} Retreat | Fleet: ${heliName} | Stay: ${roomName}${
      activeAddonsList.length > 0 ? " | Add-ons: " + activeAddonsList.join(", ") : ""
    }`;

    setItem({
      type: "package",
      id: pkg.id,
      name: pkg.name,
      price: totalPrice,
      date: selectedDate,
      passengers: passengers,
      details: descDetails,
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
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />
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

        {/* Right Side — Interactive Booking Sidebar Wizard */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="glass-card rounded-xl p-6 border border-white/10 shadow-xl flex flex-col gap-6">
            
            {/* Step Indicators */}
            <div className="flex flex-col gap-2">
              <span className="font-space text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">
                Configure Retreat · Step {currentStep} of 4
              </span>
              <div className="flex justify-between items-center mt-1">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-grow">
                    <button
                      onClick={() => step < currentStep || currentStep === 4 ? setCurrentStep(step) : null}
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-space text-[10px] font-bold border transition-all ${
                        currentStep === step
                          ? "bg-gold text-black border-gold glow-gold scale-105"
                          : currentStep > step
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 cursor-pointer"
                          : "bg-white/5 border-white/10 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {step}
                    </button>
                    {step < 4 && (
                      <div className={`h-[1px] flex-grow mx-2 ${currentStep > step ? "bg-emerald-500" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Step Contents */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-white">
                    Step 1: Schedule & Helicopter
                  </h3>

                  {/* Departure Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-space uppercase tracking-widest text-gold font-bold">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={today}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-space focus:outline-none focus:border-gold/50 cursor-pointer"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>

                  {/* Passengers */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-space uppercase tracking-widest text-gold font-bold">
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                      <button
                        onClick={handleDecrease}
                        disabled={passengers <= 1}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-gold/20 text-white flex items-center justify-center disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-space text-sm font-bold text-white tabular-nums">
                        {passengers} {passengers === 1 ? "Guest" : "Guests"}
                      </span>
                      <button
                        onClick={handleIncrease}
                        disabled={passengers >= 12}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-gold/20 text-white flex items-center justify-center disabled:opacity-30"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Helicopter fleet list */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-space uppercase tracking-widest text-gold font-bold">
                      Select Helicopter Fleet
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "h-1", name: "Airbus H145", desc: "Twin-engine VIP luxury cabin, standard fare", offset: "Included" },
                        { id: "h-2", name: "Bell 429", desc: "Premium agility, high-altitude support", offset: "-₹30,000 / guest" },
                        { id: "h-3", name: "Augusta AW109", desc: "High-speed executive transport", offset: "-₹50,000 / guest" },
                      ].map((heli) => (
                        <button
                          key={heli.id}
                          onClick={() => setSelectedHeli(heli.id)}
                          className={`text-left p-3 rounded-lg border text-xs flex flex-col gap-0.5 transition-all cursor-pointer ${
                            selectedHeli === heli.id
                              ? "bg-gold/5 border-gold text-gold"
                              : "bg-[#05070D]/80 border-white/5 text-slate-300 hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-space font-bold text-white">{heli.name}</span>
                            <span className="font-mono text-[9px] text-[#C5A880] font-semibold">{heli.offset}</span>
                          </div>
                          <p className="font-luxury text-[9px] text-slate-400 mt-0.5 leading-snug">{heli.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-white">
                    Step 2: Lodging & Suite Tier
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { id: "r-1", name: "Deluxe Suite Room", desc: "Included standard stay at premium resorts.", cost: "Included" },
                      { id: "r-2", name: "Luxury Panoramic Suite", desc: "Expanded balcony views, direct terrace access, private tea lounge.", cost: "+₹40,000 Total" },
                      { id: "r-3", name: "Presidential Villa Canopy", desc: "Private high-altitude cabin with dedicated butler & campfire lounge.", cost: "+₹90,000 Total" },
                    ].map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`text-left p-3 rounded-lg border text-xs flex flex-col gap-0.5 transition-all cursor-pointer ${
                          selectedRoom === room.id
                            ? "bg-gold/5 border-gold text-gold"
                            : "bg-[#05070D]/80 border-white/5 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-space font-bold text-white">{room.name}</span>
                          <span className="font-mono text-[9px] text-[#C5A880] font-semibold">{room.cost}</span>
                        </div>
                        <p className="font-luxury text-[9px] text-slate-400 mt-0.5 leading-snug">{room.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-white">
                    Step 3: Elite Concierge Add-ons
                  </h3>

                  <div className="flex flex-col gap-3">
                    {/* Add-on 1 */}
                    <button
                      onClick={() => setAddonLimo(!addonLimo)}
                      className={`text-left p-3 rounded-lg border text-xs flex flex-col gap-1 transition-all cursor-pointer ${
                        addonLimo
                          ? "bg-gold/5 border-gold text-gold"
                          : "bg-[#05070D]/80 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-space font-bold text-white">Audi A8 Limousine Tarmac Pickups</span>
                        <span className="font-mono text-[9px] text-[#C5A880] font-semibold">+₹15,000 Flat</span>
                      </div>
                      <p className="font-luxury text-[9px] text-slate-400 leading-snug">Private VIP vehicle directly greeting you on the airfield landing strip.</p>
                    </button>

                    {/* Add-on 2 */}
                    <button
                      onClick={() => setAddonGuide(!addonGuide)}
                      className={`text-left p-3 rounded-lg border text-xs flex flex-col gap-1 transition-all cursor-pointer ${
                        addonGuide
                          ? "bg-gold/5 border-gold text-gold"
                          : "bg-[#05070D]/80 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-space font-bold text-white">Priority VIP Spiritual Guide</span>
                        <span className="font-mono text-[9px] text-[#C5A880] font-semibold">+₹10,000 / guest</span>
                      </div>
                      <p className="font-luxury text-[9px] text-slate-400 leading-snug">Avoid queues with express entry lanes and private guide assistance.</p>
                    </button>

                    {/* Add-on 3 */}
                    <button
                      onClick={() => setAddonCatering(!addonCatering)}
                      className={`text-left p-3 rounded-lg border text-xs flex flex-col gap-1 transition-all cursor-pointer ${
                        addonCatering
                          ? "bg-gold/5 border-gold text-gold"
                          : "bg-[#05070D]/80 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-space font-bold text-white">Personalized Gourmet Flight Catering</span>
                        <span className="font-mono text-[9px] text-[#C5A880] font-semibold">+₹12,000 / guest</span>
                      </div>
                      <p className="font-luxury text-[9px] text-slate-400 leading-snug">Bespoke flight menus crafted to your dietary requirements.</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-4 text-left"
                >
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-white">
                    Step 4: Summary Verification
                  </h3>

                  <div className="bg-[#05070D] rounded-lg p-4 border border-white/5 flex flex-col gap-3 font-sans text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Departure:</span>
                      <span className="text-white font-mono">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Manifest:</span>
                      <span className="text-white font-semibold">{passengers} Guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Helicopter:</span>
                      <span className="text-gold font-semibold">{heliName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Room Upgrade:</span>
                      <span className="text-white font-semibold">{roomName}</span>
                    </div>
                    <div className="flex flex-col border-t border-white/5 pt-2 gap-1.5">
                      <span className="text-slate-500">Selected VIP Amenities:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {addonLimo && <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-teal border border-teal/20">Audi A8 Limo</span>}
                        {addonGuide && <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-teal border border-teal/20">Spiritual Guide</span>}
                        {addonCatering && <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-teal border border-teal/20">Gourmet Meals</span>}
                        {!addonLimo && !addonGuide && !addonCatering && <span className="text-slate-500 italic">None</span>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-500/5 border border-teal-500/10 p-3 rounded flex items-center gap-2 text-[10px] text-teal-400">
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                    <span>Includes 256-Bit SSL Protected VIP Checkout and Ground manifest priority logs.</span>
                  </div>

                  <button
                    onClick={handleBookTour}
                    className="w-full py-3 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 border border-gold cursor-pointer"
                  >
                    Confirm &amp; Proceed to Checkout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#051433]/95 backdrop-blur-md border-t border-[#C5A880]/20 py-4 px-6 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-space">Configured Price</span>
          <div className="flex items-baseline gap-2">
            <span className="font-space text-xl sm:text-2xl font-bold text-gold">₹{totalPrice.toLocaleString("en-IN")}</span>
            <span className="text-xs text-slate-300">({passengers} {passengers === 1 ? "Guest" : "Guests"})</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-white/20 hover:border-gold text-white text-xs font-space font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 bg-gold hover:bg-[#E3C69D] text-black text-xs font-space font-bold uppercase tracking-widest rounded transition-all duration-300 cursor-pointer shadow-lg shadow-gold/10"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleBookTour}
              className="px-6 py-2.5 bg-gold hover:bg-[#E3C69D] text-black text-xs font-space font-bold uppercase tracking-widest rounded transition-all duration-300 cursor-pointer shadow-lg shadow-gold/20"
            >
              Book Now
            </button>
          )}
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
