import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Guides & Chronicles | Roman Aviation",
  description: "Read exclusive articles, safety guidelines, luggage manuals, and slot booking checklists for Himalayan pilgrimages and luxury tourism routes.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
