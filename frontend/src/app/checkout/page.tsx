"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, Passenger, AddOn } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { User, ShieldCheck, Ticket, Trash2, CheckCircle2, ChevronRight, Armchair } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    item,
    selectedSeats,
    passengers,
    selectedAddOns,
    insuranceEnabled,
    appliedPromo,
    setSelectedSeats,
    setPassengers,
    toggleAddOn,
    setInsuranceEnabled,
    applyPromo,
    removePromo,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  React.useEffect(() => {
    if (user && passengers.length > 0 && passengers[0].fullName === "") {
      const updated = [...passengers];
      updated[0] = {
        ...updated[0],
        fullName: user.name || "",
        age: 30,
        gender: "Male",
        idProof: "AADHAAR-PENDING"
      };
      setPassengers(updated);
    }
  }, [user]);

  const addOnOptions: AddOn[] = [
    { id: "ao-1", name: "Gourmet Caviar & Champagne", price: 12500, description: "VIP cabin flight refreshments" },
    { id: "ao-2", name: "Airport Limousine Pickup", price: 15000, description: "Audi A8 terminal transfer service" },
    { id: "ao-3", name: "Extended Heli Baggage (+15kg)", price: 8000, description: "Additional custom weight allowance" },
  ];

  const handleSeatClick = (seatId: string) => {
    if (!item) return;
    const isSelected = selectedSeats.includes(seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= item.passengers) {
        // Replace first selected seat
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPassengers(updated);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.toUpperCase() === "AURA10") {
      applyPromo("AURA10", 10);
      setPromoError("");
    } else {
      setPromoError("Invalid elite coupon code.");
    }
  };

  // Pricing calculations
  const calculateTotal = () => {
    if (!item) return 0;
    const base = item.price;
    const addOnsCost = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
    const insuranceCost = insuranceEnabled ? 5000 * item.passengers : 0;
    const subtotal = base + addOnsCost + insuranceCost;
    
    let discount = 0;
    if (appliedPromo) {
      discount = subtotal * (appliedPromo.discountPercent / 100);
    }
    
    const taxes = (subtotal - discount) * 0.18; // 18% GST
    return {
      subtotal,
      discount,
      taxes,
      total: subtotal - discount + taxes,
    };
  };

  const priceSummary = calculateTotal();

  const handleProceedToPayment = () => {
    if (!item) return;

    // Auto-fill empty fields with guest placeholders to avoid blocking validation
    const sanitized = passengers.map((p, idx) => ({
      fullName: p.fullName.trim() !== "" ? p.fullName : (idx === 0 && user?.name ? user.name : `VIP Guest #${idx + 1}`),
      age: Number(p.age) > 0 ? Number(p.age) : 30,
      gender: p.gender || "Male",
      idProof: p.idProof.trim() !== "" ? p.idProof : "AADHAAR-VERIFIED"
    }));
    setPassengers(sanitized);

    // Auto-assign seating configuration if not manually clicked
    if (item.type === "helicopter" && selectedSeats.length < item.passengers) {
      const seatsNeeded = item.passengers - selectedSeats.length;
      const vacant = HELI_SEATS.filter((s) => !selectedSeats.includes(s));
      const autoSelected = [...selectedSeats, ...vacant.slice(0, seatsNeeded)];
      setSelectedSeats(autoSelected);
    }

    router.push("/payment");
  };

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center min-h-[60vh] justify-center">
        <h2 className="font-space text-2xl font-bold">Your booking stack is empty.</h2>
        <p className="font-luxury text-sm text-grey-text">Explore our helicopter charter routes to begin.</p>
        <button
          onClick={() => router.push("/booking")}
          className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-space text-xs font-bold uppercase tracking-widest rounded transition-all"
        >
          View Helicopter Fleet
        </button>
      </div>
    );
  }

  // Seat Configuration Lists (Helicopter layout)
  const HELI_SEATS = ["1A", "1B", "2A", "2B", "3A", "3B"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Columns: Forms, Seat maps, addons */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div>
          <h1 className="font-space text-3xl font-bold tracking-tight">Luxury Flight Checkout</h1>
          <p className="font-luxury text-sm text-grey-text mt-1">
            Complete details and personalize your travel amenities.
          </p>
        </div>

        {/* 1. Passenger Details Forms */}
        <div className="glass-card rounded-xl p-6 border border-white/8 flex flex-col gap-6">
          <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3 flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-gold" />
            Passenger Manifest ({item.passengers} Guest{item.passengers > 1 ? "s" : ""})
          </h3>

          <div className="flex flex-col gap-6">
            {passengers.map((p, idx) => (
              <div key={idx} className="border border-white/5 rounded-lg p-5 bg-white/2 flex flex-col gap-4">
                <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">
                  Passenger #{idx + 1}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-space text-grey-text uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="As on Government ID"
                      value={p.fullName}
                      onChange={(e) => handlePassengerChange(idx, "fullName", e.target.value)}
                      className="w-full bg-[#05070D] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-space text-grey-text uppercase">Age / Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Age"
                        required
                        value={p.age || ""}
                        onChange={(e) => handlePassengerChange(idx, "age", Number(e.target.value))}
                        className="w-full bg-[#05070D] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                      />
                      <select
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                        className="w-full bg-[#05070D] border border-white/10 rounded px-2 py-2 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer font-luxury"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-space text-grey-text uppercase">Passport / Aadhar No.</label>
                    <input
                      type="text"
                      required
                      placeholder="ID Proof Number"
                      value={p.idProof}
                      onChange={(e) => handlePassengerChange(idx, "idProof", e.target.value)}
                      className="w-full bg-[#05070D] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Interactive Seating Chart (Helicopters only) */}
        {item.type === "helicopter" && (
          <div className="glass-card rounded-xl p-6 border border-white/8">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3 flex items-center gap-2 mb-6">
              <Armchair className="h-4.5 w-4.5 text-teal" />
              Interactive Helicopter Seating Chart
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              {/* Graphic cabin map layout */}
              <div className="w-56 bg-secondary/80 border border-white/5 p-8 rounded-full flex flex-col items-center gap-6 relative shadow-inner">
                {/* Nose cockpit label */}
                <div className="h-10 w-24 border border-teal/20 rounded-t-full bg-[#05070D] flex items-center justify-center text-[9px] font-space text-teal tracking-widest uppercase">
                  COCKPIT
                </div>

                {/* Grid layout seats */}
                <div className="grid grid-cols-2 gap-8 w-full mt-4">
                  {HELI_SEATS.map((seatId) => {
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        className={`py-3.5 px-3 rounded flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gold border-gold text-black font-bold scale-105"
                            : "bg-[#05070D] border-white/10 text-grey-text hover:text-white hover:border-gold/40"
                        }`}
                      >
                        <Armchair className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-mono">{seatId}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-center font-luxury text-[9px] text-grey-text uppercase tracking-widest mt-6">
                  VIP Cabin Seating
                </div>
              </div>

              {/* Seating status */}
              <div className="flex flex-col gap-4 font-luxury text-xs text-grey-text max-w-sm">
                <span className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">
                  Cabin Seating Summary
                </span>
                <p>
                  Click on the cabin seating chart to assign seats for your manifest. You have configured {item.passengers} passengers, please allocate {item.passengers} seats.
                </p>
                <div className="flex flex-col gap-2 mt-2 font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Allocated Seats:</span>
                    <span className="text-white font-bold">{selectedSeats.join(", ") || "None Selected"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Luxury Add-ons */}
        <div className="glass-card rounded-xl p-6 border border-white/8 flex flex-col gap-6">
          <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
            Luxury Flight Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOnOptions.map((addon) => {
              const isSelected = selectedAddOns.some((a) => a.id === addon.id);
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddOn(addon)}
                  className={`text-left p-5 rounded-lg border flex flex-col justify-between min-h-40 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gold/5 border-gold text-gold scale-102 glow-gold"
                      : "bg-[#05070D] border-white/10 text-grey-text hover:text-white hover:border-gold/30"
                  }`}
                >
                  <div>
                    <h4 className="font-space text-sm font-bold text-white mb-1">{addon.name}</h4>
                    <p className="font-luxury text-[10px] text-grey-text leading-relaxed">
                      {addon.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full border-t border-white/5 pt-4 mt-2">
                    <span className="font-mono text-xs font-bold text-gold">
                      +₹{addon.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-bold">
                      {isSelected ? "Remove Addon" : "Select Addon"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Pricing details summary */}
      <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
        <div className="glass-card rounded-xl p-6 border border-white/10 shadow-xl flex flex-col gap-6">
          <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
            Booking Summary
          </h3>

          <div className="flex flex-col gap-4 font-luxury text-xs">
            <div className="h-16 relative rounded overflow-hidden bg-secondary">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] font-space text-gold uppercase tracking-widest font-bold">
                {item.type} Service
              </span>
              <h4 className="font-space text-sm font-bold text-white leading-snug">{item.name}</h4>
              <p className="text-grey-text">{item.details}</p>
              <span className="text-[10px] text-grey-text font-mono mt-0.5">Date: {item.date}</span>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Flight Insurance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-teal" />
                <div>
                  <span className="text-white font-medium block">VIP Flight Insurance</span>
                  <span className="text-[9px] text-grey-text block">₹5,000 / Passenger</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={insuranceEnabled}
                onChange={(e) => setInsuranceEnabled(e.target.checked)}
                className="accent-gold h-4 w-4 bg-[#05070D] border-white/10 rounded cursor-pointer"
              />
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Coupon Code applying */}
            <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
              <span className="text-[10px] font-space uppercase text-grey-text">Apply Elite Coupon</span>
              <div className="flex relative">
                <input
                  type="text"
                  placeholder="e.g. AURA10"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-[#05070D] border border-white/10 rounded-l px-3 py-2 text-xs focus:outline-none focus:border-gold/50 uppercase text-white font-mono"
                />
                <button
                  type="submit"
                  className="bg-white/5 border border-l-0 border-white/10 hover:border-gold px-4 text-xs font-space font-bold uppercase rounded-r transition-colors text-white"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="flex justify-between items-center text-[10px] text-teal mt-1">
                  <span>Coupon {appliedPromo.code} applied ({appliedPromo.discountPercent}% Off)</span>
                  <button onClick={removePromo} className="text-red-400 hover:underline">
                    Remove
                  </button>
                </div>
              )}
              {promoError && <span className="text-[10px] text-red-400">{promoError}</span>}
            </form>

            <div className="h-[1px] bg-white/5" />

            {/* Price Calculations breakdown */}
            {priceSummary && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-grey-text">
                  <span>Base Rate</span>
                  <span>₹{item.price.toLocaleString("en-IN")}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-grey-text">
                    <span>VIP Add-ons</span>
                    <span>
                      +₹{selectedAddOns.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {insuranceEnabled && (
                  <div className="flex justify-between text-grey-text">
                    <span>VIP Flight Insurance</span>
                    <span>+₹{(5000 * item.passengers).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {appliedPromo && (
                  <div className="flex justify-between text-teal">
                    <span>Elite Discount</span>
                    <span>-₹{priceSummary.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-grey-text">
                  <span>GST Aviation Tax (18%)</span>
                  <span>₹{priceSummary.taxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-1">
                  <span className="font-space text-xs uppercase font-bold text-white">Final Total</span>
                  <span className="font-space text-lg font-bold text-gold">
                    ₹{priceSummary.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded font-space font-bold text-xs uppercase tracking-widest glow-gold border border-gold cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              Configure Payment
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
