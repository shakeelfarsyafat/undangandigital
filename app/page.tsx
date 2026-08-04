import Link from "next/link";
import { Sparkles, LayoutDashboard, UserCheck, Heart } from "lucide-react";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1A1D] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto glass-card p-8 rounded-3xl space-y-6 shadow-2xl border border-[#C5A059]/30">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-serif text-3xl shadow-sm">
          A & N
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A47E3B] font-semibold">
            Undangan Pernikahan Digital Premium
          </p>
          <h1 className="font-serif text-3xl font-bold">
            Ahmad & Nabila
          </h1>
        </div>

        <p className="text-xs text-[#5C4649] leading-relaxed font-light">
          Sistem undangan digital personalisasi dengan Neon PostgreSQL, Drizzle ORM, Next.js App Router & Admin Dashboard.
        </p>

        <div className="space-y-3 pt-2">
          {/* General Preview without specific guest name */}
          <Link
            href="/invite"
            className="w-full btn-gold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold shadow-md hover:scale-[1.02] transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            Buka Tampilan Undangan (Umum)
          </Link>

          {/* Personal invitation preview */}
          <Link
            href="/invite/faza-mohamad"
            className="w-full py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold bg-[#FFFDF9] text-[#A47E3B] border border-[#C5A059]/40 hover:bg-[#F5EFE6] transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4" />
            Contoh Undangan Personal (Faza Mohamad)
          </Link>

          {/* Admin Dashboard */}
          <Link
            href="/admin"
            className="w-full py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold bg-[#2C1A1D] text-white hover:bg-black transition-colors shadow-md"
          >
            <LayoutDashboard className="w-4 h-4" />
            Masuk Admin Dashboard
          </Link>
        </div>

        <div className="text-[11px] text-[#A47E3B] border-t border-[#C5A059]/20 pt-4 flex items-center justify-center gap-1.5 font-light">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Format URL Tamu Personal: <code>/invite/[slug]</code></span>
        </div>
      </div>
    </div>
  );
}
