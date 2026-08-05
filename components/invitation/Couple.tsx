"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface Settings {
  groomName: string;
  groomFullName: string;
  groomFather: string;
  groomMother: string;
  groomPhotoUrl?: string | null;

  brideName: string;
  brideFullName: string;
  brideFather: string;
  brideMother: string;
  bridePhotoUrl?: string | null;
}

export function Couple({ settings }: { settings: Settings }) {
  return (
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center bg-gold-dots snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      
      {/* Floating Ornaments */}
      <div className="absolute top-14 left-6 w-2 h-2 rounded-full bg-[#D4AF37]/50 animate-float-particle" />
      <div className="absolute bottom-16 right-6 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/40 animate-float-particle" style={{ animationDelay: "1.2s" }} />

      <div className="max-w-xl w-full my-auto space-y-4 sm:space-y-6 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-1 sm:space-y-2 flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <GununganHeader className="w-[24vw] max-w-[110px] h-[12vh] max-h-[120px]" />
          </motion.div>
          
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B6508] font-bold">
            Selamat Datang
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#3E2211] font-bold">
            Mempelai Pengantin
          </h2>
          <JavaneseDivider className="w-36 h-6 sm:w-56 sm:h-10" />
        </motion.div>

        {/* Groom & Bride Vertical Stack */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-sm w-full mx-auto">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="glass-card-parchment p-3.5 sm:p-4 rounded-2xl space-y-1.5 shadow-md border border-[#C5A059]/40 flex flex-col items-center relative overflow-hidden text-center cursor-pointer"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-md gold-avatar-ring">
              <Image
                src={settings.groomPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"}
                alt={settings.groomFullName}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="space-y-0.5">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#3E2211]">
                {settings.groomFullName}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-[#8B6508] font-bold uppercase tracking-wider">
                Mempelai Pria
              </p>
            </div>

            <p className="text-[10px] sm:text-xs text-[#5C3A21] leading-tight">
              Putra dari: <span className="font-semibold text-[#3E2211]">{settings.groomFather}</span> & <span className="font-semibold text-[#3E2211]">{settings.groomMother}</span>
            </p>
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            viewport={{ once: true }}
            className="glass-card-parchment p-3.5 sm:p-4 rounded-2xl space-y-1.5 shadow-md border border-[#C5A059]/40 flex flex-col items-center relative overflow-hidden text-center cursor-pointer"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-md gold-avatar-ring">
              <Image
                src={settings.bridePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"}
                alt={settings.brideFullName}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="space-y-0.5">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#3E2211]">
                {settings.brideFullName}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-[#8B6508] font-bold uppercase tracking-wider">
                Mempelai Wanita
              </p>
            </div>

            <p className="text-[10px] sm:text-xs text-[#5C3A21] leading-tight">
              Putri dari: <span className="font-semibold text-[#3E2211]">{settings.brideFather}</span> & <span className="font-semibold text-[#3E2211]">{settings.brideMother}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
