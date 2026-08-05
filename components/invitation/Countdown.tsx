"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

export function Countdown({ targetDate = "2026-12-20T08:00:00" }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsPassed(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center bg-gold-dots snap-start overflow-hidden">
      <JavaneseBottomCorners className="w-96 h-96 sm:w-[36rem] sm:h-[36rem]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-md w-full my-auto glass-card-parchment p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 relative z-20 overflow-hidden border border-[#C5A059]/40"
      >

        <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#8B6508] font-bold">
          Etangan Wektu Bahagia
        </p>

        <JavaneseDivider className="w-36 h-6 sm:w-44 sm:h-8" />

        {isPassed ? (
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3E2211]">
            Dina Bahagia Sampun Anjog!
          </h3>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center pt-2">
            <div className="bg-[#1E100A] text-[#FDFBF7] p-2.5 sm:p-3 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
              <span className="block font-serif text-xl sm:text-3xl font-bold text-[#F3E5AB]">
                {timeLeft?.days ?? 0}
              </span>
              <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                Dina
              </span>
            </div>

            <div className="bg-[#1E100A] text-[#FDFBF7] p-2.5 sm:p-3 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
              <span className="block font-serif text-xl sm:text-3xl font-bold text-[#F3E5AB]">
                {timeLeft?.hours ?? 0}
              </span>
              <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                Jam
              </span>
            </div>

            <div className="bg-[#1E100A] text-[#FDFBF7] p-2.5 sm:p-3 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
              <span className="block font-serif text-xl sm:text-3xl font-bold text-[#F3E5AB]">
                {timeLeft?.minutes ?? 0}
              </span>
              <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                Menit
              </span>
            </div>

            <div className="bg-[#1E100A] text-[#FDFBF7] p-2.5 sm:p-3 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
              <span className="block font-serif text-xl sm:text-3xl font-bold text-[#F3E5AB]">
                {timeLeft?.seconds ?? 0}
              </span>
              <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                Detik
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
