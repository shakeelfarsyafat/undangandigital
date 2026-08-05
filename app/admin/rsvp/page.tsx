"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRSVPPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/guests?tab=rsvp");
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-[#5C4649]">
      Mengalihkan ke Manajer Tamu & RSVP...
    </div>
  );
}
