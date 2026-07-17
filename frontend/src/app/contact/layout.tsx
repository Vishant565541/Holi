import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact VIP Concierge Desk | Roman Aviation",
  description: "Contact the flight coordinators at Roman Aviation. Reach our Terminal 3 terminal lounges or make a reservation query for private helicopter charters.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
