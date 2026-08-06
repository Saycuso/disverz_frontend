import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the new weapon
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Disverz | The Active Server Feed",
  description: "Rank your Discord server based on real human activity.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 👑 JSON-LD Schema Object for Google Search Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Disverz",
    "url": "https://disverz.com",
    "description": "Rank your Discord server based on real human activity.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://disverz.com/?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#060606] text-white min-h-screen relative `}
      >
        {/* 👑 Injecting the JSON-LD Schema directly for global SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* The Navbar sits at the top of every page */}
        <AuthProvider>
          <Navbar />
          <div className="w-full max-w-7xl mx-auto px-4 md:px-0 flex-1 flex flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}