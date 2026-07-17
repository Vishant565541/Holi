"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import API from "@/utils/api";
import { TOUR_PACKAGES, TourPackage } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { Check, Star, RefreshCw, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ToursListingContent() {
  const [tourPackages, setTourPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<TourPackage[]>([]);
  const [compareTrayOpen, setCompareTrayOpen] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await API.get("/tours");
        setTourPackages(res.data || []);
      } catch (err) {
        console.error("Failed to query live tours list:", err);
        setTourPackages(TOUR_PACKAGES);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const toggleCompare = (pkg: TourPackage) => {
    const isSelected = selectedForCompare.find((p) => p.id === pkg.id);
    if (isSelected) {
      setSelectedForCompare(selectedForCompare.filter((p) => p.id !== pkg.id));
    } else {
      if (selectedForCompare.length >= 2) {
        // Limit to 2 for comparisons side-by-side
        setSelectedForCompare([selectedForCompare[1], pkg]);
      } else {
        setSelectedForCompare([...selectedForCompare, pkg]);
      }
      setCompareTrayOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-xs font-luxury text-grey-text">
        <RefreshCw className="h-6 w-6 text-gold animate-spin mx-auto mb-2" />
        Syncing VIP flight itineraries...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title */}
      <div className="border-b border-white/5 pb-6 mb-12">
        <h1 className="font-space text-3xl font-bold tracking-tight">Luxury Tour Packages</h1>
        <p className="font-luxury text-sm text-grey-text mt-1">
          Handcrafted retreats combining executive helicopter transits, top-tier villas, and custom yachts.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {tourPackages.map((pkg) => {
          const isComparing = selectedForCompare.some((p) => p.id === pkg.id);
          const ratingStr = pkg.rating ? String(pkg.rating) : "5.0";
          const inclusionsList = Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 
            ? pkg.inclusions 
            : ["VIP Priority Access", "Bespoke high-altitude catering"];
          return (
            <div
              key={pkg.id}
              className="rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 group transition-all duration-300 hover:border-gold/30 high-contrast-card"
            >
              <div className="sm:col-span-5 h-64 sm:h-full relative overflow-hidden bg-secondary">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-black/60 border border-white/10 px-3 py-1 rounded text-[10px] font-space tracking-widest text-gold uppercase text-gold-explicit z-10">
                  {pkg.duration}
                </div>
              </div>

              <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold text-xs text-gold-explicit">
                      <Star className="h-3.5 w-3.5 fill-gold" />
                      <span className="font-bold text-gold-explicit">{ratingStr}</span>
                    </div>
                    {/* Compare toggle */}
                    <button
                      onClick={() => toggleCompare(pkg)}
                      className={`flex items-center gap-1 text-[10px] font-space uppercase tracking-widest px-2 py-1 rounded border transition-colors ${
                        isComparing
                          ? "bg-gold text-black border-gold font-bold"
                          : "bg-white/5 border-white/10 text-grey-text hover:text-white hover:border-gold/30 text-slate-light"
                      }`}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {isComparing ? "Comparing" : "Compare"}
                    </button>
                  </div>
                  <h3 style={{ color: '#ffffff' }} className="font-space text-lg font-bold text-white group-hover:text-gold transition-colors mt-1">
                    {pkg.name}
                  </h3>
                  <p style={{ color: '#cbd5e1' }} className="font-luxury text-xs text-grey-text text-slate-light line-clamp-2">
                    {pkg.tagline || (pkg as any).description || ""}
                  </p>
                </div>

                {/* Highlights */}
                <div className="flex flex-col gap-1.5 my-4">
                  {inclusionsList.slice(0, 3).map((inc: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white">
                      <Check className="h-3 w-3 text-teal shrink-0" />
                      <span style={{ color: '#cbd5e1' }} className="font-luxury text-grey-text text-slate-light line-clamp-1">{inc}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <div>
                    <span style={{ color: '#94a3b8' }} className="text-[9px] uppercase tracking-wider text-grey-text text-slate-muted">Total Rate</span>
                    <div style={{ color: '#C5A880' }} className="font-space text-base font-bold text-gold text-gold-explicit">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <Link
                    href={`/tours/${pkg.id}`}
                    style={{ color: '#C5A880', borderColor: '#C5A880' }}
                    className="px-4 py-2 border border-gold hover:bg-gold hover:text-black font-space text-[10px] font-bold uppercase tracking-widest text-gold rounded transition-all cursor-pointer btn-explicit"
                  >
                    Details & Book
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Tray Panel */}
      <AnimatePresence>
        {compareTrayOpen && selectedForCompare.length > 0 && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-[#0B1220]/95 backdrop-blur-md border-t border-white/10 p-6 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              {/* Tray Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="font-space text-sm tracking-wider font-bold text-gold uppercase flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-teal animate-spin" />
                  Retreat Packages Comparison Chart
                </span>
                <button
                  onClick={() => setCompareTrayOpen(false)}
                  className="text-xs text-grey-text hover:text-white"
                >
                  Hide Chart
                </button>
              </div>

              {/* Side-by-side detail list */}
              <div className="grid grid-cols-3 gap-6 font-luxury text-xs text-grey-text">
                {/* Titles */}
                <div className="flex flex-col gap-4 border-r border-white/5 pr-4 justify-center">
                  <span className="font-space font-semibold uppercase text-[10px] text-white">Spec Index</span>
                  <div className="font-medium">Total Duration</div>
                  <div className="font-medium">Package Cost</div>
                  <div className="font-medium">VIP Inclusions</div>
                </div>

                {/* Package 1 */}
                <div className="flex flex-col gap-4">
                  <span className="font-space font-bold text-white text-[11px] text-gold truncate">
                    {selectedForCompare[0].name}
                  </span>
                  <div className="text-white font-mono">{selectedForCompare[0].duration}</div>
                  <div className="text-gold font-mono font-bold">
                    ₹{selectedForCompare[0].price.toLocaleString("en-IN")}
                  </div>
                  <div className="flex flex-col gap-1 text-[10px]">
                    {selectedForCompare[0].inclusions.slice(0, 3).map((inc, i) => (
                      <span key={i} className="truncate">• {inc}</span>
                    ))}
                  </div>
                </div>

                {/* Package 2 */}
                <div className="flex flex-col gap-4">
                  {selectedForCompare[1] ? (
                    <>
                      <span className="font-space font-bold text-white text-[11px] text-gold truncate">
                        {selectedForCompare[1].name}
                      </span>
                      <div className="text-white font-mono">{selectedForCompare[1].duration}</div>
                      <div className="text-gold font-mono font-bold">
                        ₹{selectedForCompare[1].price.toLocaleString("en-IN")}
                      </div>
                      <div className="flex flex-col gap-1 text-[10px]">
                        {selectedForCompare[1].inclusions.slice(0, 3).map((inc, i) => (
                          <span key={i} className="truncate">• {inc}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full border border-dashed border-white/10 rounded p-4 text-center">
                      <span className="text-[10px]">Add another package to compare values</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product JSON-LD structured schema for package listings */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": tourPackages.map((pkg, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "item": {
                "@type": "Product",
                "name": pkg.name,
                "description": pkg.tagline || "",
                "image": pkg.image,
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "INR",
                  "price": String(pkg.price),
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2027-12-31"
                }
              }
            }))
          })
        }}
      />
    </div>
  );
}

export default function ToursListingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="font-space text-gold text-sm tracking-wider animate-pulse">
            Configuring Luxury Expedition Retreats...
          </span>
        </div>
      }
    >
      <ToursListingContent />
    </Suspense>
  );
}
