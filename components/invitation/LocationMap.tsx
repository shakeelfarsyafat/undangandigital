"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface LocationProps {
  venueName?: string;
  venueAddress?: string;
  mapsUrl?: string;
}

export function LocationMap({
  venueName = "Ballroom Hotel Grand Mahakam",
  venueAddress = "Jl. Mahakam No. 6, Kramat Pela, Kebayoran Baru, Jakarta Selatan",
  mapsUrl = "https://maps.google.com/?q=Hotel+Grand+Mahakam",
}: LocationProps) {
  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center bg-gold-dots snap-start">
      <div className="max-w-xl w-full my-auto space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-1 flex flex-col items-center"
        >
          <GununganHeader className="w-[24vw] max-w-[110px] h-[12vh] max-h-[120px]" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B6508] font-bold">
            Pitedah Papan Acara
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#3E2211] font-bold">
            Lokasi Acara
          </h2>
          <JavaneseDivider className="w-36 h-6 sm:w-56 sm:h-10" />
        </motion.div>

        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card-parchment p-4 sm:p-6 rounded-3xl space-y-3 shadow-lg border border-[#C5A059]/40 relative overflow-hidden"
        >
          <JavaneseBottomCorners className="w-20 h-20 sm:w-28 sm:h-28" />

          {/* Responsive Map Embed Container */}
          <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-inner border border-[#C5A059]/40 relative bg-[#F7F2E7]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273180295837!2d106.79758507572793!3d-6.227670793760431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14ebb43d231%3A0xb36ef207e997f3ed!2sHotel%20Grand%20Mahakam!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
              className="w-full h-full"
            />
          </div>

          <div className="space-y-1 text-center pt-1">
            <div className="flex items-center justify-center gap-1.5 text-[#C5A059]">
              <MapPin className="w-4 h-4" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E2211]">
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
        </motion.div>
      </div>
    </section>
  );
}
