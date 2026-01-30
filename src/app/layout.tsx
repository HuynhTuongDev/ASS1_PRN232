import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AURA | Premium Botanical Essentials",
  description: "Curated collection of high-integrity materials and timeless design for the modern sanctuary.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.className} antialiased text-slate-900 bg-white`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
