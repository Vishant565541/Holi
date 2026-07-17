"use client";

import React, { useState } from "react";
import { Compass, Mail, Phone, Clock, Send, ShieldAlert, CheckCircle, Search, HelpCircle, ChevronDown, ChevronUp, MapPin, Award, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  // Flight tracker states
  const [searchRef, setSearchRef] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState("");

  // FAQ Accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && msg) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setName("");
        setEmail("");
        setMsg("");
      }, 3000);
    }
  };

  const handleTrackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError("");
    setTrackingResult(null);

    const ref = searchRef.trim().toUpperCase();
    if (!ref) return;

    // Direct mock match or fallback simulation
    if (ref.startsWith("ROM-") || ref.startsWith("KED-") || ref.length >= 4) {
      setTrackingResult({
        ref: ref,
        from: ref.includes("KED") ? "Dehradun (DED)" : "Delhi T3 VIP",
        to: ref.includes("KED") ? "Kedarnath Sanctuary" : "Goa Marina Base",
        date: "2026-07-12",
        passengers: "2 Passengers",
        status: "ATC Corridor Scheduled",
        steps: [
          { label: "Inquiry Logged", desc: "Received at central Roman dispatch desk", done: true },
          { label: "corridor clearance", desc: "Spiritual route ATC slot approved", done: true },
          { label: "helicopter staging", desc: "Airbus H145 prepped at Sahastradhara hangar", done: true },
          { label: "crew check-in", desc: "Pre-flight checks by Capt. R. Sharma (Retired Air Force)", done: false }
        ]
      });
    } else {
      setTrackingError("No active booking request found with this reference key. Try entering 'ROM-2026' or 'KED-7672'.");
    }
  };

  const offices = [
    { city: "New Delhi Airport Terminal", address: "VIP Terminal 3, Indira Gandhi International Airport, New Delhi 110037", phone: "+91 70418 61886" },
    { city: "Dehradun Helipad Office", address: "Sahastradhara Helipad Main hangar, Dehradun, Uttarakhand 248001", phone: "+91 84889 94892" },
    { city: "Goa Marine Office", address: "Harbor View Concourse, Panaji, Goa 403001", phone: "+91 83479 31011" },
  ];

  const faqs = [
    {
      q: "What is the maximum baggage weight per passenger?",
      a: "Due to high-altitude flight safety dynamics and weight balance limits, individual baggage is limited to 10 kg per passenger. Soft duffel bags are highly recommended instead of hard shell trolley suitcases."
    },
    {
      q: "How are weather delays managed on spiritual mountain routes?",
      a: "Passenger safety is our absolute priority. In case of unfavorable weather coordinates or cloud ceiling warnings at Kedarnath or Badrinath, flights are put on priority standby. Rescheduling is provided at no extra cost, or a transparent refund is calculated."
    },
    {
      q: "Can we request custom gourmet catering or wheelchair assistance?",
      a: "Yes, you can specify custom preferences. Our flight concierges can coordinate gourmet vegetarian/Vedic box meals, priority porter passes for darshan, and wheelchair staging at helipads."
    },
    {
      q: "What certifications do Roman Aviation helicopters hold?",
      a: "All aircraft are operated under Non-Scheduled Operator Permits (NSOP) authorized by the DGCA, maintaining rigorous mechanical inspections and double-pilot cockpit redundancy protocols."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-16">
      
      {/* Title & Helplines Strip */}
      <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">
            Concierge Desk
          </span>
          <h1 style={{ color: '#ffffff' }} className="font-serif text-3xl md:text-4xl font-bold tracking-tight uppercase">
            VIP Support Desk
          </h1>
          <p style={{ color: '#cbd5e1' }} className="font-sans text-xs sm:text-sm text-slate-300">
            Reach our flight coordinators and terminal offices instantly.
          </p>
        </div>
        
        {/* Flyer Coordinates Strip */}
        <div className="flex flex-wrap gap-4 text-xs font-sans">
          <div className="p-3 bg-[#051433] border border-white/5 rounded-lg flex items-center gap-3">
            <Phone className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
            <div>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-none">24/7 Helplines</span>
              <span style={{ color: '#ffffff' }} className="font-semibold text-white">70418 61886 | 84889 94892</span>
            </div>
          </div>
          <div className="p-3 bg-[#051433] border border-white/5 rounded-lg flex items-center gap-3">
            <Mail className="h-4 w-4 text-gold shrink-0 text-gold-explicit" />
            <div>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-none">Email Office</span>
              <span style={{ color: '#ffffff' }} className="font-semibold text-white">info@romanaviation.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Showcase Banner */}
      <section className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative h-[250px] sm:h-[350px] lg:h-[400px]">
        <img 
          src="/luxury_concierge_contact.png" 
          alt="Roman Aviation Luxury Concierge Desk" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-[#020B1E]/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span style={{ color: '#C5A880' }} className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">VIP Concierge Services</span>
            <h2 style={{ color: '#ffffff' }} className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">First-Class Passenger Lounges</h2>
          </div>
          <span style={{ color: '#cbd5e1' }} className="text-xs text-slate-300 font-sans max-w-sm leading-relaxed text-slate-light">
            Our luxury dispatch lounges at New Delhi VIP Terminal 3 and Sahastradhara Base coordinate all private board transfers and flight itineraries.
          </span>
        </div>
      </section>

      {/* Middle Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact form & Tracker - Left */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Form */}
          <div className="bg-[#051433] rounded-xl p-6 md:p-8 border border-white/5 shadow-lg high-contrast-card">
            <h2 style={{ color: '#ffffff' }} className="font-space text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6">
              Send Dispatch Inquiry
            </h2>

            {formSubmitted ? (
              <div className="text-center py-12 flex flex-col gap-4 items-center justify-center">
                <CheckCircle className="h-10 w-10 text-gold animate-bounce text-gold-explicit" />
                <h4 style={{ color: '#ffffff' }} className="font-space text-sm font-bold text-white">Inquiry Forwarded</h4>
                <p style={{ color: '#cbd5e1' }} className="font-sans text-[11px] text-slate-300">
                  Our private travel concierge will contact your office in less than 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label style={{ color: '#cbd5e1' }} className="text-[10px] font-space text-slate-300 uppercase">Noble Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dev Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#020B1E] border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50 font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label style={{ color: '#cbd5e1' }} className="text-[10px] font-space text-slate-300 uppercase">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="dev@patelcorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#020B1E] border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50 font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label style={{ color: '#cbd5e1' }} className="text-[10px] font-space text-slate-300 uppercase">Details & Route Request</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your charter details, locations, passenger count, and scheduling requirements..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-[#020B1E] border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50 font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  style={{ color: '#ffffff', borderColor: '#C5A880' }}
                  className="py-3.5 bg-transparent hover:bg-gold hover:text-black border border-gold rounded font-space font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 btn-explicit"
                >
                  <span>Dispatch Inquiry Request</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Interactive Mock Flight Request Tracker */}
          <div className="bg-[#051433] rounded-xl p-6 md:p-8 border border-white/5 shadow-lg high-contrast-card">
            <h2 style={{ color: '#ffffff' }} className="font-space text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-2">
              Flight Dispatch Tracker
            </h2>
            <p style={{ color: '#cbd5e1' }} className="font-sans text-[11px] text-slate-300 mb-6">
              Enter your inquiry reference ID to monitor ATC slot coordinates and flight staging.
            </p>

            <form onSubmit={handleTrackRequest} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Enter ID (e.g. ROM-2026)"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="flex-grow bg-[#020B1E] border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50 font-mono"
              />
              <button
                type="submit"
                style={{ color: '#020B1E', backgroundColor: '#C5A880' }}
                className="px-4 bg-gold text-black rounded font-space font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Track</span>
              </button>
            </form>

            {trackingError && (
              <span className="text-red-400 font-sans text-xs block">{trackingError}</span>
            )}

            {trackingResult && (
              <div className="p-4 rounded-lg bg-[#020B1E] border border-white/10 flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">Reference Key</span>
                    <span className="font-mono text-xs font-bold text-white block">{trackingResult.ref}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/25 font-space text-[8px] text-gold uppercase font-bold text-gold-explicit">
                    {trackingResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px] font-sans text-slate-300 text-slate-light border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[8px] uppercase text-slate-500 block">Flight Corridor</span>
                    <span>{trackingResult.from} → {trackingResult.to}</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-slate-500 block">Staging Coordinates</span>
                    <span>{trackingResult.date} ({trackingResult.passengers})</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  {trackingResult.steps.map((st: any, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${st.done ? "border-gold bg-gold/15 text-gold text-gold-explicit" : "border-white/20 text-slate-500"}`}>
                          {st.done ? <Check className="h-2.5 w-2.5" /> : <span className="text-[8px] font-bold font-mono">{idx+1}</span>}
                        </div>
                        {idx < trackingResult.steps.length - 1 && (
                          <div className={`w-[1px] h-6 mt-1 ${st.done ? "bg-gold/30" : "bg-white/10"}`} />
                        )}
                      </div>
                      <div>
                        <span style={{ color: st.done ? '#ffffff' : '#94a3b8' }} className="font-space text-[10px] uppercase font-bold tracking-wider block leading-none mb-0.5">
                          {st.label}
                        </span>
                        <span className="font-sans text-[10px] text-slate-400 block leading-tight">{st.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Office addresses - Right */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#051433] rounded-xl p-6 border border-white/10 flex flex-col gap-5 shadow-lg high-contrast-card">
            <h3 style={{ color: '#ffffff' }} className="font-space text-sm uppercase tracking-wider font-bold text-white border-b border-white/5 pb-2">
              Corporate Terminal Offices
            </h3>

            <div className="flex flex-col gap-6">
              {offices.map((of, i) => (
                <div key={i} className="flex flex-col gap-1 font-sans text-xs text-slate-300 text-slate-light">
                  <span style={{ color: '#ffffff' }} className="font-space text-xs font-semibold text-white">{of.city}</span>
                  <p className="leading-relaxed mt-0.5">{of.address}</p>
                  <span style={{ color: '#C5A880' }} className="text-[10px] text-gold font-mono mt-1 block font-semibold text-gold-explicit">Phone: {of.phone}</span>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-white/5 my-2" />

            {/* Emergency Rescue Box */}
            <div className="flex gap-3 bg-red-400/5 border border-red-400/10 p-4 rounded text-xs font-sans text-slate-300 text-slate-light leading-relaxed">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
              <div>
                <span className="text-red-400 font-bold block mb-0.5 uppercase tracking-wider font-space text-[10px]">24/7 Heli-Rescue Emergency</span>
                For instant weather reports or search and rescue coordinates: <br />
                <span className="font-bold text-white text-white-explicit block mt-1">Call +91 70418 61886 | 84889 94892</span>
              </div>
            </div>

            {/* Corporate Tax block */}
            <div className="flex items-center gap-3 bg-[#020B1E] border border-white/10 p-4 rounded text-xs font-sans text-slate-300 text-slate-light">
              <Award className="h-5 w-5 text-gold shrink-0 text-gold-explicit" />
              <div>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-none mb-1">GST Registration</span>
                <span className="font-mono text-white text-white-explicit font-semibold text-[11px]">GST IN: 24AAPCR7672B1Z6</span>
              </div>
            </div>
          </div>

          {/* Google Maps Embed Card */}
          <div className="bg-[#051433] rounded-xl p-4 border border-white/10 shadow-lg overflow-hidden h-[300px] high-contrast-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.6644781498616!2d77.08182967630043!3d28.549806475711684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1bf47b0e14a1%3A0xe21287c9362e524d!2sIndira%20Gandhi%20International%20Airport%20Terminal%203!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "0.5rem" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col items-center">
          <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">FAQ Desk</span>
          <h2 style={{ color: '#ffffff' }} className="font-serif text-2xl md:text-3xl font-bold text-white mt-2">Common Booking Inquiries</h2>
          <div className="h-[1px] w-12 bg-gold mt-4" />
        </div>

        <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-white/5 bg-[#051433] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-space text-xs font-bold uppercase tracking-wider text-white hover:text-gold cursor-pointer transition-colors"
                >
                  <span style={{ color: isOpen ? '#C5A880' : '#ffffff' }} className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 shrink-0 text-gold" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-gold shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/5 bg-[#020B1E]/40"
                    >
                      <p style={{ color: '#cbd5e1' }} className="px-6 py-4 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed text-slate-light">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
