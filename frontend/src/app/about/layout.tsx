import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Roman Aviation | Luxury Charter Brand",
  description: "Discover Roman Aviation's legacy of safety, luxury, and premium helicopter flight solutions across India. Learn about our elite aviation brand.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
