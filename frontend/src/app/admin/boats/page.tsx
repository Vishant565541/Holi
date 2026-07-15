"use client";

import React, { useState, useEffect } from "react";
import API from "@/utils/api";
import {
  Ship,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BoatItem {
  id: string;
  name: string;
  type: string;
  capacity: string;
  price: number;
  image: string;
  schedules: string[];
  description: string;
}

export default function AdminBoats() {
  const [boats, setBoats] = useState<BoatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [createdStatus, setCreatedStatus] = useState(false);

  const [newBoat, setNewBoat] = useState({
    id: "",
    name: "",
    type: "",
    capacity: "",
    price: 50000,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
    schedulesInput: "10:00 AM, 02:30 PM, 05:30 PM",
    description: ""
  });

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/boats");
      setBoats(res.data || []);
    } catch (err: any) {
      setError("Failed to query boats database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoats();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoat.id || !newBoat.name) {
      setError("Please fill out all required properties.");
      return;
    }

    try {
      setError("");
      const payload = {
        ...newBoat,
        price: Number(newBoat.price),
        schedules: newBoat.schedulesInput.split(",").map((f) => f.trim()),
      };

      await API.post("/boats", payload);
      setCreatedStatus(true);
      fetchBoats();

      setNewBoat({
        id: "",
        name: "",
        type: "",
        capacity: "",
        price: 50000,
        image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
        schedulesInput: "10:00 AM, 02:30 PM, 05:30 PM",
        description: ""
      });

      setTimeout(() => {
        setCreatedStatus(false);
        setShowAddForm(false);
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create boat.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Remove boat ${id}?`)) {
      try {
        await API.delete(`/boats/${id}`);
        fetchBoats();
      } catch (err) {
        console.error("Failed to delete boat:", err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">
            Yacht & Marine Operations
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Configure catamaran models, cruise timetables, passenger thresholds, and charter rates.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2.5 px-4 rounded bg-gold hover:bg-gold/95 text-black font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Marine Vessel
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded p-3 font-luxury text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {createdStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded p-3 font-luxury text-xs text-emerald-400"
        >
          <CheckCircle className="h-4 w-4 shrink-0" />
          Marine vessel created and saved to database.
        </motion.div>
      )}

      {/* Add Boat Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="glass-card rounded-xl border border-gold/20 p-6 flex flex-col gap-4 overflow-hidden"
          >
            <h3 className="font-space text-sm font-bold text-gold uppercase tracking-wider">New Marine Vessel</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Boat ID *", key: "id", placeholder: "b-10" },
                { label: "Boat Name *", key: "name", placeholder: "Royal Yacht Elite" },
                { label: "Type", key: "type", placeholder: "Catamaran Yacht" },
                { label: "Capacity", key: "capacity", placeholder: "12 Guests Max" },
                { label: "Hourly Rate (₹)", key: "price", placeholder: "85000", type: "number" },
                { label: "Image URL", key: "image", placeholder: "https://..." },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    value={(newBoat as any)[field.key]}
                    onChange={(e) => setNewBoat({ ...newBoat, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="bg-[#030712] border border-white/10 rounded px-3 py-2 text-xs text-white font-luxury placeholder:text-grey-text/40 focus:border-gold/50 outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Schedules (comma separated)</label>
              <input
                type="text"
                value={newBoat.schedulesInput}
                onChange={(e) => setNewBoat({ ...newBoat, schedulesInput: e.target.value })}
                className="bg-[#030712] border border-white/10 rounded px-3 py-2 text-xs text-white font-luxury placeholder:text-grey-text/40 focus:border-gold/50 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Description</label>
              <textarea
                value={newBoat.description}
                onChange={(e) => setNewBoat({ ...newBoat, description: e.target.value })}
                rows={2}
                className="bg-[#030712] border border-white/10 rounded px-3 py-2 text-xs text-white font-luxury placeholder:text-grey-text/40 focus:border-gold/50 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="self-start py-2.5 px-6 bg-gold hover:bg-gold/90 text-black font-space text-[10px] font-bold uppercase tracking-widest rounded cursor-pointer transition-all"
            >
              Save Vessel to Database
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-xs text-grey-text font-luxury">
          <RefreshCw className="h-5 w-5 animate-spin text-gold mx-auto mb-2" />
          Loading marine fleet...
        </div>
      )}

      {/* Boats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boats.map((boat) => (
          <div key={boat.id} className="glass-card rounded-xl border border-white/8 overflow-hidden flex flex-col justify-between">
            <div className="h-44 w-full relative overflow-hidden">
              <img
                src={boat.image}
                alt={boat.name}
                className="w-full h-full object-cover opacity-85"
              />
              <span className="absolute top-3 left-3 bg-[#030712]/80 border border-white/10 px-2.5 py-0.5 rounded font-mono font-bold text-[9px] text-gold uppercase">
                {boat.id}
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="font-space text-base font-bold text-white leading-tight">{boat.name}</h3>
                <span className="font-luxury text-[10px] text-grey-text mt-1.5 block">{boat.type} • {boat.capacity}</span>
              </div>

              {/* Schedules */}
              <div className="flex flex-wrap gap-1.5 mt-1 font-space text-[9px]">
                {(boat.schedules || []).map((time: string, i: number) => (
                  <span key={i} className="bg-white/2 border border-white/5 text-grey-text px-2 py-0.5 rounded">
                    {time}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <span className="text-[8px] uppercase text-grey-text block">Hourly Yacht Rate</span>
                  <span className="font-space font-bold text-gold text-sm">
                    ₹{Number(boat.price).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert("Editing boat details...")}
                    className="p-2 bg-white/2 hover:bg-white/5 border border-white/10 rounded cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-grey-text hover:text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(boat.id)}
                    className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
