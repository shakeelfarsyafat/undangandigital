"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Image from "next/image";
import { JavaneseDivider, MegamendungCloud, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface CoverProps {
  guestName: string;
  groomName: string;
  brideName: string;
  onOpen: () => void;
}

export function Cover({ guestName, groomName, brideName, onOpen }: CoverProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-40 h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between py-6 px-4 sm:py-8 sm:px-6 text-center text-[#3E2211] overflow-hidden bg-gold-dots"
    >
      {/* Background Vintage Parchment Overlay */}
      <div className="absolute inset-3 sm:inset-5 z-0 rounded-3xl border-2 border-[#C5A059]/40 bg-[#FAF5EB]/90 shadow-2xl backdrop-blur-sm pointer-events-none overflow-hidden">
        <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      </div>

      {/* Megamendung Clouds Left & Right */}
      <div className="absolute top-10 left-4 z-10 hidden sm:block">
        <MegamendungCloud className="w-24 h-16 sm:w-32 sm:h-20" />
      </div>
      <div className="absolute top-10 right-4 z-10 hidden sm:block">
        <MegamendungCloud className="w-24 h-16 sm:w-32 sm:h-20" />
      </div>

      {/* Top Date Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 space-y-0.5 mt-2"
      >
        <p className="text-[11px] sm:text-xs font-bold text-[#8B6508] tracking-widest uppercase">
          Minggu
        </p>
        <p className="font-serif text-xs sm:text-sm font-bold text-[#3E2211] tracking-wider">
          20 Desember 2026
        </p>
      </motion.div>

      {/* Center Featured Gunungan Wayang (Scaled dynamically to 100dvh) */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="relative z-20 space-y-2 sm:space-y-3 my-auto max-w-sm w-full py-2 flex flex-col items-center justify-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[32vw] max-w-[150px] h-[20vh] max-h-[190px] mx-auto gunungan-glow-large"
        >
          <Image
            src="/images/javanese/gunungan.png"
            alt="Gunungan Wayang Emas"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Groom & Bride Names */}
        <div className="space-y-0.5">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3E2211] tracking-wide">
            {groomName} <span className="font-script text-2xl sm:text-4xl text-[#C5A059]">&</span> {brideName}
          </h1>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8B6508] font-bold pt-0.5">
            Undangan Pernikahan
          </p>
        </div>

        <JavaneseDivider className="w-36 h-6 sm:w-48 sm:h-8" />

        {/* Guest Greeting Section */}
        <div className="pt-1 space-y-0.5 text-[#3E2211]">
          <p className="text-[11px] text-[#5C3A21] font-medium">
            Kepada Yth.
          </p>
          <p className="text-[11px] text-[#5C3A21] font-light">
            Bapak/Ibu/Saudara/i
          </p>
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#3E2211] capitalize pt-0.5">
            {guestName}
          </h2>
        </div>

        {/* Open Invitation Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="btn-jawa-gold py-3 px-7 rounded-full inline-flex items-center justify-center gap-2 text-xs font-semibold shadow-xl cursor-pointer mt-2"
        >
          <Mail className="w-4 h-4 animate-bounce" />
          Buka Undangan
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-20 text-[9px] sm:text-[10px] text-[#8B6508] tracking-[0.25em] uppercase font-bold mb-1"
      >
        Acara Pernikahan
      </motion.div>
    </motion.div>
  );
}
