"use client";

/**
 * /hotels/book — Guest details → liteAPI hosted payment portal → Confirmation.
 * Restyled to match the premium glassmorphic branding of AURA Travels.
 */

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { ShieldCheck, Mail, User, ShieldAlert, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LITEAPI_ENV = process.env.NEXT_PUBLIC_LITEAPI_ENV || "sandbox";

interface BookingContext {
  offer: {
    offerId: string;
    roomName: string;
    boardName: string | null;
    price: number | null;
    currency: string;
    refundable: boolean;
  };
  hotel: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  checkin: string;
  checkout: string;
}

interface GuestHolder {
  firstName: string;
  lastName: string;
  email: string;
}

interface ConfirmedBooking {
  bookingId: string;
  status: string;
  hotelConfirmationCode: string | null;
  hotel: string | null;
  checkin: string | null;
  checkout: string | null;
  price: number | null;
  currency: string | null;
}

function BookInner() {
  const params = useSearchParams();
  const offerId = params.get("offerId");
  const step = params.get("step"); // null | "confirm"

  const [ctx, setCtx] = useState<BookingContext | null>(null);
  const [holder, setHolder] = useState<GuestHolder>({ firstName: "", lastName: "", email: "" });
  const [phase, setPhase] = useState<"details" | "paying" | "confirming" | "done" | "error">("details");
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [error, setError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const paymentMounted = useRef(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("bookingContext");
    if (raw) setCtx(JSON.parse(raw));
  }, []);

  // Finalize booking on redirect return (?step=confirm)
  useEffect(() => {
    if (step !== "confirm") return;
    const raw = sessionStorage.getItem("pendingBooking");
    if (!raw) {
      setError("Session expired — please start the booking again.");
      setPhase("error");
      return;
    }
    const pending = JSON.parse(raw);
    setPhase("confirming");
    fetch("/api/booking/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.error || "Booking failed");
        setBooking(d);
        setPhase("done");
        sessionStorage.removeItem("pendingBooking");
      })
      .catch((e: any) => {
        setError(e.message);
        setPhase("error");
      });
  }, [step]);

  async function startPayment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const r = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not start checkout");

      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({ prebookId: d.prebookId, transactionId: d.transactionId, holder })
      );

      setPhase("paying");

      // Mount the liteAPI payment wrapper
      const mount = () => {
        const win = window as any;
        if (paymentMounted.current || typeof win.LiteAPIPayment === "undefined") return;
        paymentMounted.current = true;
        const liteAPIPayment = new win.LiteAPIPayment({
          publicKey: LITEAPI_ENV, // 'sandbox' | 'live'
          appearance: { theme: "flat" },
          targetElement: "#liteapi-payment",
          secretKey: d.secretKey,
          returnUrl: `${window.location.origin}/hotels/book?step=confirm`,
        });
        liteAPIPayment.handlePayment();
      };

      const t = setInterval(() => {
        const win = window as any;
        if (typeof win.LiteAPIPayment !== "undefined") {
          clearInterval(t);
          mount();
        }
      }, 200);
    } catch (err: any) {
      setError(err.message);
    }
  }

  const setVal = (k: keyof GuestHolder) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setHolder({ ...holder, [k]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Script
        src="https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1"
        onLoad={() => setSdkReady(true)}
      />

      <h1 className="font-space text-3xl font-bold tracking-tight text-white mb-6">Complete Your Booking</h1>

      {/* Summary Card */}
      {ctx && (
        <div className="glass-card rounded-2xl p-6 mb-8 border border-white/10">
          <h3 className="font-space text-lg font-bold text-white mb-1">{ctx.hotel?.name}</h3>
          <p className="font-luxury text-xs text-grey-text mb-4">{ctx.hotel?.address}, {ctx.hotel?.city}</p>

          <div className="border-t border-white/5 pt-4 flex flex-wrap justify-between items-center gap-4 text-sm font-luxury">
            <div>
              <span className="text-slate-400 font-bold block">{ctx.offer?.roomName}</span>
              <span className="text-slate-500 text-xs">{ctx.checkin} → {ctx.checkout}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-xs">Total Stay Price</span>
              <span className="text-gold font-mono font-bold text-lg">
                {ctx.offer?.currency} {ctx.offer?.price != null ? Math.round(ctx.offer.price).toLocaleString("en-IN") : ""}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-luxury"
          >
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Entry Step */}
      {phase === "details" && step !== "confirm" && (
        <form onSubmit={startPayment} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="font-space text-lg font-bold text-white border-b border-white/5 pb-3">Guest Contact Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  required
                  placeholder="First name"
                  value={holder.firstName}
                  onChange={setVal("firstName")}
                  className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">Last Name</label>
              <input
                required
                placeholder="Last name"
                value={holder.lastName}
                onChange={setVal("lastName")}
                className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-space uppercase tracking-widest text-gold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={holder.email}
                onChange={setVal("email")}
                className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold/60 transition-all font-luxury"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!offerId || !sdkReady}
            className="w-full py-4 bg-gold hover:bg-gold-hover text-background font-space font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 glow-gold"
          >
            {sdkReady ? "Proceed to Secure Payment" : "Configuring SDK..."}
          </button>

          <p className="text-[10px] text-center text-slate-500 font-luxury">
            🔒 Checkout is secured by liteAPI. Card details are processed on their secure server and never reach this site.
          </p>
        </form>
      )}

      {/* Payment Mount Target */}
      <div id="liteapi-payment" className="mt-4 rounded-2xl overflow-hidden shadow-2xl" />

      {/* Processing States */}
      {phase === "confirming" && (
        <div className="glass-card rounded-2xl p-10 text-center font-luxury text-grey-text">
          <RefreshCw className="h-6 w-6 text-gold animate-spin mx-auto mb-3" />
          Confirming your booking details with liteAPI...
        </div>
      )}

      {/* Done State */}
      {phase === "done" && booking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>

          <div>
            <h2 className="font-space text-2xl font-bold text-white mb-2">Booking Confirmed 🎉</h2>
            <p className="font-luxury text-sm text-grey-text">
              Your suite has been successfully reserved. Details have been sent to your email.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 text-left max-w-md mx-auto space-y-2 text-sm font-luxury text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking ID:</span>
              <strong className="text-white">{booking.bookingId}</strong>
            </div>
            {booking.hotelConfirmationCode && (
              <div className="flex justify-between">
                <span className="text-slate-500">Hotel Confirmation:</span>
                <strong className="text-white">{booking.hotelConfirmationCode}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Resort Name:</span>
              <strong className="text-white">{booking.hotel}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dates:</span>
              <strong className="text-white">{booking.checkin} → {booking.checkout}</strong>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-luxury text-grey-text">Loading secure booking...</div>}>
      <BookInner />
    </Suspense>
  );
}
