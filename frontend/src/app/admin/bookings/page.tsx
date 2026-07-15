"use client";

import React, { useState, useEffect } from "react";
import API from "@/utils/api";
import {
  Search,
  Filter,
  FileSpreadsheet,
  XCircle,
  CheckCircle,
  Eye,
  ArrowRight,
  TrendingDown,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected details modal
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings");
      setBookings(res.data || []);
      setFilteredBookings(res.data || []);
    } catch (err) {
      console.error("Failed to query bookings list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter application log
  useEffect(() => {
    let result = bookings;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(term) ||
          b.name.toLowerCase().includes(term) ||
          b.user_email.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((b) => b.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(result);
  }, [searchTerm, typeFilter, statusFilter, bookings]);

  // Cancel reservation Action
  const handleCancelBooking = async (id: string) => {
    if (confirm(`Are you sure you want to cancel booking ${id}?`)) {
      try {
        await API.post(`/bookings/cancel/${id}`);
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev: any) => ({ ...prev, status: "Cancelled" }));
        }
      } catch (err) {
        alert("Failed to cancel booking. Try again later.");
      }
    }
  };

  // Confirm booking Action
  const handleConfirmBooking = async (id: string) => {
    try {
      // Simulate state update if needed or run API check
      alert(`Booking ${id} set to confirmed status.`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/export/bookings`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">
            Reservations Flight Deck
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            View passenger manifests, modify status parameters, and export logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredBookings.length === 0}
          className="py-2 px-4 rounded border border-white/10 bg-white/2 hover:bg-gold hover:text-black font-space text-[10px] font-bold text-white transition-all cursor-pointer flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV Sheet
        </button>
      </div>

      {/* 1. FILTER CONTROLS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0b0f19] p-4 rounded-lg border border-white/5 font-space text-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-grey-text" />
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#030712] border border-white/10 rounded pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-grey-text shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#030712] border border-white/10 rounded px-2.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Flight Types</option>
            <option value="helicopter">Helicopter Charter</option>
            <option value="package">Tour Package</option>
            <option value="hotel">Hotels & Retreats</option>
            <option value="boat">Yacht Charters</option>
          </select>
        </div>

        {/* Filter Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-[#030712] border border-white/10 rounded px-2.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
        >
          <option value="all">All Booking Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* 2. BOOKINGS DATA GRID */}
      <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 font-luxury text-xs text-grey-text">
            Syncing live database manifests...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 font-luxury text-xs text-grey-text">
            No flight bookings records found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-luxury text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 font-space text-[10px] text-grey-text uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Guest Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Flight / Package</th>
                  <th className="p-4">Departure</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/1 transition-all text-grey-text hover:text-white">
                    <td className="p-4 font-mono font-bold text-white text-[10px]">
                      {b.id}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{b.user_email}</span>
                        <span className="text-[9px] opacity-70">Client Profile</span>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[9px] font-space tracking-wider">
                      {b.type}
                    </td>
                    <td className="p-4 font-medium text-white max-w-44 truncate">
                      {b.name}
                    </td>
                    <td className="p-4 font-mono text-[10px]">
                      {b.date || "N/A"}
                    </td>
                    <td className="p-4 font-mono font-semibold text-gold">
                      ₹{Number(b.price).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[9px] font-space font-bold uppercase px-2 py-0.5 rounded ${
                          b.status === "Confirmed"
                            ? "bg-teal/5 text-teal border border-teal/15"
                            : b.status === "Cancelled"
                            ? "bg-red-400/5 text-red-400 border border-red-400/15"
                            : "bg-yellow-400/5 text-yellow-400 border border-yellow-400/15"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded bg-white/2 hover:bg-white/5 border border-white/5 text-white cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {b.status !== "Cancelled" && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-1.5 rounded bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 text-red-400 cursor-pointer"
                          title="Cancel flight"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. DETAILS DRAWER / MODAL OVERLAY */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-xl border border-white/10 w-full max-w-lg p-6 flex flex-col gap-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] font-space text-gold uppercase tracking-widest font-bold">
                    Reservation Details
                  </span>
                  <h3 className="font-space text-base font-bold text-white mt-1">
                    Flight ID: {selectedBooking.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-grey-text hover:text-white font-space font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Booking properties list */}
              <div className="flex flex-col gap-4 font-luxury text-xs text-grey-text">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-space uppercase block">Client email</span>
                    <span className="text-white font-medium">{selectedBooking.user_email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-space uppercase block">Service Type</span>
                    <span className="text-white uppercase font-space font-bold tracking-wider">
                      {selectedBooking.type}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-space uppercase block">Charter Flight Name</span>
                  <span className="text-white font-medium">{selectedBooking.name}</span>
                </div>

                <div>
                  <span className="text-[9px] font-space uppercase block">Flight Details</span>
                  <p className="text-white font-medium bg-[#030712] p-2.5 rounded border border-white/5 mt-1 leading-relaxed">
                    {selectedBooking.details || "No custom route details provided."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[9px] font-space uppercase block">Departure</span>
                    <span className="text-white font-mono">{selectedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-space uppercase block">Passengers</span>
                    <span className="text-white font-medium">{selectedBooking.passengers} Cabin</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-space uppercase block">Income</span>
                    <span className="text-gold font-mono font-bold">
                      ₹{Number(selectedBooking.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                <button
                  onClick={() => {
                    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings/invoice/${selectedBooking.id}`, "_blank");
                  }}
                  className="py-2 px-4 rounded border border-white/10 bg-white/2 hover:bg-white/5 font-space text-[10px] font-bold text-white transition-all cursor-pointer flex items-center gap-2 uppercase tracking-widest"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Receipt
                </button>

                <div className="flex gap-2">
                  {selectedBooking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      className="py-2 px-4 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-space text-[10px] font-bold uppercase tracking-widest rounded cursor-pointer transition-all"
                    >
                      Cancel Flight
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="py-2 px-4 bg-gold hover:bg-gold/90 text-black font-space text-[10px] font-bold uppercase tracking-widest rounded cursor-pointer transition-all shadow-md shadow-gold/10"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
