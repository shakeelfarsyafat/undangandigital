"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function InvitationPage({ params }: PageProps) {
  const { slug } = use(params);
  
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
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
    loveStories: Array<{
      id: string;
      year: string;
      title: string;
      description: string;
    }>;
    gallery: Array<{
      id: string;
      imageUrl: string;
      altText?: string;
    }>;
  } | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/invite/${slug}`);
        if (res.status === 404) {
          setIsError(true);
          return;
        }
        if (!res.ok) {
          setIsError(true);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setIsError(true);
      }
    }
    loadData();
  }, [slug]);

  if (isError) {
    return notFound();
  }

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

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <main className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#FAF8F5] relative max-w-md mx-auto shadow-2xl border-x border-[#C5A059]/10 overflow-hidden">
      {/* Loading Screen */}
      {isLoadingScreen && (
        <LoadingScreen onFinish={() => setIsLoadingScreen(false)} />
      )}

      {/* Fullscreen Cover Modal */}
      {!isCoverOpen && (
        <Cover
          guestName={data.guest.name}
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
          onOpen={() => setIsCoverOpen(true)}
        />
      )}

      {/* Floating Music Player */}
      <MusicPlayer isPlaying={isCoverOpen} />

      {/* Main Invitation Sections with Snap Scrolling */}
      <div className={`h-full w-full overflow-y-auto scroll-smooth snap-y snap-mandatory ${!isCoverOpen ? "opacity-30 blur-sm pointer-events-none" : "opacity-100"}`}>
        <Hero
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
          weddingDate={data.settings.weddingDate}
          heroPhotoUrl={data.settings.heroPhotoUrl}
        />

        <Ayat />

        <Couple settings={data.settings} />

        <LoveStory stories={data.loveStories} />

        <SaveTheDate events={data.events} />

        <LocationMap
          targetDate={`${data.settings.weddingDate}T08:00:00`}
          venueName={data.events[0]?.venueName}
          venueAddress={data.events[0]?.venueAddress}
          mapsUrl={data.events[0]?.mapsUrl}
        />

        <WeddingGift
          banks={data.banks}
        />

        <RSVPForm guestId={data.guest.id} guestName={data.guest.name} />

        <Closing
          groomName={data.settings.groomName}
          brideName={data.settings.brideName}
        />
      </div>
    </main>
  );
}
