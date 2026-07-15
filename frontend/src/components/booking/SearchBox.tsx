"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, Search, Compass, Anchor, Building, Helicopter } from "lucide-react";

type BookingType = "helicopter" | "package" | "hotel" | "boat";

export default function SearchBox() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingType>("helicopter");
  const [source, setSource] = useState("Dehradun (DED)");
  const [destination, setDestination] = useState("Kedarnath Sanctuary");
  const [journeyType, setJourneyType] = useState("One Way");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&journeyType=${encodeURIComponent(journeyType)}&date=${date}&passengers=${passengers}`;
    
    if (activeTab === "helicopter") {
      router.push(`/booking${query}`);
    } else if (activeTab === "package") {
      router.push(`/tours${query}`);
    } else if (activeTab === "hotel") {
      router.push(`/hotels${query}`);
    } else {
      router.push(`/boats${query}`);
    }
  };

  const tabs = [
    { id: "helicopter", name: "Helicopter Booking", icon: Helicopter },
    { id: "package", name: "Tour Packages", icon: Compass },
    { id: "hotel", name: "Hotels", icon: Building },
    { id: "boat", name: "Boat Services", icon: Anchor },
  ] as const;

  const locations = {
    helicopter: {
      sources: ["Dehradun (DED)", "New Delhi Hub", "Srinagar Terminal", "Goa Beachfront Heliport"],
      destinations: ["Kedarnath Sanctuary", "Badrinath Valley", "Srinagar Terminal", "Goa Shoreline", "Mumbai Heliport"],
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

  return (
    <div className="w-full max-w-5xl mx-auto bg-white text-black rounded-xl overflow-hidden shadow-2xl border border-slate-200">
      {/* Search Type Selector Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSource(locations[tab.id].sources[0]);
                setDestination(locations[tab.id].destinations[0]);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 font-space text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-white text-black border-t-2 border-[#C5A880]"
                  : "text-slate-400 hover:text-black hover:bg-slate-100/50"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#C5A880]" : "text-slate-400"}`} />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 items-end">
        {/* Source location */}
        <div className="flex flex-col gap-1.5">
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            From
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans"
          >
            {locations[activeTab].sources.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Location */}
        <div className="flex flex-col gap-1.5">
          <label className="font-space text-[9px] tracking-wider text-slate-500 uppercase font-bold flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            To
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs text-black focus:outline-none focus:border-[#C5A880] cursor-pointer font-sans"
          >
            {locations[activeTab].destinations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
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
        <button
          type="submit"
          className="w-full bg-[#C5A880] hover:bg-[#E3C69D] text-black rounded font-space font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[34px] border border-[#C5A880]"
        >
          <span>Search Now</span>
          <Search className="h-3.5 w-3.5 text-black" />
        </button>
      </form>
    </div>
  );
}
