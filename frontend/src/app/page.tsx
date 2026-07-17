"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=600&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      route: "Plan your own journey with customized experiences.",
      cta: "Customize Now"
    }
  ];

  const testimonials = [
    {
      name: "Dev Patel",
      role: "Chairman, Patel International Holdings",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      quote: "Roman Aviation is not just a flight coordinator; they are curators of the sky. We chartered an AW109 shuttle for my international board executives and a catamaran weekend cruise in Goa. The logistics were operated with surgical precision, complete with custom labels and premium catering.",
    },
    {
      name: "Ananya Birla",
      role: "Founder, Birla Wellness Group",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      quote: "The Char Dham helicopter tour was exceptional. The priority darshan slots saved us hours, and the mountain lodges they arranged were premium. Truly a luxurious spiritual journey for my family.",
    },
    {
      name: "Vikram Singhania",
      role: "CEO, Singhania Logistics Ltd",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      quote: "Outstanding airport transfers. The Bell 429 helicopter bypassed all traffic, making sure our corporate team arrived at the regional summit right on schedule. Professional crew and exceptional safety standards.",
    },
    {
      name: "Sarah Jenkins",
      role: "Executive VP, Global Luxury Travels",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      quote: "I recommend Roman Aviation to all our premium international clients. Their attention to detail, private lounges, and state-of-the-art DGCA-certified fleet are second to none in the country.",
    },
    {
      name: "Rajesh Kurup",
      role: "Director, Sacred India Expeditions",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      quote: "The Katra to Vaishno Devi flight was seamlessly executed. The team went out of their way to provide wheelchair staging for my elderly parents. Highly recommended for spiritual pilgrimages.",
    }
  ];

  const faqs = [
    {
      q: "What is your emergency safety protocol?",
      a: "All flights are operated by DGCA-certified operators utilizing multi-engine helicopters with dual-pilot instrument flight rating (IFR). We work in close alignment with state disaster boards, regional command controls, and maintain immediate emergency evacuation readiness.",
    },
    {
      q: "How does Roman Aviation handle weather cancellations?",
      a: "In VIP aviation, safety takes absolute priority. If regional weather conditions fall below instrument standards, we offer immediate complimentary rescheduling, helicopter model upgrades, or a complete transparent refund calculation.",
    },
    {
      q: "Are there any hidden booking fees or taxes?",
      a: "No. All our pricing options are transparent. A standard 18% GST (Goods and Services Tax) is applicable on air passenger transits and will be detailed clearly at checkout with no hidden surcharges.",
    },
    {
      q: "What is the cancellation and rescheduling policy?",
      a: "Bookings cancelled 72 hours prior to departure receive a full refund minus a 5% handling charge. Cancellations within 24-72 hours incur a 50% retention charge. Rescheduling is complimentary up to 48 hours before flight staging, subject to slot availability.",
    },
    {
      q: "What identity documents are mandatory for boarding?",
      a: "As per DGCA mandates for flight manifests, all passengers must carry a valid physical government-issued photo ID (Aadhaar Card, Passport, or Voter ID). PAN cards are not accepted as valid identity proof for boarding manifest logs.",
    },
    {
      q: "What is the luggage weight limit per passenger?",
      a: "Due to strict helicopter weight capacity limits and high-altitude flight safety regulations, passenger luggage is strictly limited to 10 kg per passenger. Soft duffel bags are highly recommended; large hard-shell suitcases will not fit in the baggage compartments.",
    },
    {
      q: "Do you accommodate group bookings and corporate charters?",
      a: "Yes. We offer fully customizable private helicopter charter flights for corporate board members, weddings, VIP families, and emergency medical flyouts. Contact our 24/7 Concierge Desk to coordinate aircraft staging.",
    },
    {
      q: "What is the policy for infant and elderly passengers?",
      a: "Infants under 2 years of age (under 10 kg) travel free of charge when seated on an adult's lap. Passengers with specific high-altitude cardiac or respiratory conditions are advised to consult a medical practitioner before booking Himalayan routes.",
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[#020B1E] text-white">
      {/* Background Mountain overlay (Optimized Next Image) */}
      <div className="absolute inset-0 opacity-5 mix-blend-lighten pointer-events-none z-0">
        <Image 
          src="https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=1920&auto=format&fit=crop" 
          alt="Himalayan mountain peaks backdrop" 
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020B1E]/80 to-[#020B1E] pointer-events-none z-0" />

      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left column text content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C5A880]/20 bg-[#C5A880]/5 self-start"
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
            className="font-sans text-sm md:text-base text-[#cbd5e1] leading-relaxed max-w-xl"
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
                <span className="text-[10px] text-slate-400 mt-0.5">Safe, Reliable & Comfortable</span>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Scenic Tour Packages</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Explore breathtaking destinations</span>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Hotel className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Hotels & Cruise Bookings</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Complete travel solutions at one place</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions (CTA Visual Hierarchy) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            {/* Dominant Primary Solid Gold CTA */}
            <Link
              href="/booking"
              className="flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-widest rounded border border-gold transition-all duration-300 shadow-lg shadow-gold/20"
            >
              <span>Book Helicopter Now</span>
              <Helicopter className="h-4 w-4" />
            </Link>
            {/* Downgraded Outline Secondary CTA */}
            <Link
              href="/tours"
              className="flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-gold hover:text-gold hover:bg-transparent font-space text-xs text-white uppercase tracking-widest rounded transition-all duration-300"
            >
              <span>Explore Packages</span>
              <Compass className="h-4 w-4 text-[#C5A880]" />
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
                    <p className="font-sans text-[9px] text-[#cbd5e1] mt-0.5 leading-snug">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right column: Large Helicopter Scenic Image (Optimized Next Image) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[500px] flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
        >
          <Image 
            src="/luxury_helicopter_hero_1783848402751.png" 
            alt="Airbus H145 helicopter over Himalayan mountains for Kedarnath route" 
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/90 via-transparent to-transparent z-10" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-card border border-white/10 backdrop-blur-md z-20">
            <span className="font-space text-[9px] text-gold uppercase tracking-widest font-bold">Featured Airbus H145</span>
            <h4 className="font-serif text-sm font-semibold text-white mt-1">Himalayan Luxury Pilgrimage Route</h4>
            <p className="text-[10px] text-slate-300 font-sans mt-0.5">High altitude certified cabin with dynamic autopilot safety configuration.</p>
          </div>
        </motion.div>
      </section>

      {/* 2. Global Quick Search Panel */}
      <section className="px-6 relative z-30 -mt-10 mb-20 max-w-7xl mx-auto">
        <SearchBox />
      </section>

      {/* 3. Our Services Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
            Luxury Offerings
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
            Our Services
          </h2>
          {/* Custom Gold Divider */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A880]" />
            <Helicopter className="h-4.5 w-4.5 text-[#C5A880]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A880]" />
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
              image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop",
              alt: "Airbus H135 helicopter parked on premium helipad for charter booking"
            },
            { 
              name: "Tour Packages", 
              desc: "Curated travel packages with helicopter, hotel & activities.", 
              cta: "Explore Now", 
              href: "/tours", 
              icon: Compass, 
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
              alt: "Luxury travel planner brochure and maps on table for Tour Packages"
            },
            { 
              name: "Hotel Booking", 
              desc: "Luxury stays and comfortable hotels at best prices.", 
              cta: "Book Hotel", 
              href: "/hotels", 
              icon: Hotel, 
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
              alt: "Exterior facade of Taj Lake Palace luxury hotel resort in Udaipur"
            },
            { 
              name: "Boat Services", 
              desc: "Enjoy luxury boat rides and water experiences at top destinations.", 
              cta: "Book Now", 
              href: "/boats", 
              icon: Ship, 
              image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&auto=format&fit=crop",
              alt: "Luxury yacht sailing off the Goa shoreline under a bright blue sky"
            }
          ].map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="rounded-xl overflow-hidden flex flex-col group hover:border-gold/30 transition-all duration-500 relative bg-[#051433] border border-white/5 shadow-lg text-white"
              >
                {/* Optimized Next Image */}
                <div className="h-48 relative overflow-hidden bg-secondary">
                  <Image 
                    src={srv.image} 
                    alt={srv.alt} 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/95 via-transparent to-transparent z-10" />
                </div>
                
                <div className="p-6 pt-8 relative flex-grow flex flex-col justify-between z-20">
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
      <section className="py-16 bg-[#051433]/70 border-y border-white/5 relative overflow-hidden z-10">
        {/* Ambient glow in banner */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
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
                  <p className="font-sans text-[9px] text-[#cbd5e1] leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Signals: Certifications & Licenses Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/5 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
            Safety Credentials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
            Certifications & Licenses
          </h2>
          <div className="h-[1px] w-12 bg-gold mt-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: DGCA License */}
          <div className="bg-[#051433]/50 p-6 rounded-xl border border-white/5 flex flex-col gap-4 text-left hover:border-[#C5A880]/30 transition-all duration-300 shadow-md">
            <div className="h-12 w-12 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full flex items-center justify-center text-[#C5A880] mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-space text-base font-bold uppercase tracking-wider text-white">DGCA Operator License</h3>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              Fully authorized under Non-Scheduled Operator Permit (NSOP) No. 24/2026 issued by the Directorate General of Civil Aviation, Government of India.
            </p>
            <span className="font-mono text-[10px] text-[#C5A880] mt-auto block font-semibold">LICENSE: NSOP-24/2026-DGCA</span>
          </div>
          
          {/* Card 2: Insurance Coverage */}
          <div className="bg-[#051433]/50 p-6 rounded-xl border border-white/5 flex flex-col gap-4 text-left hover:border-[#C5A880]/30 transition-all duration-300 shadow-md">
            <div className="h-12 w-12 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full flex items-center justify-center text-[#C5A880] mb-2">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-space text-base font-bold uppercase tracking-wider text-white">Comprehensive Insurance</h3>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              Every flight is backed by a comprehensive passenger liability and hull insurance coverage of up to ₹50 Crores per flight, underwritten by The New India Assurance Co.
            </p>
            <span className="font-mono text-[10px] text-[#C5A880] mt-auto block font-semibold">COVERAGE: ₹50,00,00,000 INR</span>
          </div>

          {/* Card 3: Safety Audit Badges */}
          <div className="bg-[#051433]/50 p-6 rounded-xl border border-white/5 flex flex-col gap-4 text-left hover:border-[#C5A880]/30 transition-all duration-300 shadow-md">
            <div className="h-12 w-12 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full flex items-center justify-center text-[#C5A880] mb-2">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-space text-base font-bold uppercase tracking-wider text-white">Safety Audits & Standards</h3>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              ISO 9001:2015 Safety Management certified, aligned with ICAO Annex 19 safety standard benchmarks. Undergoes bi-annual external operations audits.
            </p>
            <span className="font-mono text-[10px] text-[#C5A880] mt-auto block font-semibold">STANDARDS: ISO 9001 | ICAO ANNEX 19</span>
          </div>
        </div>
      </section>

      {/* Flyer Mid-Section: Your Journey Our Priority */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
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

          {/* Right Image stacked gallery (Optimized Next Image) */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl overflow-hidden border border-white/10 h-64 shadow-xl hover:scale-[1.02] transition-transform duration-300 relative group">
              <Image 
                src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=400&auto=format&fit=crop" 
                alt="Beautiful Himalayan sanctuary with snow mountains for Kedarnath pilgrims"
                fill
                sizes="(max-width: 768px) 100vw, 15vw"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 z-10">
                <span className="font-space text-[8px] uppercase tracking-wider text-white font-bold">Kedarnath Sanctuary</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 h-64 shadow-xl hover:scale-[1.02] transition-transform duration-300 mt-8 relative group">
              <Image 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop" 
                alt="Luxury Cruise Yacht sailing at sunset"
                fill
                sizes="(max-width: 768px) 100vw, 15vw"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 z-10">
                <span className="font-space text-[8px] uppercase tracking-wider text-white font-bold">Luxury Yacht</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 h-64 shadow-xl hover:scale-[1.02] transition-transform duration-300 mt-16 relative group">
              <Image 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" 
                alt="Scenic beachfront shoreline with palm trees"
                fill
                sizes="(max-width: 768px) 100vw, 15vw"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 z-10">
                <span className="font-space text-[8px] uppercase tracking-wider text-white font-bold">Scenic Beachfronts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Tour Packages Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Explore India
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
              Popular Tour Packages
            </h2>
          </div>
          <Link
            href="/tours"
            className="px-5 py-2.5 border border-white/20 hover:border-gold hover:text-[#C5A880] hover:bg-transparent font-space text-[10px] font-bold uppercase tracking-widest text-[#cbd5e1] rounded-full transition-all duration-300 self-start"
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
              {/* Optimized Next Image */}
              <div className="h-52 relative overflow-hidden bg-secondary">
                <Image 
                  src={pkg.image} 
                  alt={pkg.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/90 via-transparent to-transparent z-10" />
                
                {/* Badge on top left */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`text-[9px] font-space uppercase tracking-wider px-2.5 py-1 rounded font-bold ${pkg.badgeColor}`}>
                    {pkg.badge}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow text-left">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-space text-[9px] uppercase tracking-wider text-slate-300">
                      {pkg.type}
                    </span>
                    <div className="flex items-center gap-0.5 text-gold">
                      <Star className="h-3 w-3 fill-gold" />
                      <span className="font-space text-[10px] font-bold text-gold">5.0</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors mb-1">
                    {pkg.name}
                  </h3>
                  <span className="font-sans text-[10px] text-[#C5A880] block mb-3 font-medium">
                    {pkg.route}
                  </span>
                </div>

                <div className="border-t border-white/5 pt-4 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Package Rate</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-space text-base font-bold text-white">{pkg.price}</span>
                      <span className="text-[9px] text-slate-300 font-light">{pkg.personLabel}</span>
                    </div>
                  </div>
                  
                  {/* Secondary Outline CTA Button */}
                  <Link
                    href={pkg.id === "pkg-custom" ? "/contact" : `/booking?package=${pkg.id}`}
                    className="px-4 py-2 bg-transparent hover:border-gold hover:text-gold text-white border border-white/20 font-space text-[9px] font-bold uppercase tracking-widest rounded transition-all duration-300 cursor-pointer"
                  >
                    {pkg.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Luxury Testimonial Grid Section (Expanded to 5 reviews) */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center relative z-10 border-t border-white/5">
        <div className="flex flex-col gap-3 mb-16">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
            Client Testimonials
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">Noble Client Endorsements</h2>
          <div className="h-[1px] w-12 bg-gold mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div 
              key={idx} 
              className={`glass-card rounded-2xl p-8 relative overflow-hidden bg-[#051433]/30 border border-white/5 text-left flex flex-col justify-between hover:border-[#C5A880]/30 transition-all duration-300 shadow-lg ${
                idx >= 3 ? "md:col-span-1 lg:col-span-1 lg:max-w-md mx-auto w-full" : ""
              }`}
            >
              <div className="absolute top-4 right-6 font-serif text-6xl text-gold/5 pointer-events-none select-none">
                “
              </div>
              
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-0.5 mb-4 text-[#C5A880]">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C5A880] text-[#C5A880]" />
                  ))}
                </div>
                
                <p className="font-serif text-sm italic text-white/90 leading-relaxed mb-6">
                  "{testi.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                <div className="h-10 w-10 rounded-full overflow-hidden relative border border-[#C5A880]/20 shrink-0">
                  <Image 
                    src={testi.photo} 
                    alt={`Portrait of ${testi.name} for testimonial review`} 
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-space text-xs font-bold text-gold uppercase tracking-wider">{testi.name}</h4>
                  <span className="font-sans text-[9px] tracking-wider text-slate-400 uppercase block mt-0.5">
                    {testi.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Stats Footer Strip */}
      <section className="py-12 bg-[#051433]/40 border-y border-white/5 relative z-10">
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
                  <div className="font-space text-[10px] tracking-wider text-[#cbd5e1] uppercase font-semibold">
                    {st.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Travel Chronicles & Guides Section (SEO Value Addition) */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Travel Chronicles
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
              Expedition Guides & Insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="px-5 py-2.5 border border-white/20 hover:border-gold hover:text-gold hover:bg-transparent font-space text-[10px] font-bold uppercase tracking-widest text-white rounded-full transition-all duration-300 self-start"
          >
            View All Guides
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Kedarnath Helicopter Booking 2026 Guide",
              desc: "Learn about official slot booking calendars, DGCA regulations, baggage constraints, and flight timings for the 2026 pilgrimage season.",
              date: "July 12, 2026",
              author: "Capt. A. Singh",
              image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=400&auto=format&fit=crop",
              alt: "Snow peaks on route to Kedarnath temple sanctum"
            },
            {
              title: "Char Dham Yatra Cost Breakdown",
              desc: "A detailed pricing and budget breakdown comparing VIP private helicopter charters with group flight shuttles and premium hotel stops.",
              date: "June 28, 2026",
              author: "Devi Shastry",
              image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
              alt: "Ancient temple architecture nestled in high mountain valley"
            },
            {
              title: "Best Time to Visit Vaishno Devi by Helicopter",
              desc: "Understand peak seasons, weather coordinates, monsoon delay schedules, and how to book express Darshan passes in Katra.",
              date: "May 15, 2026",
              author: "Dr. P. Nair",
              image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=400&auto=format&fit=crop",
              alt: "Green valley landscape around Vaishno Devi Katra terminal"
            }
          ].map((article, idx) => (
            <div key={idx} className="bg-[#051433] rounded-xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 flex flex-col group text-left">
              <div className="h-48 relative overflow-hidden bg-secondary">
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-transparent to-transparent z-10" />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between z-20">
                <div>
                  <span className="font-space text-[9px] text-[#C5A880] uppercase tracking-wider block mb-2">{article.date} | By {article.author}</span>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">{article.title}</h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">{article.desc}</p>
                </div>
                <Link
                  href="/blog"
                  className="font-space text-[9px] text-[#C5A880] hover:text-white uppercase tracking-widest font-bold flex items-center gap-1.5 mt-auto transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQs Section (Expandable Accordion + 8 items) */}
      <section className="py-20 px-6 max-w-4xl mx-auto relative z-10 border-t border-white/5">
        <div className="flex flex-col gap-3 text-center mb-12">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">Support Chronicle</span>
          <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="h-[1px] w-12 bg-gold mx-auto mt-2" />
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
                  className="w-full text-left p-5 font-space text-xs md:text-sm font-semibold flex items-center justify-between gap-4 hover:text-gold transition-colors text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4.5 w-4.5 text-gold shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gold shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/5 bg-[#020B1E]/40 text-left"
                    >
                      <div className="p-5 text-[11px] md:text-xs font-sans text-slate-300 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Roman Aviation",
            "image": "https://romanaviation.in/logo.png",
            "@id": "https://romanaviation.in",
            "url": "https://romanaviation.in",
            "telephone": "+917041861886",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "VIP Terminal 3, Indira Gandhi International Airport",
              "addressLocality": "New Delhi",
              "postalCode": "110037",
              "addressCountry": "IN"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.95",
              "reviewCount": "58"
            },
            "review": testimonials.map(t => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": t.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": String(t.rating)
              },
              "reviewBody": t.quote
            }))
          })
        }}
      />
    </div>
  );
}
