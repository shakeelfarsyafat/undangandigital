"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Lock, Mail, Heart, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@wedding.com");
  const [password, setPassword] = useState("admin123");
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

  return (
    <div className="min-h-screen bg-[#2C1A1D] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-[#FAF8F5] text-[#2C1A1D] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 border border-[#C5A059]/30">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-serif text-2xl shadow-inner">
            <Heart className="w-6 h-6 fill-[#C5A059]" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#A47E3B] font-semibold">
            Admin Panel
          </p>
          <h1 className="font-serif text-2xl font-bold">
            Undangan Pernikahan
          </h1>
          <p className="text-xs text-[#5C4649] font-light">
            Masuk untuk mengelola data tamu, RSVP, dan pengaturan.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2C1A1D]">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A47E3B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FFFDF9] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                placeholder="admin@wedding.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2C1A1D]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A47E3B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FFFDF9] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-gold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-lg cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-[#F5EFE6] rounded-xl text-[11px] text-[#5C4649] space-y-0.5 border border-[#C5A059]/20">
          <p className="font-semibold text-[#A47E3B]">Akun Pengujian (Demo):</p>
          <p>Email: <code className="font-mono text-[#2C1A1D]">admin@wedding.com</code></p>
          <p>Password: <code className="font-mono text-[#2C1A1D]">admin123</code></p>
        </div>
      </div>
    </div>
  );
}
