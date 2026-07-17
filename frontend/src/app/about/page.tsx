"use client";

import React from "react";
import { Compass, Award, ShieldCheck, Users, Check, PlaneTakeoff, Phone, Mail, Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const coreValues = [
    { 
      title: "Premium Helicopter Services", 
      desc: "Safe, Reliable & Comfortable high-altitude charters operated under strict DGCA certifications and dual-pilot requirements." 
    },
    { 
      title: "Scenic Tour Packages", 
      desc: "Handcrafted journeys and sacred spiritual mountain tours across India's most breathtaking cultural and wilderness destinations." 
    },
    { 
      title: "Hotels & Cruise Bookings", 
      desc: "Complete travel solutions featuring premier lakeside retreats, heritage lodges, and sunset luxury yacht services at one place." 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-20">
      {/* Brand values banner */}
      <section className="text-center flex flex-col gap-4">
        <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">
          Roman Philosophy
        </span>
        <h1 style={{ color: '#ffffff' }} className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight uppercase">
          Fly Beyond The Ordinary
        </h1>
        <div className="h-[1px] w-20 bg-gold mx-auto mt-2" />
        <p style={{ color: '#cbd5e1' }} className="font-sans text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mt-4">
          Established in 2020, Roman Aviation & Tourism was founded to disrupt private regional transit. We cater to guests demanding seamless helicopter transits, elite concierge coordinates, and uncompromised flight safety dynamics.
        </p>
      </section>

      {/* Main Image Showcase */}
      <section className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative h-[300px] sm:h-[400px] lg:h-[450px]">
        <img 
          src="/luxury_hangar_about.png" 
          alt="Roman Aviation Private Hangar" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-[#020B1E]/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span style={{ color: '#C5A880' }} className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">Our Base of Operations</span>
            <h2 style={{ color: '#ffffff' }} className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">State-of-the-art Private Hangars</h2>
          </div>
          <span style={{ color: '#cbd5e1' }} className="text-xs text-slate-300 font-sans max-w-xs leading-relaxed">
            Fully climate-controlled hangars housing our premium fleet under constant mechanical telemetry inspection.
          </span>
        </div>
      </section>

      {/* Corporate pillars Grid */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">Core Offerings</span>
          <h2 style={{ color: '#ffffff' }} className="font-serif text-2xl md:text-3xl font-bold text-white mt-2">Bespoke Travel Pillars</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((v, i) => (
            <div key={i} className="rounded-xl p-6 border border-white/5 flex flex-col gap-4 bg-[#051433] shadow-lg high-contrast-card">
              <div className="h-10 w-10 rounded-full bg-gold/5 border border-gold/25 flex items-center justify-center text-gold text-gold-explicit shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <h3 style={{ color: '#ffffff' }} className="font-space text-sm uppercase tracking-wider font-bold text-white">{v.title}</h3>
              <p style={{ color: '#cbd5e1' }} className="font-sans text-xs text-slate-300 leading-relaxed text-slate-light">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand guidelines block (Your Journey, Our Priority) */}
      <section className="rounded-xl p-8 border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#051433] high-contrast-card">
        <div className="md:col-span-7 flex flex-col gap-4 text-left">
          <span style={{ color: '#C5A880' }} className="font-space text-xs text-gold uppercase tracking-wider font-semibold text-gold-explicit">
            Mission Statement
          </span>
          <h2 style={{ color: '#ffffff' }} className="font-serif text-2xl sm:text-3.5xl font-bold text-white leading-tight uppercase">
            YOUR JOURNEY, <br />
            <span className="text-gold text-gold-explicit">OUR PRIORITY</span>
          </h2>
          <p style={{ color: '#cbd5e1' }} className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed text-slate-light max-w-lg">
            From spiritual journeys to adventure escapes, we provide world-class aviation and tourism services tailored to your needs. Utilizing real-time flight tracking telemetry and senior military pilot crew coordinates.
          </p>
          <div className="flex flex-col gap-2.5 mt-2">
            {["Multi-Engine Turbine Helicopter Mandate", "Strict Balance & Payload Risk Inspection Protocols", "VIP Executive Airport Terminal Lounges"].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-xs text-white">
                <Check className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
                <span style={{ color: '#cbd5e1' }} className="font-sans text-slate-300 text-slate-light leading-none">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-5 flex flex-col gap-6 p-6 rounded-lg bg-[#020B1E] border border-white/10 text-left">
          <span style={{ color: '#C5A880' }} className="font-space text-[10px] uppercase tracking-wider text-gold font-bold">Let's Fly Together</span>
          <h3 style={{ color: '#ffffff' }} className="font-serif text-base font-bold text-white">Corporate Credentials</h3>
          
          <div className="flex flex-col gap-3.5 text-xs font-sans text-slate-300 text-slate-light">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
              <span>70418 61886, 84889 94892, 83479 31011</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
              <span className="truncate">info@romanaviation.in</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
              <span>romanaviationgroup.com</span>
            </div>
            <div className="flex items-center gap-3 border-t border-white/5 pt-3">
              <span className="font-semibold text-gold text-gold-explicit font-space text-[9px] uppercase tracking-wider">GST IN:</span>
              <span className="font-mono text-white text-white-explicit text-[11px]">24AAPCR7672B1Z6</span>
            </div>
          </div>
          
          <Link
            href="/contact"
            style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            className="w-full py-3 bg-[#020B1E] hover:bg-gold hover:text-black border border-white/10 hover:border-gold font-space text-[9px] font-bold uppercase tracking-widest text-center rounded transition-all duration-300 btn-explicit"
          >
            Contact Flight Concierge
          </Link>
        </div>
      </section>
    </div>
  );
}
