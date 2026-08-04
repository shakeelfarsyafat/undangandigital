"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import { createWhatsAppShareUrl } from "@/lib/whatsapp";

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

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Teman");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

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

      toast.success(`Tamu "${nameInput}" berhasil ditambahkan! Link: /invite/${data.guest.slug}`);
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
      const res = await fetch(`/api/admin/guests?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus tamu");
      }

      toast.success(`Tamu "${name}" berhasil dihapus`);
      fetchGuests();
    } catch {
      toast.error("Gagal menghapus tamu");
    }
  };

  const copyLink = (slug: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const inviteUrl = `${origin}/invite/${slug}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(id);
    toast.success("Link undangan berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "Semua" || g.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A059]/20 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
            Daftar Tamu Undangan
          </h1>
          <p className="text-xs text-[#5C4649] font-light mt-1">
            Kelola tamu, buat link undangan personalisasi otomatis, copy link & kirim pesan WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Tambah Tamu
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFDF9] p-4 rounded-2xl border border-[#C5A059]/30 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A47E3B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama tamu / slug..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["Semua", "Keluarga", "Teman", "Kampus", "Organisasi", "Rekan Kerja", "Lainnya"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#C5A059] text-white font-semibold shadow"
                  : "bg-[#FAF8F5] text-[#5C4649] hover:bg-[#F5EFE6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      {isLoading ? (
        <div className="text-xs text-[#5C4649] py-12 text-center">Memuat daftar tamu...</div>
      ) : filteredGuests.length === 0 ? (
        <div className="text-xs text-[#5C4649] py-12 text-center glass-card rounded-2xl">
          Tidak ada tamu yang sesuai dengan pencarian.
        </div>
      ) : (
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5EFE6] text-[#2C1A1D] uppercase tracking-wider font-semibold border-b border-[#C5A059]/20">
              <tr>
                <th className="p-4">Nama Tamu</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Status Dibuka</th>
                <th className="p-4">Status RSVP</th>
                <th className="p-4">Link Undangan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/15 text-[#5C4649]">
              {filteredGuests.map((guest) => {
                const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
                const inviteUrl = `${origin}/invite/${guest.slug}`;
                const waUrl = createWhatsAppShareUrl({
                  phone: guest.phone,
                  guestName: guest.name,
                  groomName: "Ahmad",
                  brideName: "Nabila",
                  invitationUrl: inviteUrl,
                });

                return (
                  <tr key={guest.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="p-4 font-semibold text-[#2C1A1D]">
                      {guest.name}
                      <span className="block font-mono text-[10px] text-[#A47E3B] font-normal">
                        /invite/{guest.slug}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#C5A059]/10 text-[#A47E3B] font-medium rounded-full text-[11px]">
                        {guest.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      {guest.phone || <span className="text-gray-400 font-sans italic">-</span>}
                    </td>
                    <td className="p-4">
                      {guest.invitationStatus === "opened" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium text-[11px]">
                          <Eye className="w-3.5 h-3.5" /> Dibuka
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-[11px]">
                          <EyeOff className="w-3.5 h-3.5" /> Belum
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {guest.rsvpStatus === "attending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-medium text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Hadir ({guest.guestCount || 1})
                        </span>
                      ) : guest.rsvpStatus === "declined" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-medium text-[11px]">
                          Tidak Hadir
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium text-[11px]">
                          Belum Konfirmasi
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <a
                        href={`/invite/${guest.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C5A059] font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Buka <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Copy Link */}
                        <button
                          onClick={() => copyLink(guest.slug, guest.id)}
                          title="Salin Link"
                          className="p-2 rounded-lg bg-[#FAF8F5] text-[#A47E3B] hover:bg-[#C5A059] hover:text-white transition-colors cursor-pointer border border-[#C5A059]/30"
                        >
                          {copiedId === guest.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* WhatsApp button */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Kirim WhatsApp"
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-300"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteGuest(guest.id, guest.name)}
                          title="Hapus Tamu"
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border border-rose-200"
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

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-[#2C1A1D] p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl border border-[#C5A059]/30 space-y-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-[#5C4649] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold">
                + Tambah Tamu Baru
              </h3>
              <p className="text-xs text-[#5C4649]">
                Sistem akan otomatis menghasilkan slug unik dan link undangan personal.
              </p>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Tamu *</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Contoh: Faza Mohamad"
                  className="w-full p-3 bg-[#FFFDF9] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full p-3 bg-[#FFFDF9] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Kategori Tamu</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full p-3 bg-[#FFFDF9] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  {["Keluarga", "Teman", "Kampus", "Organisasi", "Rekan Kerja", "Lainnya"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold py-3 px-6 rounded-xl text-xs font-semibold shadow-lg cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Tamu & Buat Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
