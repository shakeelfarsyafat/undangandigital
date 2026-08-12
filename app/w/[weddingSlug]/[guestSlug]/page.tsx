"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { LoadingScreen } from "@/components/invitation/LoadingScreen";
import { Cover } from "@/components/invitation/Cover";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { Hero } from "@/components/invitation/Hero";
import { Ayat } from "@/components/invitation/Ayat";
import { Couple } from "@/components/invitation/Couple";
import { LoveStory } from "@/components/invitation/LoveStory";
import { Gallery } from "@/components/invitation/Gallery";
import { SaveTheDate } from "@/components/invitation/SaveTheDate";
import { LocationMap } from "@/components/invitation/LocationMap";
import { WeddingGift } from "@/components/invitation/WeddingGift";
import { RSVPForm } from "@/components/invitation/RSVPForm";
import { WishesSection } from "@/components/invitation/WishesSection";
import { Closing } from "@/components/invitation/Closing";

interface PageProps {
  params: Promise<{ weddingSlug: string; guestSlug: string }>;
}

export default function MultiTenantInvitationPage({ params }: PageProps) {
  const { weddingSlug, guestSlug } = use(params);

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [reloadWishes, setReloadWishes] = useState(0);
  const [data, setData] = useState<{
    guest: { id: string; name: string; slug: string; category: string };
    settings: {
      groomName: string;
      groomFullName: string;
      groomFather: string;
      groomMother: string;
      groomInstagram?: string;
      groomPhotoUrl?: string;
      brideName: string;
      brideFullName: string;
      brideFather: string;
      brideMother: string;
      brideInstagram?: string;
      bridePhotoUrl?: string;
      weddingDate: string;
      heroPhotoUrl?: string;
      musicUrl?: string | null;
      quoteText?: string;
      giftRecipient?: string;
      giftPhone?: string;
      giftAddress?: string;
    };
    events: Array<{
      id: string;
      type: string;
      title: string;
      date: string;
      startTime: string;
      endTime: string;
      venueName: string;
      venueAddress: string;
      mapsUrl: string;
    }>;
    banks: Array<{
      id: string;
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    }>;
    loveStories?: Array<{
      id: string;
      year: string;
      title: string;
      description: string;
    }>;
    gallery?: Array<{
      id: string;
      imageUrl: string;
      altText?: string;
    }>;
  } | null>(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchInvitationData() {
      try {
        const res = await fetch(`/api/invite?weddingSlug=${weddingSlug}&guestSlug=${guestSlug}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = await res.json();
        setData(json);

        // Mark guest as opened
        if (json.guest?.id && !json.guest.id.startsWith("g-guest") && !json.guest.id.startsWith("general-")) {
          fetch(`/api/invite/open`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestId: json.guest.id }),
          }).catch(() => {});
        }
      } catch {
        setError(true);
      }
    }

    fetchInvitationData();
  }, [weddingSlug, guestSlug]);

  if (error) {
    return notFound();
  }

  if (!data) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#FDFBF7] text-[#1E100A] font-serif text-sm">
        Memuat undangan digital...
      </div>
    );
  }

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
  };

  return (
    <main className="relative min-h-[100dvh] w-full max-w-md mx-auto bg-[#FDFBF7] shadow-2xl overflow-hidden font-sans">
      {isLoadingScreen && (
        <LoadingScreen
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
          onFinish={() => setIsLoadingScreen(false)}
        />
      )}

      {!isCoverOpen && (
        <Cover
          guestName={data.guest.name}
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
          onOpen={handleOpenInvitation}
        />
      )}

      <MusicPlayer isPlaying={isCoverOpen} musicUrl={data.settings.musicUrl} />

      <div
        className={`h-full w-full overflow-y-auto scroll-smooth snap-y snap-mandatory ${
          !isCoverOpen ? "opacity-30 blur-sm pointer-events-none" : "opacity-100"
        }`}
      >
        <Hero
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
          weddingDate={data.settings.weddingDate}
          heroPhotoUrl={data.settings.heroPhotoUrl}
        />

        <Ayat />

        <Couple settings={data.settings} />

        <LoveStory stories={data.loveStories || []} />

        {data.gallery && data.gallery.length > 0 && <Gallery items={data.gallery} />}

        <SaveTheDate events={data.events || []} />

        <LocationMap
          targetDate={`${data.settings.weddingDate}T08:00:00`}
          venueName={data.events?.[0]?.venueName}
          venueAddress={data.events?.[0]?.venueAddress}
          mapsUrl={data.events?.[0]?.mapsUrl}
        />

        <WeddingGift banks={data.banks || []} />

        <RSVPForm
          guestId={data.guest.id}
          guestName={data.guest.name}
          onSubmitted={() => setReloadWishes((prev) => prev + 1)}
        />

        <WishesSection
          guestId={data.guest.id}
          weddingSlug={weddingSlug}
          reloadKey={reloadWishes}
        />

        <Closing
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
        />
      </div>
    </main>
  );
}
