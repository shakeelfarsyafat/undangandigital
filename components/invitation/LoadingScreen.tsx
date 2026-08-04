"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MegamendungCloud, JavaneseDivider } from "./JavaneseOrnaments";

export function LoadingScreen({ onFinish }: { onFinish?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.9, delay: 2.2 }}
      onAnimationComplete={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gold-dots text-[#3E2211] px-4 overflow-hidden"
    >
      {/* Background Vintage Card Frame */}
      <div className="absolute inset-4 sm:inset-6 z-0 rounded-3xl border-2 border-[#C5A059]/40 bg-[#FAF5EB]/95 shadow-2xl pointer-events-none" />

      {/* Megamendung Cloud left & right */}
      <div className="absolute top-16 left-8 z-10 hidden sm:block">
        <MegamendungCloud className="w-28 h-20" />
      </div>
      <div className="absolute top-16 right-8 z-10 hidden sm:block">
        <MegamendungCloud className="w-28 h-20" />
      </div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center space-y-4 relative z-10 max-w-xs"
      >
        {/* Large Prominent Gunungan Animation matching Screenshot 1 */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-36 h-48 sm:w-44 sm:h-60 mx-auto gunungan-glow-large"
        >
          <Image
            src="/images/javanese/gunungan.png"
            alt="Gunungan Wayang"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#8B6508] font-bold">
            Pawiwahan Ageng
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#3E2211]">
            Ahmad & Nabila
          </h1>
        </div>

        <JavaneseDivider className="w-44 h-8" />
      </motion.div>
    </motion.div>
  );
}
