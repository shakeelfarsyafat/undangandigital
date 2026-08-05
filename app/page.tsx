"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  Heart,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RootPortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      if (data.user?.role === "superadmin") {
        window.location.href = "/admin/users";
      } else {
        window.location.href = "/admin";
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E100A] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-5xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#C5A059]/30">
        
        {/* BAGIAN KIRI: Form Login Admin */}
        <div className="lg:col-span-6 p-6 sm:p-12 flex flex-col justify-between space-y-8 bg-[#FFFDF9]">
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
                  Portal Admin Undangan Digital
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1A1D]">
                Masuk ke Dashboard
              </h1>
              <p className="text-xs text-[#5C4649] font-light leading-relaxed">
                Silakan masuk dengan email & password admin untuk mengelola data mempelai, daftar tamu, dan RSVP.
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] transition-all text-[#2C1A1D]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A47E3B] hover:text-[#2C1A1D] transition-colors p-1 cursor-pointer"
                    title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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

            {/* Quick Credentials Info Box */}
            <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-[#C5A059]/30 text-[11px] text-[#5C3A21] space-y-1 mt-2 text-left">
              <p className="font-semibold text-[#8B6508]">Kredensial Login:</p>
              <p>&bull; <strong>Super Admin:</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono">superadmin@wedding.com</code> (Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono">superadmin123</code>)</p>
              <p>&bull; <strong>Admin Mempelai:</strong> Akun mempelai yang terdaftar (contoh: <code className="bg-white px-1.5 py-0.5 rounded font-mono">jenal@wedding.com</code> / <code className="bg-white px-1.5 py-0.5 rounded font-mono">jenal123</code>)</p>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-[#C5A059]/15 text-[11px] text-[#5C4649]/70">
            Sistem Keamanan Terenkripsi &bull; Undangan Pernikahan Digital
          </div>
        </div>

        {/* BAGIAN KANAN: Preview & Demo Tampilan Undangan Digital */}
        <div className="lg:col-span-6 bg-[#2C1A1D] text-white p-6 sm:p-12 flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Background Ornaments */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Informasi Detail hanya tampil di layar desktop (lg:block), tersembunyi di HP */}
          <div className="relative z-10 space-y-6 hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#E6C887] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Demo Tampilan Undangan
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl font-bold text-[#FFFDF9] leading-tight">
                Lihat Contoh Tampilan Undangan Digital
              </h2>
              <p className="text-xs text-[#E8DCC4]/80 leading-relaxed font-light">
                Klik tombol di bawah ini untuk melihat demo interaktif tampilan undangan publik yang siap dikirimkan kepada para tamu undangan.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-[#C5A059]/20">
                <Smartphone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Desain Mobile Friendly & Premium</h4>
                  <p className="text-[11px] text-[#E8DCC4]/70 font-light mt-0.5">
                    Ornamen Jawa modern, musik latar, galeri foto, kisah cinta, & tombol kirim ucapan RSVP.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Demo Tampilan Undangan Publik (Tampil di HP & Desktop) */}
          <div className="relative z-10 space-y-3 pt-2 lg:pt-4 border-t border-[#C5A059]/20">
            <p className="text-xs font-semibold text-[#E6C887]">
              Demo Tampilan Undangan Tamu:
            </p>

            <Link
              href="/invite/demo"
              target="_blank"
              className="w-full p-4 rounded-2xl bg-[#C5A059] hover:bg-[#b08c47] text-white flex items-center justify-between text-xs font-semibold shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Lihat Contoh Undangan Tamu (Demo Live)</span>
              </div>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
