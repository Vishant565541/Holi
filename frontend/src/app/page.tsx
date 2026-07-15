"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchBox from "@/components/booking/SearchBox";
import { 
  ShieldCheck, 
  Award, 
  Star, 
  HelpCircle, 
  PlaneTakeoff, 
  Ship, 
  Hotel, 
  Users, 
  MapPin, 
  Calendar, 
  Lock, 
  Headphones, 
  Sparkles, 
  Compass, 
  Helicopter,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "5000+", label: "Happy Customers", icon: Users },
    { value: "50+", label: "Destinations", icon: MapPin },
    { value: "10+", label: "Years of Experience", icon: Calendar },
    { value: "100+", label: "Travel Partners", icon: Award },
  ];

  const benefits = [
    { title: "Premium Helicopters", desc: "DGCA approved fleet", icon: Helicopter },
    { title: "Best Price Guarantee", desc: "Match charter rates", icon: Award },
    { title: "Secure Payments", desc: "100% secure bookings", icon: Lock },
    { title: "24/7 Customer Support", desc: "Dedicated flight concierges", icon: Headphones },
  ];

  const pillars = [
    { title: "Safety First", desc: "DGCA approved operators and top safety standards.", icon: ShieldCheck },
    { title: "Pan India Network", desc: "Wide network across major tourist destinations.", icon: Compass },
    { title: "Best Experience", desc: "Luxury, comfort and unforgettable journeys.", icon: Sparkles },
    { title: "Easy Booking", desc: "Simple booking process with instant confirmation.", icon: Calendar },
    { title: "Secure Payments", desc: "100% secure payment and data protection.", icon: Lock },
    { title: "24/7 Support", desc: "Our team is always here to assist you.", icon: Headphones },
  ];

  const popularPackages = [
    {
      id: "pkg-kedarnath",
      name: "Kedarnath Yatra",
      type: "Helicopter Package",
      badge: "3 Days / 2 Nights",
      badgeColor: "bg-[#C5A880] text-black",
      price: "₹ 49,999",
      personLabel: "/ Person",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
      route: "Dehradun - Kedarnath - Dehradun",
      cta: "View Details"
    },
    {
      id: "pkg-chardham",
      name: "Char Dham Yatra",
      type: "Helicopter Package",
      badge: "4 Days / 3 Nights",
      badgeColor: "bg-[#4B6B40] text-white",
      price: "₹ 1,29,999",
      personLabel: "/ Person",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
      route: "Dehradun - Yamunotri - Gangotri - Kedarnath - Badrinath",
      cta: "View Details"
    },
    {
      id: "pkg-vaishnodevi",
      name: "Vaishno Devi",
      type: "Helicopter Package",
      badge: "2 Days / 1 Night",
      badgeColor: "bg-[#C5A880] text-black",
      price: "₹ 39,999",
      personLabel: "/ Person",
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600&auto=format&fit=crop",
      route: "Katra - Vaishno Devi - Katra",
      cta: "View Details"
    },
    {
      id: "pkg-custom",
      name: "Custom Luxury",
      type: "Holiday Package",
      badge: "Custom Package",
      badgeColor: "bg-[#D68B3E] text-black",
      price: "Bespoke",
      personLabel: "Pricing",
      image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
      route: "Plan your own journey with customized experiences.",
      cta: "Customize Now"
    }
  ];

  const faqs = [
    {
      q: "What is your emergency safety protocol?",
      a: "All flights are operated by DGCA-certified multi-engine helicopters with dual-pilot instrument flight rating (IFR). We work in close alignment with state disaster boards, regional command controls, and maintain immediate emergency evacuation readiness.",
    },
    {
      q: "How does Roman Aviation handle weather cancellations?",
      a: "In VIP aviation, safety takes absolute priority. If regional weather conditions fall below instrument standards, we offer immediate rescheduling, helicopter model upgrades, or full refund compensation.",
    },
    {
      q: "Can I customize the catering and onboard utilities?",
      a: "Yes. Every private charter booking allows you to detail gourmet dining preferences, select top-shelf champagne or wine, specify passenger weights for balance, and coordinate limousine ramp pickups.",
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[#020B1E] text-white">
      {/* Background Mountain overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-5 mix-blend-lighten pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020B1E]/80 to-[#020B1E] pointer-events-none" />

      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column text content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 self-start"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold glow-gold" />
            <span className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">
              India's Premier Luxury Aviation Brand
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-6.5xl font-bold tracking-tight leading-[1.1]"
          >
            Elevating Travel <br />
            <span className="text-gold italic font-normal">Across India</span> <br />
            by Air, Land & Water
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-sm md:text-base text-grey-text leading-relaxed max-w-xl"
          >
            Experience India like never before with our premium helicopter tours, curated travel packages, hotels and boat services.
          </motion.p>

          {/* Flyer bullet points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-4.5 my-2 text-xs font-sans text-slate-300"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Helicopter className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Premium Helicopter Services</span>
                <span className="text-[10px] text-grey-text mt-0.5">Safe, Reliable & Comfortable</span>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Scenic Tour Packages</span>
                <span className="text-[10px] text-grey-text mt-0.5">Explore breathtaking destinations</span>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Hotel className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Hotels & Cruise Bookings</span>
                <span className="text-[10px] text-grey-text mt-0.5">Complete travel solutions at one place</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <Link
              href="/booking"
              className="flex items-center gap-2 px-8 py-3.5 bg-gold text-black hover:bg-gold-hover font-space text-xs font-bold uppercase tracking-widest rounded border border-gold transition-all duration-300 shadow-lg shadow-gold/10"
            >
              <span>Book Helicopter Now</span>
              <Helicopter className="h-4 w-4" />
            </Link>
            <Link
              href="/tours"
              className="flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-gold/45 hover:bg-white/5 font-space text-xs text-white uppercase tracking-widest rounded transition-all duration-300"
            >
              <span>Explore Packages</span>
              <Compass className="h-4 w-4 text-gold" />
            </Link>
          </motion.div>

          {/* Core metrics counters / benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-8 mt-6"
          >
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/2 border border-white/5 hover:border-gold/15 transition-all duration-300">
                  <div className="h-7 w-7 rounded bg-gold/10 flex items-center justify-center text-gold">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-space text-[10px] font-bold uppercase tracking-wider text-white">
                      {benefit.title}
                    </h4>
                    <p className="font-sans text-[9px] text-grey-text mt-0.5 leading-snug">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right column: Large Helicopter Scenic Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[500px] flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
        >
          <img 
            src="/luxury_helicopter_hero_1783848402751.png" 
            alt="Roman Aviation Luxury Helicopter flight over Himalayas" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/90 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-card border border-white/10 backdrop-blur-md">
            <span className="font-space text-[9px] text-gold uppercase tracking-widest font-bold">Featured Airbus H145</span>
            <h4 className="font-serif text-sm font-semibold text-white mt-1">Himalayan Luxury Pilgrimage Route</h4>
            <p className="text-[10px] text-grey-text font-sans mt-0.5">High altitude certified cabin with dynamic autopilot safety configuration.</p>
          </div>
        </motion.div>
      </section>

      {/* 2. Global Quick Search Panel */}
      <section className="px-6 relative z-30 -mt-10 mb-20 max-w-7xl mx-auto">
        <SearchBox />
      </section>

      {/* 3. Our Services Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">
            Luxury Offerings
          </span>
          <h2 style={{ color: '#ffffff' }} className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
            Our Services
          </h2>
          {/* Custom Gold Divider */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold" />
            <Helicopter className="h-4.5 w-4.5 text-gold" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: "Helicopter Booking", 
              desc: "Book helicopter rides across India to your favorite destinations.", 
              cta: "Book Now", 
              href: "/booking", 
              icon: Helicopter, 
              image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop" 
            },
            { 
              name: "Tour Packages", 
              desc: "Curated travel packages with helicopter, hotel & activities.", 
              cta: "Explore Now", 
              href: "/tours", 
              icon: Compass, 
              image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop" 
            },
            { 
              name: "Hotel Booking", 
              desc: "Luxury stays and comfortable hotels at best prices.", 
              cta: "Book Hotel", 
              href: "/hotels", 
              icon: Hotel, 
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop" 
            },
            { 
              name: "Boat Services", 
              desc: "Enjoy luxury boat rides and water experiences at top destinations.", 
              cta: "Book Now", 
              href: "/boats", 
              icon: Ship, 
              image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&auto=format&fit=crop" 
            }
          ].map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="rounded-xl overflow-hidden flex flex-col group hover:border-gold/30 transition-all duration-500 relative bg-[#051433] border border-white/5 shadow-lg text-white"
              >
                <div className="h-48 relative overflow-hidden bg-secondary">
                  <img 
                    src={srv.image} 
                    alt={srv.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/95 via-transparent to-transparent" />
                </div>
                
                <div className="p-6 pt-8 relative flex-grow flex flex-col justify-between">
                  {/* Circular Gold Icon Badge */}
                  <div className="absolute -top-6 left-6 h-12 w-12 rounded-full bg-[#051433] border border-gold/30 flex items-center justify-center text-gold shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-space text-sm font-bold uppercase tracking-wider text-white mb-2">
                      {srv.name}
                    </h3>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                      {srv.desc}
                    </p>
                  </div>

                  <Link
                    href={srv.href}
                    className="flex items-center gap-1 text-[10px] text-gold hover:text-white uppercase tracking-widest font-space font-bold mt-auto transition-colors"
                  >
                    <span>{srv.cta}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Why Choose Roman Aviation Banner */}
      <section className="py-16 bg-[#051433]/70 border-y border-white/5 relative overflow-hidden">
        {/* Ambient glow in banner */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 style={{ color: '#ffffff' }} className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
              Why Choose Roman Aviation & Tourism?
            </h2>
            <div className="h-[1px] w-20 bg-gold mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 bg-white/2 rounded-lg border border-white/5 hover:border-gold/15 transition-all">
                  <div className="h-10 w-10 rounded-full bg-gold/5 border border-gold/25 flex items-center justify-center text-gold mb-3">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-space text-[10px] font-bold uppercase tracking-wider text-white mb-1.5">
                    {pil.title}
                  </h4>
                  <p className="font-sans text-[9px] text-grey-text leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flyer Mid-Section: Your Journey Our Priority */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left details */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-2">
              <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">
                Our Priority
              </span>
              <h2 className="font-serif text-3.5xl md:text-4.5xl font-bold tracking-tight text-white leading-tight uppercase">
                YOUR JOURNEY,<br />
                <span className="text-gold">OUR PRIORITY</span>
              </h2>
            </div>
            
            <p className="font-sans text-sm text-slate-300 leading-relaxed max-w-lg">
              From spiritual journeys to adventure escapes, we provide world-class aviation and tourism services tailored to your needs.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-[#051433] border border-gold/20 text-gold rounded font-space text-[9px] font-bold uppercase tracking-wider">
                SAFE. LUXURIOUS. MEMORABLE.
              </span>
            </div>

            {/* Let's Fly Together */}
            <div className="flex flex-col mt-2 font-serif text-2xl md:text-3xl text-white italic">
              <span className="text-slate-400 font-light text-base">Let's</span>
              <span className="text-gold font-bold not-italic tracking-wider uppercase font-space text-4xl flex items-center gap-2 mt-1">
                FLY TOGETHER
                <PlaneTakeoff className="h-6 w-6 text-gold animate-bounce" />
              </span>
            </div>
          </div>

          {/* Right Image stacked gallery (Flyer mock) */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl overflow-hidden border border-white/10 h-64 shadow-xl hover:scale-[1.02] transition-transform duration-300 relative group">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop" 
                alt="Kedarnath Temple"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="font-space text-[8px] uppercase tracking-wider text-white font-bold">Kedarnath Sanctuary</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 h-64 shadow-xl hover:scale-[1.02] transition-transform duration-300 mt-8 relative group">
              <img 
                src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=400&auto=format&fit=crop" 
                alt="Luxury Cruise Yacht"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="font-space text-[8px] uppercase tracking-wider text-white font-bold">Luxury Yacht</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 h-64 shadow-xl hover:scale-[1.02] transition-transform duration-300 mt-16 relative group">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" 
                alt="Tropical Island"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="font-space text-[8px] uppercase tracking-wider text-white font-bold">Scenic Beachfronts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Tour Packages Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">
              Explore India
            </span>
            <h2 style={{ color: '#ffffff' }} className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
              Popular Tour Packages
            </h2>
          </div>
          <Link
            href="/tours"
            style={{ color: '#C5A880', borderColor: 'rgba(197, 168, 128, 0.3)' }}
            className="px-5 py-2.5 border border-gold/30 hover:border-gold hover:bg-gold hover:text-black font-space text-[10px] font-bold uppercase tracking-widest text-gold rounded-full transition-all duration-300 self-start"
          >
            View All Packages
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className="rounded-xl overflow-hidden flex flex-col group border border-white/5 hover:border-gold/30 transition-all duration-500 bg-[#051433] shadow-lg text-white high-contrast-card"
            >
              <div className="h-52 relative overflow-hidden bg-secondary">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/90 via-transparent to-transparent" />
                
                {/* Badge on top left */}
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] font-space uppercase tracking-wider px-2.5 py-1 rounded font-bold ${pkg.badgeColor}`}>
                    {pkg.badge}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span style={{ color: '#cbd5e1' }} className="font-space text-[9px] uppercase tracking-wider text-slate-300 text-slate-light">
                      {pkg.type}
                    </span>
                    <div className="flex items-center gap-0.5 text-gold text-gold-explicit">
                      <Star className="h-3 w-3 fill-gold" />
                      <span style={{ color: '#C5A880' }} className="font-space text-[10px] font-bold text-gold text-gold-explicit">5.0</span>
                    </div>
                  </div>

                  <h3 style={{ color: '#ffffff' }} className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors mb-1">
                    {pkg.name}
                  </h3>
                  <span style={{ color: '#C5A880' }} className="font-sans text-[10px] text-[#C5A880] text-gold-explicit block mb-3 font-medium">
                    {pkg.route}
                  </span>
                </div>

                <div className="border-t border-white/5 pt-4 mt-auto flex items-center justify-between">
                  <div>
                    <span style={{ color: '#94a3b8' }} className="text-[8px] uppercase tracking-wider text-slate-400 text-slate-muted block">Package Rate</span>
                    <div className="flex items-baseline gap-0.5">
                      <span style={{ color: '#ffffff' }} className="font-space text-base font-bold text-white text-white-explicit">{pkg.price}</span>
                      <span style={{ color: '#cbd5e1' }} className="text-[9px] text-slate-300 text-slate-light font-light">{pkg.personLabel}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={pkg.id === "pkg-custom" ? "/contact" : `/booking?package=${pkg.id}`}
                    style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                    className="px-4 py-2 bg-[#020B1E] hover:bg-gold hover:text-black text-white border border-white/10 hover:border-gold font-space text-[9px] font-bold uppercase tracking-widest rounded transition-all duration-300 cursor-pointer btn-explicit"
                  >
                    {pkg.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Luxury Testimonial Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="flex flex-col gap-3 mb-10">
          <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">
            Client Testimonial
          </span>
          <h2 style={{ color: '#ffffff' }} className="font-serif text-3xl font-bold">Noble Client Endorsements</h2>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden bg-[#051433]/30">
          <div className="absolute top-4 right-8 font-serif text-8xl text-gold/5 pointer-events-none select-none">
            “
          </div>
          <p style={{ color: '#ffffff' }} className="font-serif text-base md:text-lg italic text-white/90 leading-relaxed mb-6 max-w-3xl mx-auto">
            "Roman Aviation is not just a flight coordinator; they are curators of the sky. We chartered an AW109 shuttle for my international board executives and a catamaran weekend cruise in Goa. The logistics were operated with surgical precision, complete with custom labels and premium butler caterings."
          </p>
          <div className="flex flex-col items-center gap-1">
            <span style={{ color: '#C5A880' }} className="font-space text-xs font-semibold text-gold uppercase tracking-wider">Dev Patel</span>
            <span style={{ color: '#cbd5e1' }} className="font-sans text-[9px] tracking-wider text-grey-text uppercase">
              Chairman, Patel International holdings
            </span>
          </div>
        </div>
      </section>

      {/* 7. Stats Footer Strip */}
      <section className="py-12 bg-[#051433]/40 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex items-center gap-4 justify-center md:justify-start">
                <div className="h-10 w-10 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-space text-xl md:text-2xl font-bold text-white">
                    {st.value}
                  </div>
                  <div className="font-space text-[10px] tracking-wider text-grey-text uppercase font-semibold">
                    {st.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FAQs Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 text-center mb-12">
          <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Support Chronicle</span>
          <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-white/10 rounded-lg overflow-hidden bg-white/2 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 font-space text-xs md:text-sm font-semibold flex items-center justify-between gap-4 hover:text-gold transition-colors text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4.5 w-4.5 text-gold shrink-0" />
                    {faq.q}
                  </span>
                  <span className={`text-gold transition-transform duration-300 text-[10px] ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/5 text-[11px] md:text-xs font-sans text-grey-text leading-relaxed bg-[#020B1E]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
