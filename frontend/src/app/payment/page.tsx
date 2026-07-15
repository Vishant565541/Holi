"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ShieldCheck, Compass, CreditCard, Laptop, RefreshCw, XCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/utils/api";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const router = useRouter();
  const { item, selectedAddOns, insuranceEnabled, appliedPromo, clearCart } = useCartStore();
  const { addBooking, user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay" | "phonepe">("stripe");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");
  const [timerText, setTimerText] = useState(3);

  // Recalculate price details for checkout booking summary
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
    
    const taxes = (subtotal - discount) * 0.18;
    return subtotal - discount + taxes;
  };

  const finalAmount = calculateTotal();

  const handlePayment = async () => {
    if (!item) return;
    setPaymentStatus("processing");

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const userEmail = user?.email || "guest@aura.com";

    try {
      // 1. Create Pending Booking in database
      await API.post("/bookings", {
        id: bookingId,
        user_email: userEmail,
        type: item.type,
        name: item.name,
        details: item.details,
        date: item.date,
        passengers: item.passengers,
        price: finalAmount,
      });

      // 2. Initialize Payment order on backend
      const orderRes = await API.post("/payments/create", {
        provider: paymentMethod,
        amount: finalAmount,
        bookingId: bookingId,
        userEmail: userEmail,
      });

      const orderData = orderRes.data;

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpay();
        if (!loaded) {
          setPaymentStatus("failure");
          alert("Razorpay SDK failed to load.");
          return;
        }

        const options = {
          key: "rzp_test_AuraAviationKey",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "AURA Luxury Aviation",
          description: `Charter flight reservation ${bookingId}`,
          order_id: orderData.mock ? undefined : orderData.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await API.post("/payments/verify", {
              provider: "razorpay",
              paymentId: response.razorpay_payment_id || orderData.id,
              signature: response.razorpay_signature || "mock_sig",
              bookingId: bookingId,
            });

            if (verifyRes.data.verified) {
              setPaymentStatus("success");
              // Update state in local store
              addBooking({
                id: bookingId,
                type: item.type,
                name: item.name,
                details: item.details,
                date: item.date,
                passengers: item.passengers,
                price: finalAmount,
                status: "Confirmed",
              });
              setTimeout(() => {
                clearCart();
                router.push(`/success?id=${bookingId}`);
              }, 1500);
            } else {
              setPaymentStatus("failure");
            }
          },
          prefill: {
            name: user?.name || "VIP Guest",
            email: userEmail,
          },
          theme: {
            color: "#D4AF37"
          },
          modal: {
            ondismiss: function () {
              setPaymentStatus("idle");
            }
          }
        };

        if (orderData.mock) {
          // Auto resolve simulation for sandbox mode
          setTimeout(() => {
            options.handler({ razorpay_payment_id: orderData.id });
          }, 1500);
        } else {
          const paymentObject = new (window as any).Razorpay(options);
          paymentObject.open();
        }
      } else {
        // Stripe / PhonePe flow simulation & verified validation via backend verification API
        setTimeout(async () => {
          const verifyRes = await API.post("/payments/verify", {
            provider: paymentMethod,
            paymentId: orderData.id,
            signature: "mock_success",
            bookingId: bookingId,
          });

          if (verifyRes.data.verified) {
            setPaymentStatus("success");
            addBooking({
              id: bookingId,
              type: item.type,
              name: item.name,
              details: item.details,
              date: item.date,
              passengers: item.passengers,
              price: finalAmount,
              status: "Confirmed",
            });
            setTimeout(() => {
              clearCart();
              router.push(`/success?id=${bookingId}`);
            }, 1500);
          } else {
            setPaymentStatus("failure");
          }
        }, 2000);
      }
    } catch (e) {
      setPaymentStatus("failure");
      console.error("Payment Gateway Error:", e);
    }
  };

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[60vh]">
        <h2 className="font-space text-xl">Session expired or empty reservation details.</h2>
        <button onClick={() => router.push("/")} className="px-4 py-2 bg-gold text-black rounded">
          Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Title */}
      <div className="border-b border-white/5 pb-6 mb-10">
        <h1 className="font-space text-3xl font-bold tracking-tight">VIP Secure Payment Portal</h1>
        <p className="font-luxury text-sm text-grey-text mt-1">
          Authorized with bank-grade 256-bit encryption protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative">
        {paymentStatus === "idle" && (
          <>
            {/* Payment options - Left */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
                Select Payment Gateway
              </h3>

              <div className="flex flex-col gap-3">
                {/* Stripe */}
                <button
                  onClick={() => setPaymentMethod("stripe")}
                  className={`p-4 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                    paymentMethod === "stripe"
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-[#05070D] border-white/10 text-grey-text hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <span className="font-space font-bold block text-white">Stripe Checkout</span>
                      <span className="text-[10px] text-grey-text">International Credit / Debit Cards</span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-mono">Gateway A</span>
                </button>

                {/* Razorpay */}
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-4 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                    paymentMethod === "razorpay"
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-[#05070D] border-white/10 text-grey-text hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Compass className="h-5 w-5" />
                    <div>
                      <span className="font-space font-bold block text-white">Razorpay SmartPay</span>
                      <span className="text-[10px] text-grey-text">UPI, NetBanking & Corporate Cards</span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-mono">Gateway B</span>
                </button>

                {/* PhonePe */}
                <button
                  onClick={() => setPaymentMethod("phonepe")}
                  className={`p-4 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                    paymentMethod === "phonepe"
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-[#05070D] border-white/10 text-grey-text hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5" />
                    <div>
                      <span className="font-space font-bold block text-white">PhonePe UPI</span>
                      <span className="text-[10px] text-grey-text">Direct QR & Mobile App pay</span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-mono">Gateway C</span>
                </button>
              </div>

              {/* Encryption banner */}
              <div className="flex gap-3 bg-white/2 border border-white/5 p-4 rounded-lg text-xs font-luxury text-grey-text">
                <ShieldCheck className="h-5 w-5 text-teal shrink-0" />
                <p>
                  Your transaction credentials are encrypted end-to-end. We do not store PIN details, credit card numbers, or biometric assets in local caches.
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full py-4 bg-gold hover:bg-gold/90 text-black rounded font-space font-bold text-xs uppercase tracking-widest transition-all glow-gold border border-gold cursor-pointer"
              >
                Proceed to Authorized Payment
              </button>
            </div>

            {/* Invoice Summary - Right */}
            <div className="md:col-span-5">
              <div className="glass-card rounded-xl p-6 border border-white/10 shadow-lg flex flex-col gap-4 font-luxury text-xs text-grey-text">
                <h3 className="font-space text-sm uppercase tracking-wider font-bold text-white border-b border-white/5 pb-3">
                  Summary Invoice
                </h3>
                <div className="flex justify-between">
                  <span>Reserved Service</span>
                  <span className="text-white font-semibold text-right truncate max-w-[150px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Flight Date</span>
                  <span className="text-white font-semibold">{item.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manifest Size</span>
                  <span className="text-white font-semibold">{item.passengers} Passengers</span>
                </div>
                <div className="h-[1px] bg-white/5 my-2" />
                <div className="flex justify-between items-end">
                  <span className="font-space text-xs uppercase text-white font-bold">Payable Amount</span>
                  <span className="font-space text-lg font-bold text-gold">
                    ₹{finalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Processing screen animation */}
        {paymentStatus === "processing" && (
          <div className="col-span-12 flex flex-col items-center justify-center py-20 text-center gap-4">
            <RefreshCw className="h-10 w-10 text-gold animate-spin" />
            <h3 className="font-space text-lg font-bold text-white">Authorizing Booking Transaction...</h3>
            <p className="font-luxury text-xs text-grey-text">
              Contacting payment gateway servers. Secure token expires in {timerText}s. Do not click refresh.
            </p>
          </div>
        )}

        {/* Success splash */}
        {paymentStatus === "success" && (
          <div className="col-span-12 flex flex-col items-center justify-center py-20 text-center gap-4">
            <CheckCircle className="h-12 w-12 text-teal animate-bounce" />
            <h3 className="font-space text-xl font-bold text-white">Payment Authorized</h3>
            <p className="font-luxury text-xs text-grey-text">
              Generating secure flight invoice. Redirecting to receipt workspace...
            </p>
          </div>
        )}

        {/* Failure Retry workspace */}
        {paymentStatus === "failure" && (
          <div className="col-span-12 flex flex-col items-center justify-center py-16 text-center gap-5">
            <XCircle className="h-12 w-12 text-red-400" />
            <div>
              <h3 className="font-space text-xl font-bold text-white">Transaction Declined</h3>
              <p className="font-luxury text-xs text-grey-text mt-1 max-w-sm mx-auto">
                The banking authority rejected the token handshake. Please ensure credit thresholds or try another gateway card.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentStatus("idle")}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-space text-xs uppercase tracking-widest text-white transition-all cursor-pointer"
              >
                Change Gateway
              </button>
              <button
                onClick={handlePayment}
                className="px-6 py-2.5 bg-gold hover:bg-gold/90 border border-gold rounded font-space text-xs uppercase tracking-widest text-black transition-all glow-gold cursor-pointer"
              >
                Retry Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
