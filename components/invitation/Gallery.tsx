"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GununganHeader, JavaneseDivider, MegamendungCloud } from "./JavaneseOrnaments";

interface GalleryItem {
  id: string;
  imageUrl: string;
  altText?: string | null;
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : (prev as number) - 1));
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : (prev as number) + 1));
  };

  return (
    <section className="py-20 px-6 bg-[#F7F2E7] text-center relative overflow-hidden">
      {/* Floating Megamendung Clouds */}
      <div className="absolute top-10 left-2 opacity-50">
        <MegamendungCloud className="w-24 h-16" />
      </div>
      <div className="absolute top-10 right-2 opacity-50">
        <MegamendungCloud className="w-24 h-16" />
      </div>

      <div className="max-w-3xl mx-auto space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <GununganHeader className="w-16 h-24" />
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8B6508] font-semibold">
            Tetenger Momen Bahagia
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1E100A] font-bold">
            Our Gallery
          </h2>
          <JavaneseDivider className="w-48 h-8" />
        </motion.div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((img, idx) => (
            <motion.div
              key={img.id || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedIndex(idx)}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer group border-2 border-[#D4AF37]"
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `Gallery ${idx + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#1E100A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[#F3E5AB] text-xs font-semibold">
                Ningali Foto
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1E100A]/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37]/40 transition-colors z-50 cursor-pointer border border-[#D4AF37]/40"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37]/40 transition-colors z-50 cursor-pointer border border-[#D4AF37]/40"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37]/40 transition-colors z-50 cursor-pointer border border-[#D4AF37]/40"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            >
              <Image
                src={items[selectedIndex].imageUrl}
                alt={items[selectedIndex].altText || "Lightbox Image"}
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
