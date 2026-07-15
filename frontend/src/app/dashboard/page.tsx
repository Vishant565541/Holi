"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, CreditCard, Ticket, Shield, LogOut, Send, Check,
  Bell, Star, FileText, Award, Heart, MapPin, Calendar,
  ChevronRight, TrendingUp, Plane, Hotel, Anchor, Clock,
  CheckCircle, AlertCircle, Zap, Globe, Phone, Mail,
  LayoutDashboard, Upload, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "overview" | "bookings" | "favourites" | "loyalty" | "documents" | "profile" | "tickets" | "security";

// ── Stat card component ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "gold" }: any) {
  const colorMap: Record<string, string> = {
    gold: "text-gold bg-gold/8 border-gold/15",
    teal: "text-teal bg-teal/8 border-teal/15",
    purple: "text-purple-400 bg-purple-400/8 border-purple-400/15",
    blue: "text-blue-400 bg-blue-400/8 border-blue-400/15",
  };
  return (
    <div className="bg-white/2 border border-white/8 rounded-xl p-4 flex flex-col gap-3">
      <div className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-space text-xl font-bold text-white">{value}</p>
        <p className="font-space text-[10px] uppercase tracking-wider text-grey-text mt-0.5">{label}</p>
        {sub && <p className="font-luxury text-[10px] text-grey-text/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const INPUT_CLS = "w-full bg-[#05070D] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/40 transition-colors font-luxury placeholder-white/20";
const LABEL_CLS = "text-[9px] font-space uppercase tracking-widest text-gold/80 font-bold mb-1 block";

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const {
    isLoggedIn, user, bookings, tickets, notifications,
    logout, fetchBookings, fetchTickets, addTicket,
    addReplyToTicket, updateProfile, markNotificationsAsRead,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Profile
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileEmail] = useState(user?.email || "");
  const [profileCity, setProfileCity] = useState("");
  const [profileNationality, setProfileNationality] = useState("Indian");
  const [profileGender, setProfileGender] = useState("Prefer not to say");
  const [profileDob, setProfileDob] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Tickets
  const [tckSubject, setTckSubject] = useState("");
  const [tckCategory, setTckCategory] = useState("Inquiry");
  const [tckMsg, setTckMsg] = useState("");
  const [tckCreated, setTckCreated] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState("");

  // Documents
  const [docUploaded, setDocUploaded] = useState({ passport: false, aadhaar: false, visa: false, medical: false });

  useEffect(() => {
    if (isLoggedIn) { fetchBookings(); fetchTickets(); }
  }, [isLoggedIn]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileName, profilePhone);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tckSubject && tckMsg) {
      await addTicket(tckSubject, tckCategory, tckMsg);
      setTckSubject(""); setTckMsg("");
      setTckCreated(true);
      setTimeout(() => setTckCreated(false), 3000);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTicketId && chatReply.trim()) {
      await addReplyToTicket(activeTicketId, chatReply);
      setChatReply("");
    }
  };

  const handleLogout = () => { logout(); router.push("/"); };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <h2 className="font-space text-lg text-white">Access denied. Please authenticate.</h2>
        <button onClick={() => router.push("/auth")}
          className="px-6 py-3 bg-gold text-black rounded font-space text-xs font-bold uppercase tracking-widest">
          Sign In
        </button>
      </div>
    );
  }

  const selectedTicket = tickets.find((t) => t.id === activeTicketId);
  const unread = notifications.filter((n: any) => !n.read).length;

  // Loyalty points (mock: ₹500 per booking)
  const loyaltyPoints = bookings.length * 500;
  const tier = loyaltyPoints >= 5000 ? "Platinum" : loyaltyPoints >= 2000 ? "Gold" : loyaltyPoints >= 500 ? "Silver" : "Bronze";
  const tierColor = tier === "Platinum" ? "text-purple-300" : tier === "Gold" ? "text-gold" : tier === "Silver" ? "text-slate-300" : "text-amber-700";

  const NAV_ITEMS: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "overview",   label: "Overview",          icon: LayoutDashboard },
    { id: "bookings",   label: "Flight Reservations", icon: CreditCard, badge: bookings.length },
    { id: "favourites", label: "Saved Favourites",  icon: Heart },
    { id: "loyalty",    label: "Loyalty & Rewards", icon: Award },
    { id: "documents",  label: "Travel Documents",  icon: FileText },
    { id: "profile",    label: "Profile Settings",  icon: User },
    { id: "tickets",    label: "Support Inquiries", icon: Ticket, badge: tickets.filter((t: any) => t.status === "Open").length },
    { id: "security",   label: "Security Protocols", icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-3 flex flex-col gap-3 glass-card p-5 rounded-xl border border-white/8 lg:sticky lg:top-28">

        {/* Avatar block */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-1">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border-2 border-gold/30 flex items-center justify-center text-gold font-space font-bold text-base shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || "VIP"}
          </div>
          <div className="min-w-0">
            <h3 className="font-space text-sm font-bold text-white leading-tight truncate">{user?.name || "Guest"}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Award className={`h-3 w-3 ${tierColor}`} />
              <span className={`font-space text-[9px] font-bold uppercase ${tierColor}`}>{tier} Member</span>
            </div>
          </div>
        </div>

        {/* Notification badge */}
        {unread > 0 && (
          <button onClick={() => { markNotificationsAsRead(); }}
            className="flex items-center gap-2 px-3 py-2 bg-gold/5 border border-gold/15 rounded-lg text-[10px] font-space text-gold font-bold w-full cursor-pointer hover:bg-gold/10 transition-colors">
            <Bell className="h-3.5 w-3.5" />
            {unread} new notification{unread > 1 ? "s" : ""}
          </button>
        )}

        {/* Nav items */}
        <nav className="flex flex-col gap-1 font-space text-xs">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-3 ${
                  isActive ? "bg-gold text-black font-bold" : "text-grey-text hover:text-white hover:bg-white/3"
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-black/20 text-black" : "bg-gold/15 text-gold"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Points mini-display */}
        <div className="mt-2 px-3 py-3 bg-white/2 border border-white/8 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[8px] uppercase tracking-widest text-grey-text block">Loyalty Points</span>
            <span className="font-space font-bold text-gold text-sm">{loyaltyPoints.toLocaleString("en-IN")}</span>
          </div>
          <Zap className="h-5 w-5 text-gold/40" />
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full text-left py-2.5 px-3 rounded-lg border border-red-400/10 text-red-400 hover:bg-red-400/5 transition-all font-space text-xs flex items-center gap-3 cursor-pointer mt-1">
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Exit Workspace</span>
        </button>
      </div>

      {/* ── Main Panel ───────────────────────────────────────────────────────── */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-xl p-6 md:p-8 border border-white/8 min-h-[50vh]"
          >

            {/* ── 1. OVERVIEW ─────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold">Welcome back</span>
                  <h2 className="font-space text-xl font-bold text-white mt-1">
                    Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0]} ✦
                  </h2>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={Plane} label="Total Flights" value={bookings.length} sub="Booked" color="gold" />
                  <StatCard icon={Zap} label="Loyalty Points" value={loyaltyPoints.toLocaleString()} sub={`${tier} Tier`} color="purple" />
                  <StatCard icon={Ticket} label="Open Tickets" value={tickets.filter((t: any) => t.status === "Open").length} sub="Awaiting reply" color="teal" />
                  <StatCard icon={Bell} label="Notifications" value={unread} sub="Unread" color="blue" />
                </div>

                {/* Recent bookings preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-space text-xs uppercase tracking-wider font-bold text-gold/80">Recent Reservations</h3>
                    <button onClick={() => setActiveTab("bookings")}
                      className="flex items-center gap-1 text-[9px] text-grey-text hover:text-gold font-space font-bold uppercase tracking-wider transition-colors cursor-pointer">
                      View All <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-grey-text font-luxury text-xs border border-white/5 rounded-lg bg-white/1">
                      No reservations yet.{" "}
                      <button onClick={() => router.push("/tours")} className="text-gold underline cursor-pointer">Browse Tours →</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {bookings.slice(0, 3).map((b: any) => (
                        <div key={b.id} className="flex items-center gap-4 p-3 bg-white/2 border border-white/5 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                            <Plane className="h-3.5 w-3.5 text-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-space text-xs font-bold text-white truncate">{b.name}</p>
                            <p className="text-[9px] text-grey-text font-luxury">{b.date} · {b.details}</p>
                          </div>
                          <span className="font-space text-xs font-bold text-gold shrink-0">₹{Number(b.price).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-gold/80 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Book Helicopter", icon: Plane, path: "/booking", color: "gold" },
                      { label: "Browse Tours", icon: MapPin, path: "/tours", color: "teal" },
                      { label: "Find Hotels", icon: Hotel, path: "/hotels", color: "purple" },
                      { label: "Boat Charter", icon: Anchor, path: "/boats", color: "blue" },
                    ].map((a) => (
                      <button key={a.label} onClick={() => router.push(a.path)}
                        className="flex flex-col items-center gap-2 p-4 bg-white/2 border border-white/8 rounded-xl hover:border-gold/30 hover:bg-gold/3 transition-all cursor-pointer group">
                        <a.icon className="h-5 w-5 text-gold/60 group-hover:text-gold transition-colors" />
                        <span className="font-space text-[9px] uppercase tracking-wider text-grey-text group-hover:text-white transition-colors text-center">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. FLIGHT RESERVATIONS ──────────────────────────────────── */}
            {activeTab === "bookings" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h2 className="font-space text-lg font-bold text-white">Flight Reservations Log</h2>
                    <p className="font-luxury text-[10px] text-grey-text mt-0.5">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""} on record</p>
                  </div>
                  <button onClick={() => router.push("/booking")}
                    className="py-2 px-4 bg-gold text-black rounded-lg font-space text-[9px] font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5">
                    <Plane className="h-3.5 w-3.5" /> New Booking
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 text-grey-text font-luxury text-sm flex flex-col items-center gap-3">
                    <Plane className="h-10 w-10 text-white/10" />
                    <p>No reservations found.</p>
                    <button onClick={() => router.push("/tours")} className="text-gold text-xs font-space font-bold underline cursor-pointer">Explore Packages →</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="border border-white/5 rounded-xl p-5 bg-white/2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/10 transition-colors">
                        <div className="flex gap-4 items-start">
                          <div className="h-10 w-10 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
                            <Plane className="h-4.5 w-4.5 text-gold" />
                          </div>
                          <div className="flex flex-col gap-1 font-luxury text-xs text-grey-text">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-space font-bold text-white text-sm">{booking.name}</span>
                              <span className="text-[9px] uppercase tracking-wider bg-gold/5 border border-gold/15 text-gold px-1.5 py-0.5 rounded font-mono">
                                {booking.id}
                              </span>
                              <span className="text-[9px] uppercase bg-teal/5 border border-teal/15 text-teal px-1.5 py-0.5 rounded font-space font-bold">
                                Confirmed
                              </span>
                            </div>
                            <p className="text-grey-text">{booking.details}</p>
                            <div className="flex flex-wrap gap-3 mt-0.5">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.date}</span>
                              {booking.passengers && <span className="flex items-center gap-1"><User className="h-3 w-3" /> {booking.passengers} guest{booking.passengers > 1 ? "s" : ""}</span>}
                              {booking.type && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {booking.type}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 gap-3">
                          <div>
                            <span className="text-[8px] uppercase text-grey-text block">Final Cost</span>
                            <span className="font-space font-bold text-gold text-base">₹{Number(booking.price).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => router.push(`/success?id=${booking.id}`)}
                              className="px-3 py-1.5 border border-white/10 hover:border-gold rounded-lg font-space text-[9px] font-bold uppercase tracking-wider text-grey-text hover:text-gold bg-white/3 transition-all cursor-pointer">
                              Invoice
                            </button>
                            <button onClick={() => setActiveTab("tickets")}
                              className="px-3 py-1.5 border border-white/10 hover:border-teal/50 rounded-lg font-space text-[9px] font-bold uppercase tracking-wider text-grey-text hover:text-teal bg-white/3 transition-all cursor-pointer">
                              Support
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 3. FAVOURITES ────────────────────────────────────────────── */}
            {activeTab === "favourites" && (
              <div className="flex flex-col gap-6">
                <h2 className="font-space text-lg font-bold text-white border-b border-white/5 pb-3">Saved Favourites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Kedarnath Helicopter Darshan", type: "Helicopter Charter", price: "₹4,99,000", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400", tag: "Spiritual" },
                    { name: "Goa Beach Luxury Yacht", type: "Boat Charter", price: "₹1,25,000/day", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400", tag: "Leisure" },
                    { name: "Himalayan Sacred Peaks", type: "Tour Package", price: "₹5,88,820", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400", tag: "VIP Expedition" },
                    { name: "The Leela Goa Resort", type: "Hotel", price: "₹32,000/night", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400", tag: "5-Star" },
                  ].map((fav, i) => (
                    <div key={i} className="border border-white/8 rounded-xl overflow-hidden flex flex-col bg-white/1 hover:border-white/15 transition-colors">
                      <div className="h-28 relative overflow-hidden">
                        <img src={fav.img} alt={fav.name} className="w-full h-full object-cover opacity-70" />
                        <span className="absolute top-2 left-2 text-[8px] font-space font-bold uppercase tracking-wider bg-gold/80 text-black px-1.5 py-0.5 rounded">
                          {fav.tag}
                        </span>
                        <button className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full hover:bg-red-400/20 transition-colors cursor-pointer">
                          <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" />
                        </button>
                      </div>
                      <div className="p-4 flex items-center justify-between gap-2">
                        <div>
                          <p className="font-space text-xs font-bold text-white">{fav.name}</p>
                          <p className="text-[9px] text-grey-text font-luxury mt-0.5">{fav.type}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-space text-xs font-bold text-gold">{fav.price}</p>
                          <button onClick={() => router.push("/booking")}
                            className="text-[8px] font-space font-bold text-teal uppercase tracking-wider hover:text-white transition-colors cursor-pointer mt-0.5 block">
                            Book Now →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-grey-text font-luxury text-center">
                  These are your curated favourites. Heart any service during browsing to save it here.
                </p>
              </div>
            )}

            {/* ── 4. LOYALTY & REWARDS ─────────────────────────────────────── */}
            {activeTab === "loyalty" && (
              <div className="flex flex-col gap-6">
                <h2 className="font-space text-lg font-bold text-white border-b border-white/5 pb-3">Loyalty & Rewards</h2>

                {/* Tier card */}
                <div className="relative rounded-2xl overflow-hidden border border-gold/20 p-6 bg-gradient-to-br from-gold/10 via-[#051433] to-[#020B1E]">
                  <div className="absolute top-4 right-4 opacity-10">
                    <Award className="h-24 w-24 text-gold" />
                  </div>
                  <span className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold">Current Tier</span>
                  <h3 className={`font-space text-3xl font-bold mt-1 ${tierColor}`}>{tier} Elite</h3>
                  <p className="font-luxury text-xs text-grey-text mt-1">
                    {tier === "Platinum" ? "You've unlocked all premium perks." :
                     tier === "Gold" ? `${(5000 - loyaltyPoints).toLocaleString()} more points to reach Platinum.` :
                     tier === "Silver" ? `${(2000 - loyaltyPoints).toLocaleString()} more points to reach Gold.` :
                     `${(500 - loyaltyPoints).toLocaleString()} more points to reach Silver.`}
                  </p>
                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] font-space text-grey-text mb-1">
                      <span>{loyaltyPoints} pts</span>
                      <span>{tier === "Platinum" ? "MAX" : tier === "Gold" ? "5,000 pts" : tier === "Silver" ? "2,000 pts" : "500 pts"}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (loyaltyPoints / (tier === "Platinum" ? loyaltyPoints : tier === "Gold" ? 5000 : tier === "Silver" ? 2000 : 500)) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                      />
                    </div>
                  </div>
                  <p className="font-space text-2xl font-bold text-white mt-4">{loyaltyPoints.toLocaleString()} <span className="text-sm text-gold/60">pts</span></p>
                </div>

                {/* Perks */}
                <div>
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-gold/80 mb-3">Your Active Perks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: Plane, title: "Priority Boarding", desc: "Skip the queue at all Roman Aviation terminals" },
                      { icon: Hotel, title: "Hotel Upgrades", desc: "Complimentary room upgrades at partner hotels" },
                      { icon: Star, title: "5% Loyalty Discount", desc: "Auto-applied on your next booking" },
                      { icon: Phone, title: "Concierge Hotline", desc: "24/7 dedicated VIP helpline access" },
                    ].map((perk, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-white/2 border border-white/8 rounded-xl">
                        <div className="h-8 w-8 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
                          <perk.icon className="h-4 w-4 text-gold" />
                        </div>
                        <div>
                          <p className="font-space text-xs font-bold text-white">{perk.title}</p>
                          <p className="font-luxury text-[10px] text-grey-text mt-0.5">{perk.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Points history */}
                <div>
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-gold/80 mb-3">Points History</h3>
                  <div className="flex flex-col gap-2">
                    {bookings.length === 0 ? (
                      <p className="text-xs text-grey-text font-luxury text-center py-6">Make your first booking to earn points!</p>
                    ) : (
                      bookings.slice(0, 5).map((b: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/1 border border-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3.5 w-3.5 text-teal" />
                            <span className="font-luxury text-xs text-grey-text">{b.name}</span>
                          </div>
                          <span className="font-space text-xs font-bold text-teal">+500 pts</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── 5. TRAVEL DOCUMENTS ──────────────────────────────────────── */}
            {activeTab === "documents" && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="font-space text-lg font-bold text-white">Travel Documents</h2>
                  <p className="font-luxury text-[10px] text-grey-text mt-0.5">Upload and manage your KYC and travel documents for expedited boarding.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "passport", label: "Passport", desc: "Valid passport for international travel clearance", icon: Globe },
                    { key: "aadhaar", label: "Aadhaar Card", desc: "Government-issued ID for domestic KYC verification", icon: User },
                    { key: "visa", label: "Visa Documents", desc: "Active visa for international charter destinations", icon: FileText },
                    { key: "medical", label: "Medical Fitness", desc: "High-altitude medical clearance certificate", icon: Shield },
                  ].map((doc) => {
                    const uploaded = docUploaded[doc.key as keyof typeof docUploaded];
                    return (
                      <div key={doc.key} className={`p-5 rounded-xl border flex flex-col gap-4 transition-all ${
                        uploaded ? "border-teal/20 bg-teal/3" : "border-white/8 bg-white/1"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${
                              uploaded ? "bg-teal/10 border-teal/20 text-teal" : "bg-white/3 border-white/10 text-grey-text"
                            }`}>
                              <doc.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-space text-xs font-bold text-white">{doc.label}</p>
                              <p className="font-luxury text-[9px] text-grey-text mt-0.5 max-w-[180px] leading-relaxed">{doc.desc}</p>
                            </div>
                          </div>
                          {uploaded ? (
                            <CheckCircle className="h-5 w-5 text-teal shrink-0" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-grey-text/40 shrink-0" />
                          )}
                        </div>
                        <button
                          onClick={() => setDocUploaded((p) => ({ ...p, [doc.key]: !p[doc.key as keyof typeof docUploaded] }))}
                          className={`w-full py-2 rounded-lg border font-space text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            uploaded
                              ? "border-teal/20 bg-teal/5 text-teal hover:bg-teal/10"
                              : "border-white/10 bg-white/3 text-grey-text hover:border-gold/30 hover:text-gold"
                          }`}>
                          <Upload className="h-3 w-3" />
                          {uploaded ? "Re-upload Document" : "Upload Document"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 p-4 bg-gold/5 border border-gold/15 rounded-xl text-xs font-luxury text-grey-text leading-relaxed">
                  <Lock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <p>All documents are encrypted and stored securely. They are only accessed by our compliance team for DGCA permit verification and customs clearance.</p>
                </div>
              </div>
            )}

            {/* ── 6. PROFILE SETTINGS ──────────────────────────────────────── */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                <h2 className="font-space text-lg font-bold text-white border-b border-white/5 pb-3">Profile Configuration</h2>

                {profileSaved && (
                  <div className="bg-teal/10 border border-teal/20 text-teal text-xs px-4 py-3 rounded-lg flex items-center gap-2">
                    <Check className="h-4 w-4" /> Profile updated successfully.
                  </div>
                )}

                {/* Avatar section */}
                <div className="flex items-center gap-4 p-4 bg-white/2 border border-white/8 rounded-xl">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border-2 border-gold/30 flex items-center justify-center text-gold font-space font-bold text-xl shrink-0">
                    {user?.name?.slice(0, 2).toUpperCase() || "VIP"}
                  </div>
                  <div>
                    <p className="font-space text-sm font-bold text-white">{user?.name}</p>
                    <p className={`font-space text-[10px] font-bold ${tierColor}`}>{tier} Member · {loyaltyPoints} pts</p>
                    <button type="button" className="text-[9px] font-space text-gold/60 hover:text-gold mt-1 cursor-pointer transition-colors uppercase tracking-wider flex items-center gap-1">
                      <Upload className="h-2.5 w-2.5" /> Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Full Name</label>
                    <input type="text" required value={profileName}
                      onChange={(e) => setProfileName(e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Email (read-only)</label>
                    <input type="email" disabled value={profileEmail} className={INPUT_CLS + " opacity-50 cursor-not-allowed"} />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Phone Number</label>
                    <input type="tel" required value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)} className={INPUT_CLS} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Date of Birth</label>
                    <input type="date" value={profileDob}
                      onChange={(e) => setProfileDob(e.target.value)} className={INPUT_CLS} style={{ colorScheme: "dark" }} />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Gender</label>
                    <select value={profileGender} onChange={(e) => setProfileGender(e.target.value)}
                      className={INPUT_CLS + " cursor-pointer"}>
                      {["Male", "Female", "Non-Binary", "Prefer not to say"].map((g) => (
                        <option key={g} value={g} className="bg-[#030712]">{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>City / Base Location</label>
                    <input type="text" value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)} className={INPUT_CLS} placeholder="e.g. New Delhi" />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Nationality</label>
                    <select value={profileNationality} onChange={(e) => setProfileNationality(e.target.value)}
                      className={INPUT_CLS + " cursor-pointer"}>
                      {["Indian", "British", "American", "UAE National", "Canadian", "Australian", "Other"].map((n) => (
                        <option key={n} value={n} className="bg-[#030712]">{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit"
                  className="px-6 py-3 bg-gold hover:bg-gold/90 text-black rounded-lg font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer self-start flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> Save Profile
                </button>
              </form>
            )}

            {/* ── 7. SUPPORT INQUIRIES ─────────────────────────────────────── */}
            {activeTab === "tickets" && (
              <div className="flex flex-col gap-5">
                <h2 className="font-space text-lg font-bold text-white border-b border-white/5 pb-3">Support Inquiries</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Create */}
                  <div className="md:col-span-5 flex flex-col gap-4 border-r border-white/5 pr-6">
                    <h3 className="font-space text-xs uppercase tracking-wider font-bold">Submit New Inquiry</h3>
                    {tckCreated && (
                      <div className="bg-teal/10 border border-teal/20 text-teal text-[10px] px-3 py-2 rounded-lg">
                        ✓ Inquiry logged. VIP dispatcher will review shortly.
                      </div>
                    )}
                    <form onSubmit={handleCreateTicket} className="flex flex-col gap-3">
                      <div className="flex flex-col">
                        <label className={LABEL_CLS}>Subject</label>
                        <input type="text" required placeholder="e.g. VIP Catering Request" value={tckSubject}
                          onChange={(e) => setTckSubject(e.target.value)} className={INPUT_CLS} />
                      </div>
                      <div className="flex flex-col">
                        <label className={LABEL_CLS}>Category</label>
                        <select value={tckCategory} onChange={(e) => setTckCategory(e.target.value)}
                          className={INPUT_CLS + " cursor-pointer"}>
                          <option>General Inquiry</option>
                          <option>Billing Issue</option>
                          <option>Flight Change Request</option>
                          <option>Cancellation Request</option>
                          <option>Feedback</option>
                          <option>Emergency</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className={LABEL_CLS}>Message</label>
                        <textarea rows={4} required placeholder="Describe your inquiry in detail…" value={tckMsg}
                          onChange={(e) => setTckMsg(e.target.value)} className={INPUT_CLS + " resize-none"} />
                      </div>
                      <button type="submit"
                        className="py-2.5 bg-white/5 hover:bg-gold hover:text-black border border-gold text-gold font-space text-xs font-bold uppercase rounded-lg transition-all cursor-pointer">
                        Submit Inquiry
                      </button>
                    </form>
                  </div>

                  {/* History */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    <h3 className="font-space text-xs uppercase tracking-wider font-bold">Inquiry History</h3>
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {tickets.length === 0 ? (
                        <p className="text-xs text-grey-text font-luxury text-center py-6">No inquiries submitted yet.</p>
                      ) : (
                        tickets.map((t: any) => (
                          <button key={t.id} onClick={() => setActiveTicketId(t.id)}
                            className={`p-3 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer text-xs ${
                              activeTicketId === t.id ? "bg-gold/10 border-gold text-gold" : "bg-[#05070D] border-white/10 text-grey-text hover:text-white"
                            }`}>
                            <div>
                              <div className="font-bold text-white">{t.subject}</div>
                              <span className="text-[9px] text-grey-text">{t.category} · {t.date}</span>
                            </div>
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              t.status === "Open" ? "text-teal bg-teal/8 border border-teal/15" : "text-grey-text bg-white/5 border border-white/8"
                            }`}>{t.status}</span>
                          </button>
                        ))
                      )}
                    </div>

                    {selectedTicket && (
                      <div className="border border-white/10 rounded-xl p-4 bg-secondary/40 flex flex-col gap-3">
                        <span className="font-space text-[10px] uppercase text-gold font-bold">Chat — {selectedTicket.subject}</span>
                        <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
                          {(selectedTicket as any).messages.map((m: any, i: number) => (
                            <div key={i} className={`flex flex-col gap-1 max-w-[80%] p-2.5 rounded-lg text-xs ${
                              m.sender === "user"
                                ? "bg-gold/5 border border-gold/10 text-white self-end text-right"
                                : "bg-[#05070D] border border-white/10 text-grey-text self-start"
                            }`}>
                              <p>{m.text}</p>
                              <span className="text-[8px] opacity-50">{m.date}</span>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendReply} className="flex gap-2 border-t border-white/5 pt-3">
                          <input type="text" required placeholder="Type your response…" value={chatReply}
                            onChange={(e) => setChatReply(e.target.value)}
                            className={INPUT_CLS + " flex-1"} />
                          <button type="submit"
                            className="px-4 bg-gold hover:bg-gold/90 text-black rounded-lg flex items-center justify-center cursor-pointer shrink-0">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── 8. SECURITY PROTOCOLS ────────────────────────────────────── */}
            {activeTab === "security" && (
              <div className="flex flex-col gap-6">
                <h2 className="font-space text-lg font-bold text-white border-b border-white/5 pb-3">Security & Compliance</h2>

                <div className="flex flex-col gap-4">
                  {[
                    { icon: Shield, color: "text-gold bg-gold/8 border-gold/15", title: "Two-Factor Authentication (2FA)", desc: "Your account enforces 6-digit OTP validation via email on every login and high-value reservation.", status: "Active" },
                    { icon: Bell, color: "text-teal bg-teal/8 border-teal/15", title: "Real-Time Security Alerts", desc: `We monitor login activity and flight status changes. You have ${unread} unread alert${unread !== 1 ? "s" : ""} right now.`, status: "Enabled" },
                    { icon: Lock, color: "text-purple-400 bg-purple-400/8 border-purple-400/15", title: "JWT Session Encryption", desc: "All sessions are signed using RS256 asymmetric encryption with a 1-hour rolling window and refresh token rotation.", status: "Active" },
                    { icon: FileText, color: "text-blue-400 bg-blue-400/8 border-blue-400/15", title: "DGCA Compliance Record", desc: "Your charter flights are logged under Non-Scheduled Operator Permit (NSOP) regulations. All records are audit-ready.", status: "Verified" },
                  ].map((item, i) => (
                    <div key={i} className="p-5 border border-white/8 bg-white/1 rounded-xl flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-space text-xs font-bold text-white uppercase">{item.title}</span>
                          <span className="text-[8px] font-bold text-teal bg-teal/8 border border-teal/15 px-1.5 py-0.5 rounded uppercase">{item.status}</span>
                        </div>
                        <p className="font-luxury text-xs text-grey-text leading-relaxed mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active sessions */}
                <div>
                  <h3 className="font-space text-xs uppercase tracking-wider font-bold text-gold/80 mb-3">Active Sessions</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { device: "Chrome · Windows 11", location: "Mumbai, IN", time: "Now · Current session", active: true },
                      { device: "Safari · iPhone 15", location: "Delhi, IN", time: "2 hours ago", active: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${session.active ? "bg-teal animate-pulse" : "bg-grey-text/30"}`} />
                          <div>
                            <p className="font-space text-xs font-bold text-white">{session.device}</p>
                            <p className="font-luxury text-[9px] text-grey-text">{session.location} · {session.time}</p>
                          </div>
                        </div>
                        {!session.active && (
                          <button className="text-[9px] text-red-400/70 hover:text-red-400 font-space font-bold uppercase cursor-pointer transition-colors">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
