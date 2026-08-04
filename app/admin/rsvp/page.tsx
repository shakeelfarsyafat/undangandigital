"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Users, UserCheck } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface RSVPItem {
  id: string;
  guestId: string;
  guestName: string;
  attendanceStatus: string;
  guestCount: number;
  message?: string | null;
  createdAt: string | Date;
}

export function AdminRSVPPage() {
  const [rsvps, setRsvps] = useState<RSVPItem[]>([]);
  const [filter, setFilter] = useState<"Semua" | "Hadir" | "Tidak Hadir" | "Belum Konfirmasi">("Semua");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRsvps = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/rsvp");
      if (res.ok) {
        const json = await res.json();
        setRsvps(json.rsvps || []);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRsvps();
  }, [fetchRsvps]);

  const totalHadir = rsvps.filter((r) => r.attendanceStatus === "attending").length;
  const totalTidakHadir = rsvps.filter((r) => r.attendanceStatus === "declined").length;
  const totalPerkiraanOrang = rsvps
    .filter((r) => r.attendanceStatus === "attending")
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);

  const filteredRsvps = rsvps.filter((r) => {
    if (filter === "Hadir") return r.attendanceStatus === "attending";
    if (filter === "Tidak Hadir") return r.attendanceStatus === "declined";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-6">
        <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
          Rekapitulasi Kehadiran Tamu (RSVP)
        </h1>
        <p className="text-xs text-[#5C4649] font-light mt-1">
          Pantau respon kehadiran tamu undangan dan total perkiraan porsi/kehadiran.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-green-50 text-green-800 border border-green-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">Konfirmasi Hadir</p>
            <p className="font-serif text-3xl font-bold">{totalHadir} Undangan</p>
          </div>
          <CheckCircle className="w-8 h-8 opacity-70" />
        </div>

        <div className="p-5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">Tidak Dapat Hadir</p>
            <p className="font-serif text-3xl font-bold">{totalTidakHadir} Undangan</p>
          </div>
          <XCircle className="w-8 h-8 opacity-70" />
        </div>

        <div className="p-5 rounded-2xl bg-[#F5EFE6] text-[#A47E3B] border border-[#C5A059]/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">Total Perkiraan Kehadiran</p>
            <p className="font-serif text-3xl font-bold">{totalPerkiraanOrang} Orang</p>
          </div>
          <UserCheck className="w-8 h-8 opacity-70" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#FFFDF9] p-2 rounded-xl border border-[#C5A059]/30 w-fit">
        {(["Semua", "Hadir", "Tidak Hadir"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === tab
                ? "bg-[#C5A059] text-white shadow-sm"
                : "text-[#5C4649] hover:bg-[#FAF8F5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-xs text-[#5C4649] py-12 text-center">Memuat data RSVP...</div>
      ) : filteredRsvps.length === 0 ? (
        <div className="text-xs text-[#5C4649] py-12 text-center glass-card rounded-2xl">
          Belum ada respon RSVP untuk kategori ini.
        </div>
      ) : (
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5EFE6] text-[#2C1A1D] uppercase tracking-wider font-semibold border-b border-[#C5A059]/20">
              <tr>
                <th className="p-4">Nama Tamu</th>
                <th className="p-4">Status Kehadiran</th>
                <th className="p-4">Jumlah Tamu</th>
                <th className="p-4">Pesan / Ucapan</th>
                <th className="p-4">Waktu Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/15 text-[#5C4649]">
              {filteredRsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="p-4 font-semibold text-[#2C1A1D]">
                    {rsvp.guestName}
                  </td>
                  <td className="p-4">
                    {rsvp.attendanceStatus === "attending" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-medium text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> InsyaAllah Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-medium text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Tidak Hadir
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-[#2C1A1D]">
                    {rsvp.attendanceStatus === "attending" ? `${rsvp.guestCount} Orang` : "-"}
                  </td>
                  <td className="p-4 max-w-xs truncate italic">
                    {rsvp.message || <span className="text-gray-400 not-italic">-</span>}
                  </td>
                  <td className="p-4 font-light text-[11px]">
                    {formatRelativeTime(rsvp.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRSVPPage;
