"use client";

import React, { useState } from "react";
import { Settings, Shield, CreditCard, Mail, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [activeSubTab, setActiveSubTab] = useState<"gateway" | "company" | "smtp">("gateway");
  const [savedStatus, setSavedStatus] = useState(false);

  // Settings states
  const [settings, setSettings] = useState({
    companyName: "AURA Luxury Aviation",
    gstPercentage: 18,
    currencySymbol: "INR (₹)",
    activeGateway: "AURA Elite Simulator",
    smtpUser: "operations@auratravels.com",
    smtpHost: "smtp.gmail.com"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Settings className="h-5 w-5 text-gold" />
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">
            Portal Control Settings
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Configure system payment credentials, tax rates, and operations profiles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left tabs selector */}
        <div className="lg:col-span-3 flex flex-col gap-2 font-space text-xs">
          {[
            { id: "gateway", name: "Billing & Gateway", icon: CreditCard },
            { id: "company", name: "Company Profile", icon: Settings },
            { id: "smtp", name: "SMTP Notifications", icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`w-full text-left py-3 px-4 rounded transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? "bg-gold text-black font-bold"
                    : "text-grey-text hover:text-white hover:bg-white/2"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right configuration forms */}
        <form onSubmit={handleSave} className="lg:col-span-9 glass-card rounded-xl p-6 md:p-8 border border-white/8 flex flex-col gap-6">
          {savedStatus && (
            <div className="bg-teal/10 border border-teal/20 text-teal text-xs px-3.5 py-2.5 rounded flex items-center gap-2">
              <Check className="h-4 w-4 animate-pulse" />
              <span>Configurations updated and synchronized successfully!</span>
            </div>
          )}

          {activeSubTab === "gateway" && (
            <div className="flex flex-col gap-5">
              <h3 className="font-space text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-2 text-white">
                Billing & Gateway Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-luxury text-xs text-grey-text">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">Active Gateway Selector</label>
                  <select
                    value={settings.activeGateway}
                    onChange={(e) => setSettings({ ...settings, activeGateway: e.target.value })}
                    className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2.5 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="AURA Elite Simulator">AURA Elite Gateway Simulator</option>
                    <option value="Stripe Business">Stripe Business Checkout</option>
                    <option value="Razorpay VIP">Razorpay Professional Routing</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">Operational GST / VAT (%)</label>
                  <input
                    type="number"
                    value={settings.gstPercentage}
                    onChange={(e) => setSettings({ ...settings, gstPercentage: Number(e.target.value) })}
                    className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">Corporate Currency</label>
                  <input
                    type="text"
                    disabled
                    value={settings.currencySymbol}
                    className="w-full bg-[#030712]/50 border border-white/10 rounded px-3 py-2.5 text-grey-text cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "company" && (
            <div className="flex flex-col gap-5">
              <h3 className="font-space text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-2 text-white">
                Operations Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-luxury text-xs text-grey-text">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">Corporate Registration ID</label>
                  <input
                    type="text"
                    disabled
                    value="CIN U62200DL2026PTC390901"
                    className="w-full bg-[#030712]/50 border border-white/10 rounded px-3 py-2.5 text-grey-text opacity-60"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "smtp" && (
            <div className="flex flex-col gap-5">
              <h3 className="font-space text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-2 text-white">
                SMTP Notification Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-luxury text-xs text-grey-text">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">SMTP User</label>
                  <input
                    type="email"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-space uppercase">SMTP Host Address</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-gold hover:bg-gold/90 text-black rounded font-space font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-gold/10 cursor-pointer self-start mt-4"
          >
            Apply Configurations
          </button>
        </form>
      </div>
    </div>
  );
}
