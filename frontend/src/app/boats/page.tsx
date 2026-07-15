"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/utils/api";
import { BOATS, BoatListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { Star, Anchor, ShieldCheck, Check, Calendar, Users, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function BoatsListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  const paramSource = searchParams.get("source") || "Harbors";
  const paramDest = searchParams.get("destination") || "AURA Prestige 75 Yacht, Goa";
  const paramDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const paramPassengers = Number(searchParams.get("passengers")) || 2;

  const [boatsList, setBoatsList] = useState<BoatListing[]>(BOATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/boats");
        if (res.data && res.data.length > 0) {
          const merged: BoatListing[] = res.data.map((dbBoat: any) => {
            const mockMatch = BOATS.find((m) => m.id === dbBoat.id);
            if (mockMatch) {
              return { ...mockMatch, ...dbBoat, features: mockMatch.features };
            }
            return {
              ...dbBoat,
              location: dbBoat.location || "Goa, India",
              duration: "Per Hour",
              features: ["Private Captain & Crew", "Onboard Refreshments", "Safety Equipment"],
              capacity: dbBoat.capacity || 6,
            };
          });
          setBoatsList(merged);
        }
      } catch (err) {
        console.error("Failed to fetch boats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoats();
  }, []);

  const [hoursSelected, setHoursSelected] = useState<{ [boatId: string]: number }>({
    "b-1": 3,
    "b-2": 1,
  });

  const handleBookBoat = (boat: BoatListing) => {
    const hours = hoursSelected[boat.id] || 3;
    const finalPrice = boat.price * hours;

    setItem({
      type: "boat",
      id: boat.id,
      name: boat.name,
      price: finalPrice,
      date: paramDate,
      passengers: paramPassengers,
      details: `${boat.location} (${boat.type})`,
      duration: `${hours} ${boat.id === "b-1" ? "Hours Cruise" : "Day Stay"}`,
      image: boat.image,
    });
    router.push("/checkout");
  };

  const updateHours = (boatId: string, val: number) => {
    setHoursSelected({
      ...hoursSelected,
      [boatId]: Math.max(boatId === "b-1" ? 3 : 1, val),
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-xs font-luxury text-grey-text">
        <RefreshCw className="h-6 w-6 text-gold animate-spin mx-auto mb-2" />
        Loading yacht fleet...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title */}
      <div className="border-b border-white/5 pb-6 mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold tracking-tight">Luxury Yacht & Boat Services</h1>
          <p className="font-luxury text-sm text-grey-text mt-1">
            Private cruises, shoreline catamarans, and premium houseboats.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-grey-text bg-white/2 px-4 py-2 border border-white/5 rounded">
          <Anchor className="h-3.5 w-3.5 text-gold" />
          <span>Coastal Departures Log</span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-10">
        {boatsList.map((boat) => {
          const count = hoursSelected[boat.id] || (boat.id === "b-1" ? 3 : 1);
          return (
            <div
              key={boat.id}
              className="glass-card rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 transition-all hover:border-gold/20 duration-300"
            >
              {/* Photo */}
              <div className="lg:col-span-4 h-64 lg:h-full relative rounded-lg overflow-hidden bg-secondary">
                <img src={boat.image} alt={boat.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-black/60 border border-white/10 px-3 py-1 rounded text-[10px] font-space tracking-widest text-gold uppercase">
                  {boat.type}
                </div>
              </div>

              {/* Specs */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-space text-2xl font-bold text-white mb-2">{boat.name}</h3>
                  <span className="font-luxury text-xs text-grey-text block mb-4">{boat.location}</span>

                  <div className="grid grid-cols-2 gap-4 border border-white/5 bg-white/2 rounded p-4 mb-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-grey-text block">Max Capacity</span>
                      <span className="font-space text-xs font-bold text-white">{boat.capacity} Guests</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-grey-text block">Billing Type</span>
                      <span className="font-space text-xs font-bold text-teal">{boat.duration}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-col gap-1.5">
                    {boat.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white font-luxury">
                        <Check className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span className="text-grey-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration Configurator */}
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-xs font-space uppercase text-grey-text">
                    {boat.id === "b-1" ? "Select Cruise Hours" : "Select Booking Days"}
                  </span>
                  <div className="flex items-center gap-2 border border-white/10 rounded overflow-hidden">
                    <button
                      onClick={() => updateHours(boat.id, count - 1)}
                      className="px-3 py-1 bg-white/5 text-white hover:bg-white/10 text-xs font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-white">{count}</span>
                    <button
                      onClick={() => updateHours(boat.id, count + 1)}
                      className="px-3 py-1 bg-white/5 text-white hover:bg-white/10 text-xs font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing & Booking */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-6">
                <div className="text-left lg:text-right">
                  <span className="text-[9px] uppercase tracking-wider text-grey-text">Charter Subtotal</span>
                  <div className="font-space text-2xl font-bold text-gold">
                    ₹{(boat.price * count).toLocaleString("en-IN")}
                  </div>
                  <span className="text-[9px] text-grey-text block">
                    (₹{boat.price.toLocaleString("en-IN")} base unit)
                  </span>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto lg:w-full">
                  <div className="flex items-center gap-1.5 text-[10px] font-luxury text-grey-text bg-white/2 p-2 rounded border border-white/5">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal shrink-0" />
                    <span>Includes Yacht Captain & Butler Crew</span>
                  </div>
                  <button
                    onClick={() => handleBookBoat(boat)}
                    className="w-full py-3 bg-gold hover:bg-gold/90 text-black rounded font-space font-bold text-xs uppercase tracking-widest transition-all glow-gold border border-gold cursor-pointer"
                  >
                    Reserve Yacht
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BoatsListingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="font-space text-gold text-sm tracking-wider animate-pulse">
            Configuring Yacht Charters...
          </span>
        </div>
      }
    >
      <BoatsListingContent />
    </Suspense>
  );
}
