import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Retreat & Tour Packages | Roman Aviation",
  description: "Explore bespoke luxury holiday and spiritual packages combining private helicopter transits, premium hotels, and yacht charters across India.",
};

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
