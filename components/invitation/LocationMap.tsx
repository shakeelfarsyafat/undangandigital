"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock } from "lucide-react";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface LocationMapProps {
  targetDate?: string;
  venueName?: string;
  venueAddress?: string;
  mapsUrl?: string;
}

export function LocationMap({
  targetDate = "2026-12-20T08:00:00",
  venueName = "Ballroom Hotel Grand Mahakam",
  venueAddress = "Jl. Mahakam No. 6, Kramat Pela, Kebayoran Baru, Jakarta Selatan",
  mapsUrl = "https://maps.google.com/?q=Hotel+Grand+Mahakam",
}: LocationMapProps) {
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
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center bg-gold-dots snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />

      <div className="max-w-xl w-full my-auto space-y-4 sm:space-y-5 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-1 flex flex-col items-center"
        >
          <GununganHeader className="w-[20vw] max-w-[100px] h-[10vh] max-h-[110px]" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B6508] font-bold">
            Hitung Mundur & Lokasi
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#3E2211] font-bold">
            Waktu & Lokasi Acara
          </h2>
          <JavaneseDivider className="w-36 h-6 sm:w-56 sm:h-10" />
        </motion.div>

        {/* Combined Parchment Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card-parchment p-4 sm:p-6 rounded-3xl space-y-4 shadow-xl border border-[#C5A059]/40 relative overflow-hidden"
        >
          {/* Countdown Section */}
          <div className="space-y-2">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#8B6508] font-bold flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Hitung Mundur Acara
            </p>

            {isPassed ? (
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E2211]">
                Hari Bahagia Telah Tiba!
              </h3>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-[#1E100A] text-[#FDFBF7] p-2 sm:p-2.5 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-[#F3E5AB]">
                    {timeLeft?.days ?? 0}
                  </span>
                  <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    Hari
                  </span>
                </div>

                <div className="bg-[#1E100A] text-[#FDFBF7] p-2 sm:p-2.5 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-[#F3E5AB]">
                    {timeLeft?.hours ?? 0}
                  </span>
                  <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    Jam
                  </span>
                </div>

                <div className="bg-[#1E100A] text-[#FDFBF7] p-2 sm:p-2.5 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-[#F3E5AB]">
                    {timeLeft?.minutes ?? 0}
                  </span>
                  <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    Menit
                  </span>
                </div>

                <div className="bg-[#1E100A] text-[#FDFBF7] p-2 sm:p-2.5 rounded-2xl border border-[#D4AF37]/40 shadow-sm">
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-[#F3E5AB]">
                    {timeLeft?.seconds ?? 0}
                  </span>
                  <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                    Detik
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#C5A059]/30 pt-3 space-y-3">
            {/* Responsive Map Embed Container */}
            <div className="w-full h-40 sm:h-52 rounded-2xl overflow-hidden shadow-inner border border-[#C5A059]/40 relative bg-[#F7F2E7]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273180295837!2d106.79758507572793!3d-6.227670793760431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14ebb43d231%3A0xb36ef207e997f3ed!2sHotel%20Grand%20Mahakam!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Google Maps"
                className="w-full h-full"
              />
            </div>

            <div className="space-y-1 text-center pt-0.5">
              <div className="flex items-center justify-center gap-1.5 text-[#C5A059]">
                <MapPin className="w-4 h-4" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#3E2211]">
                  {venueName}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-[#5C3A21] max-w-md mx-auto leading-tight font-light">
                {venueAddress}
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-jawa-gold py-2.5 px-5 rounded-full inline-flex items-center justify-center gap-2 text-xs font-semibold shadow-md"
            >
              <Navigation className="w-4 h-4" />
              Buka Google Maps
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
