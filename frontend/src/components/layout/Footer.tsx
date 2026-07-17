"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Mail, Send, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const footerLinks = {
    services: [
      { name: "Helicopter Booking", href: "/booking" },
      { name: "Tour Packages", href: "/tours" },
      { name: "Premium Hotels", href: "/hotels" },
      { name: "Boat & Yacht Charters", href: "/boats" },
    ],
    company: [
      { name: "About Brand", href: "/about" },
      { name: "Guides & Chronicles", href: "/blog" },
      { name: "Careers Portal", href: "/careers" },
      { name: "Contact & Support", href: "/contact" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund & Cancellations", href: "/refunds" },
      { name: "Safety Guidelines", href: "/safety" },
    ],
  };

  return (
    <footer className="bg-[#020B1E] border-t border-white/5 pt-20 pb-8 relative overflow-hidden z-10 text-white">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-teal/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        {/* Brand statement */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 group self-start">
            <img 
              src="/logo.png" 
              alt="Roman Aviation & Tourism" 
              className="h-10 w-auto object-contain brightness-100 contrast-125" 
            />
          </Link>
          <p className="font-luxury text-sm text-slate-400 leading-relaxed max-w-sm">
            Setting the global benchmark in luxury air travel. Providing curated, safe, and elite helicopter charters and tours across India's most breathtaking destinations.
          </p>

          <div className="flex flex-col gap-2 border-t border-white/5 pt-4 text-xs text-slate-400 font-sans">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gold">Helplines:</span>
              <span>70418 61886, 84889 94892, 83479 31011</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gold">Email:</span>
              <span>info@romanaviation.in</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gold">GST IN:</span>
              <span className="font-mono">24AAPCR7672B1Z6</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <span className="font-space text-xs uppercase tracking-wider text-gold font-semibold">
              Subscribe to the Roman Chronicle
            </span>
            {subscribed ? (
              <div className="text-sm text-emerald-400 flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-3 rounded max-w-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Subscription confirmed. Welcome to the inner circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-sm relative">
                <input
                  type="email"
                  placeholder="Enter your private email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-gold/50 text-white font-luxury"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-gold hover:bg-gold-hover text-black rounded flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links lists */}
        <div className="flex flex-col gap-5">
          <span className="font-space text-sm tracking-wider text-white font-bold">Services</span>
          <div className="flex flex-col gap-3">
            {footerLinks.services.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-luxury text-sm text-slate-400 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-space text-sm tracking-wider text-white font-bold">Company</span>
          <div className="flex flex-col gap-3">
            {footerLinks.company.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-luxury text-sm text-slate-400 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-space text-sm tracking-wider text-white font-bold">Legal</span>
          <div className="flex flex-col gap-3">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-luxury text-sm text-slate-400 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Social media / Trust labels */}
        <div className="flex items-center gap-6">
          <span className="text-xs font-luxury text-slate-400">Follow us:</span>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://instagram.com" target="_blank" className="hover:text-gold text-xs transition-colors">Instagram</a>
            <a href="https://youtube.com" target="_blank" className="hover:text-gold text-xs transition-colors">YouTube</a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-gold text-xs transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" className="hover:text-gold text-xs transition-colors">Twitter</a>
          </div>
        </div>
      </div>

      {/* Copy info */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs font-luxury text-slate-400">
          &copy; {new Date().getFullYear()} Roman Aviation Private Limited. All Rights Reserved.
        </span>
        <span className="text-xs font-luxury text-slate-400 flex items-center gap-1">
          Crafted for ultra-exclusive travel <Heart className="h-3 w-3 text-gold fill-gold" /> of VIP guests.
        </span>
      </div>
    </footer>
  );
}
