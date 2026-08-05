"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Send, Users, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface RSVPFormProps {
  guestId: string;
  guestName: string;
  onSubmitted?: () => void;
}

export function RSVPForm({ guestId, guestName, onSubmitted }: RSVPFormProps) {
  const [attendanceStatus, setAttendanceStatus] = useState<"attending" | "declined">("attending");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId,
          attendanceStatus,
          guestCount: attendanceStatus === "attending" ? guestCount : 0,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim RSVP");
      }

      toast.success("Terima kasih! Konfirmasi kehadiran berhasil dikirim.");
      setIsSubmitted(true);
      if (onSubmitted) onSubmitted();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FAF5EB] text-center snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      <div className="max-w-md w-full my-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card-parchment p-5 sm:p-7 rounded-3xl space-y-4 shadow-xl border border-[#C5A059]/40 text-left relative overflow-hidden"
        >

          <div className="text-center space-y-1">
            <GununganHeader className="w-[20vw] max-w-[90px] h-[10vh] max-h-[100px] mx-auto" />
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B6508] font-bold">
              Konfirmasi Kehadiran
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#3E2211]">
              RSVP
            </h2>
            <p className="text-xs font-semibold text-[#3E2211]">
              {guestName}
            </p>
            <JavaneseDivider className="w-36 h-6 mx-auto" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Attendance Status */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttendanceStatus("attending")}
                className={`py-2.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  attendanceStatus === "attending"
                    ? "bg-[#C5A059] text-[#1E100A] border-[#C5A059] shadow-md font-bold"
                    : "bg-[#FAF5EB] text-[#3E2211] border-[#C5A059]/40"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Hadir
              </button>

              <button
                type="button"
                onClick={() => setAttendanceStatus("declined")}
                className={`py-2.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  attendanceStatus === "declined"
                    ? "bg-[#1E100A] text-[#FDFBF7] border-[#1E100A] shadow-md"
                    : "bg-[#FAF5EB] text-[#3E2211] border-[#C5A059]/40"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Tidak Hadir
              </button>
            </div>

            {/* Guest Count (if attending) */}
            {attendanceStatus === "attending" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#3E2211] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  Jumlah Tamu Hadir
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`py-2 px-3 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        guestCount === num
                          ? "bg-[#8B6508] text-white border-[#8B6508]"
                          : "bg-[#FAF5EB] text-[#5C3A21] border-[#C5A059]/40"
                      }`}
                    >
                      {num} Orang
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ucapan & Doa Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#3E2211] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                Ucapan & Doa Restu
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan dan doa restu..."
                className="w-full p-2.5 bg-[#FAF5EB] rounded-xl border border-[#C5A059]/40 text-xs text-[#3E2211] focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-jawa-gold py-3 px-5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Mengirim..." : isSubmitted ? "Perbarui Konfirmasi" : "Kirim Konfirmasi Kehadiran"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
