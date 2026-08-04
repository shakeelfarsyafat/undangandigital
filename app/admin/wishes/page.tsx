"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, User } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Wish {
  id: string;
  guestName: string;
  attendanceStatus: string;
  message?: string | null;
  createdAt: string | Date;
}

export default function AdminWishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) {
        const json = await res.json();
        setWishes(json.wishes || []);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  return (
    <div className="space-y-8">
      <div className="border-b border-[#C5A059]/20 pb-6">
        <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
          Daftar Ucapan & Doa Tamu
        </h1>
        <p className="text-xs text-[#5C4649] font-light mt-1">
          Kumpulan doa restu dan ucapan hangat dari seluruh tamu undangan.
        </p>
      </div>

      {isLoading ? (
        <div className="text-xs text-[#5C4649] py-12 text-center">Memuat ucapan tamu...</div>
      ) : wishes.length === 0 ? (
        <div className="text-xs text-[#5C4649] py-12 text-center glass-card rounded-2xl">
          Belum ada ucapan yang masuk.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#A47E3B] flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#2C1A1D]">
                      {wish.guestName}
                    </h4>
                    <span className="text-[10px] text-[#A47E3B] font-medium">
                      {wish.attendanceStatus === "attending" ? "InsyaAllah Hadir" : "Tidak Dapat Hadir"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#5C4649]/70 font-light">
                  {formatRelativeTime(wish.createdAt)}
                </span>
              </div>

              <p className="text-xs text-[#5C4649] leading-relaxed italic bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/15">
                &ldquo;{wish.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
