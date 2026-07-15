"use client";

import React, { useState, useEffect, useRef } from "react";
import API from "@/utils/api";
import {
  Map, Plus, Trash2, Edit2, CheckCircle, Upload, ImageIcon,
  ChevronDown, ChevronUp, X, Sparkles, Calendar, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────
interface DayEntry {
  day: number;
  title: string;
  desc: string;
  stay: string;
  transport: string;
}

interface TourPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  rating: string;
  image: string;
  tag: string;
  description: string;
  tagline?: string;
  itinerary: DayEntry[];
  inclusions: string[];
  exclusions: string[];
}

const BLANK_DAY = (): DayEntry => ({
  day: 1, title: "", desc: "", stay: "Luxury Lodge", transport: "Airbus H145"
});

const INPUT_CLS =
  "w-full bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs font-space focus:outline-none focus:border-gold/40 transition-colors placeholder-white/20";

const LABEL_CLS = "text-[9px] font-space uppercase tracking-widest text-gold/80 font-bold mb-1 block";

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminTours() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    id: "",
    name: "",
    tagline: "",
    duration: "2 Nights / 3 Days",
    price: 180000,
    rating: "4.8",
    tag: "VIP Expedition",
    image: "",
    inclusions: ["VIP Priority Access", "Bespoke high-altitude catering"],
    exclusions: ["Personal offerings at temple"],
  });
  const [days, setDays] = useState<DayEntry[]>([{ ...BLANK_DAY() }]);

  // ── Fetch tours ──────────────────────────────────────────────────────────────
  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tours");
      const mapped = (res.data || []).map((t: any) => ({
        ...t,
        description: t.tagline || t.description || "",
        itinerary: Array.isArray(t.itinerary) ? t.itinerary : [],
        inclusions: Array.isArray(t.inclusions) ? t.inclusions : [],
        exclusions: Array.isArray(t.exclusions) ? t.exclusions : [],
      }));
      setTours(mapped);
    } catch (e) {
      console.error("Failed to load tours:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  // ── Auto-number on open ──────────────────────────────────────────────────────
  const openModal = () => {
    const nextNum = tours.length + 1;
    const nextId = `p-${nextNum}`;
    setForm({
      id: nextId,
      name: "",
      tagline: "",
      duration: "2 Nights / 3 Days",
      price: 180000,
      rating: "4.8",
      tag: "VIP Expedition",
      image: "",
      inclusions: ["VIP Priority Access", "Bespoke high-altitude catering"],
      exclusions: ["Personal offerings at temple"],
    });
    setDays([{ day: 1, title: "", desc: "", stay: "Luxury Lodge", transport: "Airbus H145" }]);
    setImagePreview("");
    setSavedOk(false);
    setShowModal(true);
  };

  // ── Image upload ─────────────────────────────────────────────────────────────
  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);

    // Local preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      const res = await API.post("/storage/upload", {
        file: base64,
        fileName: file.name,
        folder: "tours",
      });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch (err) {
      console.error("Image upload failed:", err);
      // fallback: use local base64 preview as image src
      setForm((f) => ({ ...f, image: imagePreview }));
    } finally {
      setImageUploading(false);
    }
  };

  // ── Day helpers ──────────────────────────────────────────────────────────────
  const addDay = () => {
    setDays((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", desc: "", stay: "Luxury Lodge", transport: "Airbus H145" },
    ]);
  };

  const removeDay = (idx: number) => {
    setDays((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((d, i) => ({ ...d, day: i + 1 }))
    );
  };

  const updateDay = (idx: number, field: keyof DayEntry, val: string) => {
    setDays((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: field === "day" ? Number(val) : val };
      return next;
    });
  };

  // ── Inclusion/Exclusion helpers ──────────────────────────────────────────────
  const updateListItem = (key: "inclusions" | "exclusions", idx: number, val: string) => {
    setForm((f) => {
      const arr = [...f[key]];
      arr[idx] = val;
      return { ...f, [key]: arr };
    });
  };

  const addListItem = (key: "inclusions" | "exclusions") => {
    setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  };

  const removeListItem = (key: "inclusions" | "exclusions", idx: number) => {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.price) return;
    setSaving(true);

    const payload = {
      id: form.id,
      name: form.name,
      tagline: form.tagline,
      duration: form.duration,
      price: Number(form.price),
      rating: Number(form.rating) || 4.8,
      image: form.image || imagePreview || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600",
      tag: form.tag,
      inclusions: form.inclusions.filter((i) => i.trim()),
      exclusions: form.exclusions.filter((e) => e.trim()),
      itinerary: days.map((d) => ({
        day: d.day,
        title: d.title.trim() || `Day ${d.day}`,
        desc: d.desc.trim(),
        stay: d.stay.trim() || "Luxury Lodge",
        transport: d.transport.trim() || "Airbus H145",
      })),
    };

    try {
      await API.post("/tours", payload);
      setSavedOk(true);
      fetchTours();
      setTimeout(() => { setSavedOk(false); setShowModal(false); }, 1600);
    } catch (err) {
      console.error("Failed to create tour:", err);
      alert("Failed to save tour package to database.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm(`Remove package ${id}?`)) return;
    try {
      await API.delete(`/tours/${id}`);
      fetchTours();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">
            Tour Package Configurator
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Configure luxury multi-day itineraries, define package rates, and manage all tour packages.
          </p>
        </div>
        <button
          onClick={openModal}
          className="py-2.5 px-4 rounded bg-gold hover:bg-gold/90 text-black font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </button>
      </div>

      {/* ─── Create Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.form
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl border border-white/10 w-full max-w-3xl shadow-2xl flex flex-col my-4"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <h3 className="font-space text-base font-bold text-white">Create Tour Package</h3>
                  <span className="ml-2 px-2 py-0.5 bg-gold/10 border border-gold/20 rounded text-gold font-mono text-[10px] font-bold">
                    #{form.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex flex-col gap-6 px-6 py-5 overflow-y-auto max-h-[75vh]">

                {savedOk && (
                  <div className="bg-teal/10 border border-teal/20 text-teal text-xs px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 animate-bounce" />
                    Tour package saved successfully!
                  </div>
                )}

                {/* ── Section 1: Core Details ─────────────────────────────── */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold mb-3">
                    § 1 — Core Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Package ID (auto, readonly) */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Package ID (auto-assigned)</label>
                      <input
                        type="text"
                        readOnly
                        value={form.id}
                        className={INPUT_CLS + " opacity-50 cursor-not-allowed"}
                      />
                    </div>

                    {/* Package Name */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Package Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Himalayan Sacred Peaks Pilgrimage"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* Tagline */}
                    <div className="flex flex-col md:col-span-2">
                      <label className={LABEL_CLS}>Tagline / Short Description</label>
                      <input
                        type="text"
                        placeholder="e.g. A sacred aerial pilgrimage through the Himalayas"
                        value={form.tagline}
                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Days / 2 Nights"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Price Rate (₹) *</label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* Category Tag */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Category Tag</label>
                      <select
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        className={INPUT_CLS + " cursor-pointer"}
                      >
                        {["VIP Expedition", "Spiritual Journey", "Beach Escape", "Heli Safari", "Corporate Retreat", "Honeymoon Special"].map((t) => (
                          <option key={t} value={t} className="bg-[#030712]">{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Star Rating (1–5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min={1}
                        max={5}
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Package Image ────────────────────────────── */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold mb-3">
                    § 2 — Package Image
                  </p>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="relative group border-2 border-dashed border-white/15 hover:border-gold/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 h-44"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Upload className="h-5 w-5 text-white" />
                          <span className="text-white text-xs font-space font-bold">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-grey-text">
                        <ImageIcon className="h-10 w-10 text-white/15" />
                        <div className="text-center">
                          <p className="text-xs font-space font-bold text-white/40 group-hover:text-gold transition-colors">
                            {imageUploading ? "Uploading…" : "Click to upload package image"}
                          </p>
                          <p className="text-[9px] text-white/20 mt-1">JPG, PNG, WEBP · Max 5MB</p>
                        </div>
                      </div>
                    )}
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImagePick}
                    className="hidden"
                  />
                  {form.image && (
                    <p className="text-[9px] text-teal mt-1.5 truncate">
                      ✓ Uploaded: {form.image.slice(0, 60)}…
                    </p>
                  )}
                </div>

                {/* ── Section 3: Day-Wise Itinerary ──────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold">
                      § 3 — Day-Wise Itinerary ({days.length} {days.length === 1 ? "Day" : "Days"})
                    </p>
                    <button
                      type="button"
                      onClick={addDay}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-lg text-[9px] font-space font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Day
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {days.map((day, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#030712] border border-white/8 rounded-xl p-4 flex flex-col gap-3"
                      >
                        {/* Day header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 bg-gold/15 border border-gold/25 rounded-full flex items-center justify-center text-gold font-mono text-[10px] font-bold shrink-0">
                              {day.day}
                            </span>
                            <span className="font-space text-[11px] font-bold text-white uppercase tracking-wider">
                              Day {day.day}
                            </span>
                          </div>
                          {days.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDay(idx)}
                              className="p-1.5 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3 text-red-400" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Title */}
                          <div className="flex flex-col">
                            <label className={LABEL_CLS}>Day Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Arrival & Heli Transfer"
                              value={day.title}
                              onChange={(e) => updateDay(idx, "title", e.target.value)}
                              className={INPUT_CLS}
                            />
                          </div>

                          {/* Stay */}
                          <div className="flex flex-col">
                            <label className={LABEL_CLS}>Overnight Stay</label>
                            <input
                              type="text"
                              placeholder="e.g. Luxury Lodge"
                              value={day.stay}
                              onChange={(e) => updateDay(idx, "stay", e.target.value)}
                              className={INPUT_CLS}
                            />
                          </div>

                          {/* Description */}
                          <div className="flex flex-col md:col-span-2">
                            <label className={LABEL_CLS}>Day Description</label>
                            <textarea
                              rows={2}
                              placeholder="Detailed activities and experiences for this day…"
                              value={day.desc}
                              onChange={(e) => updateDay(idx, "desc", e.target.value)}
                              className={INPUT_CLS + " resize-none"}
                            />
                          </div>

                          {/* Transport */}
                          <div className="flex flex-col">
                            <label className={LABEL_CLS}>Mode of Transport</label>
                            <select
                              value={day.transport}
                              onChange={(e) => updateDay(idx, "transport", e.target.value)}
                              className={INPUT_CLS + " cursor-pointer"}
                            >
                              {["Airbus H145", "Bell 407", "Private Helicopter", "Luxury SUV", "Yacht Transfer", "On Foot / Doli"].map((t) => (
                                <option key={t} value={t} className="bg-[#030712]">{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── Section 4: Inclusions & Exclusions ─────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Inclusions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold">
                        § 4A — Inclusions
                      </p>
                      <button type="button" onClick={() => addListItem("inclusions")}
                        className="text-[9px] text-gold hover:text-white font-space font-bold flex items-center gap-1 cursor-pointer transition-colors">
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {form.inclusions.map((inc, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                          <input
                            type="text"
                            value={inc}
                            placeholder="e.g. Helicopter transfers"
                            onChange={(e) => updateListItem("inclusions", i, e.target.value)}
                            className={INPUT_CLS + " flex-1"}
                          />
                          <button type="button" onClick={() => removeListItem("inclusions", i)}
                            className="text-red-400/60 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold">
                        § 4B — Exclusions
                      </p>
                      <button type="button" onClick={() => addListItem("exclusions")}
                        className="text-[9px] text-gold hover:text-white font-space font-bold flex items-center gap-1 cursor-pointer transition-colors">
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {form.exclusions.map((exc, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400/60 shrink-0" />
                          <input
                            type="text"
                            value={exc}
                            placeholder="e.g. Personal expenses"
                            onChange={(e) => updateListItem("exclusions", i, e.target.value)}
                            className={INPUT_CLS + " flex-1"}
                          />
                          <button type="button" onClick={() => removeListItem("exclusions", i)}
                            className="text-red-400/60 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>{/* end scrollable body */}

              {/* Modal footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/8 bg-white/1 rounded-b-2xl">
                <span className="text-[9px] text-grey-text font-luxury">
                  {days.length} day{days.length !== 1 ? "s" : ""} · {form.inclusions.filter(Boolean).length} inclusions · {form.exclusions.filter(Boolean).length} exclusions
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-white/3 hover:bg-white/8 border border-white/10 text-white rounded-lg font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2 px-6 bg-gold hover:bg-gold/90 text-black rounded-lg font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving ? (
                      <><div className="w-3.5 h-3.5 border-2 border-black/40 border-t-transparent rounded-full animate-spin" /> Saving…</>
                    ) : (
                      <>Create Package</>
                    )}
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Tours Grid ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-xl border border-white/8 h-72 animate-pulse bg-white/2" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="glass-card rounded-xl border border-white/8 overflow-hidden flex flex-col">
              <div className="h-48 w-full relative overflow-hidden">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover opacity-80" />
                <span className="absolute top-3 left-3 bg-[#030712]/80 border border-white/10 px-2 py-0.5 rounded font-mono font-bold text-[9px] text-gold uppercase">
                  {tour.tag}
                </span>
                <span className="absolute top-3 right-3 bg-[#030712]/80 border border-white/10 px-2 py-0.5 rounded font-mono font-bold text-[9px] text-white">
                  {tour.id}
                </span>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#030712]/80 border border-gold/20 px-2 py-0.5 rounded">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  <span className="text-gold font-mono text-[9px] font-bold">{tour.rating}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-space text-base font-bold text-white leading-tight">{tour.name}</h3>
                  <span className="font-luxury text-[10px] text-grey-text mt-1 block">
                    {tour.duration} · {(tour.itinerary || []).length} planned days
                  </span>
                </div>

                <p className="font-luxury text-xs text-grey-text leading-relaxed line-clamp-2">
                  {tour.description || tour.tagline}
                </p>

                {/* Itinerary preview */}
                <div className="flex flex-col gap-1.5 bg-[#030712]/50 p-3 rounded-lg border border-white/5 font-luxury text-[10px] text-grey-text">
                  <span className="font-space text-[9px] text-gold uppercase tracking-wider block font-bold mb-0.5">
                    Itinerary Preview
                  </span>
                  {(tour.itinerary || []).slice(0, 3).map((step, i) => {
                    const title = typeof step === "object" ? (step.title || step.desc || "") : step;
                    return (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="h-4 w-4 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold font-mono text-[8px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="line-clamp-1">{title}</p>
                      </div>
                    );
                  })}
                  {(tour.itinerary || []).length > 3 && (
                    <p className="text-white/30 text-[9px] pl-6">+{tour.itinerary.length - 3} more days…</p>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-auto">
                  <div>
                    <span className="text-[8px] uppercase text-grey-text block">Package Price</span>
                    <span className="font-space font-bold text-gold text-sm">
                      ₹{Number(tour.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Editing ${tour.id} — edit modal coming soon.`)}
                      className="p-2 bg-white/2 hover:bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-grey-text hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {tours.length === 0 && !loading && (
            <div className="md:col-span-2 flex flex-col items-center justify-center py-20 gap-3 text-grey-text border border-white/5 rounded-xl bg-white/1">
              <Map className="h-10 w-10 text-white/10" />
              <p className="font-space text-xs uppercase tracking-wider">No tour packages yet</p>
              <button onClick={openModal} className="mt-2 py-2 px-4 bg-gold text-black rounded font-space text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                Create First Package
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
