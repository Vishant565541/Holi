import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Palace Stays & Resort Suite Bookings | Roman Tourism",
  description: "Reserve handpicked luxury suites at royal lake palaces, heritage lodges, and wild canvas retreats. Real-time pricing, premier butler service, and heliport landing clearances.",
  keywords: "luxury hotel booking, palace stays India, Aman-i-Khas, Taj Exotica suite, corporate retreat lodge",
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
