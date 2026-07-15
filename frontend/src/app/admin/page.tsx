"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import API from "@/utils/api";
import {
  TrendingUp, Users, Calendar, CreditCard, ArrowUpRight,
  ShieldCheck, AlertCircle, FileSpreadsheet, Download, Mail,
  Zap, Lock, Eye, EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  return <AdminDashboardContent />;
}

// ── Dashboard content (shown only after login) ────────────────────────────────
function AdminDashboardContent() {
  const [metrics, setMetrics] = useState({
    bookingsCount: 0,
    revenueTotal: 0,
    activeFleet: 3,
    applicationsPending: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/bookings");
        const bookingsList = res.data || [];
        const count = bookingsList.length;
        const totalRev = bookingsList.reduce((acc: number, item: any) => {
          if (item.status !== "Cancelled") return acc + Number(item.price);
          return acc;
        }, 0);
        setRecentBookings(bookingsList.slice(0, 5));
        setMetrics({ bookingsCount: count, revenueTotal: totalRev, activeFleet: 3, applicationsPending: 1 });
      } catch (err) {
        console.error("Failed to query dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const monthlyRevenue = [
    { month: "Jan", amount: 4.2 }, { month: "Feb", amount: 6.8 },
    { month: "Mar", amount: 8.5 }, { month: "Apr", amount: 12.1 },
    { month: "May", amount: 15.6 }, { month: "Jun", amount: 18.4 },
  ];
  const trafficSources = [
    { source: "Direct VIPs",       percentage: 55, color: "bg-gold" },
    { source: "Elite Concierge",   percentage: 30, color: "bg-teal" },
    { source: "Corporate Channels", percentage: 15, color: "bg-grey-text" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("roman_admin_auth");
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-space text-2xl font-bold text-white tracking-tight uppercase">Aviation Control Centre</h2>
          <p className="font-luxury text-xs text-grey-text mt-0.5">
            Operational dashboard — flights, pilots dispatch, and database statistics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => alert("Simulating PDF operational metrics download...")}
            className="py-2 px-4 rounded border border-white/10 bg-white/2 hover:bg-white/5 font-space text-[10px] font-bold text-white transition-all cursor-pointer flex items-center gap-2 uppercase tracking-widest">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
          <button onClick={handleLogout}
            className="py-2 px-4 rounded border border-red-400/15 bg-red-400/5 hover:bg-red-400/10 font-space text-[10px] font-bold text-red-400 transition-all cursor-pointer uppercase tracking-widest">
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: `₹${(metrics.revenueTotal / 100000).toFixed(2)} Lakhs`, icon: CreditCard, color: "text-gold",       desc: "Active reservations income" },
          { title: "Reservations",  value: `${metrics.bookingsCount} Flights`,                      icon: Calendar,   color: "text-teal",       desc: "All charter bookings in DB" },
          { title: "Active Fleet",  value: `${metrics.activeFleet} Copters`,                        icon: ShieldCheck, color: "text-green-400", desc: "Airbus H145 / AW109 active" },
          { title: "Applications",  value: "2 Pending",                                              icon: Users,      color: "text-blue-400",   desc: "Pilot candidacies" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 border border-white/8 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-space text-grey-text uppercase tracking-wider">{stat.title}</span>
                <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div>
                <span className="font-space text-xl font-bold text-white">{loading ? "…" : stat.value}</span>
                <span className="font-luxury text-[9px] text-grey-text mt-0.5 block">{stat.desc}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card rounded-xl p-6 border border-white/8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="font-space text-xs font-bold uppercase tracking-wider text-white">Revenue Growth Metrics</h3>
              <span className="font-luxury text-[10px] text-grey-text mt-0.5 block">Monthly turnover (₹ Lakhs)</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/5 px-2 py-0.5 rounded font-mono font-bold">
              <TrendingUp className="h-3 w-3" /> +24% YoY
            </span>
          </div>
          <div className="h-64 w-full relative flex items-end justify-between px-4 pb-6 mt-4">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-grey-text font-mono">
              <span>₹20L</span><span>₹15L</span><span>₹10L</span><span>₹5L</span><span>0</span>
            </div>
            <div className="absolute inset-0 left-8 right-0 bottom-6 border-b border-white/5 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="flex-1 left-8 right-0 absolute bottom-6 top-4 flex items-end justify-around pl-6">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2 group relative w-12">
                  <span className="absolute -top-8 bg-gold text-black font-space font-bold text-[9px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{data.amount}L
                  </span>
                  <div style={{ height: `${(data.amount / 20) * 100}%` }}
                    className="w-4 bg-gradient-to-t from-gold/40 to-gold rounded-t transition-all duration-500 group-hover:from-gold shadow-md shadow-gold/10" />
                  <span className="absolute -bottom-6 font-mono text-[9px] text-grey-text">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-xl p-6 border border-white/8 flex flex-col justify-between gap-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-space text-xs font-bold uppercase tracking-wider text-white">Traffic Allocations</h3>
            <span className="font-luxury text-[10px] text-grey-text mt-0.5 block">Core user acquisition channels</span>
          </div>
          <div className="flex justify-center items-center py-4">
            <div className="h-32 w-32 rounded-full border-8 border-white/5 flex items-center justify-center">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-widest text-grey-text block font-space">Acquisitions</span>
                <span className="text-sm font-space font-bold text-white mt-0.5 block">5.8k unique</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 font-space text-[10px]">
            {trafficSources.map((source, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${source.color}`} />
                  <span className="text-grey-text">{source.source}</span>
                </div>
                <span className="font-mono text-white font-bold">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card rounded-xl p-6 border border-white/8 flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-space text-xs font-bold uppercase tracking-wider text-white">Live Operations Stream</h3>
            <Link href="/admin/bookings"
              className="text-[10px] font-space text-gold hover:underline flex items-center gap-1 uppercase font-bold tracking-wider">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-10 font-luxury text-xs text-grey-text">Syncing database feed…</div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-10 font-luxury text-xs text-grey-text">No operations logged.</div>
          ) : (
            <div className="flex flex-col gap-4 font-luxury text-xs text-grey-text">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-space font-bold">{booking.name}</span>
                      <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-1 rounded">{booking.id}</span>
                    </div>
                    <span>Type: {booking.type} · Date: {booking.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-space font-bold text-gold block">₹{Number(booking.price).toLocaleString("en-IN")}</span>
                    <span className={`text-[9px] uppercase font-bold ${booking.status === "Confirmed" ? "text-teal" : "text-red-400"}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 glass-card rounded-xl p-6 border border-white/8 flex flex-col gap-5">
          <div className="border-b border-white/5 pb-2">
            <h3 className="font-space text-xs font-bold uppercase tracking-wider text-white">System Admin Commands</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => alert("Re-syncing database connection pool...")}
              className="p-4 rounded border border-white/5 hover:border-gold/30 bg-white/2 hover:bg-white/5 cursor-pointer text-center flex flex-col items-center gap-2.5 transition-all">
              <Zap className="h-5 w-5 text-gold animate-pulse" />
              <div>
                <span className="font-space text-[10px] font-bold text-white uppercase block">Cache Refresh</span>
                <span className="text-[8px] text-grey-text font-luxury mt-0.5 block">Sync DB metrics</span>
              </div>
            </button>
            <button onClick={() => alert("Broadcasting notifications to passenger devices...")}
              className="p-4 rounded border border-white/5 hover:border-teal/30 bg-white/2 hover:bg-white/5 cursor-pointer text-center flex flex-col items-center gap-2.5 transition-all">
              <Mail className="h-5 w-5 text-teal" />
              <div>
                <span className="font-space text-[10px] font-bold text-white uppercase block">Broadcast Alert</span>
                <span className="text-[8px] text-grey-text font-luxury mt-0.5 block">SMS notifications</span>
              </div>
            </button>
          </div>
          <div className="mt-2 p-3 bg-teal/5 border border-teal/15 rounded flex items-center gap-2.5 text-[10px] font-luxury text-grey-text">
            <AlertCircle className="h-4 w-4 text-teal shrink-0" />
            <span>Database status: connected. All systems clear.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
