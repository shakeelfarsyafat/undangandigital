"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GununganHeader, JavaneseDivider, MegamendungCloud, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  heroPhotoUrl?: string;
}

export function Hero({ groomName, brideName, weddingDate, heroPhotoUrl }: HeroProps) {
  const displayHeroPhoto =
    heroPhotoUrl ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80";

  return (
    <section className="relative h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between text-center px-4 py-6 sm:py-8 bg-[#FAF5EB] overflow-hidden bg-gold-dots snap-start">
      {/* Floating Megamendung Clouds */}
      <div className="absolute top-8 left-4 opacity-80 z-10 hidden sm:block">
        <MegamendungCloud className="w-28 h-18 sm:w-36 sm:h-24" />
      </div>
      <div className="absolute top-8 right-4 opacity-80 z-10 hidden sm:block">
        <MegamendungCloud className="w-28 h-18 sm:w-36 sm:h-24" />
      </div>

      {/* Floating Gold Sparkles */}
      <div className="absolute top-16 left-8 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/50 animate-float-particle" />
      <div className="absolute top-32 right-10 w-2 h-2 rounded-full bg-[#D4AF37]/60 animate-float-particle" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-24 left-12 w-3 h-3 rounded-full bg-[#D4AF37]/40 animate-float-particle" style={{ animationDelay: "2s" }} />

      {/* Bottom Corner Ornaments */}
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-sm w-full my-auto flex flex-col items-center justify-center space-y-2 sm:space-y-3"
      >
        {/* Gunungan Header */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <GununganHeader className="w-[30vw] max-w-[140px] h-[16vh] max-h-[160px]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#8B6508] font-bold"
        >
          Pernikahan
        </motion.p>

        {/* Hero Arch Image */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative h-[28vh] max-h-[260px] aspect-[3/4] mx-auto rounded-t-full rounded-b-3xl overflow-hidden border-3 border-[#C5A059] shadow-2xl gold-avatar-ring cursor-pointer"
        >
          <Image
            src={displayHeroPhoto}
            alt="Foto Pengantin Halaman Utama"
            fill
            priority
            className="object-cover object-center filter saturate-[0.95] transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E100A]/40 via-transparent to-transparent" />
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="space-y-0.5"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2211] tracking-wide">
            {groomName} <span className="font-script text-2xl sm:text-3xl text-[#C5A059]">&</span> {brideName}
          </h1>
        </motion.div>

        {/* Javanese Ukiran Divider */}
        <JavaneseDivider className="w-40 h-8 sm:w-56 sm:h-12" />

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs font-semibold text-[#5C3A21] tracking-widest uppercase py-1 border-y border-[#C5A059]/40 inline-block px-6 bg-[#FAF5EB]/80 rounded-full"
        >
          Minggu, {weddingDate}
        </motion.p>

        {/* Javanese Blessing Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-[11px] sm:text-xs italic text-[#5C3A21] leading-relaxed max-w-xs mx-auto font-light"
        >
          &ldquo;Semoga Allah SWT memberikan keberkahan dan ketenteraman dalam keluarga yang dipersatukan dalam cinta kasih.&rdquo;
        </motion.p>
      </motion.div>
    </section>
  );
}
