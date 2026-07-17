"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { HELICOPTERS, HelicopterListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { 
  Map, 
  Eye, 
  Compass, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown,
  Activity,
  Coffee,
  UserCheck,
  Car
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/utils/api";

// Latitude, Longitude, and Relative SVG Grid Coordinates for major flight paths
const locationCoordinates: Record<string, { lat: string; lon: string; x: number; y: number; name: string }> = {
  "Dehradun (DED)": { name: "Dehradun", lat: "30.3165° N", lon: "78.0322° E", x: 48, y: 46 },
  "New Delhi Hub": { name: "New Delhi", lat: "28.6139° N", lon: "77.2090° E", x: 42, y: 62 },
  "Delhi (DEL)": { name: "New Delhi", lat: "28.6139° N", lon: "77.2090° E", x: 42, y: 62 },
  "Srinagar Terminal": { name: "Srinagar", lat: "34.0837° N", lon: "74.7973° E", x: 30, y: 20 },
  "Goa Beachfront Heliport": { name: "Goa Beach", lat: "15.2993° N", lon: "74.1240° E", x: 36, y: 88 },
  "Goa Shoreline": { name: "Goa Shore", lat: "15.3200° N", lon: "74.1100° E", x: 37, y: 89 },
  "Mumbai Heliport": { name: "Mumbai", lat: "19.0760° N", lon: "72.8777° E", x: 28, y: 78 },
  "Mumbai (BOM)": { name: "Mumbai", lat: "19.0760° N", lon: "72.8777° E", x: 28, y: 78 },
  "Kedarnath Sanctuary": { name: "Kedarnath", lat: "30.7346° N", lon: "79.0669° E", x: 55, y: 34 },
  "Badrinath Valley": { name: "Badrinath", lat: "30.7433° N", lon: "79.4938° E", x: 59, y: 35 },
  "Badrinath Shrine": { name: "Badrinath", lat: "30.7433° N", lon: "79.4938° E", x: 59, y: 35 },
  "Vaishno Devi Shrine": { name: "Vaishno Devi", lat: "32.9801° N", lon: "74.9530° E", x: 31, y: 25 },
  "Char Dham Circuit": { name: "Char Dham", lat: "30.7000° N", lon: "79.1000° E", x: 57, y: 37 },
};

function BookingSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  // Search parameters from URL
  const paramSource = searchParams.get("source") || "Dehradun (DED)";
  const paramDest = searchParams.get("destination") || "Kedarnath Sanctuary";
  const paramDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const paramPassengers = Number(searchParams.get("passengers")) || 2;

  // Local state for Modify Search
  const [localSource, setLocalSource] = useState(paramSource);
  const [localDest, setLocalDest] = useState(paramDest);
  const [localDate, setLocalDate] = useState(paramDate);
  const [localPassengers, setLocalPassengers] = useState(paramPassengers);

  // Filter states
  const [helicopters, setHelicopters] = useState<HelicopterListing[]>(HELICOPTERS);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [sortBy, setSortBy] = useState<"price" | "speed" | "safety">("price");
  const [filteredHelis, setFilteredHelis] = useState<HelicopterListing[]>(HELICOPTERS);

  // Hospitality Upgrades Selection
  const [upgrades, setUpgrades] = useState({
    vipLounge: false,
    gourmetMeals: false,
    porterDarshan: false,
    groundTransfer: false
  });

  // Upgrade prices definitions
  const UPGRADE_PRICES = {
    vipLounge: 5000,     // Per passenger
    gourmetMeals: 3500,    // Per passenger
    porterDarshan: 12000,  // Per passenger
    groundTransfer: 8000   // Flat rate
  };

  // Sync state if url parameters change
  useEffect(() => {
    setLocalSource(paramSource);
    setLocalDest(paramDest);
    setLocalDate(paramDate);
    setLocalPassengers(paramPassengers);
  }, [paramSource, paramDest, paramDate, paramPassengers]);

  // Fetch live fleet from API
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await API.get("/fleet");
        if (res.data && res.data.length > 0) {
          setHelicopters(res.data);
        }
      } catch (err) {
        console.error("Failed to query live fleet database:", err);
      }
    };
    fetchFleet();
  }, []);

  // Filter and sort listings
  useEffect(() => {
    let result = helicopters.filter((h) => Number(h.price) <= maxPrice);

    if (sortBy === "price") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "speed") {
      result.sort((a, b) => parseFloat(b.speed) - parseFloat(a.speed));
    } else if (sortBy === "safety") {
      result.sort((a, b) => parseFloat(b.safetyRating) - parseFloat(a.safetyRating));
    }

    setFilteredHelis(result);
  }, [helicopters, maxPrice, sortBy]);

  // Calculate pricing upgrades
  let upgradesPerPassenger = 0;
  if (upgrades.vipLounge) upgradesPerPassenger += UPGRADE_PRICES.vipLounge;
  if (upgrades.gourmetMeals) upgradesPerPassenger += UPGRADE_PRICES.gourmetMeals;
  if (upgrades.porterDarshan) upgradesPerPassenger += UPGRADE_PRICES.porterDarshan;

  let flatUpgrades = 0;
  if (upgrades.groundTransfer) flatUpgrades += UPGRADE_PRICES.groundTransfer;

  const totalUpgradeCost = (upgradesPerPassenger * paramPassengers) + flatUpgrades;

  // Handle Modify Search submit
  const handleUpdateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/booking?source=${encodeURIComponent(localSource)}&destination=${encodeURIComponent(localDest)}&date=${localDate}&passengers=${localPassengers}`
    );
  };

  // Select flight and book
  const handleSelectFlight = (heli: HelicopterListing) => {
    // Add dynamic upgrade prices per passenger to pass custom checkout item calculations
    const finalPerPassengerPrice = Number(heli.price) + upgradesPerPassenger + Math.round(flatUpgrades / paramPassengers);
    
    setItem({
      type: "helicopter",
      id: heli.id,
      name: `${heli.name} Flight`,
      price: finalPerPassengerPrice,
      date: paramDate,
      passengers: paramPassengers,
      details: `${paramSource} ➔ ${paramDest}`,
      duration: heli.speed.includes("240") ? "45 Mins" : "35 Mins",
      image: heli.image,
    });
    router.push("/checkout");
  };

  // Google Maps Vector calculation
  const srcCoord = locationCoordinates[paramSource] || { name: paramSource.split(" ")[0], lat: "30.3165° N", lon: "78.0322° E", x: 45, y: 55 };
  const destCoord = locationCoordinates[paramDest] || { name: paramDest.split(" ")[0], lat: "30.7346° N", lon: "79.0669° E", x: 55, y: 35 };

  const dx = destCoord.x - srcCoord.x;
  const dy = destCoord.y - srcCoord.y;
  const rawDist = Math.sqrt(dx * dx + dy * dy);

  let distanceKm = Math.round(rawDist * 12.5);
  let etaMin = Math.round(distanceKm / 4.2);

  // Set specific values for known routes
  if (paramSource.includes("Dehradun") && paramDest.includes("Kedarnath")) {
    distanceKm = 109;
    etaMin = 28;
  } else if (paramSource.includes("Delhi") && paramDest.includes("Kedarnath")) {
    distanceKm = 325;
    etaMin = 65;
  }

  // Pre-load location options
  const sourceOptions = ["Dehradun (DED)", "New Delhi Hub", "Srinagar Terminal", "Goa Beachfront Heliport", "Mumbai Heliport"];
  const destOptions = ["Kedarnath Sanctuary", "Badrinath Valley", "Vaishno Devi Shrine", "Char Dham Circuit", "Goa Shoreline", "Mumbai Heliport"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <BookingProgressTracker currentStep={2} />
      {/* Header breadcrumb summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold tracking-tight">Available Air Charters</h1>
        </div>
        <div className="text-xs font-mono text-gold px-3 py-1.5 rounded border border-gold/20 bg-gold/5 uppercase tracking-wider">
          Total Upgrade Cost: +₹{totalUpgradeCost.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings & Configuration panel - Left */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Module 1: Configure Charter Search */}
          <form onSubmit={handleUpdateSearch} className="flex flex-col gap-4 bg-[#051433] p-5 rounded-xl border border-white/5 shadow-lg text-white">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Compass className="h-4.5 w-4.5 text-gold" />
              <h2 className="font-space text-xs uppercase tracking-wider font-bold">Modify Flight Request</h2>
            </div>

            {/* Departure */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Departure From</label>
              <select
                value={localSource}
                onChange={(e) => setLocalSource(e.target.value)}
                className="w-full bg-[#020B1E] border border-white/15 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-sans"
              >
                {sourceOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#020B1E]">{opt}</option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Destination To</label>
              <select
                value={localDest}
                onChange={(e) => setLocalDest(e.target.value)}
                className="w-full bg-[#020B1E] border border-white/15 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-sans"
              >
                {destOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#020B1E]">{opt}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Date</label>
                <input
                  type="date"
                  required
                  value={localDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full bg-[#020B1E] border border-white/15 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-sans"
                />
              </div>

              {/* Passengers */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Passengers</label>
                <select
                  value={localPassengers}
                  onChange={(e) => setLocalPassengers(Number(e.target.value))}
                  className="w-full bg-[#020B1E] border border-white/15 rounded px-2 py-2 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                    <option key={num} value={num} className="bg-[#020B1E]">{num} Pax</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gold hover:bg-gold-hover text-black font-space text-[10px] font-bold uppercase tracking-wider rounded transition-colors shadow-lg cursor-pointer text-center"
            >
              Search flights
            </button>
          </form>


          {/* Module 3: Hospitality & VIP Upgrades */}
          <div className="flex flex-col gap-4 bg-[#051433] p-5 rounded-xl border border-white/5 shadow-lg text-white">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <UserCheck className="h-4.5 w-4.5 text-gold" />
              <h2 className="font-space text-xs uppercase tracking-wider font-bold">Hospitality Services</h2>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Upgrade 1: VIP Lounge */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.vipLounge}
                  onChange={(e) => setUpgrades({...upgrades, vipLounge: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">VIP Lounge Access</span>
                    <span className="text-[9px] font-mono text-gold">+₹5,000/pax</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Dedicated terminal suite with complimentary drinks and fast customs clearance.</p>
                </div>
              </label>

              {/* Upgrade 2: Gourmet Meals */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.gourmetMeals}
                  onChange={(e) => setUpgrades({...upgrades, gourmetMeals: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">Gourmet In-Flight Meals</span>
                    <span className="text-[9px] font-mono text-gold">+₹3,500/pax</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Curated hot gourmet dining boxes and high altitude beverages.</p>
                </div>
              </label>

              {/* Upgrade 3: Porter Darshan */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.porterDarshan}
                  onChange={(e) => setUpgrades({...upgrades, porterDarshan: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">VIP Priority Darshan Pass</span>
                    <span className="text-[9px] font-mono text-gold">+₹12,000/pax</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Fast-track direct entry slots at holy shrines with dedicated porters.</p>
                </div>
              </label>

              {/* Upgrade 4: Ground Transfer */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.groundTransfer}
                  onChange={(e) => setUpgrades({...upgrades, groundTransfer: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">Luxury Ground Transfer</span>
                    <span className="text-[9px] font-mono text-gold">+₹8,000 flat</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Private luxury sedan pickup directly from terminal gates to hotel stay.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Listings grid & Flight route - Right */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Flight list */}
          <div className="flex flex-col gap-6">
            {filteredHelis.length === 0 ? (
              <div className="bg-[#051433] rounded-xl p-12 text-center flex flex-col gap-4 border border-white/5">
                <span className="font-space text-slate-300">No charters found in this price ceiling.</span>
                <button
                  onClick={() => setMaxPrice(300000)}
                  className="px-4 py-2 bg-gold text-black rounded font-space font-semibold text-xs tracking-wider uppercase mx-auto cursor-pointer"
                >
                  Reset Price Filter
                </button>
              </div>
            ) : (
              filteredHelis.map((heli) => {
                const basePrice = heli.price * paramPassengers;
                const totalPriceWithAddOns = basePrice + totalUpgradeCost;
                
                return (
                  <div
                    key={heli.id}
                    className="bg-[#051433] rounded-xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border border-white/5 transition-all hover:border-gold/20 duration-300 shadow-md"
                  >
                    {/* Photo */}
                    <div className="md:col-span-3 h-36 relative rounded overflow-hidden bg-secondary border border-white/5">
                      <img src={heli.image} alt={heli.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Flight Info */}
                    <div className="md:col-span-5 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-space tracking-widest text-gold uppercase px-2 py-0.5 bg-gold/5 border border-gold/10 rounded">
                          {heli.model}
                        </span>
                        <div className="flex items-center gap-1 text-gold text-xs">
                          <Star className="h-3 w-3 fill-gold" />
                          <span className="font-mono">{(heli.safetyRating || (heli as any).safety_rating || "5.0/5.0").split("/")[0]}</span>
                        </div>
                      </div>
                      <h3 className="font-space text-base font-bold text-white leading-none">{heli.name}</h3>
                      <p className="font-sans text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {heli.description}
                      </p>
                      <div className="flex items-center gap-3 text-[9px] text-slate-400 uppercase tracking-wider font-mono mt-1">
                        <span>Speed: {heli.speed}</span>
                        <span>•</span>
                        <span>Limit: {heli.range}</span>
                      </div>
                    </div>

                    {/* Actions & Pricing */}
                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3">
                      <div className="text-left md:text-right">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-space">Charter Rate</span>
                        
                        {/* Dynamic price additions indicator */}
                        {totalUpgradeCost > 0 ? (
                          <div className="flex flex-col">
                            <span className="font-mono text-[9px] text-slate-400 line-through">
                              ₹{basePrice.toLocaleString("en-IN")}
                            </span>
                            <div className="font-space text-lg font-bold text-gold">
                              ₹{totalPriceWithAddOns.toLocaleString("en-IN")}
                            </div>
                            <span className="text-[8px] text-slate-300 block">
                              (incl. upgrades for {paramPassengers} Pax)
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="font-space text-lg font-bold text-gold">
                              ₹{basePrice.toLocaleString("en-IN")}
                            </div>
                            <span className="text-[8px] text-slate-300 block">
                              (for {paramPassengers} passengers)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Link
                          href={`/booking/${heli.id}?date=${paramDate}&passengers=${paramPassengers}&source=${paramSource}&destination=${paramDest}`}
                          className="p-2 border border-white/10 hover:border-gold/30 rounded text-slate-400 hover:text-gold bg-white/5 flex items-center justify-center transition-all"
                          title="View Detailed Specs"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleSelectFlight(heli)}
                          className="flex-grow md:flex-grow-0 px-4 py-2 bg-gold hover:bg-gold-hover text-black rounded font-space font-bold text-[10px] uppercase tracking-widest transition-all glow-gold border border-gold cursor-pointer"
                        >
                          Book Flight
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Dynamic Flight Vector Map widget */}
          <div className="bg-[#051433] rounded-xl p-5 border border-white/5 flex flex-col gap-4 shadow-lg text-white relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Map className="h-4.5 w-4.5 text-gold" />
                <h3 className="font-space text-xs uppercase tracking-wider font-bold">Planned Flight Path Vector</h3>
              </div>
              <span className="font-mono text-[9px] text-teal animate-pulse">IFR corridor active</span>
            </div>

            {/* Map screen box */}
            <div className="h-56 bg-[#020B1E]/95 rounded border border-white/10 relative overflow-hidden">
              {/* Radar Grid overlay pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.03)_0%,transparent_70%)] pointer-events-none" />
              
              {/* SVG Flight Corridor */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Horizontal & Vertical center radar lines */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(197,168,128,0.04)" strokeWidth="0.3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(197,168,128,0.04)" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(197,168,128,0.03)" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(197,168,128,0.03)" strokeWidth="0.3" />

                {/* Curved flight path vector */}
                <path
                  id="flightVectorPath"
                  d={`M ${srcCoord.x} ${srcCoord.y} Q ${(srcCoord.x + destCoord.x) / 2} ${(srcCoord.y + destCoord.y) / 2 - 12} ${destCoord.x} ${destCoord.y}`}
                  fill="none"
                  stroke="#C5A880"
                  strokeWidth="0.6"
                  strokeDasharray="2 1.5"
                />

                {/* Pulsing beacon traversing the SVG path in real-time */}
                <circle r="1" fill="#C5A880">
                  <animateMotion dur="3.5s" repeatCount="indefinite">
                    <mpath href="#flightVectorPath" />
                  </animateMotion>
                </circle>

                {/* Departure Location Pin */}
                <circle cx={srcCoord.x} cy={srcCoord.y} r="1.5" fill="#C5A880" />
                <circle cx={srcCoord.x} cy={srcCoord.y} r="4.5" fill="none" stroke="#C5A880" strokeWidth="0.25" className="animate-ping" style={{ transformOrigin: `${srcCoord.x}px ${srcCoord.y}px` }} />

                {/* Arrival Location Pin */}
                <circle cx={destCoord.x} cy={destCoord.y} r="1.5" fill="#2DD4BF" />
                <circle cx={destCoord.x} cy={destCoord.y} r="4.5" fill="none" stroke="#2DD4BF" strokeWidth="0.25" className="animate-ping" style={{ transformOrigin: `${destCoord.x}px ${destCoord.y}px` }} />
              </svg>

              {/* Geographic Labels overlays */}
              <div 
                className="absolute font-mono text-[8px] bg-slate-950/90 px-1.5 py-0.5 rounded border border-gold/20 text-gold whitespace-nowrap shadow-lg"
                style={{ left: `${srcCoord.x}%`, top: `${srcCoord.y - 6}%`, transform: 'translateX(-50%)' }}
              >
                🛫 {srcCoord.name} ({srcCoord.lat.split(" ")[0]})
              </div>

              <div 
                className="absolute font-mono text-[8px] bg-slate-950/90 px-1.5 py-0.5 rounded border border-teal/20 text-teal whitespace-nowrap shadow-lg"
                style={{ left: `${destCoord.x}%`, top: `${destCoord.y - 6}%`, transform: 'translateX(-50%)' }}
              >
                🛬 {destCoord.name} ({destCoord.lat.split(" ")[0]})
              </div>

              {/* Telemetry info row bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[8px] font-mono uppercase tracking-widest text-slate-400 bg-slate-900/60 p-2 rounded backdrop-blur-sm border border-white/5">
                <span>Dist: {distanceKm} Km</span>
                <span>Altitude: FL125 (12,500ft)</span>
                <span>Est. Duration: {etaMin} Mins</span>
              </div>

              <div className="absolute top-3 right-3 font-mono text-[7px] text-slate-500 uppercase tracking-widest">
                Corridor: {srcCoord.name.substring(0,3)}-{destCoord.name.substring(0,3)}
              </div>
            </div>
            
            {/* Quick Route coordinates log details */}
            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-300 bg-slate-950/40 p-3 rounded border border-white/5 mt-1">
              <div>
                <span className="text-gold block font-semibold text-[9px] uppercase tracking-wider mb-0.5">Origin Telemetry</span>
                <span>Lat: {srcCoord.lat}</span>
                <span className="block">Lon: {srcCoord.lon}</span>
              </div>
              <div>
                <span className="text-teal block font-semibold text-[9px] uppercase tracking-wider mb-0.5">Dest. Telemetry</span>
                <span>Lat: {destCoord.lat}</span>
                <span className="block">Lon: {destCoord.lon}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function BookingSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[50vh]">
          <span className="font-space text-gold text-sm uppercase tracking-widest animate-pulse">
            Configuring Luxury Avionics Charter Flight Options...
          </span>
          <div className="h-1 w-24 bg-gold/20 rounded overflow-hidden">
            <div className="h-full bg-gold animate-infinite-loading w-1/2" />
          </div>
        </div>
      }
    >
      <BookingSearchContent />
    </Suspense>
  );
}
