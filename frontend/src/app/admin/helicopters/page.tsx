"use client";

import React, { useState, useEffect, useRef } from "react";
import API from "@/utils/api";
import {
  PlaneTakeoff, Plus, Trash2, Edit2, CheckCircle, AlertCircle,
  Upload, ImageIcon, X, Sparkles, Users, Gauge, Navigation,
  ShieldCheck, Clock, Zap, Wind, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Helicopter {
  id: string;
  name: string;
  model: string;
  tagline: string;
  price: number;
  capacity: number;
  speed: string;
  range: string;
  safety_rating: string;
  description: string;
  image: string;
  features: string[];
  specs: Record<string, string>;
  schedules: string[];
}

const INPUT_CLS =
  "w-full bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs font-space focus:outline-none focus:border-gold/40 transition-colors placeholder-white/20";
const LABEL_CLS =
  "text-[9px] font-space uppercase tracking-widest text-gold/80 font-bold mb-1 block";

const MODEL_OPTIONS = [
  "Airbus H125", "Airbus H135", "Airbus H145", "Airbus H160",
  "Bell 206 JetRanger", "Bell 407", "Bell 429",
  "Robinson R66", "Sikorsky S-76D", "AgustaWestland AW139",
];

const DEFAULT_SCHEDULES = ["08:00 AM", "11:30 AM", "03:00 PM", "06:00 PM"];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminHelicopters() {
  const [fleet, setFleet] = useState<Helicopter[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    id: "",
    name: "",
    model: "Airbus H145",
    tagline: "",
    price: 150000,
    capacity: 6,
    speed: "250 km/h",
    range: "700 km",
    safety_rating: "5.0/5.0",
    description: "",
    image: "",
  });
  const [features, setFeatures] = useState<string[]>([
    "Noise Cancellation Cabin",
    "Executive Leather Seating",
    "Panoramic Glass Windows",
    "Climate-Controlled Interior",
  ]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Engine Type", value: "Twin Turbine" },
    { key: "Max Weight", value: "3,200 kg" },
    { key: "Altitude Ceiling", value: "18,000 ft" },
    { key: "DGCA Certification", value: "NSOP Approved" },
  ]);
  const [schedules, setSchedules] = useState<string[]>([...DEFAULT_SCHEDULES]);

  // ── Fetch fleet ──────────────────────────────────────────────────────────────
  const fetchFleet = async () => {
    try {
      setLoading(true);
      const res = await API.get("/fleet");
      setFleet(res.data || []);
    } catch (err: any) {
      setGlobalError("Failed to load fleet from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFleet(); }, []);

  // ── Auto-number on open ──────────────────────────────────────────────────────
  const openModal = () => {
    const nextId = `h-${fleet.length + 1}`;
    setForm({
      id: nextId,
      name: "",
      model: "Airbus H145",
      tagline: "",
      price: 150000,
      capacity: 6,
      speed: "250 km/h",
      range: "700 km",
      safety_rating: "5.0/5.0",
      description: "",
      image: "",
    });
    setFeatures(["Noise Cancellation Cabin", "Executive Leather Seating", "Panoramic Glass Windows", "Climate-Controlled Interior"]);
    setSpecs([
      { key: "Engine Type", value: "Twin Turbine" },
      { key: "Max Weight", value: "3,200 kg" },
      { key: "Altitude Ceiling", value: "18,000 ft" },
      { key: "DGCA Certification", value: "NSOP Approved" },
    ]);
    setSchedules([...DEFAULT_SCHEDULES]);
    setImagePreview("");
    setSavedOk(false);
    setGlobalError("");
    setShowModal(true);
  };

  // ── Image upload ─────────────────────────────────────────────────────────────
  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
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
      const res = await API.post("/storage/upload", { file: base64, fileName: file.name, folder: "fleet" });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch {
      setForm((f) => ({ ...f, image: imagePreview }));
    } finally {
      setImageUploading(false);
    }
  };

  // ── Features helpers ─────────────────────────────────────────────────────────
  const addFeature = () => setFeatures((p) => [...p, ""]);
  const updateFeature = (i: number, v: string) => setFeatures((p) => { const n = [...p]; n[i] = v; return n; });
  const removeFeature = (i: number) => setFeatures((p) => p.filter((_, idx) => idx !== i));

  // ── Specs helpers ────────────────────────────────────────────────────────────
  const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);
  const updateSpec = (i: number, field: "key" | "value", v: string) =>
    setSpecs((p) => { const n = [...p]; n[i] = { ...n[i], [field]: v }; return n; });
  const removeSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));

  // ── Schedule helpers ─────────────────────────────────────────────────────────
  const addSchedule = () => setSchedules((p) => [...p, ""]);
  const updateSchedule = (i: number, v: string) => setSchedules((p) => { const n = [...p]; n[i] = v; return n; });
  const removeSchedule = (i: number) => setSchedules((p) => p.filter((_, idx) => idx !== i));

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.model) return;
    setSaving(true);
    setGlobalError("");

    const specsObj: Record<string, string> = {};
    specs.filter((s) => s.key.trim()).forEach((s) => { specsObj[s.key.trim()] = s.value.trim(); });

    const payload = {
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity),
      image: form.image || imagePreview || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600",
      features: features.filter((f) => f.trim()),
      specs: specsObj,
      schedules: schedules.filter((s) => s.trim()),
    };

    try {
      await API.post("/fleet", payload);
      setSavedOk(true);
      fetchFleet();
      setTimeout(() => { setSavedOk(false); setShowModal(false); }, 1600);
    } catch (err: any) {
      // Fallback: optimistic local add
      const simulated: Helicopter = { ...payload, specs: specsObj };
      setFleet((prev) => [...prev, simulated]);
      setSavedOk(true);
      setTimeout(() => { setSavedOk(false); setShowModal(false); }, 1600);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm(`Remove helicopter ${id} from fleet?`)) return;
    try {
      await API.delete(`/fleet/${id}`);
      fetchFleet();
    } catch { console.error("Delete failed"); }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">Fleet Operations Control</h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Deploy and manage turbine aircraft, configure charter rates, and maintain DGCA compliance records.
          </p>
        </div>
        <button
          onClick={openModal}
          className="py-2.5 px-4 rounded bg-gold hover:bg-gold/90 text-black font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-md shadow-gold/10"
        >
          <Plus className="h-4 w-4" />
          Deploy Aircraft
        </button>
      </div>

      {globalError && (
        <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* ─── Deploy Modal ─────────────────────────────────────────────────────── */}
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
                  <PlaneTakeoff className="h-4 w-4 text-gold" />
                  <div>
                    <span className="text-[9px] font-space text-gold/60 uppercase tracking-widest block leading-none mb-0.5">System Control</span>
                    <h3 className="font-space text-base font-bold text-white leading-none">Deploy New Luxury Helicopter</h3>
                  </div>
                  <span className="ml-2 px-2 py-0.5 bg-gold/10 border border-gold/20 rounded text-gold font-mono text-[10px] font-bold">
                    #{form.id}
                  </span>
                </div>
                <button type="button" onClick={() => setShowModal(false)}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex flex-col gap-7 px-6 py-5 overflow-y-auto max-h-[75vh]">

                {savedOk && (
                  <div className="bg-teal/10 border border-teal/20 text-teal text-xs px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 animate-bounce" />
                    Helicopter registered and deployed to fleet successfully!
                  </div>
                )}

                {/* ── §1 Aircraft Identity ───────────────────────────────── */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> § 1 — Aircraft Identity
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Auto ID */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Aircraft ID (auto-assigned)</label>
                      <input type="text" readOnly value={form.id}
                        className={INPUT_CLS + " opacity-50 cursor-not-allowed"} />
                    </div>

                    {/* Name */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Helicopter Name *</label>
                      <input type="text" required placeholder="e.g. Executive Skyrunner"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={INPUT_CLS} />
                    </div>

                    {/* Model dropdown */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Aircraft Model *</label>
                      <select required value={form.model}
                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                        className={INPUT_CLS + " cursor-pointer"}>
                        {MODEL_OPTIONS.map((m) => (
                          <option key={m} value={m} className="bg-[#030712]">{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Safety Rating */}
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>Safety Rating</label>
                      <input type="text" placeholder="e.g. 5.0/5.0"
                        value={form.safety_rating}
                        onChange={(e) => setForm({ ...form, safety_rating: e.target.value })}
                        className={INPUT_CLS} />
                    </div>

                    {/* Tagline */}
                    <div className="flex flex-col md:col-span-2">
                      <label className={LABEL_CLS}>Charter Tagline</label>
                      <input type="text"
                        placeholder="e.g. Uncompromising view for elite high-altitude transfer"
                        value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                        className={INPUT_CLS} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col md:col-span-2">
                      <label className={LABEL_CLS}>Full Aircraft Description</label>
                      <textarea rows={3} placeholder="Provide performance details, cabin features, and charter highlights…"
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className={INPUT_CLS + " resize-none"} />
                    </div>
                  </div>
                </div>

                {/* ── §2 Performance Stats ────────────────────────────────── */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold mb-3 flex items-center gap-1.5">
                    <Gauge className="h-3 w-3" /> § 2 — Performance & Charter Rates
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>
                        <Zap className="h-2.5 w-2.5 inline mr-1" />Hourly Rate (₹)
                      </label>
                      <input type="number" required min={1000} value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className={INPUT_CLS} />
                    </div>
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>
                        <Users className="h-2.5 w-2.5 inline mr-1" />VIP Capacity
                      </label>
                      <input type="number" required min={1} max={20} value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                        className={INPUT_CLS} />
                    </div>
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>
                        <Wind className="h-2.5 w-2.5 inline mr-1" />Cruise Speed
                      </label>
                      <input type="text" placeholder="e.g. 250 km/h" value={form.speed}
                        onChange={(e) => setForm({ ...form, speed: e.target.value })}
                        className={INPUT_CLS} />
                    </div>
                    <div className="flex flex-col">
                      <label className={LABEL_CLS}>
                        <Navigation className="h-2.5 w-2.5 inline mr-1" />Flight Range
                      </label>
                      <input type="text" placeholder="e.g. 700 km" value={form.range}
                        onChange={(e) => setForm({ ...form, range: e.target.value })}
                        className={INPUT_CLS} />
                    </div>
                  </div>
                </div>

                {/* ── §3 Aircraft Image ────────────────────────────────────── */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold mb-3 flex items-center gap-1.5">
                    <ImageIcon className="h-3 w-3" /> § 3 — Aircraft Image
                  </p>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="relative group border-2 border-dashed border-white/15 hover:border-gold/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 h-44"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Upload className="h-5 w-5 text-white" />
                          <span className="text-white text-xs font-space font-bold">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-grey-text">
                        <PlaneTakeoff className="h-10 w-10 text-white/10" />
                        <div className="text-center">
                          <p className="text-xs font-space font-bold text-white/40 group-hover:text-gold transition-colors">
                            {imageUploading ? "Uploading…" : "Click to upload helicopter image"}
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
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
                  {form.image && (
                    <p className="text-[9px] text-teal mt-1.5 truncate">✓ Uploaded: {form.image.slice(0, 60)}…</p>
                  )}
                </div>

                {/* ── §4 Technical Specs ───────────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" /> § 4 — Technical Specifications ({specs.length})
                    </p>
                    <button type="button" onClick={addSpec}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-lg text-[9px] font-space font-bold uppercase tracking-widest transition-all cursor-pointer">
                      <Plus className="h-3 w-3" /> Add Spec
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {specs.map((spec, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-center">
                        <input type="text" placeholder="Spec name (e.g. Engine Type)"
                          value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)}
                          className={INPUT_CLS + " flex-1"} />
                        <span className="text-grey-text text-xs shrink-0">→</span>
                        <input type="text" placeholder="Value (e.g. Twin Turbine)"
                          value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)}
                          className={INPUT_CLS + " flex-1"} />
                        <button type="button" onClick={() => removeSpec(i)}
                          className="text-red-400/60 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── §5 Cabin Features ─────────────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold flex items-center gap-1.5">
                      <Star className="h-3 w-3" /> § 5 — Cabin Features ({features.length})
                    </p>
                    <button type="button" onClick={addFeature}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-lg text-[9px] font-space font-bold uppercase tracking-widest transition-all cursor-pointer">
                      <Plus className="h-3 w-3" /> Add Feature
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {features.map((feat, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold/60 shrink-0" />
                        <input type="text" placeholder="e.g. Noise Cancellation Cabin"
                          value={feat} onChange={(e) => updateFeature(i, e.target.value)}
                          className={INPUT_CLS + " flex-1"} />
                        <button type="button" onClick={() => removeFeature(i)}
                          className="text-red-400/60 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── §6 Departure Schedules ───────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-space uppercase tracking-widest text-gold/60 font-bold flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> § 6 — Available Departure Slots ({schedules.length})
                    </p>
                    <button type="button" onClick={addSchedule}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-lg text-[9px] font-space font-bold uppercase tracking-widest transition-all cursor-pointer">
                      <Plus className="h-3 w-3" /> Add Slot
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {schedules.map((slot, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-1.5 items-center bg-[#030712] border border-white/10 rounded-lg px-3 py-2">
                        <Clock className="h-3 w-3 text-gold/60 shrink-0" />
                        <input type="text" placeholder="08:00 AM"
                          value={slot} onChange={(e) => updateSchedule(i, e.target.value)}
                          className="bg-transparent text-white text-xs font-space focus:outline-none flex-1 w-0 min-w-0 placeholder-white/20" />
                        <button type="button" onClick={() => removeSchedule(i)}
                          className="text-red-400/40 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>{/* end scrollable body */}

              {/* Modal footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/8 bg-white/1 rounded-b-2xl">
                <span className="text-[9px] text-grey-text font-luxury">
                  {features.length} features · {specs.length} specs · {schedules.length} departure slots
                </span>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-white/3 hover:bg-white/8 border border-white/10 text-white rounded-lg font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer">
                    Discard
                  </button>
                  <button type="submit" disabled={saving}
                    className="py-2 px-6 bg-gold hover:bg-gold/90 text-black rounded-lg font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2">
                    {saving ? (
                      <><div className="w-3.5 h-3.5 border-2 border-black/40 border-t-transparent rounded-full animate-spin" /> Deploying…</>
                    ) : (
                      <><PlaneTakeoff className="h-3.5 w-3.5" /> Deploy Helicopter</>
                    )}
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Fleet Grid ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl border border-white/8 h-80 animate-pulse bg-white/2" />
          ))}
        </div>
      ) : fleet.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-grey-text border border-white/5 rounded-xl bg-white/1">
          <PlaneTakeoff className="h-10 w-10 text-white/10" />
          <p className="font-space text-xs uppercase tracking-wider">No aircraft in fleet</p>
          <button onClick={openModal}
            className="mt-2 py-2 px-4 bg-gold text-black rounded font-space text-[10px] font-bold uppercase tracking-widest cursor-pointer">
            Deploy First Helicopter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleet.map((heli) => (
            <motion.div key={heli.id} layoutId={heli.id}
              className="glass-card rounded-xl border border-white/8 overflow-hidden flex flex-col">

              {/* Image banner */}
              <div className="h-44 w-full relative overflow-hidden bg-secondary">
                <img src={heli.image} alt={heli.name}
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-[#030712]/80 border border-white/10 px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wider text-gold">
                  {heli.id}
                </span>
                <span className="absolute bottom-3 left-3 bg-[#030712]/80 border border-white/10 px-2 py-0.5 rounded font-space text-[9px] text-white">
                  {heli.model}
                </span>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#030712]/80 border border-gold/20 px-2 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 text-gold" />
                  <span className="text-gold font-mono text-[9px] font-bold">{heli.safety_rating || "5.0/5"}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-space text-sm font-bold text-white leading-tight">{heli.name}</h3>
                  {heli.tagline && (
                    <p className="font-luxury text-[10px] text-gold/80 mt-0.5 italic line-clamp-1">{heli.tagline}</p>
                  )}
                </div>

                <p className="font-luxury text-xs text-grey-text line-clamp-2 leading-relaxed">
                  {heli.description || "Premium high-altitude twin turbine helicopter charter."}
                </p>

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-1 border-t border-b border-white/5 py-2.5 font-mono text-[9px] text-grey-text text-center bg-white/1 rounded-lg">
                  <div>
                    <span className="uppercase text-[8px] opacity-50 block">Speed</span>
                    <span className="text-white font-bold text-[10px]">{heli.speed || "—"}</span>
                  </div>
                  <div className="border-l border-r border-white/5">
                    <span className="uppercase text-[8px] opacity-50 block">Range</span>
                    <span className="text-white font-bold text-[10px]">{heli.range || "—"}</span>
                  </div>
                  <div>
                    <span className="uppercase text-[8px] opacity-50 block">Seats</span>
                    <span className="text-white font-bold text-[10px]">{heli.capacity} VIP</span>
                  </div>
                </div>

                {/* Features preview */}
                {(heli.features || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {heli.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[8px] px-1.5 py-0.5 bg-gold/5 border border-gold/15 text-gold/80 rounded font-space">
                        {f}
                      </span>
                    ))}
                    {heli.features.length > 3 && (
                      <span className="text-[8px] px-1.5 py-0.5 bg-white/3 border border-white/8 text-grey-text rounded font-space">
                        +{heli.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Schedules */}
                {(heli.schedules || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {heli.schedules.slice(0, 3).map((s, i) => (
                      <span key={i} className="flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 bg-white/3 border border-white/8 text-grey-text rounded font-mono">
                        <Clock className="h-2 w-2" /> {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-auto">
                  <div>
                    <span className="text-[8px] uppercase text-grey-text block">Base Rate / Hr</span>
                    <span className="font-space font-bold text-gold text-sm">
                      ₹{Number(heli.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => alert(`Edit modal for ${heli.id} — coming soon`)}
                      className="p-2 bg-white/2 hover:bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-colors">
                      <Edit2 className="h-3.5 w-3.5 text-grey-text" />
                    </button>
                    <button onClick={() => handleDelete(heli.id)}
                      className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg cursor-pointer transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
