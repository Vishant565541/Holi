"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Mail, Phone, Shield, Check, Users, Laptop, Lock, ChevronDown, Plus } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, updateProfile } = useAuthStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [dob, setDob] = useState(user?.date_of_birth || "");
  const [nationality, setNationality] = useState(user?.nationality || "");
  const [maritalStatus, setMaritalStatus] = useState(user?.marital_status || "");
  const [anniversary, setAnniversary] = useState(user?.anniversary || "");
  const [city, setCity] = useState(user?.city_of_residence || "Ahmedabad");
  const [state, setState] = useState(user?.state || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLastName(user.last_name || "");
      setGender(user.gender || "Male");
      setDob(user.date_of_birth || "");
      setNationality(user.nationality || "");
      setMaritalStatus(user.marital_status || "");
      setAnniversary(user.anniversary || "");
      setCity(user.city_of_residence || "Ahmedabad");
      setState(user.state || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleProfileSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateProfile({
      name,
      last_name: lastName,
      gender,
      date_of_birth: dob || null,
      nationality,
      marital_status: maritalStatus,
      anniversary: anniversary || null,
      city_of_residence: city,
      state,
      phone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleConfirmCity = async () => {
    await updateProfile({ city_of_residence: city });
    alert(`City confirmed as ${city}!`);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <h2 className="text-lg text-slate-800 font-sans font-semibold">Please authenticate to access your profile.</h2>
        <button
          onClick={() => router.push("/auth")}
          className="px-6 py-3 bg-[#7EDBC5] hover:bg-[#6ec2ae] text-white rounded-xl font-bold uppercase tracking-wider text-xs cursor-pointer shadow-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">
                My Account
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-between px-3 py-3.5 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === "profile"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 opacity-80" />
                    <span>My Profile</span>
                  </div>
                  {activeTab === "profile" && <span className="h-2 w-2 rounded-full bg-red-500 mr-1" />}
                </button>

                <button
                  onClick={() => setActiveTab("co-travellers")}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === "co-travellers"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users className="h-5 w-5 opacity-80" />
                  <span>Co-Travellers</span>
                </button>

                <button
                  onClick={() => setActiveTab("devices")}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === "devices"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Laptop className="h-5 w-5 opacity-80" />
                  <span>Logged In Devices</span>
                </button>
              </nav>

              <div className="border-t border-slate-100 my-4 pt-4">
                <button
                  onClick={() => alert("Redirecting to Reset Password...")}
                  className="w-full flex items-center gap-3 px-3 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <Lock className="h-5 w-5 opacity-80" />
                  <span>Reset Password</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PROFILE AREA */}
          <div className="md:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              
              {/* Header with Save Button */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                
                <div className="flex items-center gap-3">
                  {saved && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      Saved successfully!
                    </span>
                  )}
                  <button
                    onClick={() => handleProfileSave()}
                    className="px-6 py-2 bg-[#D1D5DB] hover:bg-[#c4c7cc] text-slate-800 font-bold uppercase tracking-wider text-xs rounded-lg transition-all shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Personalization Info Banner */}
              <div className="bg-gradient-to-r from-orange-50/20 via-blue-50/30 to-blue-50/60 rounded-xl p-4 border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600 font-bold text-lg">✈️</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Let's personalize your travel!</h4>
                    <p className="text-xs text-slate-500">Confirm your City to help us plan better trips for you!</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={handleConfirmCity}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 text-xs font-bold transition-all"
                  >
                    Confirm City
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-8">
                
                {/* General Information Section */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-5">General Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* First & Middle Name (Stacked) */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        First & Middle Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="First & Middle Name"
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5"
                      />
                    </div>

                    {/* Last Name (Stacked) */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5"
                      />
                    </div>

                    {/* Gender (Stacked Select) */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Date of Birth (Stacked Datepicker) */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      />
                    </div>

                    {/* Nationality */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Nationality
                      </label>
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      >
                        <option value="Indian">Indian</option>
                        <option value="American">American</option>
                        <option value="British">British</option>
                        <option value="Canadian">Canadian</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Marital Status */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Marital Status
                      </label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Anniversary */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Anniversary
                      </label>
                      <input
                        type="date"
                        value={anniversary}
                        onChange={(e) => setAnniversary(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      />
                    </div>

                    {/* City of Residence */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        City of Residence
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      >
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* State */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col relative">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        State
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 appearance-none w-full"
                      >
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block pl-1">
                    Required for GST purpose on your tax invoice
                  </span>
                </div>

                {/* Contact Details Section */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-base font-bold text-slate-800 mb-2">Contact Details</h3>
                  <p className="text-xs text-slate-400 mb-5">Add contact information to receive booking details & other alerts</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Add Mobile Number */}
                    <div>
                      {showPhoneInput || phone ? (
                        <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-col">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter Mobile Number"
                            className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 w-full"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowPhoneInput(true)}
                          className="w-full flex items-center justify-center gap-2 border border-blue-200 rounded-xl py-4 text-xs font-bold text-blue-600 hover:bg-blue-50/50 transition-all uppercase"
                        >
                          Add Mobile Number
                        </button>
                      )}
                    </div>

                    {/* Email ID */}
                    <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl px-4 py-2 flex flex-row items-center justify-between">
                      <div className="flex flex-col w-full">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Email ID
                        </label>
                        <input
                          type="email"
                          disabled
                          value={user?.email || ""}
                          className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none mt-0.5 cursor-not-allowed opacity-80"
                        />
                      </div>
                      <div className="bg-emerald-100 text-emerald-600 p-0.5 rounded-full">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    </div>

                  </div>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
