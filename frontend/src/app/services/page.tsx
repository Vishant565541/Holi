"use client";

import React from "react";
import Link from "next/link";
import { 
  Helicopter, 
  Compass, 
  Hotel, 
  Ship, 
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const servicesList = [
    {
      name: "Helicopter Booking",
      tagline: "Ultra-luxury high altitude transits & bespoke private flight charters",
      desc: "Fly above the clouds in state-of-the-art Airbus and Bell helicopters. Perfect for fast-track business transits, airport shoreline shuttle loops, and direct high-altitude sacred mountain pilgrimages to Kedarnath, Badrinath, and more.",
      cta: "Configure Helicopter Flight",
      href: "/booking",
      icon: Helicopter,
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
      features: ["DGCA Certified Multi-Engine Fleets", "Dual-Pilot IFR Operations", "Bespoke Ramp VIP Pickups", "Retractable Landing Gear Stays"]
    },
    {
      name: "Tour Packages",
      tagline: "Curated multi-day itineraries combining sky travel & luxury retreats",
      desc: "Experience India's most breathtaking sites through custom sky tour packages. Handcrafted journeys that unify scenic flights, 5-star lodging, private yacht excursions, and priority darshan slots with state-appointed local guides.",
      cta: "Browse Curated Packages",
      href: "/tours",
      icon: Compass,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
      features: ["VIP Priority Darshan Entries", "Taj & Sarovar Stays Included", "Private Gourmet Catering", "Personal Tour Historian Guides"]
    },
    {
      name: "Hotel Booking",
      tagline: "Elite lodgings, royal lake palaces, and wild canvas retreats",
      desc: "Access an handpicked portfolio of India's absolute finest hotels, wilderness sanctuaries, and historical monuments. Indulge in private suites at Taj Lake Palace Udaipur, Aman-i-Khas Wilds Ranthambore, and Taj Exotica Goa.",
      cta: "Reserve Luxury Suite",
      href: "/hotels",
      icon: Hotel,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      features: ["Private Pool Suite Access", "Personal Butler & Concierge", "Campfire Organic Dining", "Direct Helicopter Landing Clearances"]
    },
    {
      name: "Boat Services",
      tagline: "Executive catamarans, sunset motor yachts, & backwater suites",
      desc: "Navigate beautiful coastlines and backwaters aboard elite yachts and sovereign double-deck houseboats. Perfect for corporate shoreline conferences, sunset cruises in Goa, or romantic getaways in Alleppey.",
      cta: "Book Yacht Charter",
      href: "/boats",
      icon: Ship,
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop",
      features: ["Flybridge Sunbeds", "Private Chefs Onboard", "Jetski Attachments Available", "Professional Crew of 4 Included"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#020B1E] text-white pt-10 pb-24">
      {/* Background Graphic elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-5 mix-blend-lighten pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020B1E]/60 via-[#020B1E]/90 to-[#020B1E] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 mb-4"
          >
            <Sparkles className="h-3 w-3 text-gold" />
            <span className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">
              Exclusive Brand Offerings
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            Our Services
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mt-4"
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold" />
            <Helicopter className="h-4.5 w-4.5 text-gold animate-pulse" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-sm md:text-base text-slate-300 leading-relaxed max-w-xl mt-4"
          >
            Handcrafted travel, flight navigation, and private hospitality services designed to deliver safety, speed, and comfort.
          </motion.p>
        </div>

        {/* Services List Grid */}
        <div className="flex flex-col gap-16">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#051433] rounded-2xl overflow-hidden border border-white/5 shadow-2xl p-6 lg:p-8 high-contrast-card`}
              >
                {/* Visual Image container */}
                <div className={`col-span-1 lg:col-span-6 relative h-[250px] sm:h-[350px] rounded-xl overflow-hidden border border-white/10 group ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 h-12 w-12 rounded-full bg-[#051433] border border-gold/30 flex items-center justify-center text-gold shadow-lg text-gold-explicit">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Text Content */}
                <div className={`col-span-1 lg:col-span-6 flex flex-col gap-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex flex-col gap-2">
                    <span style={{ color: '#C5A880' }} className="font-space text-[10px] uppercase tracking-widest text-gold font-bold text-gold-explicit">
                      {srv.name}
                    </span>
                    <h3 style={{ color: '#ffffff' }} className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                      {srv.tagline}
                    </h3>
                  </div>

                  <p style={{ color: '#cbd5e1' }} className="font-sans text-xs sm:text-sm text-slate-300 text-slate-light leading-relaxed">
                    {srv.desc}
                  </p>

                  {/* Bullet features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-white">
                        <ShieldCheck className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
                        <span style={{ color: '#cbd5e1' }} className="font-sans text-slate-300 text-slate-light leading-none">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Call to action button */}
                  <Link
                    href={srv.href}
                    style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                    className="flex items-center justify-center gap-2 self-start px-6 py-3 bg-[#020B1E] hover:bg-gold hover:text-black border border-white/10 hover:border-gold font-space text-[10px] font-bold uppercase tracking-widest text-white rounded transition-all duration-300 mt-2 btn-explicit"
                  >
                    <span>{srv.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
