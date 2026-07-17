import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Yacht Charter & Houseboats Booking | Roman Cruises",
  description: "Rent premium flybridge yachts, executive catamarans, and backwater houseboat suites in Goa and Kerala. Private chef catering, water sports addons, and professional crew included.",
  keywords: "yacht charter Goa, luxury boat rental Kerala, Prestige 75 yacht, sunset cruise charter",
};

export default function BoatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
