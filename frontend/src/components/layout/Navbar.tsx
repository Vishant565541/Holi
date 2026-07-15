"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { Compass, Menu, X, User, ShoppingCart, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { item } = useCartStore();

  const serviceOptions = [
    { name: "Helicopter Booking", href: "/booking" },
    { name: "Tour Packages", href: "/tours" },
    { name: "Hotels", href: "/hotels" },
    { name: "Boat Services", href: "/boats" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Careers", href: "/careers" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-md"
            : "bg-white border-b border-slate-100 py-4.5 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="Roman Aviation & Tourism" 
              className="h-14 w-auto object-contain brightness-100 contrast-125" 
            />
          </Link>
 
          {/* Desktop Menu links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => {
              if (link.name === "Services") {
                const isServicesActive = pathname.startsWith("/services") || serviceOptions.some(opt => pathname === opt.href);
                return (
                  <div
                    key={link.name}
                    className="relative py-1"
                    onMouseEnter={() => setServicesHovered(true)}
                    onMouseLeave={() => setServicesHovered(false)}
                  >
                    <Link
                      href="/services"
                      className={`font-space text-[10px] uppercase tracking-widest hover:text-gold transition-colors flex items-center gap-1 cursor-pointer py-1 ${
                        isServicesActive ? "text-gold font-bold" : "text-slate-800"
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className="h-3 w-3 text-gold" />
                    </Link>
 
                    {/* Dropdown menu */}
                    <AnimatePresence>
                      {servicesHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-150 rounded-lg p-1.5 shadow-2xl flex flex-col gap-0.5 z-50"
                        >
                          {serviceOptions.map((opt) => (
                            <Link
                              key={opt.name}
                              href={opt.href}
                              className={`font-space text-[9px] uppercase tracking-widest px-3 py-2.5 rounded hover:bg-slate-50 hover:text-gold transition-all duration-200 block text-left ${
                                pathname === opt.href ? "text-gold font-bold bg-slate-50" : "text-slate-700"
                              }`}
                            >
                              {opt.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
 
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-space text-[10px] uppercase tracking-widest hover:text-gold transition-colors relative py-1 ${
                    isActive ? "text-gold font-bold" : "text-slate-800"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
 
          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Cart/Booking Icon */}
            <Link
              href="/checkout"
              className="relative p-2 text-slate-800 hover:text-gold transition-colors"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {item && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-gold rounded-full text-[10px] text-black font-bold flex items-center justify-center animate-pulse">
                  1
                </span>
              )}
            </Link>
 
            {/* Dashboard / Login */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-slate-800 hover:text-gold transition-colors py-1.5 px-4 border border-gold/40 rounded-full bg-slate-50 hover:bg-gold hover:text-black"
                >
                  <User className="h-3.5 w-3.5 text-gold" />
                  <span>{user?.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] uppercase tracking-wider text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-slate-800 hover:text-black transition-colors py-2 px-5 border border-gold/40 rounded-full bg-transparent hover:bg-gold hover:border-gold transition-all duration-300"
              >
                <User className="h-3.5 w-3.5 text-gold" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
 
          {/* Tablet & Mobile Nav Triggers */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link
              href="/checkout"
              className="relative p-2 text-slate-800 hover:text-gold transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {item && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-gold rounded-full text-[10px] text-black font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </Link>
 
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-800 hover:text-gold transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 pt-24 px-6 bg-[#020B1E] flex flex-col justify-between pb-12 lg:hidden"
          >
            <div className="flex flex-col gap-5 mt-8">
              {navLinks.map((link) => {
                if (link.name === "Services") {
                  return (
                    <div key={link.name} className="flex flex-col border-b border-white/5">
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className={`font-space text-lg uppercase tracking-wider hover:text-gold transition-colors py-2 flex justify-between items-center w-full cursor-pointer ${
                          mobileServicesOpen ? "text-gold" : "text-white"
                        }`}
                      >
                        <span>Services</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180 text-gold" : "text-white/50"}`} />
                      </button>
                      
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col pl-4 gap-1 pb-3 pt-1"
                          >
                            {serviceOptions.map((opt) => (
                              <Link
                                key={opt.name}
                                href={opt.href}
                                onClick={() => setIsOpen(false)}
                                className={`font-space text-sm uppercase tracking-wide hover:text-gold transition-colors py-2 ${
                                  pathname === opt.href ? "text-gold font-semibold" : "text-white/80"
                                }`}
                              >
                                {opt.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-space text-lg uppercase tracking-wider hover:text-gold transition-colors py-2 border-b border-white/5 flex justify-between items-center ${
                      isActive ? "text-gold" : "text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    <Compass className="h-4 w-4 text-gold/30" />
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-4">
              {isLoggedIn ? (
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mb-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-white"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/5 border border-gold/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="font-space text-sm font-semibold">{user?.name}</div>
                      <div className="font-luxury text-xs text-white/60">Go to Dashboard</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded bg-red-400/5 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded border border-white/10 hover:border-gold/30 text-white font-luxury text-sm tracking-wider bg-white/5 transition-all"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 rounded bg-gold text-black font-space tracking-widest font-semibold uppercase glow-gold text-sm"
              >
                Book Flight Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
