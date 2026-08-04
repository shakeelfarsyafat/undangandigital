"use client";

import { motion } from "framer-motion";
import { GununganWhite, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

export function Ayat() {
  return (
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#1E100A] text-center text-[#FDFBF7] relative overflow-hidden snap-start">
      {/* Dark Batik Texture Background */}
      <div className="absolute inset-0 bg-batik-pattern opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-md w-full my-auto glass-card-jawa-dark p-6 sm:p-8 rounded-3xl relative shadow-2xl border border-[#D4AF37]/50 overflow-hidden flex flex-col items-center justify-center space-y-3"
      >
        <JavaneseBottomCorners className="w-24 h-24 sm:w-32 sm:h-32 opacity-90" />

        <GununganWhite className="w-[28vw] max-w-[130px] h-[16vh] max-h-[150px]" />

        {/* Arabic Text */}
        <p dir="rtl" className="text-lg sm:text-2xl leading-relaxed font-serif text-[#F3E5AB] font-medium">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </p>

        {/* Translation */}
        <p className="text-[11px] sm:text-xs text-[#FDFBF7]/90 leading-relaxed italic font-light max-w-xs mx-auto">
          &ldquo;Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang...&rdquo;
        </p>

        <JavaneseDivider className="w-40 h-8" />

        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
          QS. Ar-Rum: 21
        </span>
      </motion.div>
    </section>
  );
}
