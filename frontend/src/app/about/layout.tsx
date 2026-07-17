import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Roman Aviation | Corporate Heritage & Aircraft Fleet",
  description: "Learn about the founders of Roman Aviation, our high-altitude search and rescue history, company milestones, and helicopter fleet specifications.",
  keywords: "Roman aviation group, founders Roman Aviation, Airbus H145 specs, Bell 429 specs, helicopter history",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
