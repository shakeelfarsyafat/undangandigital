"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface Wish {
  id: string;
  guestName: string;
  attendanceStatus: string;
  message?: string | null;
  createdAt: string | Date;
}

export function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
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
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FDFBF7] text-center bg-batik-pattern snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      <div className="max-w-md mx-auto space-y-8 relative z-20 my-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <GununganHeader className="w-16 h-24" />
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8B6508] font-semibold">
            Doa & Ucapan
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1E100A] font-bold">
            Ucapan & Doa Restu
          </h2>
          <JavaneseDivider className="w-48 h-8" />
        </motion.div>

        {isLoading ? (
          <div className="text-xs text-[#4A2B18] py-8">Memuat ucapan...</div>
        ) : wishes.length === 0 ? (
          <div className="text-xs text-[#4A2B18] py-8 italic glass-card-jawa p-6 rounded-2xl">
            Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
          </div>
        ) : (
          <div className="space-y-3 text-left max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
            {wishes.map((wish, idx) => (
              <motion.div
                key={wish.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card-jawa p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1E100A] text-[#D4AF37] flex items-center justify-center font-bold text-xs border border-[#D4AF37]/40">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#1E100A]">
                        {wish.guestName}
                      </h4>
                      <span className="text-[10px] text-[#8B6508] font-semibold">
                        {wish.attendanceStatus === "attending" ? "InsyaAllah Hadir" : "Mohon Maaf Tidak Hadir"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#4A2B18]/70 font-light">
                    {formatRelativeTime(wish.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-[#4A2B18] leading-relaxed pt-1 font-light italic">
                  &ldquo;{wish.message}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
