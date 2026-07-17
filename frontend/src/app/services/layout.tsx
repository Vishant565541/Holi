import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviation & Tourism Service Offerings | Roman Aviation",
  description: "Browse our exclusive suite of private helicopter flights, customized tour packages, lakeside palace hotels, and coastal yacht charters.",
  keywords: "helicopter rental, private jet booking, bespoke tour package, luxury houseboat, VIP concierge travel",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
