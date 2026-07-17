"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Calendar, BookOpen, Compass, Helicopter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: string;
  title: string;
  desc: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    id: "kedarnath-2026",
    title: "Kedarnath Helicopter Booking 2026 Guide",
    desc: "Understand official slot booking calendars, DGCA guidelines, baggage constraints, and flight schedules for the 2026 pilgrimage season.",
    date: "July 12, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1626014903708-544413740c4c?q=80&w=800&auto=format&fit=crop",
    content: [
      "Securing a helicopter slot for Kedarnath is one of the most crucial aspects of planning your Himalayan pilgrimage. For the 2026 season, the Directorate General of Civil Aviation (DGCA) and Uttarakhand Civil Aviation Development Authority (UCADA) have announced synchronized booking schedules aligned with the temple opening dates.",
      "Official slot calendars open in phases, starting 30 days prior to the opening of the shrine. It is mandatory for all pilgrims to register on the official Uttarakhand Tourist Care portal before attempting to book a helicopter ticket, as your unique registration key will be verified during the manifest logging.",
      "Safety takes absolute priority at high altitudes. All operations are conducted under strict visual flight rules (VFR). Luggage limits are non-negotiable at 10 kg per seat. It is strongly advised to carry soft duffel bags rather than hard trolleys, which cannot be accommodated in the helicopter cargo holds.",
      "Infants under 2 years travel free of charge if they do not occupy a seat and are lap-held (weight must be under 10 kg). Be prepared for weather delays, as cloud cover at the Phata, Sirsi, and Guptkashi helipads can result in sudden standby holds. We recommend keeping a buffer day in your itinerary."
    ]
  },
  {
    id: "chardham-cost",
    title: "Char Dham Yatra Cost Breakdown",
    desc: "A detailed pricing and budget breakdown comparing VIP private helicopter charters with group flight shuttles and premium hotel stops.",
    date: "June 28, 2026",
    author: "Devi Shastry",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Char Dham Yatra—encompassing Yamunotri, Gangotri, Kedarnath, and Badrinath—is a spiritual odyssey of a lifetime. Traveling via helicopter offers unparalleled convenience and comfort, bypassing days of grueling road travel. However, understanding the cost elements is vital for budgeting.",
      "A VIP private helicopter charter typically runs between ₹4,50,000 to ₹5,80,000 per package, depending on occupancy levels, aircraft model (such as the spacious twin-engine Airbus H145), and the quality of accommodations at each valley stop.",
      "The cost structure generally includes Dehradun Sahastradhara helipad departures, dynamic priority Darshan slots at Badrinath and Kedarnath, luxury mountain resort stays, custom high-altitude gourmet meals, and dedicated local guides.",
      "For solo travelers or couples, seat-only configurations on shared commercial shuttles start from ₹49,999 per temple. When calculating budgets, factor in a standard 18% GST on air passenger transits and optional upgrades such as custom Vedic pujas or private Audi SUV ground transits."
    ]
  },
  {
    id: "vaishnodevi-time",
    title: "Best Time to Visit Vaishno Devi by Helicopter",
    desc: "Understand peak seasons, weather coordinates, monsoon delay schedules, and how to book express Darshan passes in Katra.",
    date: "May 15, 2026",
    author: "Dr. Priya Nair",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1585016495481-91613a37932d?q=80&w=800&auto=format&fit=crop",
    content: [
      "Located in the Trikuta Mountains of Jammu & Kashmir, the holy shrine of Mata Vaishno Devi attracts millions of devotees annually. The helicopter ride from Katra base to Sanjichhat helipad reduces a steep 12 km trek into a scenic 8-minute flight.",
      "Choosing the right season for your flight is key. The ideal windows are March to June (spring-summer) and September to November (autumn). During these months, the weather coordinates are highly stable, maximizing flight safety and reducing air corridor standby holds.",
      "The monsoon season (July to August) is prone to sudden rainstorms and dense mountain fog, which often lead to operational delays or cancellations. If you book during these months, verify the operator's standby policies and ensure your tickets include automated refund processing.",
      "Helicopter tickets automatically grant you access to the priority VIP Darshan queue at the Bhawan. Always double-check slot timings and arrive at the Katra staging helipad at least 1 hour before departure for security profiling and physical weight checks."
    ]
  }
];

export default function BlogPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12 relative min-h-screen text-white bg-[#020B1E]">
      
      {/* Title block */}
      <div className="border-b border-white/5 pb-8 flex flex-col gap-2">
        <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
          Chronicle & Guides
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight uppercase">
          Roman Travel Chronicles
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-300">
          Exclusive insights, safety manuals, and planning checklists for elite Himalayan pilgrims.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedArticleId ? (
          /* Articles List Grid */
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {ARTICLES.map((article) => (
              <div 
                key={article.id}
                className="bg-[#051433] rounded-xl overflow-hidden border border-white/5 hover:border-[#C5A880]/30 transition-all duration-500 flex flex-col justify-between group h-full shadow-lg"
              >
                <div className="h-56 relative overflow-hidden bg-secondary">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-transparent to-transparent z-10" />
                </div>
                
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-4 text-[9px] text-[#C5A880] uppercase font-space tracking-wider mb-3">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-6">
                      {article.desc}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedArticleId(article.id)}
                    className="font-space text-[10px] text-[#C5A880] hover:text-white uppercase tracking-widest font-bold flex items-center gap-1.5 mt-auto transition-colors cursor-pointer text-left self-start"
                  >
                    <span>Read Article</span>
                    <BookOpen className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Article Reader View */
          <motion.article 
            key="reader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8 max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedArticleId(null)}
              className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-[#C5A880] hover:text-white transition-colors cursor-pointer self-start border border-[#C5A880]/20 px-4 py-2 rounded bg-[#051433]/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Chronicles</span>
            </button>

            {/* Feature Image */}
            <div className="h-[250px] sm:h-[400px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={activeArticle!.image} 
                alt={activeArticle!.title} 
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-[#020B1E]/30 to-transparent" />
            </div>

            {/* Article Header */}
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl sm:text-3.5xl font-bold text-white leading-tight">
                {activeArticle!.title}
              </h2>
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-sans border-b border-white/5 pb-4">
                <span className="flex items-center gap-1.5 text-[#C5A880]"><User className="h-4 w-4" /> {activeArticle!.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {activeArticle!.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {activeArticle!.readTime}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="flex flex-col gap-6 text-slate-200 font-sans text-sm sm:text-base leading-relaxed text-left">
              {activeArticle!.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Ready to Book CTA Card */}
            <div className="bg-[#051433] rounded-xl p-6 md:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 shadow-xl">
              <div className="text-left flex items-start gap-4">
                <div className="h-10 w-10 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold shrink-0 mt-1">
                  <Helicopter className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-space text-sm uppercase tracking-wider font-bold text-white">Ready for your pilgrimage?</h4>
                  <p className="font-sans text-xs text-slate-300 mt-1">Reserve your exclusive private charter and luxury flight corridor now.</p>
                </div>
              </div>
              
              <Link
                href="/booking"
                className="px-6 py-3 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-widest rounded border border-gold transition-all duration-300 shrink-0 text-center w-full sm:w-auto"
              >
                Book Now
              </Link>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
