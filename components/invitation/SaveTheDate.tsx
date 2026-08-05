"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, CalendarPlus } from "lucide-react";
import toast from "react-hot-toast";
import { JavaneseDivider, GununganHeader, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface EventItem {
  id: string;
  type: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
}

export function SaveTheDate({ events }: { events: EventItem[] }) {
  const downloadICS = (event: EventItem) => {
    try {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//ID
BEGIN:VEVENT
SUMMARY:Pawiwahan Ageng Ahmad & Nabila - ${event.title}
DESCRIPTION:${event.title} Ahmad & Nabila bertempat di ${event.venueName}
LOCATION:${event.venueAddress}
DTSTART:20261220T080000Z
DTEND:20261220T150000Z
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `pernikahan-ahmad-nabila-${event.type}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Jadwal Pahing berhasil ditambahkan ke Kalender!");
    } catch {
      toast.error("Gagal mendownload file kalender");
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center bg-gold-dots snap-start overflow-hidden">
      <JavaneseBottomCorners className="w-96 h-96 sm:w-[36rem] sm:h-[36rem]" />
      <div className="max-w-xl w-full my-auto space-y-4 sm:space-y-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-1 flex flex-col items-center"
        >
          <GununganHeader className="w-[24vw] max-w-[110px] h-[12vh] max-h-[120px]" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B6508] font-bold">
            Rangkaian Acara
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#3E2211] font-bold">
            Jadwal Acara
          </h2>
          <JavaneseDivider className="w-36 h-6 sm:w-56 sm:h-10" />
        </motion.div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="glass-card-parchment p-4 sm:p-6 rounded-2xl space-y-3 shadow-lg border border-[#C5A059]/40 flex flex-col justify-between relative overflow-hidden text-left"
            >

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1E100A] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow-sm shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E2211]">
                    {evt.title}
                  </h3>
                </div>

                <div className="space-y-1.5 text-[11px] sm:text-xs text-[#5C3A21] pt-2 border-t border-[#C5A059]/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span className="font-semibold text-[#3E2211]">{evt.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>{evt.startTime} – {evt.endTime}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#3E2211]">{evt.venueName}</p>
                      <p className="font-light text-[10px] sm:text-[11px] line-clamp-2">{evt.venueAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadICS(evt)}
                className="w-full btn-jawa-gold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-semibold cursor-pointer mt-1"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Simpan ke Kalender
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
