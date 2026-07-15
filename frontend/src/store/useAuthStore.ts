"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "@/utils/api";

export interface Booking {
  id: string;
  type: "helicopter" | "package" | "hotel" | "boat";
  name: string;
  details: string;
  date: string;
  passengers: number;
  price: number;
  status: "Confirmed" | "Pending" | "Cancelled" | "In Flight";
  invoiceUrl?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "Resolved";
  date: string;
  messages: { sender: "user" | "support"; text: string; date: string }[];
}

export interface AuthState {
  user: {
    name: string;
    last_name?: string;
    email: string;
    phone?: string;
    gender?: string;
    date_of_birth?: string;
    city_of_residence?: string;
    state?: string;
    nationality?: string;
    marital_status?: string;
    anniversary?: string;
  } | null;
  token: string | null;       // JWT access token
  refresh: string | null;     // JWT refresh token
  isLoggedIn: boolean;
  bookings: Booking[];
  tickets: SupportTicket[];
  notifications: { id: string; text: string; date: string; read: boolean }[];
  login: (user: any, token: string, refresh?: string) => void;
  logout: () => void;
  fetchBookings: () => Promise<void>;
  addBooking: (booking: Omit<Booking, "id" | "status"> & { id?: string; status?: string }) => Promise<string>;
  cancelBooking: (id: string) => Promise<void>;
  fetchTickets: () => Promise<void>;
  addTicket: (subject: string, category: string, initialMsg: string) => Promise<void>;
  addReplyToTicket: (ticketId: string, text: string) => Promise<void>;
  updateProfile: (profileDataOrName: string | Record<string, any>, phone?: string) => Promise<void>;
  markNotificationsAsRead: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refresh: null,
      isLoggedIn: false,
      bookings: [],
      tickets: [],
      notifications: [
        {
          id: "n-2",
          text: "Welcome to AURA. Live database syncing connected.",
          date: "Just now",
          read: false,
        },
      ],
      login: (user, token, refresh) =>
        set({
          user,
          token,
          refresh: refresh ?? null,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          refresh: null,
          isLoggedIn: false,
          bookings: [],
          tickets: [],
        }),
      fetchBookings: async () => {
        const user = get().user;
        if (!user?.email) return;
        try {
          const res = await API.get(`/bookings?email=${encodeURIComponent(user.email)}`);
          set({ bookings: res.data });
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }
      },
      addBooking: async (booking) => {
        const user = get().user;
        const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
        try {
          const payload = {
            ...booking,
            id: bookingId,
            user_email: user?.email || "dev@auratravels.com",
          };
          await API.post("/bookings", payload);
          await get().fetchBookings();
          
          set((state) => ({
            notifications: [
              {
                id: `n-${Date.now()}`,
                text: `Booking ${bookingId} for ${booking.name} is successfully processed.`,
                date: "Just now",
                read: false,
              },
              ...state.notifications,
            ],
          }));
          return bookingId;
        } catch (err) {
          console.error("Error adding booking:", err);
          return bookingId;
        }
      },
      cancelBooking: async (id) => {
        try {
          await API.post(`/bookings/cancel/${id}`);
          await get().fetchBookings();
        } catch (err) {
          console.error("Error cancelling booking:", err);
        }
      },
      fetchTickets: async () => {
        const user = get().user;
        if (!user?.email) return;
        try {
          const res = await API.get(`/tickets?email=${encodeURIComponent(user.email)}`);
          set({ tickets: res.data });
        } catch (err) {
          console.error("Error fetching tickets:", err);
        }
      },
      addTicket: async (subject, category, initialMsg) => {
        const user = get().user;
        if (!user?.email) return;
        const id = `TCK-${Math.floor(100 + Math.random() * 900)}`;
        try {
          const payload = {
            id,
            user_email: user.email,
            subject,
            category,
            date: new Date().toISOString().split("T")[0],
            initialMessage: initialMsg,
          };
          await API.post("/tickets", payload);
          await get().fetchTickets();
        } catch (err) {
          console.error("Error adding ticket:", err);
        }
      },
      addReplyToTicket: async (ticketId, text) => {
        try {
          await API.post(`/tickets/reply/${ticketId}`, { text, sender: "user" });
          await get().fetchTickets();
        } catch (err) {
          console.error("Error adding ticket reply:", err);
        }
      },
      updateProfile: async (profileDataOrName, phone) => {
        const user = get().user;
        if (!user?.email) return;
        try {
          let payload: Record<string, any> = {};
          if (typeof profileDataOrName === "string") {
            payload = { name: profileDataOrName, phone: phone };
          } else {
            payload = { ...profileDataOrName };
          }
          const res = await API.post("/auth/profile", { ...payload, email: user.email });
          set({ user: res.data });
        } catch (err) {
          console.error("Error updating profile:", err);
        }
      },
      markNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: "aura-auth-storage",
    }
  )
);
