"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface Story {
  id: string;
  year: string;
  title: string;
  description: string;
}

export function LoveStory({ stories }: { stories: Story[] }) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#F7F2E7] text-center snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      <div className="max-w-lg mx-auto relative z-20 my-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 space-y-2"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8B6508] font-semibold">
            Kisah Cinta
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1E100A] font-bold">
            Kisah Cinta Kami
          </h2>
          <JavaneseDivider className="w-44 h-8" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#D4AF37]/50 ml-4 sm:ml-8 text-left space-y-8 pl-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Gunungan Marker Badge */}
              <div className="absolute -left-[37px] top-1.5 w-7 h-7 rounded-full bg-[#1E100A] border border-[#D4AF37] flex items-center justify-center shadow-md p-1">
                <Image
                  src="/images/javanese/gunungan.png"
                  alt="Gunungan Badge"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>

              <div className="glass-card-jawa p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-2">
                <span className="inline-block px-3 py-1 bg-[#D4AF37]/15 text-[#8B6508] text-xs font-bold rounded-full">
                  {story.year} — {story.title}
                </span>
                <p className="text-xs text-[#4A2B18] leading-relaxed">
                  {story.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
