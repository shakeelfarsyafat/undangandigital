"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/invitation/LoadingScreen";
import { Cover } from "@/components/invitation/Cover";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { Hero } from "@/components/invitation/Hero";
import { Ayat } from "@/components/invitation/Ayat";
import { Couple } from "@/components/invitation/Couple";
import { LoveStory } from "@/components/invitation/LoveStory";
import { SaveTheDate } from "@/components/invitation/SaveTheDate";
import { LocationMap } from "@/components/invitation/LocationMap";
import { WeddingGift } from "@/components/invitation/WeddingGift";
import { RSVPForm } from "@/components/invitation/RSVPForm";
import { WishesSection } from "@/components/invitation/WishesSection";
import { Closing } from "@/components/invitation/Closing";

export default function GeneralInvitationPage() {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  // Default General Invitation Data
  const defaultData = {
    guest: {
      id: "general-guest-id",
      name: "Tamu Undangan",
      slug: "tamu-undangan",
      category: "Umum",
    },
    settings: {
      groomName: "Ahmad",
      groomFullName: "Ahmad Fauzi, S.T.",
      groomFather: "Bpk. H. Rahmat",
      groomMother: "Ibu Hj. Siti",
      groomInstagram: "ahmad.fauzi",
      groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      brideName: "Nabila",
      brideFullName: "Nabila Putri, S.Ked.",
      brideFather: "Bpk. H. Hasan",
      brideMother: "Ibu Hj. Aminah",
      brideInstagram: "nabila.putri",
      bridePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      weddingDate: "2026-12-20",
      heroPhotoUrl: "",
      quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...",
      giftRecipient: "Ahmad Fauzi / Nabila Putri",
      giftPhone: "081234567890",
      giftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat, DKI Jakarta 10350",
    },
    events: [
      {
        id: "e-1",
        type: "akad",
        title: "Akad Nikah",
        date: "Minggu, 20 Desember 2026",
        startTime: "08.00",
        endTime: "10.00 WIB",
        venueName: "Masjid Agung Al-Azhar",
        venueAddress: "Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan",
        mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Azhar",
      },
      {
        id: "e-2",
        type: "reception",
        title: "Resepsi Pernikahan",
        date: "Minggu, 20 Desember 2026",
        startTime: "11.00",
        endTime: "15.00 WIB",
        venueName: "Ballroom Hotel Grand Mahakam",
        venueAddress: "Jl. Mahakam No. 6, Kramat Pela, Kebayoran Baru, Jakarta Selatan",
        mapsUrl: "https://maps.google.com/?q=Hotel+Grand+Mahakam",
      },
    ],
    banks: [
      {
        id: "b-1",
        bankName: "BCA",
        accountNumber: "1234567890",
        accountHolder: "Ahmad Fauzi",
      },
      {
        id: "b-2",
        bankName: "Mandiri",
        accountNumber: "9876543210",
        accountHolder: "Nabila Putri",
      },
    ],
    loveStories: [
      {
        id: "ls-1",
        year: "2021",
        title: "Pertama Bertemu",
        description: "Awal perkenalan di kampus saat aktif dalam kegiatan organisasi mahasiswa bersama.",
      },
      {
        id: "ls-2",
        year: "2023",
        title: "Menjalin Hubungan",
        description: "Memutuskan untuk berkomitmen saling mendukung impian dan cita-cita masing-masing.",
      },
      {
        id: "ls-3",
        year: "2026",
        title: "Lamaran",
        description: "Momen membahagiakan saat kedua keluarga besar bertemu dan mengikat janji suci.",
      },
      {
        id: "ls-4",
        year: "2026",
        title: "Pernikahan",
        description: "Mengucap janji suci pernikahan dan mengarungi bahtera rumah tangga bersama.",
      },
    ],
    gallery: [
      {
        id: "g-img-1",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 1",
      },
      {
        id: "g-img-2",
        imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 2",
      },
      {
        id: "g-img-3",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 3",
      },
      {
        id: "g-img-4",
        imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 4",
      },
      {
        id: "g-img-5",
        imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 5",
      },
      {
        id: "g-img-6",
        imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 6",
      },
    ],
  };

  // Prevent background scroll when cover is active
  useEffect(() => {
    if (!isCoverOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCoverOpen]);

  return (
    <main className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#FAF8F5] relative max-w-md mx-auto shadow-2xl border-x border-[#C5A059]/10 overflow-hidden">
      {/* Loading Screen */}
      {isLoadingScreen && (
        <LoadingScreen onFinish={() => setIsLoadingScreen(false)} />
      )}

      {/* Fullscreen Cover Modal */}
      {!isCoverOpen && (
        <Cover
          guestName={defaultData.guest.name}
          groomName={defaultData.settings.groomName}
          brideName={defaultData.settings.brideName}
          onOpen={() => setIsCoverOpen(true)}
        />
      )}

      {/* Floating Music Player */}
      <MusicPlayer isPlaying={isCoverOpen} />

      {/* Main Invitation Sections with Snap Scrolling */}
      <div className={`h-full w-full overflow-y-auto scroll-smooth snap-y snap-mandatory ${!isCoverOpen ? "opacity-30 blur-sm pointer-events-none" : "opacity-100"}`}>
        <Hero
          groomName={defaultData.settings.groomName}
          brideName={defaultData.settings.brideName}
          weddingDate={defaultData.settings.weddingDate}
          heroPhotoUrl={defaultData.settings.heroPhotoUrl}
        />

        <Ayat />

        <Couple settings={defaultData.settings} />

        <LoveStory stories={defaultData.loveStories} />

        <SaveTheDate events={defaultData.events} />

        <LocationMap
          targetDate={`${defaultData.settings.weddingDate}T08:00:00`}
          venueName={defaultData.events[0]?.venueName}
          venueAddress={defaultData.events[0]?.venueAddress}
          mapsUrl={defaultData.events[0]?.mapsUrl}
        />

        <WeddingGift
          banks={defaultData.banks}
        />

        <RSVPForm guestId={defaultData.guest.id} guestName={defaultData.guest.name} />

        <Closing
          groomName={defaultData.settings.groomName}
          brideName={defaultData.settings.brideName}
        />
      </div>
    </main>
  );
}
