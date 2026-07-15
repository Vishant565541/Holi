"use client";

import React, { useState, useEffect } from "react";
import API from "@/utils/api";
import { Users, Mail, Phone, Calendar, Shield, Search } from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [filteredList, setFilteredList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsersList(res.data || []);
      setFilteredList(res.data || []);
    } catch (e) {
      console.error("Failed to query users from API:", e);
      // Fallback
      setUsersList([
        {
          id: 1,
          name: "Dev Patel",
          email: "dev@auratravels.com",
          phone: "+91 98765 43210",
          role: "customer",
          created_at: new Date().toISOString()
        }
      ]);
      setFilteredList([
        {
          id: 1,
          name: "Dev Patel",
          email: "dev@auratravels.com",
          phone: "+91 98765 43210",
          role: "customer",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter application search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredList(usersList);
      return;
    }
    const term = searchTerm.toLowerCase();
    const result = usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone && u.phone.includes(term))
    );
    setFilteredList(result);
  }, [searchTerm, usersList]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">
            Registered Users Database
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Overview of all client login sessions and corporate account profiles in the database.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-grey-text" />
        <input
          type="text"
          placeholder="Search users by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0b0f19] border border-white/10 rounded pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50 font-space"
        />
      </div>

      {/* Users Data Grid */}
      {loading ? (
        <div className="text-center py-16 font-luxury text-xs text-grey-text">
          Syncing users database...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16 font-luxury text-xs text-grey-text">
          No registered users match your criteria.
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-luxury text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 font-space text-[10px] text-grey-text uppercase tracking-wider">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-grey-text">
                {filteredList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/1 transition-all hover:text-white">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold font-space font-bold">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{u.name}</span>
                          <span className="text-[10px] opacity-70">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      {u.phone || "N/A"}
                    </td>

                    <td className="p-4 uppercase text-[9px] font-space tracking-wider">
                      <span className={`px-2 py-0.5 rounded ${
                        u.role === "admin" ? "bg-red-400/5 text-red-400 border border-red-400/10" : "bg-teal/5 text-teal border border-teal/10"
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 font-mono">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
