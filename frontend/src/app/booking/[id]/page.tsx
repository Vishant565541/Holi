"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HELICOPTERS, HelicopterListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { Star, ShieldAlert, Check, Calendar, Users, Clock, ShieldCheck, Compass, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import API from "@/utils/api";

function HelicopterDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  const heliId = params.id as string;
  const [heli, setHeli] = useState<HelicopterListing>(
    HELICOPTERS.find((h) => h.id === heliId) || HELICOPTERS[0]
  );

  useEffect(() => {
    const fetchHeli = async () => {
      try {
        const res = await API.get(`/fleet/${heliId}`);
        if (res.data) {
          setHeli(res.data);
        }
      } catch (err) {
        console.error("Failed to query helicopter details:", err);
      }
    };
    fetchHeli();
  }, [heliId]);

  // Booking default query params
  const paramSource = searchParams.get("source") || "Dehradun (DED)";
  const paramDest = searchParams.get("destination") || "Kedarnath Sanctuary";
  const paramDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const paramPassengers = Number(searchParams.get("passengers")) || 2;

  const [selectedTime, setSelectedTime] = useState(heli.schedules[0]);
  const [activeTab, setActiveTab] = useState<"specs" | "amenities" | "reviews">("specs");

  // 3D Blueprint Canvas logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: -0.2, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let autoAngle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 300;
    };
    resize();
    window.addEventListener("resize", resize);

    // Rotate point function
    const rot = (x: number, y: number, z: number, rx: number, ry: number) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      let x1 = x * cosY + z * sinY;
      let z1 = -x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      let y2 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    const drawBlueprint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 75;

      const angleX = rotation.x;
      const angleY = rotation.y + autoAngle;
      if (!isDragging) {
        autoAngle += 0.005;
      }

      ctx.strokeStyle = "rgba(45, 212, 191, 0.4)"; // Teal grid line
      ctx.lineWidth = 0.5;

      // Draw background sci-fi radar circles
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Simple wireframe representation of helicopter
      // Nodes
      const nodes = [
        { x: -1.2, y: -0.2, z: 0 }, // Cockpit nose 0
        { x: -0.4, y: 0.3, z: 0.4 }, // Canopy Top L 1
        { x: -0.4, y: 0.3, z: -0.4 }, // Canopy Top R 2
        { x: -0.5, y: -0.3, z: 0.5 }, // Floor FL 3
        { x: -0.5, y: -0.3, z: -0.5 }, // Floor FR 4
        { x: 0.8, y: 0.2, z: 0.4 }, // Cabin Rear UL 5
        { x: 0.8, y: 0.2, z: -0.4 }, // Cabin Rear UR 6
        { x: 0.8, y: -0.3, z: 0.4 }, // Cabin Rear DL 7
        { x: 0.8, y: -0.3, z: -0.4 }, // Cabin Rear DR 8
        { x: 2.2, y: 0.6, z: 0 }, // Tail Stabilizer 9
        { x: 0.0, y: 0.6, z: 0 }, // Main Rotor Hub 10
      ];

      // Project nodes
      const proj = nodes.map((n) => {
        const r = rot(n.x, n.y, n.z, angleX, angleY);
        return { x: cx + r.x * scale, y: cy - r.y * scale, z: r.z };
      });

      // Connections (edges)
      const edges = [
        [0, 1], [0, 2], [0, 3], [0, 4], // Nose to canopy/floor
        [1, 2], [3, 4], [1, 3], [2, 4], // Canopy ring & floor ring
        [1, 5], [2, 6], [3, 7], [4, 8], // Cabin sides
        [5, 6], [7, 8], [5, 7], [6, 8], // Cabin back ring
        [5, 9], [6, 9], [7, 9], [8, 9], // Tail boom
        [10, 1], [10, 2], [10, 5], [10, 6] // Rotor mount
      ];

      ctx.strokeStyle = "#2DD4BF";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      edges.forEach(([u, v]) => {
        ctx.moveTo(proj[u].x, proj[u].y);
        ctx.lineTo(proj[v].x, proj[v].y);
      });
      ctx.stroke();

      // Main rotor blades rotating
      const rotorAngle = Date.now() * 0.02;
      const bladeLength = 1.8;
      for (let i = 0; i < 4; i++) {
        const theta = rotorAngle + (i * Math.PI) / 2;
        const bX = Math.cos(theta) * bladeLength;
        const bZ = Math.sin(theta) * bladeLength;

        // Blade tip node
        const rTip = rot(bX, 0.6, bZ, angleX, angleY);
        const pTip = { x: cx + rTip.x * scale, y: cy - rTip.y * scale };

        ctx.strokeStyle = "#D4AF37"; // Gold blades
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(proj[10].x, proj[10].y);
        ctx.lineTo(pTip.x, pTip.y);
        ctx.stroke();
      }

      // Nodes dots
      ctx.fillStyle = "#D4AF37";
      proj.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawBlueprint);
    };

    drawBlueprint();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [rotation, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotationStart.current = { x: rotation.x, y: rotation.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation({
      x: rotationStart.current.x + dy * 0.005,
      y: rotationStart.current.y + dx * 0.005,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBookFlight = () => {
    setItem({
      type: "helicopter",
      id: heli.id,
      name: `${heli.name} Flight`,
      price: heli.price,
      date: paramDate,
      passengers: paramPassengers,
      details: `${paramSource} ➔ ${paramDest} (${selectedTime})`,
      duration: heli.speed.includes("240") ? "45 Mins" : "35 Mins",
      image: heli.image,
    });
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Return button */}
      <Link
        href={`/booking?source=${encodeURIComponent(paramSource)}&destination=${encodeURIComponent(paramDest)}&date=${paramDate}&passengers=${paramPassengers}`}
        className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-gold hover:text-white transition-colors mb-6 self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to flights search
      </Link>

      {/* Main columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Media gallery & specifications */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-space text-xs uppercase tracking-widest text-gold font-bold px-2 py-0.5 bg-gold/5 border border-gold/15 rounded">
                {heli.model}
              </span>
              <div className="flex items-center gap-1 text-gold text-sm font-semibold">
                <Star className="h-4 w-4 fill-gold" />
                <span>{heli.safetyRating} Safety Rating</span>
              </div>
            </div>
            <h1 className="font-space text-3xl md:text-4xl font-bold tracking-tight text-white mt-3">
              {heli.name}
            </h1>
            <p className="font-luxury text-sm text-grey-text italic mt-1">{heli.tagline}</p>
          </div>

          {/* Large image gallery */}
          <div className="h-96 w-full relative rounded-xl overflow-hidden bg-secondary border border-white/5">
            <img src={heli.image} alt={heli.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[#05070D]/40 backdrop-blur-sm p-4 rounded border border-white/5">
              <div>
                <span className="text-[10px] uppercase text-grey-text">Active Fleet Service</span>
                <div className="font-space text-sm font-bold text-white">AugustaWestland Air Support</div>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-teal font-bold bg-teal/10 px-2 py-1 rounded border border-teal/15">
                Ready for Dispatch
              </span>
            </div>
          </div>

          {/* 3D Viewer Blueprint Frame */}
          <div className="glass-card rounded-xl p-6 border border-white/8">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
              <Compass className="h-4 w-4 text-teal animate-spin" />
              Avionics 3D Vector Blueprint
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Canvas viewport */}
              <div className="w-full md:w-3/5 bg-secondary/80 border border-white/5 rounded-lg overflow-hidden relative cursor-grab active:cursor-grabbing select-none flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="block mx-auto"
                />
                <div className="absolute bottom-3 text-center w-full font-luxury text-[9px] text-grey-text uppercase tracking-widest pointer-events-none">
                  Drag blueprint to rotate aircraft cabin
                </div>
              </div>
              {/* Specs side card */}
              <div className="w-full md:w-2/5 flex flex-col gap-3 font-luxury text-xs text-grey-text leading-relaxed">
                <div className="flex items-center gap-2 text-teal font-space text-[10px] uppercase tracking-wider font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  Twin-Engine Security
                </div>
                <p>
                  This model carries redundant turbine systems ensuring steady flight characteristics even under high atmospheric turbulence. Equipped with composite silent rotor blades.
                </p>
                <div className="h-[1px] bg-white/5 my-2" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] uppercase text-grey-text">Max Speed</span>
                    <div className="font-space font-bold text-white">{heli.speed}</div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-grey-text">Fuel Range</span>
                    <div className="font-space font-bold text-white">{heli.range}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info navigation tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: "specs", name: "Technical Specifications" },
              { id: "amenities", name: "In Cabin Facilities" },
              { id: "reviews", name: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 font-space text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-gold text-gold"
                    : "border-transparent text-grey-text hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab content view */}
          <div className="bg-white/2 p-6 rounded-lg border border-white/5 min-h-32">
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-luxury text-sm">
                {Object.entries(heli.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-grey-text">{key}</span>
                    <span className="text-white font-mono">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "amenities" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heli.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white font-luxury">
                    <div className="h-5 w-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Check className="h-3 w-3 text-gold" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="flex flex-col gap-6">
                {heli.reviews.map((rev, i) => (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-space text-xs font-semibold text-white">{rev.author}</span>
                      <div className="flex items-center gap-1 text-gold text-xs">
                        <Star className="h-3 w-3 fill-gold" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="font-luxury text-xs text-grey-text leading-relaxed italic">
                      "{rev.text}"
                    </p>
                    <span className="text-[10px] text-grey-text/50 font-mono block mt-1">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sticky Booking Action Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
          <div className="glass-card rounded-xl p-6 border border-white/10 shadow-xl flex flex-col gap-6">
            <h3 className="font-space text-sm uppercase tracking-wider font-bold border-b border-white/5 pb-3">
              Configure Reservation
            </h3>

            {/* Flight parameters summary */}
            <div className="flex flex-col gap-3 text-xs font-luxury">
              <div className="flex justify-between">
                <span className="text-grey-text">Route</span>
                <span className="text-white font-semibold text-right max-w-[150px] truncate">
                  {paramSource.split(" ")[0]} ➔ {paramDest.split(" ")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-grey-text">Flight Date</span>
                <span className="text-white font-semibold">{paramDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grey-text">Passengers</span>
                <span className="text-white font-semibold">{paramPassengers} Guests</span>
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Time slot picker */}
            <div className="flex flex-col gap-3">
              <span className="font-space text-[10px] tracking-widest text-gold/60 uppercase font-semibold flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Select Dispatch Slot
              </span>
              <div className="grid grid-cols-2 gap-2">
                {heli.schedules.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 text-xs font-mono rounded border transition-all cursor-pointer ${
                      selectedTime === slot
                        ? "bg-gold text-black border-gold font-bold"
                        : "bg-white/5 border-white/10 text-grey-text hover:text-white hover:border-gold/40"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Security warning */}
            <div className="flex gap-2.5 items-start bg-gold/5 border border-gold/10 p-3.5 rounded text-[10px] font-luxury text-grey-text leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
              <div>
                <span className="text-gold font-semibold block mb-0.5">Payload Restrictions</span>
                Average adult passenger weight is restricted to 80 kg. Baggage limits are strict.
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Pricing calculations */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-grey-text">
                <span>Base Rate x {paramPassengers} Guests</span>
                <span>₹{(heli.price * paramPassengers).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-grey-text">
                <span>GST (Aviation Tax 18%)</span>
                <span>₹{(heli.price * paramPassengers * 0.18).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-white/5 mt-1">
                <span className="text-xs font-space uppercase text-white font-bold">Total Quote</span>
                <span className="font-space text-xl font-bold text-gold">
                  ₹{(heli.price * paramPassengers * 1.18).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookFlight}
              className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded font-space font-bold text-xs uppercase tracking-widest glow-gold transition-all duration-300 border border-gold cursor-pointer"
            >
              Reserve Flight Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelicopterDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[50vh]">
          <span className="font-space text-gold text-sm uppercase tracking-widest animate-pulse">
            Configuring Luxury Avionics Charter Flight Specifications...
          </span>
          <div className="h-1 w-24 bg-gold/20 rounded overflow-hidden">
            <div className="h-full bg-gold animate-infinite-loading w-1/2" />
          </div>
        </div>
      }
    >
      <HelicopterDetailContent />
    </Suspense>
  );
}
