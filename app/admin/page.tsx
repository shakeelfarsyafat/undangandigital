"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Sparkles,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalGuests: number;
  opened: number;
  unopened: number;
  confirmedAttending: number;
  confirmedDeclined: number;
  pendingConfirmation: number;
  estimatedAttendees: number;
}

interface AccountStats {
  totalAccounts: number;
}

export default function AdminDashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Cek role terlebih dahulu
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          const userRole = meData.user?.role || null;
          setRole(userRole);

          if (userRole === "superadmin") {
            // Muat statistik akun
            const usersRes = await fetch("/api/admin/users");
            if (usersRes.ok) {
              const usersData = await usersRes.json();
              setAccountStats({ totalAccounts: usersData.users?.length ?? 0 });
            }
          } else {
            // Muat statistik undangan
            const statsRes = await fetch("/api/admin/stats");
            if (statsRes.ok) {
              const json = await statsRes.json();
              setStats(json.stats);
            }
          }
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // === Tampilan Super Admin ===
  if (role === "superadmin") {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A059]/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
              Dashboard Super Admin
            </h1>
            <p className="text-xs text-[#5C4649] font-light mt-1">
              Ringkasan platform undangan digital — kelola akun admin mempelai.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            + Tambah Akun Mempelai
          </Link>
        </div>

        {/* Stat Cards */}
        {isLoading ? (
          <div className="text-xs text-[#5C4649] py-10 text-center">Memuat data...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl border border-[#C5A059]/30 bg-[#F5EFE6] shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#A47E3B] opacity-80">
                  Total Akun Mempelai
                </p>
                <p className="font-serif text-4xl font-bold text-[#A47E3B]">
                  {accountStats?.totalAccounts ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/60 shadow-inner text-[#A47E3B]">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#C5A059]/30 bg-white shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#5C4649] opacity-80">
                  Role Platform
                </p>
                <p className="font-serif text-lg font-bold text-[#2C1A1D]">
                  Super Administrator
                </p>
                <p className="text-[11px] text-[#A47E3B] font-medium">
                  Akses penuh ke manajemen akun
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#C5A059]/10 shadow-inner text-[#A47E3B]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Action */}
        <div className="grid grid-cols-1 gap-5 pt-2">
          <Link
            href="/admin/users"
            className="glass-card p-6 rounded-2xl hover:border-[#C5A059] transition-all flex items-center gap-5 group shadow-md"
          >
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 text-[#A47E3B] flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C1A1D] group-hover:text-[#C5A059] transition-colors">
                Kelola Akun Mempelai
              </h3>
              <p className="text-xs text-[#5C4649] font-light mt-0.5">
                Buat akun baru, atur wedding slug, reset password, dan hapus akun mempelai.
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // === Tampilan Admin Mempelai ===
  const statCards = [
    { label: "Total Undangan", value: stats?.totalGuests ?? 0, icon: Users, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Sudah Dibuka", value: stats?.opened ?? 0, icon: Eye, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Belum Dibuka", value: stats?.unopened ?? 0, icon: EyeOff, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Konfirmasi Hadir", value: stats?.confirmedAttending ?? 0, icon: CheckCircle, color: "bg-green-50 text-green-700 border-green-200" },
    { label: "Tidak Hadir", value: stats?.confirmedDeclined ?? 0, icon: XCircle, color: "bg-rose-50 text-rose-700 border-rose-200" },
    { label: "Belum Konfirmasi", value: stats?.pendingConfirmation ?? 0, icon: Clock, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "Perkiraan Kehadiran", value: `${stats?.estimatedAttendees ?? 0} Orang`, icon: UserCheck, color: "bg-[#F5EFE6] text-[#A47E3B] border-[#C5A059]/40 font-bold" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A059]/20 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
            Dashboard Statistik
          </h1>
          <p className="text-xs text-[#5C4649] font-light mt-1">
            Ringkasan status undangan, keterbukaan link, dan estimasi kehadiran tamu.
          </p>
        </div>
        <Link
          href="/admin/guests"
          className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          + Kelola & Tambah Tamu
        </Link>
      </div>

      {/* Analytics Grid */}
      {isLoading ? (
        <div className="text-xs text-[#5C4649] py-10 text-center">Memuat statistik data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02] ${card.color}`}
              >
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-80">
                    {card.label}
                  </p>
                  <p className="font-serif text-3xl font-bold">
                    {card.value}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/60 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link
          href="/admin/guests"
          className="glass-card p-6 rounded-2xl hover:border-[#C5A059] transition-all space-y-2 group shadow-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#A47E3B] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#2C1A1D] group-hover:text-[#C5A059] transition-colors">
            Daftar Tamu & WA
          </h3>
          <p className="text-xs text-[#5C4649] font-light">
            Tambah nama tamu, buat link unik otomatis, copy link & kirim ucapan WhatsApp.
          </p>
        </Link>

        <Link
          href="/admin/guests?tab=rsvp"
          className="glass-card p-6 rounded-2xl hover:border-[#C5A059] transition-all space-y-2 group shadow-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#A47E3B] flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#2C1A1D] group-hover:text-[#C5A059] transition-colors">
            Konfirmasi RSVP
          </h3>
          <p className="text-xs text-[#5C4649] font-light">
            Pantau rincian balasan tamu yang hadir, jumlah pendamping, dan pesan.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="glass-card p-6 rounded-2xl hover:border-[#C5A059] transition-all space-y-2 group shadow-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#A47E3B] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#2C1A1D] group-hover:text-[#C5A059] transition-colors">
            Pengaturan Undangan
          </h3>
          <p className="text-xs text-[#5C4649] font-light">
            Ubah nama pengantin, jadwal acara, lokasi maps, nomor rekening, & galeri foto.
          </p>
        </Link>
      </div>
    </div>
  );
}
