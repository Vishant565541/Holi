"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, Search, Compass, Anchor, Building, Helicopter, Plane } from "lucide-react";

type BookingType = "helicopter" | "package" | "hotel" | "boat" | "charter";

export default function SearchBox() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingType>("helicopter");
  const [source, setSource] = useState("Dehradun (DED)");
  const [destination, setDestination] = useState("Kedarnath Sanctuary");
  const [journeyType, setJourneyType] = useState("One Way");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  // Searchable dropdown state
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&journeyType=${encodeURIComponent(journeyType)}&date=${date}&passengers=${passengers}`;
    
    if (activeTab === "helicopter") {
      router.push(`/booking${query}`);
    } else if (activeTab === "package") {
      router.push(`/tours${query}`);
    } else if (activeTab === "hotel") {
      router.push(`/hotels${query}`);
    } else if (activeTab === "charter") {
      router.push(`/charter`);
    } else {
      router.push(`/boats${query}`);
    }
  };

  const tabs = [
    { id: "helicopter", name: "Helicopter Booking", icon: Helicopter },
    { id: "charter", name: "Bespoke Charters", icon: Plane },
    { id: "package", name: "Tour Packages", icon: Compass },
    { id: "hotel", name: "Hotels", icon: Building },
    { id: "boat", name: "Boat Services", icon: Anchor },
  ] as const;

  const locations = {
    helicopter: {
      sources: ["Dehradun (DED)", "New Delhi Hub", "Srinagar Terminal", "Goa Beachfront Heliport"],
      destinations: ["Kedarnath Sanctuary", "Badrinath Valley", "Srinagar Terminal", "Goa Shoreline", "Mumbai Heliport"],
    },
    charter: {
      sources: ["All Locations"],
      destinations: ["All Locations"],
    },
    package: {
      sources: ["All Locations", "Dehradun (DED)", "Goa Harbor"],
      destinations: ["Himalayan Sacred Peaks Pilgrimage", "Goan Coastline Yacht & Sky Odyssey", "Amalfi Coast Helicopter Retreat"],
    },
    hotel: {
      sources: ["India", "All Locations"],
      destinations: ["Udaipur", "Ranthambore", "Bengaluru", "Goa"],
    },
    boat: {
      sources: ["Harbors"],
      destinations: ["AURA Prestige 75 Yacht, Goa", "Kerala Backwaters Sovereign Suite, Alleppey"],
    },
  };

  // Pricing Estimator based on selections
  const getEstimatedPrice = () => {
    if (activeTab === "helicopter") {
      if (source.includes("Dehradun") && destination.includes("Kedarnath")) {
        return `₹ ${(49999 * passengers).toLocaleString("en-IN")} - ₹ ${(89999 * passengers).toLocaleString("en-IN")}`;
      }
      if (source.includes("Delhi") && destination.includes("Kedarnath")) {
        return `₹ ${(129999 * passengers).toLocaleString("en-IN")} - ₹ ${(249999 * passengers).toLocaleString("en-IN")}`;
      }
      return `₹ ${(99999 * passengers).toLocaleString("en-IN")} - ₹ ${(189999 * passengers).toLocaleString("en-IN")}`;
    }
    if (activeTab === "package") {
      if (destination.includes("Sacred Peaks") || destination.includes("Himalayan")) {
        return `₹ ${(499000).toLocaleString("en-IN")} - ₹ ${(580000).toLocaleString("en-IN")}`;
      }
      if (destination.includes("Goan") || destination.includes("Yacht")) {
        return `₹ ${(350000).toLocaleString("en-IN")} - ₹ ${(420000).toLocaleString("en-IN")}`;
      }
      return `₹ ${(250000).toLocaleString("en-IN")} - ₹ ${(480000).toLocaleString("en-IN")}`;
    }
    if (activeTab === "hotel") {
      if (destination.includes("Udaipur")) {
        return `₹ ${(75000).toLocaleString("en-IN")} - ₹ ${(120000).toLocaleString("en-IN")} / Night`;
      }
      if (destination.includes("Ranthambore")) {
        return `₹ ${(95000).toLocaleString("en-IN")} - ₹ ${(140000).toLocaleString("en-IN")} / Night`;
      }
      return `₹ ${(45000).toLocaleString("en-IN")} - ₹ ${(80000).toLocaleString("en-IN")} / Night`;
    }
    if (activeTab === "boat") {
      if (destination.includes("Goa") || destination.includes("AURA")) {
        return `₹ ${(45000).toLocaleString("en-IN")} - ₹ ${(65000).toLocaleString("en-IN")} / Hour`;
      }
      return `₹ ${(85000).toLocaleString("en-IN")} - ₹ ${(110000).toLocaleString("en-IN")} / Day`;
    }
    return "";
  };

  const filteredSources = locations[activeTab].sources.filter(loc =>
    loc.toLowerCase().includes(fromQuery.toLowerCase())
  );
  
  const filteredDestinations = locations[activeTab].destinations.filter(loc =>
    loc.toLowerCase().includes(toQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-white text-black rounded-xl overflow-hidden shadow-2xl border border-slate-200">
      {/* Search Type Selector Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto scrollbar-none whitespace-nowrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              suppressHydrationWarning={true}
              onClick={() => {
                if (tab.id === "charter") {
                  router.push("/charter");
                  return;
                }
                setActiveTab(tab.id);
                setSource(locations[tab.id].sources[0]);
                setDestination(locations[tab.id].destinations[0]);
                setFromQuery("");
                setToQuery("");
              }}
              className={`flex-none sm:flex-1 flex items-center justify-center gap-2 py-4 px-5 font-space text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 ${
                isActive
                  ? "bg-white text-black border-t-2 border-[#C5A880]"
                  : "text-slate-400 hover:text-black hover:bg-slate-100/50"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#C5A880]" : "text-slate-400"}`} />
              <span className="inline">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 items-end">
        {/* Source location searchable dropdown */}
        <div 
          className="flex flex-col gap-1.5 relative"
          onMouseLeave={() => setIsFromOpen(false)}
        >
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            From
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsFromOpen(!isFromOpen);
                setIsToOpen(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans text-left flex justify-between items-center"
            >
              <span className="truncate">{source}</span>
              <span className="text-[8px] text-slate-400">▼</span>
            </button>
            {isFromOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-2xl z-50 p-2 max-h-60 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-black focus:outline-none mb-2 font-sans"
                />
                <div className="flex flex-col gap-1">
                  {filteredSources.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSource(loc);
                        setIsFromOpen(false);
                        setFromQuery("");
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                  {filteredSources.length === 0 && (
                    <span className="text-[10px] text-slate-400 px-2 py-1 block font-sans">No locations found</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Destination Location searchable dropdown */}
        <div 
          className="flex flex-col gap-1.5 relative"
          onMouseLeave={() => setIsToOpen(false)}
        >
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            To
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsToOpen(!isToOpen);
                setIsFromOpen(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans text-left flex justify-between items-center"
            >
              <span className="truncate">{destination}</span>
              <span className="text-[8px] text-slate-400">▼</span>
            </button>
            {isToOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-2xl z-50 p-2 max-h-60 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search destination..."
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-black focus:outline-none mb-2 font-sans"
                />
                <div className="flex flex-col gap-1">
                  {filteredDestinations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setDestination(loc);
                        setIsToOpen(false);
                        setToQuery("");
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <span className="text-[10px] text-slate-400 px-2 py-1 block font-sans">No locations found</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Journey Type Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <Compass className="h-3 w-3 text-slate-400" />
            Journey Type
          </label>
          <select
            value={journeyType}
            onChange={(e) => setJourneyType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans"
          >
            <option value="One Way">One Way</option>
            <option value="Round Trip">Round Trip</option>
            <option value="Multi City">Multi City</option>
          </select>
        </div>

        {/* Date Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            Travel Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans"
          />
        </div>

        {/* Passenger count */}
        <div className="flex flex-col gap-1.5">
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <Users className="h-3 w-3 text-slate-400" />
            Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans"
          >
            {[1, 2, 3, 4, 5, 6, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Now Button */}
        <div className="flex flex-col gap-1 w-full">
          {activeTab && (
            <div className="font-space text-[9px] text-[#C5A880] font-bold text-center uppercase tracking-wider mb-1 truncate">
              Est: {getEstimatedPrice()}
            </div>
          )}
          <button
            type="submit"
            suppressHydrationWarning={true}
            className="w-full bg-[#C5A880] hover:bg-[#E3C69D] text-black rounded font-space font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[34px] border border-[#C5A880] shadow-md shadow-[#C5A880]/15"
          >
            <span>Search Now</span>
            <Search className="h-3.5 w-3.5 text-black" />
          </button>
        </div>
      </form>

      {/* Trust Signals & Payment Logos Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          {/* SSL Lock Icon */}
          <svg className="h-3.5 w-3.5 text-[#C5A880]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-slate-600">SSL Secured Checkout (256-bit Encrypted)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">Secure Gateways:</span>
          <span className="px-2 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-600 bg-white">Razorpay</span>
          <span className="px-2 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-600 bg-white">PayU</span>
        </div>
      </div>
    </div>
  );
}
