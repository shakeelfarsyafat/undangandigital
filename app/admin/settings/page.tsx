"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Save, Heart, Calendar, CreditCard, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"pengantin" | "acara" | "rekening" | "galeri">("pengantin");

  // Form states
  const [groomName, setGroomName] = useState("Ahmad");
  const [groomFullName, setGroomFullName] = useState("Ahmad Fauzi, S.T.");
  const [groomFather, setGroomFather] = useState("Bpk. H. Rahmat");
  const [groomMother, setGroomMother] = useState("Ibu Hj. Siti");

  const [brideName, setBrideName] = useState("Nabila");
  const [brideFullName, setBrideFullName] = useState("Nabila Putri, S.Ked.");
  const [brideFather, setBrideFather] = useState("Bpk. H. Hasan");
  const [brideMother, setBrideMother] = useState("Ibu Hj. Aminah");

  const [weddingDate, setWeddingDate] = useState("2026-12-20");

  const [akadEvent, setAkadEvent] = useState({
    id: "e-1",
    type: "akad",
    title: "Akad Nikah",
    date: "Minggu, 20 Desember 2026",
    startTime: "08.00",
    endTime: "10.00 WIB",
    venueName: "Masjid Agung Al-Azhar",
    venueAddress: "Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan",
    mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Azhar",
  });

  const [receptionEvent, setReceptionEvent] = useState({
    id: "e-2",
    type: "reception",
    title: "Resepsi Pernikahan",
    date: "Minggu, 20 Desember 2026",
    startTime: "11.00",
    endTime: "15.00 WIB",
    venueName: "Ballroom Hotel Grand Mahakam",
    venueAddress: "Jl. Mahakam No. 6, Kramat Pela, Kebayoran Baru, Jakarta Selatan",
    mapsUrl: "https://maps.google.com/?q=Hotel+Grand+Mahakam",
  });

  const [banks, setBanks] = useState<
    Array<{ id?: string; bankName: string; accountNumber: string; accountHolder: string }>
  >([
    { id: "b-1", bankName: "BCA", accountNumber: "1234567890", accountHolder: "Ahmad Fauzi" },
    { id: "b-2", bankName: "Mandiri", accountNumber: "9876543210", accountHolder: "Nabila Putri" },
  ]);

  const [groomPhotoUrl, setGroomPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
  );
  const [bridePhotoUrl, setBridePhotoUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
  );
  const [heroPhotoUrl, setHeroPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
  );

  const [galleryItems, setGalleryItems] = useState<
    Array<{ id?: string; imageUrl: string; altText?: string }>
  >([
    { id: "g-img-1", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 1" },
    { id: "g-img-2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 2" },
    { id: "g-img-3", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 3" },
    { id: "g-img-4", imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 4" },
    { id: "g-img-5", imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 5" },
    { id: "g-img-6", imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 6" },
  ]);

  const [loveStories, setLoveStories] = useState<
    Array<{ id?: string; year: string; title: string; description: string }>
  >([
    { id: "ls-1", year: "2021", title: "Pertama Bertemu", description: "Awal perkenalan di kampus saat aktif dalam kegiatan organisasi mahasiswa bersama." },
    { id: "ls-2", year: "2023", title: "Menjalin Hubungan", description: "Memutuskan untuk berkomitmen saling mendukung impian dan cita-cita masing-masing." },
    { id: "ls-3", year: "2026", title: "Lamaran", description: "Momen membahagiakan saat kedua keluarga besar bertemu dan mengikat janji suci." },
    { id: "ls-4", year: "2026", title: "Pernikahan", description: "Mengucap janji suci pernikahan dan mengarungi bahtera rumah tangga bersama." },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [uploadingGroom, setUploadingGroom] = useState(false);
  const [uploadingBride, setUploadingBride] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            const s = json.settings;
            if (s.groomName) setGroomName(s.groomName);
            if (s.groomFullName) setGroomFullName(s.groomFullName);
            if (s.groomFather) setGroomFather(s.groomFather);
            if (s.groomMother) setGroomMother(s.groomMother);
            if (s.groomPhotoUrl) setGroomPhotoUrl(s.groomPhotoUrl);
            if (s.brideName) setBrideName(s.brideName);
            if (s.brideFullName) setBrideFullName(s.brideFullName);
            if (s.brideFather) setBrideFather(s.brideFather);
            if (s.brideMother) setBrideMother(s.brideMother);
            if (s.bridePhotoUrl) setBridePhotoUrl(s.bridePhotoUrl);
            if (s.heroPhotoUrl) setHeroPhotoUrl(s.heroPhotoUrl);
            if (s.weddingDate) setWeddingDate(s.weddingDate);
          }
          if (json.events && Array.isArray(json.events)) {
            const akad = json.events.find((e: { type: string; id: string }) => e.type === "akad" || e.id === "e-1");
            if (akad) setAkadEvent((prev) => ({ ...prev, ...akad }));
            const reception = json.events.find((e: { type: string; id: string }) => e.type === "reception" || e.id === "e-2");
            if (reception) setReceptionEvent((prev) => ({ ...prev, ...reception }));
          }
          if (json.banks && Array.isArray(json.banks) && json.banks.length > 0) {
            setBanks(json.banks);
          }
          if (json.gallery && Array.isArray(json.gallery) && json.gallery.length > 0) {
            setGalleryItems(json.gallery);
          }
          if (json.loveStories && Array.isArray(json.loveStories) && json.loveStories.length > 0) {
            setLoveStories(json.loveStories);
          }
        }
      } catch {
        // fallback to defaults
      } finally {
        setIsFetching(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            groomName,
            groomFullName,
            groomFather,
            groomMother,
            groomPhotoUrl,
            brideName,
            brideFullName,
            brideFather,
            brideMother,
            bridePhotoUrl,
            heroPhotoUrl,
            weddingDate,
          },
          events: [akadEvent, receptionEvent],
          banks,
          gallery: galleryItems,
          loveStories,
        }),
      });

      if (res.ok) {
        toast.success("Pengaturan, foto, & galeri berhasil diperbarui!");
      } else {
        toast.error("Gagal menyimpan pengaturan");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBank = () => {
    setBanks([...banks, { id: `b-${Date.now()}`, bankName: "BCA", accountNumber: "", accountHolder: "" }]);
  };

  const handleRemoveBank = (index: number) => {
    setBanks(banks.filter((_, idx) => idx !== index));
  };

  const handleBankChange = (index: number, field: string, value: string) => {
    const updated = [...banks];
    updated[index] = { ...updated[index], [field]: value };
    setBanks(updated);
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json.url;
      }
    } catch {
      // fallback
    }
    return null;
  };

  const handleAddGalleryItem = () => {
    setGalleryItems([
      ...galleryItems,
      {
        id: `g-img-${Date.now()}`,
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
        altText: `Foto Prewedding ${galleryItems.length + 1}`,
      },
    ]);
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGalleryItems(galleryItems.filter((_, idx) => idx !== index));
  };

  const handleGalleryItemChange = (index: number, field: string, value: string) => {
    const updated = [...galleryItems];
    updated[index] = { ...updated[index], [field]: value };
    setGalleryItems(updated);
  };

  const handleAddStory = () => {
    setLoveStories([
      ...loveStories,
      { id: `ls-${Date.now()}`, year: new Date().getFullYear().toString(), title: "Momen Bahagia", description: "" },
    ]);
  };

  const handleRemoveStory = (index: number) => {
    setLoveStories(loveStories.filter((_, idx) => idx !== index));
  };

  const handleStoryChange = (index: number, field: string, value: string) => {
    const updated = [...loveStories];
    updated[index] = { ...updated[index], [field]: value };
    setLoveStories(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-6">
        <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
          Kelola Data Mempelai
        </h1>
        <p className="text-xs text-[#5C4649] font-light mt-1">
          Atur data mempelai & kisah cinta, waktu & lokasi acara, rekening bank, serta foto galeri & sampul.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C5A059]/20 pb-2 overflow-x-auto">
        {[
          { id: "pengantin", label: "Data Mempelai & Kisah", icon: Heart },
          { id: "acara", label: "Acara & Lokasi", icon: Calendar },
          { id: "rekening", label: "Rekening Bank", icon: CreditCard },
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
              </div>
            </div>

            {/* Kisah Cinta Kami Section */}
            <div className="space-y-4 pt-6 border-t border-[#C5A059]/20">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
                    Kisah Cinta Kami (Love Story Timeline)
                  </h3>
                  <p className="text-xs text-[#5C4649] font-light mt-0.5">
                    Kelola momen-momen perjalanan cinta kedua mempelai.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStory}
                  className="btn-gold py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Tambah Momen Kisah
                </button>
              </div>

              <div className="space-y-4">
                {loveStories.map((story, idx) => (
                  <div
                    key={story.id || idx}
                    className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 space-y-3 relative shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                        Momen #{idx + 1}
                      </span>
                      {loveStories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStory(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Tahun *</label>
                        <input
                          type="text"
                          required
                          value={story.year}
                          onChange={(e) => handleStoryChange(idx, "year", e.target.value)}
                          className="w-full p-2.5 bg-white rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                          placeholder="2021"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-3">
                        <label className="text-xs font-semibold">Judul Momen Kisah *</label>
                        <input
                          type="text"
                          required
                          value={story.title}
                          onChange={(e) => handleStoryChange(idx, "title", e.target.value)}
                          className="w-full p-2.5 bg-white rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                          placeholder="Pertama Bertemu"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-4">
                        <label className="text-xs font-semibold">Cerita Singkat Momen *</label>
                        <textarea
                          rows={2}
                          required
                          value={story.description}
                          onChange={(e) => handleStoryChange(idx, "description", e.target.value)}
                          className="w-full p-2.5 bg-white rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] resize-none"
                          placeholder="Awal perkenalan di kampus..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "acara" && (
          <div className="space-y-8">
            {/* Tanggal Utama */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#2C1A1D] border-b border-[#C5A059]/20 pb-2">
                Tanggal & Waktu Utama (Hitung Mundur)
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

            {/* Akad Nikah */}
            <div className="space-y-4 pt-4 border-t border-[#C5A059]/20">
              <h3 className="font-serif text-xl font-bold text-[#2C1A1D] border-b border-[#C5A059]/20 pb-2">
                Acara 1: Akad Nikah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Judul Acara *</label>
                  <input
                    type="text"
                    required
                    value={akadEvent.title}
                    onChange={(e) => setAkadEvent({ ...akadEvent, title: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Tanggal Teks (misal: Minggu, 20 Desember 2026) *</label>
                  <input
                    type="text"
                    required
                    value={akadEvent.date}
                    onChange={(e) => setAkadEvent({ ...akadEvent, date: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Waktu Mulai *</label>
                  <input
                    type="text"
                    required
                    value={akadEvent.startTime}
                    onChange={(e) => setAkadEvent({ ...akadEvent, startTime: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                    placeholder="08.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Waktu Selesai *</label>
                  <input
                    type="text"
                    required
                    value={akadEvent.endTime}
                    onChange={(e) => setAkadEvent({ ...akadEvent, endTime: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                    placeholder="10.00 WIB"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Nama Tempat / Venue *</label>
                  <input
                    type="text"
                    required
                    value={akadEvent.venueName}
                    onChange={(e) => setAkadEvent({ ...akadEvent, venueName: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Alamat Lengkap Tempat *</label>
                  <textarea
                    rows={2}
                    required
                    value={akadEvent.venueAddress}
                    onChange={(e) => setAkadEvent({ ...akadEvent, venueAddress: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Link Google Maps (URL) *</label>
                  <input
                    type="url"
                    required
                    value={akadEvent.mapsUrl}
                    onChange={(e) => setAkadEvent({ ...akadEvent, mapsUrl: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Resepsi Pernikahan */}
            <div className="space-y-4 pt-4 border-t border-[#C5A059]/20">
              <h3 className="font-serif text-xl font-bold text-[#2C1A1D] border-b border-[#C5A059]/20 pb-2">
                Acara 2: Resepsi Pernikahan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Judul Acara *</label>
                  <input
                    type="text"
                    required
                    value={receptionEvent.title}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, title: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Tanggal Teks (misal: Minggu, 20 Desember 2026) *</label>
                  <input
                    type="text"
                    required
                    value={receptionEvent.date}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, date: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Waktu Mulai *</label>
                  <input
                    type="text"
                    required
                    value={receptionEvent.startTime}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, startTime: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                    placeholder="11.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Waktu Selesai *</label>
                  <input
                    type="text"
                    required
                    value={receptionEvent.endTime}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, endTime: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                    placeholder="15.00 WIB"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Nama Tempat / Venue *</label>
                  <input
                    type="text"
                    required
                    value={receptionEvent.venueName}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, venueName: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Alamat Lengkap Tempat *</label>
                  <textarea
                    rows={2}
                    required
                    value={receptionEvent.venueAddress}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, venueAddress: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold">Link Google Maps (URL) *</label>
                  <input
                    type="url"
                    required
                    value={receptionEvent.mapsUrl}
                    onChange={(e) => setReceptionEvent({ ...receptionEvent, mapsUrl: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rekening" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
                  Daftar Rekening Bank & Digital
                </h3>
                <p className="text-xs text-[#5C4649] font-light mt-0.5">
                  Kelola nomor rekening bank untuk menerima tanda kasih dari tamu undangan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBank}
                className="btn-gold py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Tambah Rekening
              </button>
            </div>

            <div className="space-y-4">
              {banks.map((bank, idx) => (
                <div
                  key={bank.id || idx}
                  className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 space-y-3 relative shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                      Rekening #{idx + 1}
                    </span>
                    {banks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBank(idx)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Nama Bank (misal: BCA / Mandiri / QRIS) *</label>
                      <input
                        type="text"
                        required
                        value={bank.bankName}
                        onChange={(e) => handleBankChange(idx, "bankName", e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                        placeholder="BCA"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Nomor Rekening *</label>
                      <input
                        type="text"
                        required
                        value={bank.accountNumber}
                        onChange={(e) => handleBankChange(idx, "accountNumber", e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Nama Pemilik Rekening *</label>
                      <input
                        type="text"
                        required
                        value={bank.accountHolder}
                        onChange={(e) => handleBankChange(idx, "accountHolder", e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                        placeholder="Ahmad Fauzi"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "galeri" && (
          <div className="space-y-8">
            {/* Foto Utama Halaman Utama (Hero Banner) */}
            <div className="space-y-4">
              <div className="border-b border-[#C5A059]/20 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
                  Foto Cover & Halaman Utama (Hero Banner)
                </h3>
                <p className="text-xs text-[#5C4649] font-light mt-0.5">
                  Unggah foto pasangan yang ditampilkan pada Banner Lengkungan (Hero Section) di halaman paling depan undangan.
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-28 h-36 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#C5A059] shrink-0 bg-white shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroPhotoUrl}
                    alt="Foto Utama Halaman Utama"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <span className="text-xs font-bold text-[#8B6508] uppercase tracking-wider block">
                    Foto Sampul / Hero Arch Image
                  </span>
                  <p className="text-xs text-[#5C4649] font-light">
                    Foto ini akan muncul di paling depan begitu tamu membuka undangan digital Anda.
                  </p>
                  <div>
                    <label className="btn-gold py-2.5 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                      <Upload className="w-4 h-4" />
                      {uploadingHero ? "Mengunggah..." : "Pilih & Upload Foto Sampul Utama"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingHero}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingHero(true);
                            const url = await handleFileUpload(file);
                            if (url) {
                              setHeroPhotoUrl(url);
                              toast.success("Foto Sampul Utama berhasil diunggah!");
                            } else {
                              toast.error("Gagal mengunggah foto");
                            }
                            setUploadingHero(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Foto Profil Mempelai */}
            <div className="space-y-4 pt-4 border-t border-[#C5A059]/20">
              <div className="border-b border-[#C5A059]/20 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
                  Foto Profil Mempelai
                </h3>
                <p className="text-xs text-[#5C4649] font-light mt-0.5">
                  Unggah foto profil lingkar yang ditampilkan pada halaman Mempelai Pengantin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Groom Photo Upload */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 space-y-3 shadow-sm">
                  <span className="text-xs font-bold text-[#8B6508] uppercase tracking-wider">
                    Foto Mempelai Pria
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C5A059] shrink-0 bg-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={groomPhotoUrl}
                        alt="Foto Mempelai Pria"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-semibold block">Pilih File Foto *</label>
                      <label className="btn-gold py-2 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingGroom ? "Mengunggah..." : "Upload Foto Pria"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingGroom}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadingGroom(true);
                              const url = await handleFileUpload(file);
                              if (url) {
                                setGroomPhotoUrl(url);
                                toast.success("Foto Mempelai Pria berhasil diunggah!");
                              } else {
                                toast.error("Gagal mengunggah foto");
                              }
                              setUploadingGroom(false);
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-[#5C4649] font-light">JPG, PNG, atau WEBP</p>
                    </div>
                  </div>
                </div>

                {/* Bride Photo Upload */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 space-y-3 shadow-sm">
                  <span className="text-xs font-bold text-[#8B6508] uppercase tracking-wider">
                    Foto Mempelai Wanita
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C5A059] shrink-0 bg-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bridePhotoUrl}
                        alt="Foto Mempelai Wanita"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-semibold block">Pilih File Foto *</label>
                      <label className="btn-gold py-2 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingBride ? "Mengunggah..." : "Upload Foto Wanita"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingBride}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadingBride(true);
                              const url = await handleFileUpload(file);
                              if (url) {
                                setBridePhotoUrl(url);
                                toast.success("Foto Mempelai Wanita berhasil diunggah!");
                              } else {
                                toast.error("Gagal mengunggah foto");
                              }
                              setUploadingBride(false);
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-[#5C4649] font-light">JPG, PNG, atau WEBP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Galeri Prewedding / Album Foto */}
            <div className="space-y-4 pt-4 border-t border-[#C5A059]/20">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C1A1D]">
                    Galeri Foto Prewedding
                  </h3>
                  <p className="text-xs text-[#5C4649] font-light mt-0.5">
                    Unggah foto-foto kenangan / prewedding dari perangkat Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddGalleryItem}
                  className="btn-gold py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Tambah Foto Galeri
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 space-y-3 relative shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                        Foto #{idx + 1}
                      </span>
                      {galleryItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#C5A059]/40 shrink-0 bg-white shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.altText || `Foto Galeri ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#2C1A1D] block">Ganti Foto *</label>
                          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B6508] bg-[#FFFDF9] border border-[#C5A059]/40 py-1.5 px-3 rounded-xl cursor-pointer hover:bg-[#FAF5EB] transition-all shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadingGalleryIndex === idx ? "Mengunggah..." : "Upload Gambar"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingGalleryIndex === idx}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadingGalleryIndex(idx);
                                  const url = await handleFileUpload(file);
                                  if (url) {
                                    handleGalleryItemChange(idx, "imageUrl", url);
                                    toast.success(`Foto #${idx + 1} berhasil diunggah!`);
                                  } else {
                                    toast.error("Gagal mengunggah foto");
                                  }
                                  setUploadingGalleryIndex(null);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[11px] font-semibold text-[#2C1A1D]">Judul/Keterangan Foto</label>
                          <input
                            type="text"
                            value={item.altText || ""}
                            onChange={(e) => handleGalleryItemChange(idx, "altText", e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                            placeholder="Foto Prewedding"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
