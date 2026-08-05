"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GununganWhite, JavaneseDivider, MegamendungCloud, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface ClosingProps {
  groomName: string;
  brideName: string;
}

export function Closing({ groomName, brideName }: ClosingProps) {
  const hashtag = `#${groomName.replace(/\s+/g, "")}${brideName.replace(/\s+/g, "")}`;

  return (
    <section className="relative h-[100dvh] min-h-[100dvh] max-h-[100dvh] py-6 px-4 text-center text-[#FDFBF7] overflow-hidden bg-[#1E100A] flex flex-col items-center justify-between snap-start">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80"
          alt="Closing Background"
          fill
          className="object-cover object-center filter brightness-[0.3] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E100A] via-[#1E100A]/80 to-[#1E100A]" />
      </div>

      <JavaneseBottomCorners className="w-96 h-96 sm:w-[36rem] sm:h-[36rem] opacity-90" />

      {/* Megamendung Cloud Floating */}
      <div className="absolute top-8 left-4 opacity-50 hidden sm:block">
        <MegamendungCloud className="w-28 h-18" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-sm w-full my-auto space-y-4 flex flex-col items-center justify-center"
      >
        <GununganWhite className="w-[30vw] max-w-[140px] h-[18vh] max-h-[170px]" />

        <p className="text-xs text-[#FDFBF7]/85 leading-relaxed max-w-xs mx-auto font-light">
          Terima kasih yang tulus dari lubuk hati kami atas kehadiran serta doa restu dari Bapak/Ibu/Saudara/i.
        </p>

        <JavaneseDivider className="w-40 h-8" />

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold">
          Kami Yang Berbahagia
        </p>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E5AB]">
          {groomName} <span className="font-script text-2xl sm:text-4xl text-[#D4AF37]">&</span> {brideName}
        </h2>

        <p className="text-xs font-mono text-[#D4AF37] tracking-widest pt-1 font-semibold">
          {hashtag}
        </p>
      </motion.div>
    </section>
  );
}
