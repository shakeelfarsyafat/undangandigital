import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const vibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Undangan Pernikahan Digital Premium | Ahmad & Nabila",
  description: "Undangan Pernikahan Digital Mempelai Ahmad Fauzi & Nabila Putri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${jakarta.variable} ${vibes.variable}`}>
      <body className="antialiased bg-[#FAF8F5] text-[#2C1A1D] selection:bg-[#C5A059] selection:text-white">
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
        {children}
      </body>
    </html>
  );
}
