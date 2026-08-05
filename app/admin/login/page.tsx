"use client";

import { useState } from "react";
import {
  Lock,
  Mail,
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
      }

      toast.success("Login berhasil! Mengalihkan ke Dashboard...");
      window.location.href = "/admin";
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoSuperAdmin = () => {
    setEmail("superadmin@wedding.com");
    setPassword("superadmin123");
    toast.success("Akun Demo Super Admin berhasil dimasukkan!");
  };

  const handleFillDemoAdminMempelai = () => {
    setEmail("mempelai@wedding.com");
    setPassword("mempelai123");
    toast.success("Akun Demo Admin Mempelai berhasil dimasukkan!");
  };

  return (
    <div className="min-h-screen bg-[#1E100A] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#C5A059]/30">
        
        {/* BAGIAN KIRI: Form Login Clean */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-[#FFFDF9]">
          <div className="space-y-6">
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-serif text-xl border border-[#C5A059]/30 shadow-sm">
                <Heart className="w-6 h-6 fill-[#C5A059]" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#2C1A1D]">
                  Wedding Admin
                </h2>
                <p className="text-[10px] text-[#8B6508] uppercase tracking-widest font-semibold">
                  Platform Undangan Digital
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
                Selamat Datang Kembali
              </h1>
              <p className="text-xs text-[#5C4649] font-light leading-relaxed">
                Silakan masuk dengan kredensial akun admin Anda untuk mengelola data mempelai, tamu, dan RSVP.
              </p>
            </div>

            {/* Form Login */}
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C1A1D] block">
                  Email Admin
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A47E3B] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] transition-all text-[#2C1A1D]"
                    placeholder="nama@domain.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C1A1D] block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A47E3B] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] transition-all text-[#2C1A1D]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-lg cursor-pointer disabled:opacity-50 transition-all mt-4"
              >
                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center pt-4 border-t border-[#C5A059]/15 text-[11px] text-[#5C4649]/70">
            Sistem Keamanan Terenkripsi &bull; Undangan Pernikahan Digital
          </div>
        </div>

        {/* BAGIAN KANAN: Panel Fitur & Tombol Demo Akun */}
        <div className="lg:col-span-6 bg-[#2C1A1D] text-white p-8 sm:p-12 flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Background Ornaments */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#E6C887] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Manajemen Multi-Tenant
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl font-bold text-[#FFFDF9] leading-tight">
                Kelola Undangan Pernikahan Tanpa Batas
              </h2>
              <p className="text-xs text-[#E8DCC4]/80 leading-relaxed font-light">
                Platform modern untuk mengelola data mempelai, daftar tamu, konfirmasi RSVP, rekening bank, hingga foto galeri dengan tampilan cepat & fleksibel.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-[#C5A059]/20">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Import Tamu Massal via Excel</h4>
                  <p className="text-[11px] text-[#E8DCC4]/70 font-light mt-0.5">
                    Unggah file <code className="font-mono bg-white/10 px-1 py-0.5 rounded">.xlsx / .csv</code> dan buat link undangan instan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-[#C5A059]/20">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Isolasi Data Per-Akun Mempelai</h4>
                  <p className="text-[11px] text-[#E8DCC4]/70 font-light mt-0.5">
                    Setiap mempelai mengelola data miliknya secara independen dan aman.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Interaktif Uji Coba Demo Akun */}
          <div className="relative z-10 space-y-3 pt-4 border-t border-[#C5A059]/20">
            <p className="text-xs font-semibold text-[#E6C887]">
              Coba Fitur dengan Akun Demo (Klik untuk Isi Otomatis):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleFillDemoSuperAdmin}
                className="p-3.5 rounded-2xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E6C887] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Demo Super Admin
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#E6C887] group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] text-[#E8DCC4]/70 block mt-1">
                  Kelola & buat akun mempelai baru
                </span>
              </button>

              <button
                type="button"
                onClick={handleFillDemoAdminMempelai}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C5A059]" />
                    Demo Admin Mempelai
                  </span>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] text-[#E8DCC4]/70 block mt-1">
                  Kelola data mempelai, tamu & RSVP
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
