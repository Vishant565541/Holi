"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  PlaneTakeoff,
  Map,
  Hotel,
  Ship,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Menu
} from "lucide-react";

// ── Admin credentials ─────────────────────────────────────────────────────────
const ADMIN_EMAIL = "sentavishant5655@gmail.com";
const ADMIN_PASS  = "vishant@5655";
const SESSION_KEY = "roman_admin_auth";

// ── Admin Login Gate ──────────────────────────────────────────────────────────
function AdminLoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      if (
        (normalizedEmail === "sentavishatj@gmail.com" || 
         normalizedEmail === "sentavishantj@gmail.com" || 
         normalizedEmail === "sentavishant5655@gmail.com") &&
        pass === ADMIN_PASS
      ) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onSuccess();
      } else {
        setError("Invalid admin credentials. Access denied.");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        {/* Brand block */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gold/10 border-2 border-gold/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-gold" />
          </div>
          <span className="text-[9px] font-space uppercase tracking-[0.3em] text-gold/50 font-bold">Roman Aviation</span>
          <h1 className="font-space text-2xl font-bold text-white mt-1">Admin Access</h1>
          <p className="font-luxury text-xs text-grey-text mt-1">Control Centre · Authorised personnel only</p>
        </div>

        <form onSubmit={handleSubmit}
          className="glass-card rounded-2xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl bg-[#0b0f19]/80 backdrop-blur-md">

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-space uppercase tracking-widest text-gold/70 font-bold">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/30" />
              <input type="email" required autoComplete="username" placeholder="admin@roman.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors placeholder-white/20 font-luxury" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-space uppercase tracking-widest text-gold/70 font-bold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/30" />
              <input type={showPass ? "text" : "password"} required autoComplete="current-password"
                placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors placeholder-white/20 font-luxury" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-text hover:text-white cursor-pointer transition-colors">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
            {loading
              ? <><span className="w-4 h-4 border-2 border-black/40 border-t-transparent rounded-full animate-spin" />Verifying…</>
              : <><ShieldCheck className="h-4 w-4" />Access Control Centre</>}
          </button>
        </form>

        <p className="text-center text-[9px] text-grey-text/30 font-luxury mt-4">
          Session expires when browser tab is closed.
        </p>
      </motion.div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [adminAuthed, setAdminAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAdminAuthed(true);
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings Log", href: "/admin/bookings", icon: CalendarDays },
    { name: "Helicopters Fleet", href: "/admin/helicopters", icon: PlaneTakeoff },
    { name: "Tour Packages", href: "/admin/tours", icon: Map },
    { name: "Hotels & Lodges", href: "/admin/hotels", icon: Hotel },
    { name: "Boat Charters", href: "/admin/boats", icon: Ship },
    { name: "Careers Applications", href: "/admin/careers", icon: Briefcase },
    { name: "Registered Users", href: "/admin/users", icon: Users },
    { name: "Portal Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    logout();
    router.push("/");
  };

  const getPageTitle = () => {
    const active = menuItems.find((item) => item.href === pathname);
    return active ? active.name : "Super Admin Panel";
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white font-space text-xs">
        <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" />
        INITIALIZING CONSOLE...
      </div>
    );
  }

  if (!adminAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AdminLoginGate onSuccess={() => setAdminAuthed(true)} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-luxury overflow-hidden relative">
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* 1. COLLAPSIBLE SIDEBAR */}
      <aside
        className={`bg-[#0b0f19] border-r border-white/5 flex flex-col justify-between transition-all duration-300 fixed lg:relative top-0 bottom-0 left-0 z-30 shrink-0 text-white h-screen lg:h-auto ${
          collapsed ? "w-16" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Toggle arrow button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-gold border border-gold/30 flex items-center justify-center text-black cursor-pointer shadow-lg hover:scale-105 transition-all hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Brand header */}
        <div className="p-4 flex items-center justify-center border-b border-white/5 overflow-hidden">
          <img 
            src="/logo.png" 
            alt="Roman Aviation" 
            className={`h-9 w-auto object-contain transition-all ${collapsed ? "max-w-[40px]" : "max-w-[180px]"}`} 
          />
        </div>

        {/* Menu Navigation items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1.5 font-space text-xs">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3 px-3.5 rounded transition-all ${
                  isActive
                    ? "bg-gold text-black font-bold shadow-md"
                    : "text-grey-text hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer log out action */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full text-left py-3 px-3.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-all font-space text-xs flex items-center gap-3 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Exit Dashboard</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN PANELS VIEWPORT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-20">
          {/* Left: Section title */}
          <div className="flex items-center gap-3 text-xs">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-white hover:text-gold transition-colors focus:outline-none"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-grey-text uppercase tracking-widest hidden sm:inline">Portal Console</span>
            <span className="text-white/20 hidden sm:inline">/</span>
            <h1 className="font-space font-bold text-white uppercase tracking-wider text-[11px]">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 relative">
            {/* Direct return back to customer site link */}
            <Link
              href="/"
              className="px-3 py-1.5 border border-white/10 hover:border-gold/30 text-grey-text hover:text-white rounded text-[10px] uppercase font-space font-semibold tracking-wider transition-all"
            >
              Public Website
            </Link>

            {/* Notifications Popover trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-8 w-8 rounded-full border border-white/5 bg-white/2 hover:bg-white/5 flex items-center justify-center text-grey-text hover:text-white transition-all cursor-pointer relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-gold" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-card border border-white/10 rounded-lg shadow-2xl p-4 flex flex-col gap-3 z-50">
                  <h3 className="font-space text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2 text-gold">
                    Recent System Actions
                  </h3>
                  <div className="flex flex-col gap-2.5 font-luxury text-[10px] text-grey-text">
                    <div className="border-b border-white/5 pb-2">
                      <p className="text-white font-medium">New helicopter booking BK-4491 logs</p>
                      <span>2 minutes ago</span>
                    </div>
                    <div className="border-b border-white/5 pb-2">
                      <p className="text-white font-medium">Career application logged for Turbine Pilot</p>
                      <span>15 minutes ago</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">PostgreSQL initialized tables successfully</p>
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Details */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/5">
              <div className="h-7 w-7 rounded-full bg-gold text-black font-space font-bold text-xs flex items-center justify-center">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-space font-bold leading-none text-white">Super Admin</p>
                <span className="text-[9px] text-grey-text uppercase tracking-wider mt-0.5 block">
                  Roman Executive
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content canvas container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background relative">
          {/* Subtle global particle ambient background light glow */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

          {children}
        </main>
      </div>
    </div>
  );
}
