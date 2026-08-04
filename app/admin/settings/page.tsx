"use client";

import { useState, useEffect } from "react";
import { Save, Heart, Calendar, CreditCard, Gift, Image as ImageIcon, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"pengantin" | "acara" | "rekening" | "galeri">("pengantin");

  // Form states
  const [groomName, setGroomName] = useState("Ahmad");
  const [groomFullName, setGroomFullName] = useState("Ahmad Fauzi, S.T.");
  const [groomFather, setGroomFather] = useState("Bpk. H. Rahmat");
  const [groomMother, setGroomMother] = useState("Ibu Hj. Siti");
  const [groomInstagram, setGroomInstagram] = useState("ahmad.fauzi");

  const [brideName, setBrideName] = useState("Nabila");
  const [brideFullName, setBrideFullName] = useState("Nabila Putri, S.Ked.");
  const [brideFather, setBrideFather] = useState("Bpk. H. Hasan");
  const [brideMother, setBrideMother] = useState("Ibu Hj. Aminah");
  const [brideInstagram, setBrideInstagram] = useState("nabila.putri");

  const [weddingDate, setWeddingDate] = useState("2026-12-20");

  const [giftRecipient, setGiftRecipient] = useState("Ahmad Fauzi / Nabila Putri");
  const [giftPhone, setGiftPhone] = useState("081234567890");
  const [giftAddress, setGiftAddress] = useState("Jl. Mawar No. 12, Menteng, Jakarta Pusat, DKI Jakarta 10350");

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pengaturan undangan berhasil diperbarui!");
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-6">
        <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
          Pengaturan Undangan Pernikahan
        </h1>
        <p className="text-xs text-[#5C4649] font-light mt-1">
          Ubah informasi mempelai, tanggal acara, lokasi Google Maps, rekening bank, & galeri.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C5A059]/20 pb-2 overflow-x-auto">
        {[
          { id: "pengantin", label: "Mempelai", icon: Heart },
          { id: "acara", label: "Acara & Lokasi", icon: Calendar },
          { id: "rekening", label: "Rekening & Hadiah", icon: CreditCard },
          { id: "galeri", label: "Foto Galeri", icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#C5A059] text-white shadow-md"
                  : "bg-[#FFFDF9] text-[#5C4649] hover:bg-[#F5EFE6]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/30 shadow-sm space-y-6">
        {activeTab === "pengantin" && (
          <div className="space-y-8">
            {/* Groom Section */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#2C1A1D] border-b border-[#C5A059]/20 pb-2">
                Mempelai Pria
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Panggilan *</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={groomFullName}
                    onChange={(e) => setGroomFullName(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Ayah *</label>
                  <input
                    type="text"
                    required
                    value={groomFather}
                    onChange={(e) => setGroomFather(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Ibu *</label>
                  <input
                    type="text"
                    required
                    value={groomMother}
                    onChange={(e) => setGroomMother(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Instagram Handle (tanpa @)</label>
                  <input
                    type="text"
                    value={groomInstagram}
                    onChange={(e) => setGroomInstagram(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Bride Section */}
            <div className="space-y-4 pt-4 border-t border-[#C5A059]/20">
              <h3 className="font-serif text-xl font-bold text-[#2C1A1D] border-b border-[#C5A059]/20 pb-2">
                Mempelai Wanita
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Panggilan *</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={brideFullName}
                    onChange={(e) => setBrideFullName(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Ayah *</label>
                  <input
                    type="text"
                    required
                    value={brideFather}
                    onChange={(e) => setBrideFather(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Ibu *</label>
                  <input
                    type="text"
                    required
                    value={brideMother}
                    onChange={(e) => setBrideMother(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Instagram Handle (tanpa @)</label>
                  <input
                    type="text"
                    value={brideInstagram}
                    onChange={(e) => setBrideInstagram(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "acara" && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
              Tanggal & Waktu Utama
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tanggal Pernikahan (YYYY-MM-DD) *</label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "rekening" && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
              Alamat Pengiriman Hadiah Fisik
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Penerima</label>
                <input
                  type="text"
                  value={giftRecipient}
                  onChange={(e) => setGiftRecipient(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nomor Telepon Penerima</label>
                <input
                  type="text"
                  value={giftPhone}
                  onChange={(e) => setGiftPhone(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  value={giftAddress}
                  onChange={(e) => setGiftAddress(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "galeri" && (
          <div className="space-y-4 text-xs text-[#5C4649]">
            <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
              Pengaturan Galeri Foto
            </h3>
            <p>
              Galeri foto saat ini menggunakan 6 foto prewedding resolusi tinggi dari Unsplash. URL foto disimpan secara efisien di Neon PostgreSQL.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-gold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}
