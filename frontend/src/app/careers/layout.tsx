import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Roman Aviation | Join the Elite Flight Crew",
  description: "Apply for cabin crew, aviation maintenance engineer, and pilot positions at Roman Aviation. Competitive salaries, global routes, and career growth.",
  keywords: "aviation jobs India, cabin crew vacancy 2026, helicopter pilot hiring, AME license job",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
