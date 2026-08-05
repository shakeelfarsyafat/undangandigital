"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

interface Settings {
  groomName: string;
  groomFullName: string;
  groomFather: string;
  groomMother: string;
  groomInstagram?: string | null;
  groomPhotoUrl?: string | null;

  brideName: string;
  brideFullName: string;
  brideFather: string;
  brideMother: string;
  brideInstagram?: string | null;
  bridePhotoUrl?: string | null;
}

export function Couple({ settings }: { settings: Settings }) {
  return (
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center bg-gold-dots snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      <div className="max-w-xl w-full my-auto space-y-4 sm:space-y-6 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-1 sm:space-y-2 flex flex-col items-center"
        >
          <GununganHeader className="w-[24vw] max-w-[110px] h-[12vh] max-h-[120px]" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B6508] font-bold">
            Selamat Datang
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#3E2211] font-bold">
            Mempelai Pengantin
          </h2>
          <JavaneseDivider className="w-36 h-6 sm:w-56 sm:h-10" />
        </motion.div>

        {/* Groom & Bride Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card-parchment p-3 sm:p-6 rounded-2xl space-y-2 shadow-lg border border-[#C5A059]/40 flex flex-col items-center relative overflow-hidden"
          >

            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-3 border-[#C5A059] shadow-md">
              <Image
                src={settings.groomPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"}
                alt={settings.groomFullName}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-0.5">
              <h3 className="font-serif text-sm sm:text-xl font-bold text-[#3E2211]">
                {settings.groomFullName}
              </h3>
              <p className="text-[9px] sm:text-xs text-[#8B6508] font-bold uppercase tracking-wider">
                Mempelai Pria
              </p>
            </div>

            <p className="text-[10px] sm:text-xs text-[#5C3A21] leading-tight">
              Putra dari: <br />
              <span className="font-semibold text-[#3E2211]">{settings.groomFather}</span> & <span className="font-semibold text-[#3E2211]">{settings.groomMother}</span>
            </p>

            {settings.groomInstagram && (
              <a
                href={`https://instagram.com/${settings.groomInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-[#C5A059] font-bold hover:underline pt-0.5"
              >
                <InstagramIcon />
                @{settings.groomInstagram}
              </a>
            )}
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card-parchment p-3 sm:p-6 rounded-2xl space-y-2 shadow-lg border border-[#C5A059]/40 flex flex-col items-center relative overflow-hidden"
          >

            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-3 border-[#C5A059] shadow-md">
              <Image
                src={settings.bridePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"}
                alt={settings.brideFullName}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-0.5">
              <h3 className="font-serif text-sm sm:text-xl font-bold text-[#3E2211]">
                {settings.brideFullName}
              </h3>
              <p className="text-[9px] sm:text-xs text-[#8B6508] font-bold uppercase tracking-wider">
                Mempelai Wanita
              </p>
            </div>

            <p className="text-[10px] sm:text-xs text-[#5C3A21] leading-tight">
              Putri dari: <br />
              <span className="font-semibold text-[#3E2211]">{settings.brideFather}</span> & <span className="font-semibold text-[#3E2211]">{settings.brideMother}</span>
            </p>

            {settings.brideInstagram && (
              <a
                href={`https://instagram.com/${settings.brideInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-[#C5A059] font-bold hover:underline pt-0.5"
              >
                <InstagramIcon />
                @{settings.brideInstagram}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
