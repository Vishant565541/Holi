"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Trash2, ShieldCheck, Weight, Info, Calendar, Users, ChevronRight, Helicopter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Leg {
  source: string;
  destination: string;
}

interface PassengerWeight {
  name: string;
  weight: number;
}

// Coordinates for SVG route map
const MAP_COORDINATES: Record<string, { x: number; y: number; label: string }> = {
  "New Delhi Hub (DEL)": { x: 190, y: 190, label: "Delhi" },
  "Dehradun Terminal (DED)": { x: 215, y: 155, label: "Dehradun" },
  "Kedarnath Sanctuary": { x: 235, y: 130, label: "Kedarnath" },
  "Badrinath Valley": { x: 255, y: 135, label: "Badrinath" },
  "Srinagar Terminal (SXR)": { x: 165, y: 80, label: "Srinagar" },
  "Katra Staging Helipad": { x: 155, y: 105, label: "Katra" },
  "Mumbai Corporate Helipad": { x: 120, y: 350, label: "Mumbai" },
  "Goa Beachfront Heliport": { x: 135, y: 400, label: "Goa" }
};

const STAGING_LOCATIONS = Object.keys(MAP_COORDINATES);

const HELI_MODELS = [
  { id: "h-1", name: "Airbus H145", capacity: 900, ratePerLeg: 220000, desc: "Twin-engine VIP cabin · Max 900 kg cargo" },
  { id: "h-2", name: "Bell 429", capacity: 750, ratePerLeg: 180000, desc: "High-altitude power · Max 750 kg cargo" },
  { id: "h-3", name: "Augusta AW109", capacity: 600, ratePerLeg: 150000, desc: "Executive high-speed shuttle · Max 600 kg cargo" }
];

