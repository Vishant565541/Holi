import type { Metadata } from "next";
import { Space_Grotesk, Inter, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import AmbientEffects from "@/components/layout/AmbientEffects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Roman Aviation | Premium Helicopter & Luxury Travel Booking Platform",
  description: "Experience ultra-luxury helicopter tourism, bespoke private charter routes, premium hotels, and yacht services in India. Fly with Roman Aviation.",
  keywords: "helicopter booking, private charter fly, luxury tourism India, helicopter tour package, private yacht rental, VIP aviation travel, Roman Aviation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${manrope.variable} ${playfairDisplay.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-gold/30 selection:text-white font-sans overflow-x-hidden">
        <AmbientEffects />
        <Navbar />
        <main className="flex-grow pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


