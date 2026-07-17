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

      {/* ── COMPANY TIMELINE ──────────────────────────────────────────────── */}
      <section className="flex flex-col gap-8 text-left">
        <div className="text-center">
          <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Our Journey</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-2">Timeline & Milestones</h2>
          <div className="h-[1px] w-12 bg-gold mx-auto mt-2" />
        </div>

        <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8 max-w-3xl mx-auto text-xs font-luxury">
          {[
            { year: "2020", title: "Flight Inception", desc: "Founded Roman Aviation in New Delhi with 1 light utility helicopter, catering to private regional transits." },
            { year: "2022", title: "Himalayan Corridor Launch", desc: "Expanded the fleet to 3 multi-engine turbine helicopters and launched daily priority corridors to Kedarnath & Badrinath." },
            { year: "2024", title: "Yachts & ISO Standards", desc: "Earned ISO 9001:2015 safety certification and launched the Goan luxury yacht charter division." },
            { year: "2026", title: "National Air Ambulance & Elite Concierge", desc: "Integrated medical evacuation helicopters and launched bespoke HNWI elite travel concierge systems." }
          ].map((mile, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-gold border-4 border-[#020B1E]" />
              <div className="font-space text-sm font-bold text-gold">{mile.year}</div>
              <h4 className="font-space text-sm font-bold text-white mt-0.5">{mile.title}</h4>
              <p className="text-grey-text leading-relaxed mt-1 text-slate-300">{mile.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDERS & TEAM ────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Leadership</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-2">Executive Officers</h2>
          <div className="h-[1px] w-12 bg-gold mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: "Capt. Roman Singh",
              role: "Founder & Chief Pilot",
              desc: "Former IAF wing commander with over 20 years and 6,000+ flight hours of high-altitude search and rescue experience in the Himalayas.",
              photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
            },
            {
              name: "Vishant Patel",
              role: "Co-Founder & Director of Fleet Operations",
              desc: "Aeronautical logistics specialist managing maintenance protocols, DGCA licensing audits, and elite concierge routing operations.",
              photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop"
            }
          ].map((member, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-[#051433] p-6 flex flex-col sm:flex-row gap-5 items-center text-left high-contrast-card">
              <div className="h-24 w-24 rounded-xl overflow-hidden relative shrink-0 border border-gold/25">
                <img src={member.photo} alt={member.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <h4 className="font-space text-sm font-bold text-white">{member.name}</h4>
                  <span className="font-space text-[10px] uppercase tracking-wider text-gold font-semibold">{member.role}</span>
                </div>
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FLEET SPECIFICATIONS ────────────────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Our Fleet</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-2">Aircraft Fleet Details</h2>
          <div className="h-[1px] w-12 bg-gold mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Airbus H145",
              type: "Twin-Engine Utility",
              specs: { Capacity: "4 VIPs", Speed: "240 km/h", Ceiling: "20,000 ft", Avionics: "Helionix Suite" },
              desc: "The pinnacle of high-altitude luxury, complete with vibration containment and scenic panorama glass windows.",
              image: "https://images.unsplash.com/photo-1681281896815-bfa3b9b47e2b?q=80&w=600&auto=format&fit=crop"
            },
            {
              name: "Bell 429",
              type: "Light Twin Engine",
              specs: { Capacity: "6 VIPs", Speed: "273 km/h", Ceiling: "18,700 ft", Avionics: "P&W Glass Cockpit" },
              desc: "Twin-engine security combined with an elegant flat-floor cabin, perfect for coastal shoreline shuttle flights.",
              image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600&auto=format&fit=crop"
            },
            {
              name: "Augusta AW109",
              type: "High-Speed Executive",
              specs: { Capacity: "5 VIPs", Speed: "285 km/h", Ceiling: "15,000 ft", Avionics: "3-Axis Autopilot" },
              desc: "Aerodynamic corporate transport featuring fully retractable landing gear for rapid city shuttle lanes.",
              image: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=600&auto=format&fit=crop"
            }
          ].map((aircraft, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-white/5 bg-[#051433] flex flex-col group hover:border-gold/30 transition-all duration-300 shadow-md">
              <div className="h-44 relative bg-secondary overflow-hidden">
                <img src={aircraft.image} alt={aircraft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 text-left flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-space text-base font-bold text-white">{aircraft.name}</h4>
                  <span className="font-space text-[9px] uppercase tracking-wider text-gold font-semibold block mb-2">{aircraft.type}</span>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">{aircraft.desc}</p>
                </div>
                <div className="border-t border-white/5 pt-3 flex flex-col gap-1.5 font-mono text-[10px] text-slate-400">
                  {Object.entries(aircraft.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="opacity-60">{key}:</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
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
