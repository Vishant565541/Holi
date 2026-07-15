"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, FileText, ArrowRight, Printer, Share2, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import canvasConfetti from "canvas-confetti";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookings = useAuthStore((state) => state.bookings);

  const bookingId = searchParams.get("id") || "BK-8801";
  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  useEffect(() => {
    // Blast celebratory confetti on success mount
    canvasConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#2DD4BF", "#FFFFFF"],
    });
  }, []);

  const handlePrint = () => {
    // Navigate to live backend generated PDF download
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings/invoice/${booking.id}`, "_blank");
  };

  const handleShare = () => {
    const text = `I just booked my luxury helicopter flight: ${booking.name} (${booking.details}) with AURA Aviation! Reservation ID: ${booking.id}`;
    navigator.clipboard.writeText(text);
    alert("Share details copied to clipboard!");
  };

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <h2 className="font-space text-lg text-white">Booking details not found.</h2>
        <Link href="/" className="px-4 py-2 bg-gold text-black rounded text-xs font-space font-bold uppercase tracking-widest">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8 items-center text-center">
      {/* Confetti & success header */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-16 w-16 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal shadow-lg shadow-teal/5 animate-pulse">
          <CheckCircle2 className="h-10 w-10 text-teal" />
        </div>
        <span className="font-space text-xs font-bold text-teal uppercase tracking-widest mt-2">
          Handshake Finalized
        </span>
        <h1 className="font-space text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          Your Sky Journey is Reserved
        </h1>
        <p className="font-luxury text-sm text-grey-text max-w-md">
          A confirmation dispatch containing boarding passes, balance limits, and pilot profiles has been routed to your private email.
        </p>
      </div>

      {/* Main Reservation Card (Will format nicely for printing) */}
      <div className="w-full text-left glass-card rounded-xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/5 to-transparent pointer-events-none" />

        <div className="flex justify-between items-center border-b border-white/5 print:border-black/10 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-space text-gold uppercase tracking-wider block">Reservation ID</span>
            <span className="font-space text-base font-bold text-white print:text-black">{booking.id}</span>
          </div>
          <span className="text-[9px] font-space uppercase tracking-widest text-teal border border-teal/20 px-2.5 py-1 bg-teal/5 rounded font-bold">
            {booking.status}
          </span>
        </div>

        <div className="flex flex-col gap-4 font-luxury text-xs text-grey-text">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-grey-text block mb-0.5">Charter / Package</span>
              <span className="font-space text-sm font-bold text-white print:text-black">{booking.name}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-grey-text block mb-0.5">Dispatch Schedule</span>
              <span className="font-space text-sm font-bold text-white print:text-black">{booking.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-grey-text block mb-0.5">Passenger Count</span>
              <span className="font-space text-sm font-bold text-white print:text-black">{booking.passengers} Guests</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-grey-text block mb-0.5">Routing Details</span>
              <span className="font-space text-sm font-bold text-white print:text-black">{booking.details}</span>
            </div>
          </div>

          <div className="h-[1px] bg-white/5 print:bg-black/10 my-4" />

          <div className="flex justify-between items-end">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-grey-text block">Paid Value</span>
              <span className="text-[10px] text-grey-text">(Inclusive of 18% Aviation Taxes)</span>
            </div>
            <span className="font-space text-xl font-bold text-gold print:text-black">
              ₹{booking.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Action actions */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-white/5 border border-white/10 hover:border-gold rounded font-space text-xs font-bold uppercase tracking-widest text-white hover:text-gold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="h-4.5 w-4.5" />
          Print Invoice
        </button>

        <button
          onClick={handleShare}
          className="px-6 py-2.5 bg-white/5 border border-white/10 hover:border-gold rounded font-space text-xs font-bold uppercase tracking-widest text-white hover:text-gold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="h-4.5 w-4.5" />
          Share Reservation
        </button>

        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-gold hover:bg-gold/90 border border-gold rounded font-space text-xs font-bold uppercase tracking-widest text-black transition-all glow-gold flex items-center gap-2"
        >
          Go to Dashboard
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="font-space text-gold text-sm tracking-wider animate-pulse">
            Configuring flight receipt confirmation...
          </span>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
