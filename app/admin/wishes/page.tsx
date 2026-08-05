"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminWishesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/guests?tab=wishes");
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-[#5C4649]">
      Mengalihkan ke Manajer Tamu & Ucapan...
    </div>
  );
}
