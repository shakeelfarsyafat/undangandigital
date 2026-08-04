import Link from "next/link";
import { MailX } from "lucide-react";

export default function InvitationNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5] text-[#2C1A1D]">
      <div className="w-20 h-20 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-6 shadow-md">
        <MailX className="w-10 h-10" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
        Undangan Tidak Ditemukan
      </h1>

      <p className="text-xs text-[#5C4649] max-w-sm leading-relaxed mb-6 font-light">
        Maaf, link undangan pernikahan yang Anda buka tidak valid atau telah dihapus.
      </p>

      <Link
        href="/"
        className="btn-gold py-3 px-6 rounded-full text-xs font-semibold shadow-lg inline-block"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}
