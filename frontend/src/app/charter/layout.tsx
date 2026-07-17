import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke Air Charter Planner | Roman Aviation",
  description: "Plan multi-leg private helicopter charters across India. Calculate cargo payload weight safety and customize luxury flight corridors.",
};

export default function CharterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
