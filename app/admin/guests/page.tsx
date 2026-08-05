"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  Copy,
  MessageCircle,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  Check,
  XCircle,
  UserCheck,
  FileSpreadsheet,
  Download,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { createWhatsAppShareUrl } from "@/lib/whatsapp";
import { formatRelativeTime } from "@/lib/utils";

interface Guest {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  category: string;
  invitationStatus: string;
  openedAt?: string | null;
  rsvpStatus: string;
  guestCount?: number;
}

interface RSVPItem {
  id: string;
  guestId: string;
  guestName: string;
  attendanceStatus: string;
  guestCount: number;
  message?: string | null;
  createdAt: string | Date;
}

function AdminGuestsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "guests" | "rsvp") || "guests";
  const [activeMainTab, setActiveMainTab] = useState<"guests" | "rsvp">(initialTab === "rsvp" ? "rsvp" : "guests");

  // Guests State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [isGuestLoading, setIsGuestLoading] = useState(true);

  // RSVP State
  const [rsvps, setRsvps] = useState<RSVPItem[]>([]);
  const [rsvpFilter, setRsvpFilter] = useState<"Semua" | "Hadir" | "Tidak Hadir">("Semua");
  const [isRsvpLoading, setIsRsvpLoading] = useState(true);

  // Modal Add Guest State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Teman");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Excel Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [parsedGuests, setParsedGuests] = useState<Array<{ name: string; phone?: string; category?: string }>>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Fetch Guests
  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/guests");
      if (res.ok) {
        const json = await res.json();
        setGuests(json.guests || []);
      }
    } catch {
      toast.error("Gagal memuat data tamu");
    } finally {
      setIsGuestLoading(false);
    }
  }, []);

  // Fetch RSVPs
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
      setIsRsvpLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
    fetchRsvps();
  }, [fetchGuests, fetchRsvps]);

  // Guest Handlers
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          phone: phoneInput,
          category: categoryInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan tamu");
      }

      toast.success(`Tamu "${nameInput}" berhasil ditambahkan!`);
      setNameInput("");
      setPhoneInput("");
      setIsAddModalOpen(false);
      fetchGuests();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus tamu "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Tamu "${name}" berhasil dihapus`);
        fetchGuests();
      } else {
        toast.error("Gagal menghapus tamu");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus tamu");
    }
  };

  const copyToClipboard = (slug: string, id: string) => {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link undangan berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (guest: Guest) => {
    const inviteUrl = `${window.location.origin}/invite/${guest.slug}`;
    const waUrl = createWhatsAppShareUrl({
      phone: guest.phone,
      guestName: guest.name,
      groomName: "Mempelai",
      brideName: "Pasangan",
      invitationUrl: inviteUrl,
    });
    window.open(waUrl, "_blank");
  };

  // Download Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      { "Nama Tamu": "Bpk. Budi & Keluarga", "Nomor Telepon": "081234567890", "Kategori": "Keluarga" },
      { "Nama Tamu": "Siti Rahma", "Nomor Telepon": "081299990003", "Kategori": "Teman" },
      { "Nama Tamu": "Deni Kurniawan", "Nomor Telepon": "081288880004", "Kategori": "Rekan Kerja" },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Tamu");
    XLSX.writeFile(workbook, "template_daftar_tamu_undangan.xlsx");
    toast.success("Template Excel berhasil diunduh!");
  };

  // Excel File Parsing Handler
  const handleExcelFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: Array<Record<string, string>> = XLSX.utils.sheet_to_json(worksheet);

      const extracted = json
        .map((row) => {
          const name = row["Nama Tamu"] || row["Nama"] || row["name"] || Object.values(row)[0] || "";
          const phone = row["Nomor Telepon"] || row["No HP"] || row["WhatsApp"] || row["phone"] || "";
          const category = row["Kategori"] || row["Category"] || row["category"] || "Lainnya";
          return {
            name: String(name).trim(),
            phone: String(phone).trim(),
            category: String(category).trim(),
          };
        })
        .filter((item) => item.name !== "" && item.name.toLowerCase() !== "nama tamu");

      if (extracted.length === 0) {
        toast.error("File Excel kosong atau format kolom tidak sesuai.");
        setParsedGuests([]);
        return;
      }

      setParsedGuests(extracted);
      toast.success(`Berhasil membaca ${extracted.length} data tamu dari file!`);
    } catch {
      toast.error("Gagal membaca file Excel / CSV");
    }
  };

  // Confirm Excel Bulk Import
  const handleConfirmImport = async () => {
    if (parsedGuests.length === 0) {
      toast.error("Tidak ada data tamu yang bisa di-import");
      return;
    }
    setIsImporting(true);

    try {
      const res = await fetch("/api/admin/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: parsedGuests }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.count} tamu berhasil di-import dari file Excel!`);
        setIsImportModalOpen(false);
        setParsedGuests([]);
        setImportFileName(null);
        fetchGuests();
      } else {
        toast.error("Gagal meng-import data tamu");
      }
    } catch {
      toast.error("Terjadi kesalahan saat import data");
    } finally {
      setIsImporting(false);
    }
  };

  // Filtered Guests
  const categories = ["Semua", "Keluarga", "Teman", "Kampus", "Organisasi", "Rekan Kerja", "Lainnya"];
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.slug.toLowerCase().includes(guestSearch.toLowerCase());
    const matchesCat = categoryFilter === "Semua" || g.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // RSVP Calculations
  const totalHadir = rsvps.filter((r) => r.attendanceStatus === "attending").length;
  const totalTidakHadir = rsvps.filter((r) => r.attendanceStatus === "declined").length;
  const totalPerkiraanOrang = rsvps
    .filter((r) => r.attendanceStatus === "attending")
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);

  const filteredRsvps = rsvps.filter((r) => {
    if (rsvpFilter === "Hadir") return r.attendanceStatus === "attending";
    if (rsvpFilter === "Tidak Hadir") return r.attendanceStatus === "declined";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
            Manajer Tamu & RSVP
          </h1>
          <p className="text-xs text-[#5C4649] font-light mt-1">
            Kelola daftar tamu undangan (manual & import Excel) dan pantau konfirmasi RSVP.
          </p>
        </div>

        {activeMainTab === "guests" && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              title="Unduh contoh format file Excel"
              className="py-2.5 px-3.5 rounded-xl border border-[#C5A059]/40 bg-[#FFFDF9] text-[#8B6508] hover:bg-[#FAF5EB] text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Template Excel
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="py-2.5 px-3.5 rounded-xl border border-[#C5A059]/40 bg-[#FFFDF9] text-[#8B6508] hover:bg-[#FAF5EB] text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Import Excel
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gold py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Tambah Tamu Manual
            </button>
          </div>
        )}
      </div>

      {/* Main Feature Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C5A059]/20 pb-2 overflow-x-auto">
        {[
          { id: "guests", label: `Daftar Tamu (${guests.length})`, icon: Users },
          { id: "rsvp", label: `Data RSVP & Ucapan (${rsvps.length})`, icon: CheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as typeof activeMainTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#C5A059] text-white shadow-md"
                  : "bg-[#FAF8F5] text-[#5C4649] hover:bg-[#F3EFEA]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DAFTAR TAMU */}
      {activeMainTab === "guests" && (
        <div className="space-y-6">
          {/* Summary Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[#5C4649] uppercase">Total Tamu</p>
                <p className="font-serif text-2xl font-bold text-[#2C1A1D]">{guests.length} Orang</p>
              </div>
              <Users className="w-7 h-7 text-[#C5A059] opacity-80" />
            </div>

            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[#5C4649] uppercase">Membuka Undangan</p>
                <p className="font-serif text-2xl font-bold text-[#2C1A1D]">
                  {guests.filter((g) => g.invitationStatus === "opened").length} Tamu
                </p>
              </div>
              <Eye className="w-7 h-7 text-emerald-600 opacity-80" />
            </div>

            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[#5C4649] uppercase">Konfirmasi RSVP</p>
                <p className="font-serif text-2xl font-bold text-[#2C1A1D]">
                  {guests.filter((g) => g.rsvpStatus === "attending" || g.rsvpStatus === "declined").length} Respon
                </p>
              </div>
              <CheckCircle className="w-7 h-7 text-blue-600 opacity-80" />
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDF9] p-4 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4649]/50" />
              <input
                type="text"
                placeholder="Cari nama tamu..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-[#C5A059] text-white font-semibold"
                      : "bg-[#FAF8F5] text-[#5C4649] hover:bg-[#F3EFEA]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 shadow-sm overflow-hidden">
            {isGuestLoading ? (
              <div className="p-8 text-center text-xs text-[#5C4649]">Memuat data tamu...</div>
            ) : filteredGuests.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5C4649]">
                Tidak ada data tamu yang ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#2C1A1D] border-b border-[#C5A059]/20 font-semibold">
                    <tr>
                      <th className="p-4">Nama Tamu</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Status Undangan</th>
                      <th className="p-4">Status RSVP</th>
                      <th className="p-4 text-right">Aksi & Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A059]/10 text-[#5C4649]">
                    {filteredGuests.map((guest) => {
                      const isOpened = guest.invitationStatus === "opened";
                      const isAttending = guest.rsvpStatus === "attending";
                      const isDeclined = guest.rsvpStatus === "declined";

                      return (
                        <tr key={guest.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="p-4 font-semibold text-[#2C1A1D]">
                            {guest.name}
                            {guest.phone && (
                              <span className="block text-[10px] font-normal text-[#5C4649]/70">
                                {guest.phone}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C5A059]/20 text-[10px] font-medium text-[#8B6508]">
                              {guest.category}
                            </span>
                          </td>
                          <td className="p-4">
                            {isOpened ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                                <Eye className="w-3.5 h-3.5" /> Dibuka
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400">
                                <EyeOff className="w-3.5 h-3.5" /> Belum Dibuka
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {isAttending ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                Hadir ({guest.guestCount || 1} orang)
                              </span>
                            ) : isDeclined ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-semibold text-[10px]">
                                Tidak Hadir
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[10px]">Belum Merespon</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => copyToClipboard(guest.slug, guest.id)}
                                title="Salin Link"
                                className="p-2 rounded-lg bg-[#FAF8F5] border border-[#C5A059]/30 text-[#8B6508] hover:bg-[#C5A059] hover:text-white transition-all cursor-pointer"
                              >
                                {copiedId === guest.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => openWhatsApp(guest)}
                                title="Kirim via WhatsApp"
                                className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`/invite/${guest.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Buka Undangan"
                                className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                title="Hapus Tamu"
                                className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DATA RSVP & PESAN UCAPAN */}
      {activeMainTab === "rsvp" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-green-50 text-green-800 border border-green-200 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">Konfirmasi Hadir</p>
                <p className="font-serif text-3xl font-bold">{totalHadir} Undangan</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-70" />
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">Tidak Dapat Hadir</p>
                <p className="font-serif text-3xl font-bold">{totalTidakHadir} Undangan</p>
              </div>
              <XCircle className="w-8 h-8 opacity-70" />
            </div>

            <div className="p-5 rounded-2xl bg-[#F5EFE6] text-[#A47E3B] border border-[#C5A059]/30 flex items-center justify-between shadow-sm">
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
                onClick={() => setRsvpFilter(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  rsvpFilter === tab
                    ? "bg-[#C5A059] text-white shadow-sm"
                    : "text-[#5C4649] hover:bg-[#FAF8F5]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* RSVP Table */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 shadow-sm overflow-hidden">
            {isRsvpLoading ? (
              <div className="p-8 text-center text-xs text-[#5C4649]">Memuat data RSVP...</div>
            ) : filteredRsvps.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5C4649]">
                Belum ada konfirmasi kehadiran (RSVP) yang masuk.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#2C1A1D] border-b border-[#C5A059]/20 font-semibold">
                    <tr>
                      <th className="p-4">Nama Tamu</th>
                      <th className="p-4">Status Kehadiran</th>
                      <th className="p-4">Jumlah Tamu</th>
                      <th className="p-4">Pesan & Doa Ucapan</th>
                      <th className="p-4 text-right">Waktu Konfirmasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A059]/10 text-[#5C4649]">
                    {filteredRsvps.map((rsvp) => {
                      const isAttending = rsvp.attendanceStatus === "attending";
                      return (
                        <tr key={rsvp.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="p-4 font-semibold text-[#2C1A1D]">{rsvp.guestName}</td>
                          <td className="p-4">
                            {isAttending ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                InsyaAllah Hadir
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold text-[10px]">
                                Tidak Dapat Hadir
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-medium text-[#2C1A1D]">
                            {isAttending ? `${rsvp.guestCount || 1} Orang` : "-"}
                          </td>
                          <td className="p-4 italic max-w-sm text-[#5C4649]">
                            {rsvp.message ? `"${rsvp.message}"` : "-"}
                          </td>
                          <td className="p-4 text-right text-[10px] text-[#5C4649]/70">
                            {formatRelativeTime(rsvp.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Tambah Tamu Manual */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-md rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C1A1D]">
                Tambah Tamu Undangan Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#5C4649] hover:text-[#2C1A1D] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Tamu / Keluarga *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bapak Budi & Keluarga"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: 081234567890"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Kategori *</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Keluarga">Keluarga</option>
                  <option value="Teman">Teman</option>
                  <option value="Kampus">Kampus</option>
                  <option value="Organisasi">Organisasi</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#5C4649] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan & Buat Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import File Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-lg rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#8B6508]" />
                <h3 className="font-serif text-lg font-bold text-[#2C1A1D]">
                  Import Tamu via Excel / CSV
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParsedGuests([]);
                  setImportFileName(null);
                }}
                className="text-[#5C4649] hover:text-[#2C1A1D] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 space-y-2">
                <p className="text-xs text-[#2C1A1D] font-semibold">Petunjuk Format File Excel:</p>
                <ul className="text-[11px] text-[#5C4649] space-y-1 list-disc pl-4 font-light">
                  <li>File mendukung format <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#C5A059]/20">.xlsx</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#C5A059]/20">.xls</code>, atau <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#C5A059]/20">.csv</code>.</li>
                  <li>Judul Kolom 1: <strong className="text-[#8B6508]">Nama Tamu</strong> (Wajib)</li>
                  <li>Judul Kolom 2: <strong className="text-[#8B6508]">Nomor Telepon</strong> (Opsional)</li>
                  <li>Judul Kolom 3: <strong className="text-[#8B6508]">Kategori</strong> (Misal: Keluarga / Teman)</li>
                </ul>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs font-semibold text-[#8B6508] underline hover:text-[#C5A059] inline-flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Contoh Template Excel
                </button>
              </div>

              {/* Upload Input Box */}
              <div className="space-y-1">
                <label className="text-xs font-semibold block">Pilih File Excel / CSV *</label>
                <label className="w-full border-2 border-dashed border-[#C5A059]/40 hover:border-[#C5A059] bg-[#FAF8F5] p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all">
                  <Upload className="w-8 h-8 text-[#C5A059] mb-2" />
                  <span className="text-xs font-semibold text-[#2C1A1D]">
                    {importFileName || "Klik di sini untuk memilih file Excel"}
                  </span>
                  <span className="text-[10px] text-[#5C4649]/70 mt-0.5">.xlsx, .xls, .csv</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleExcelFileSelect}
                  />
                </label>
              </div>

              {/* Preview extracted guests */}
              {parsedGuests.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#2C1A1D]">
                    <span>Pratinjau Data ({parsedGuests.length} Tamu Siap Di-import)</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto border border-[#C5A059]/30 rounded-xl bg-white p-2 divide-y divide-[#C5A059]/10 text-xs">
                    {parsedGuests.map((g, idx) => (
                      <div key={idx} className="py-1.5 px-2 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#2C1A1D]">{g.name}</span>
                          {g.phone && <span className="text-[10px] text-[#5C4649] ml-2">({g.phone})</span>}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#C5A059]/20 text-[#8B6508]">
                          {g.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#C5A059]/20">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParsedGuests([]);
                  setImportFileName(null);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#5C4649] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isImporting || parsedGuests.length === 0}
                className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {isImporting ? "Meng-import..." : `Import ${parsedGuests.length} Tamu`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminGuestsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-[#5C4649]">Memuat halaman tamu...</div>}>
      <AdminGuestsContent />
    </Suspense>
  );
}