export default function CharterPage() {
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  // Flight legs state
  const [legs, setLegs] = useState<Leg[]>([
    { source: "New Delhi Hub (DEL)", destination: "Dehradun Terminal (DED)" }
  ]);

  // Helicopter choice
  const [selectedHeliId, setSelectedHeliId] = useState("h-1");
  const activeHeli = HELI_MODELS.find((h) => h.id === selectedHeliId) || HELI_MODELS[0];

  // Date and passengers
  const today = new Date().toISOString().split("T")[0];
  const [departureDate, setDepartureDate] = useState(today);

  // Manifest and weights state
  const [passengers, setPassengers] = useState<PassengerWeight[]>([
    { name: "Primary Charterer", weight: 78 },
    { name: "Guest #2", weight: 70 }
  ]);
  const [luggageCount, setLuggageCount] = useState(2);

  // Estimators
  const totalPassengerWeight = passengers.reduce((sum, p) => sum + p.weight, 0);
  const totalLuggageWeight = luggageCount * 15; // Assume 15kg per bag
  const totalPayload = totalPassengerWeight + totalLuggageWeight;
  const isOverweight = totalPayload > activeHeli.capacity;
  const safetyPercentage = Math.min(100, (totalPayload / activeHeli.capacity) * 100);

  const pricePerLeg = activeHeli.ratePerLeg;
  const subtotal = legs.length * pricePerLeg;
  const tax = subtotal * 0.18;
  const finalPrice = subtotal + tax;

  const handleAddLeg = () => {
    if (legs.length >= 4) return;
    const lastDest = legs[legs.length - 1].destination;
    // Auto populate next source with previous destination
    const nextDest = STAGING_LOCATIONS.find((loc) => loc !== lastDest) || STAGING_LOCATIONS[0];
    setLegs([...legs, { source: lastDest, destination: nextDest }]);
  };

  const handleRemoveLeg = (idx: number) => {
    if (legs.length <= 1) return;
    setLegs(legs.filter((_, i) => i !== idx));
  };

  const handleLegChange = (idx: number, field: keyof Leg, val: string) => {
    const updated = [...legs];
    updated[idx] = { ...updated[idx], [field]: val };
    setLegs(updated);
  };

  const handleAddPassenger = () => {
    if (passengers.length >= 8) return;
    setPassengers([...passengers, { name: `Guest #${passengers.length + 1}`, weight: 75 }]);
  };

  const handleRemovePassenger = (idx: number) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const handlePassengerWeightChange = (idx: number, field: keyof PassengerWeight, val: string | number) => {
    const updated = [...passengers];
    updated[idx] = {
      ...updated[idx],
      [field]: field === "weight" ? Number(val) : val
    };
    setPassengers(updated);
  };

  const handleReserveCharter = () => {
    if (isOverweight) {
      alert("Payload safety limit exceeded! Please reduce cargo weight or select a larger helicopter model.");
      return;
    }

    const routeStr = legs.map((l) => MAP_COORDINATES[l.source]?.label + " ➔ " + MAP_COORDINATES[l.destination]?.label).join(" | ");

    setItem({
      type: "helicopter",
      id: `bespoke-charter-${Date.now()}`,
      name: `Bespoke Charter: ${activeHeli.name}`,
      price: subtotal, // Store base rate in cart, checkout will recalculate taxes and any add-ons
      date: departureDate,
      passengers: passengers.length,
      details: `Multi-Leg Charter: ${routeStr} · Total Payload: ${totalPayload}kg / ${activeHeli.capacity}kg`,
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop"
    });

    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 text-white bg-[#020B1E] min-h-screen">
      
      {/* Title */}
      <div className="border-b border-white/5 pb-8 flex flex-col gap-2">
        <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
          VIP Flight Concierge
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight uppercase">
          Bespoke Air Charter Planner
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-300">
          Design custom flight paths, verify cabin payload safety, and book exclusive private air corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left column: Controls */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Section 1: Route Builder */}
          <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col gap-5 text-left">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold text-white border-b border-white/5 pb-3">
              1. Build Custom Flight Legs
            </h3>
            
            <div className="flex flex-col gap-4">
              {legs.map((leg, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white/2 p-4 rounded-lg border border-white/5">
                  <div className="md:col-span-1 flex justify-center text-xs font-space font-bold text-[#C5A880] uppercase">
                    Leg #{idx + 1}
                  </div>
                  
                  {/* Source Dropdown */}
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-widest font-space text-slate-400">From</label>
                    <select
                      value={leg.source}
                      onChange={(e) => handleLegChange(idx, "source", e.target.value)}
                      className="bg-[#05070D] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-sans"
                    >
                      {STAGING_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Destination Dropdown */}
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-widest font-space text-slate-400">To</label>
                    <select
                      value={leg.destination}
                      onChange={(e) => handleLegChange(idx, "destination", e.target.value)}
                      className="bg-[#05070D] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-sans"
                    >
                      {STAGING_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-3 flex justify-end">
                    {legs.length > 1 && (
                      <button
                        onClick={() => handleRemoveLeg(idx)}
                        className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="md:hidden">Remove Leg</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {legs.length < 4 && (
              <button
                onClick={handleAddLeg}
                className="self-start py-2 px-4 border border-gold/30 hover:border-gold text-gold hover:text-white rounded text-xs font-space font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Flight Leg
              </button>
            )}
          </div>

          {/* Section 2: Helicopter Fleet */}
          <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col gap-5 text-left">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold text-white border-b border-white/5 pb-3">
              2. Private Helicopter Model
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HELI_MODELS.map((heli) => (
                <button
                  key={heli.id}
                  onClick={() => setSelectedHeliId(heli.id)}
                  className={`text-left p-4 rounded-xl border flex flex-col justify-between min-h-36 transition-all cursor-pointer ${
                    selectedHeliId === heli.id
                      ? "bg-gold/5 border-gold text-gold scale-102 shadow-lg"
                      : "bg-[#05070D]/80 border-white/5 text-slate-300 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="h-8 w-8 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-2">
                      <Helicopter className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-space font-bold text-white text-sm">{heli.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 leading-snug">{heli.desc}</span>
                  </div>
                  <div className="border-t border-white/5 pt-3 mt-4 text-[10px] uppercase font-space font-bold tracking-wider text-[#C5A880]">
                    ₹{heli.ratePerLeg.toLocaleString("en-IN")} / Leg
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Payload Weight Logger */}
          <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col gap-6 text-left">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <Weight className="h-4.5 w-4.5 text-gold" />
              3. Cabin Payload &amp; Cargo Logger
            </h3>

            {/* Visual Gauge */}
            <div className="bg-[#05070D] rounded-xl p-5 border border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-space uppercase tracking-wider text-slate-400">Total Manifest Weight</span>
                <span className={`font-mono font-bold text-sm ${isOverweight ? "text-red-400" : "text-emerald-400"}`}>
                  {totalPayload} kg / {activeHeli.capacity} kg
                </span>
              </div>
              
              {/* Progress gauge bar */}
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOverweight ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-amber-500"
                  }`}
                  style={{ width: `${safetyPercentage}%` }}
                />
              </div>

              {/* Status Banner */}
              <div className="flex items-start gap-2.5 mt-1 text-[11px] leading-relaxed">
                <Info className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isOverweight ? "text-red-400" : "text-teal-400"}`} />
                <p className={isOverweight ? "text-red-300" : "text-slate-300"}>
                  {isOverweight ? (
                    <strong className="text-red-400 font-bold uppercase tracking-wider block font-space">Overweight Warning</strong>
                  ) : (
                    <strong className="text-emerald-400 font-bold uppercase tracking-wider block font-space">Safety Approved</strong>
                  )}
                  {isOverweight 
                    ? "Your weight configuration exceeds helicopter rotor lift limit. Please upgrade helicopter model or drop secondary baggage items."
                    : "Payload coordinates are within nominal visual flight rules (VFR) safety bounds for high-altitude mountain takeoff."
                  }
                </p>
              </div>
            </div>

            {/* Passenger weight grid list */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-space uppercase tracking-widest text-[#C5A880] font-bold">Individual Guest Weights</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passengers.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/2 border border-white/5 p-3 rounded-lg">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handlePassengerWeightChange(idx, "name", e.target.value)}
                      className="bg-[#05070D] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-gold/50 font-sans w-2/3"
                      placeholder={`Passenger #${idx + 1}`}
                    />
                    <div className="flex items-center gap-1.5 w-1/3">
                      <input
                        type="number"
                        value={p.weight || ""}
                        onChange={(e) => handlePassengerWeightChange(idx, "weight", e.target.value)}
                        className="bg-[#05070D] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-gold/50 font-mono text-right w-full"
                        placeholder="kg"
                      />
                      <span className="text-[10px] text-slate-400">kg</span>
                    </div>
                    {passengers.length > 1 && (
                      <button
                        onClick={() => handleRemovePassenger(idx)}
                        className="text-red-400/70 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 items-center justify-between border-t border-white/5 pt-4 mt-2">
                {passengers.length < 8 && (
                  <button
                    onClick={handleAddPassenger}
                    className="py-1.5 px-3 border border-white/10 hover:border-gold text-xs font-space font-bold uppercase rounded transition-all cursor-pointer"
                  >
                    + Add Guest Row
                  </button>
                )}

                {/* Luggage Counter */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-sans">Baggage Bags (Max 15kg/bag):</span>
                  <div className="flex items-center bg-[#05070D] border border-white/10 rounded overflow-hidden">
                    <button
                      onClick={() => setLuggageCount((c) => Math.max(0, c - 1))}
                      className="px-2.5 py-1 hover:bg-white/5 text-xs text-slate-400 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-mono text-xs text-white font-bold">{luggageCount}</span>
                    <button
                      onClick={() => setLuggageCount((c) => Math.min(8, c + 1))}
                      className="px-2.5 py-1 hover:bg-white/5 text-xs text-slate-400 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: SVG Visualizer map & pricing */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
          
          {/* Map visualizer */}
          <div className="glass-card rounded-xl p-5 border border-white/10 shadow-xl flex flex-col gap-4 text-left overflow-hidden">
            <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Flight corridor tracker
            </span>

            {/* Map Frame */}
            <div className="h-[280px] w-full bg-[#05070D] border border-white/5 rounded-lg relative overflow-hidden flex items-center justify-center">
              
              {/* Map background grids */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {/* SVG drawing paths */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 350 450">
                {/* Connecting lines of selected legs */}
                {legs.map((leg, idx) => {
                  const pt1 = MAP_COORDINATES[leg.source];
                  const pt2 = MAP_COORDINATES[leg.destination];
                  if (!pt1 || !pt2) return null;

                  // Curved path coordinate control
                  const dx = pt2.x - pt1.x;
                  const dy = pt2.y - pt1.y;
                  const cx = pt1.x + dx / 2 - dy * 0.15;
                  const cy = pt1.y + dy / 2 + dx * 0.15;

                  return (
                    <g key={idx}>
                      <path
                        d={`M ${pt1.x} ${pt1.y} Q ${cx} ${cy} ${pt2.x} ${pt2.y}`}
                        fill="none"
                        stroke="#C5A880"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="opacity-40"
                      />
                      {/* Animated overlay route */}
                      <path
                        d={`M ${pt1.x} ${pt1.y} Q ${cx} ${cy} ${pt2.x} ${pt2.y}`}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2.5"
                        strokeDasharray="8 100"
                        className="animate-dash"
                        style={{
                          strokeDashoffset: 100,
                          animation: "dash 4s linear infinite",
                          animationDelay: `${idx * 0.5}s`
                        }}
                      />
                    </g>
                  );
                })}

                {/* Staging coordinate markers */}
                {Object.entries(MAP_COORDINATES).map(([name, coords]) => {
                  // Check if point is active in current legs
                  const isActive = legs.some((l) => l.source === name || l.destination === name);
                  return (
                    <g key={name} transform={`translate(${coords.x}, ${coords.y})`}>
                      <circle
                        r={isActive ? 4.5 : 2.5}
                        className={isActive ? "fill-blue-500 animate-pulse stroke-white stroke-1" : "fill-white/30"}
                      />
                      <text
                        y="-8"
                        textAnchor="middle"
                        className={`text-[7px] font-space font-bold uppercase ${
                          isActive ? "fill-gold font-extrabold" : "fill-slate-500"
                        }`}
                      >
                        {coords.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Pricing detail box */}
          <div className="glass-card rounded-xl p-6 border border-white/10 shadow-xl flex flex-col gap-5 text-left">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
              Charter Estimate
            </h3>

            {/* Flight parameters */}
            <div className="flex flex-col gap-2 font-luxury text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-mono text-white">{departureDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Legs:</span>
                <span className="text-white font-bold">{legs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Helicopter:</span>
                <span className="text-white font-bold">{activeHeli.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Roster Manifest:</span>
                <span className="text-white font-bold">{passengers.length} passengers</span>
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Pricing breakdown */}
            <div className="flex flex-col gap-2 font-luxury text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Leg Base Rate × {legs.length}</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Aviation GST (18%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-1">
                <span className="font-space text-xs uppercase font-bold text-white">Estimated Price</span>
                <span className="font-space text-lg font-bold text-gold">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            <div className="flex gap-2 bg-[#C5A880]/5 border border-[#C5A880]/10 p-3 rounded text-[10px] text-slate-300">
              <ShieldCheck className="h-4.5 w-4.5 text-gold shrink-0" />
              <span>Quotes include ATC clearances, staging crew manifests, and secure priority lounge access.</span>
            </div>

            <button
              onClick={handleReserveCharter}
              disabled={isOverweight}
              className="w-full py-3 bg-gold hover:bg-[#E3C69D] text-black font-space font-bold text-xs uppercase tracking-widest rounded border border-gold cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <span>Book Private Flight</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated SVG CSS inject */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
