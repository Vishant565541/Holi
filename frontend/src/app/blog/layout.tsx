import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roman Travel Chronicles | High-Altitude Pilgrimage Guides",
  description: "Read safety guidelines, slot booking calendars, and cost breakdowns written by aviation veterans for Kedarnath, Char Dham, and Vaishno Devi.",
  keywords: "Kedarnath helicopter guide 2026, Char Dham yatra cost, Vaishno Devi weather delays, high altitude flight safety",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
