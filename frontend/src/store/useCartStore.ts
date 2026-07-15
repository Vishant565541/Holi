"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  type: "helicopter" | "package" | "hotel" | "boat";
  id: string;
  name: string;
  price: number;
  date: string;
  passengers: number;
  details: string;
  duration?: string;
  image?: string;
}

export interface Passenger {
  fullName: string;
  age: number;
  gender: string;
  idProof: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartState {
  item: CartItem | null;
  selectedSeats: string[];
  passengers: Passenger[];
  selectedAddOns: AddOn[];
  insuranceEnabled: boolean;
  appliedPromo: { code: string; discountPercent: number } | null;
  setItem: (item: CartItem) => void;
  setSelectedSeats: (seats: string[]) => void;
  setPassengers: (passengers: Passenger[]) => void;
  toggleAddOn: (addOn: AddOn) => void;
  setInsuranceEnabled: (enabled: boolean) => void;
  applyPromo: (code: string, discountPercent: number) => void;
  removePromo: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      item: null,
      selectedSeats: [],
      passengers: [],
      selectedAddOns: [],
      insuranceEnabled: false,
      appliedPromo: null,
      setItem: (item) =>
        set({
          item,
          selectedSeats: [],
          passengers: Array(item.passengers).fill(null).map(() => ({
            fullName: "",
            age: 0,
            gender: "Male",
            idProof: "",
          })),
          selectedAddOns: [],
          insuranceEnabled: false,
          appliedPromo: null,
        }),
      setSelectedSeats: (seats) => set({ selectedSeats: seats }),
      setPassengers: (passengers) => set({ passengers }),
      toggleAddOn: (addOn) =>
        set((state) => {
          const exists = state.selectedAddOns.find((a) => a.id === addOn.id);
          if (exists) {
            return {
              selectedAddOns: state.selectedAddOns.filter((a) => a.id !== addOn.id),
            };
          } else {
            return { selectedAddOns: [...state.selectedAddOns, addOn] };
          }
        }),
      setInsuranceEnabled: (enabled) => set({ insuranceEnabled: enabled }),
      applyPromo: (code, discountPercent) =>
        set({ appliedPromo: { code, discountPercent } }),
      removePromo: () => set({ appliedPromo: null }),
      clearCart: () =>
        set({
          item: null,
          selectedSeats: [],
          passengers: [],
          selectedAddOns: [],
          insuranceEnabled: false,
          appliedPromo: null,
        }),
    }),
    {
      name: "aura-cart-storage",
    }
  )
);
