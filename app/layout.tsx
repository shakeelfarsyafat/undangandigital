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
  title: "Undangan Pernikahan Digital Premium",
  description: "Platform & Portal Undangan Pernikahan Digital Premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${jakarta.variable} ${vibes.variable}`}>
      <body className="antialiased bg-[#FAF8F5] text-[#2C1A1D] selection:bg-[#C5A059] selection:text-white">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#2C1A1D",
              color: "#FFFDF9",
              border: "1.5px solid rgba(197, 160, 89, 0.4)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(197, 160, 89, 0.25)",
              borderRadius: "16px",
              fontSize: "13px",
              fontWeight: "500",
              padding: "12px 18px",
            },
            success: {
              iconTheme: {
                primary: "#C5A059",
                secondary: "#2C1A1D",
              },
              style: {
                background: "linear-gradient(135deg, #2C1A1D 0%, #1A0D0F 100%)",
                border: "1.5px solid #C5A059",
              },
            },
            error: {
              iconTheme: {
                primary: "#E53E3E",
                secondary: "#FFFDF9",
              },
              style: {
                background: "linear-gradient(135deg, #3B1216 0%, #21080A 100%)",
                border: "1.5px solid #E53E3E",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
