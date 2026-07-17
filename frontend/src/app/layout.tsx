import type { Metadata } from "next";
import "./globals.css";
import AmbientEffects from "@/components/layout/AmbientEffects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Roman Aviation | Luxury Helicopter & Charter Booking",
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
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-gold/30 selection:text-white font-sans overflow-x-hidden">
        <AmbientEffects />
        <Navbar />
        <main className="flex-grow pt-24">{children}</main>
        <Footer />

        {/* Floating WhatsApp Chat Button */}
        <a
          href="https://wa.me/917041861886?text=Hi%20Roman%20Aviation%2C%20I%20have%20a%20query%20regarding%20helicopter%20booking."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#25D366] text-white rounded-full hover:bg-[#20ba5a] transition-all duration-300 shadow-2xl flex items-center justify-center border-2 border-gold cursor-pointer group animate-pulse"
          title="Chat with VIP Concierge"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.004 22.004c-2.707 0-5.354-.755-7.662-2.186L1 21l1.21-3.235c-1.57-2.39-2.215-5.215-2.207-8.083C.013 4.348 5.397 0 12.01 0c3.2 0 6.21 1.244 8.477 3.512 2.267 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.39 12.008-12.01 12.008zm0-20.73c-5.753 0-10.432 3.82-10.438 8.528-.004 2.457.973 4.793 2.752 6.577l.184.184-.725 2.164 2.222-.582.183.108c1.782 1.056 3.82 1.613 5.82 1.614 5.757 0 10.44-3.823 10.444-8.532.002-2.285-.89-4.433-2.51-6.056-1.62-1.623-3.774-2.517-6.932-2.517z" />
          </svg>
          <span className="absolute right-full mr-3 bg-[#020B1E] border border-gold/40 text-gold font-space text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Chat with VIP Concierge
          </span>
        </a>

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Roman Aviation",
              "url": "https://romanaviation.in",
              "logo": "https://romanaviation.in/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+917041861886",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["en", "hi"]
              }
            })
          }}
        />
      </body>
    </html>
  );
}


