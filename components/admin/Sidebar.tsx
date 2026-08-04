"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  MessageSquare,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Berhasil keluar dari admin");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Gagal logout");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Daftar Tamu", href: "/admin/guests", icon: Users },
    { label: "Data RSVP", href: "/admin/rsvp", icon: CheckCircle },
    { label: "Ucapan Tamu", href: "/admin/wishes", icon: MessageSquare },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#2C1A1D] text-white min-h-screen p-6 flex flex-col justify-between border-r border-[#C5A059]/20 shrink-0">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#E6C887] flex items-center justify-center font-serif text-lg font-bold border border-[#C5A059]/30">
            <Heart className="w-5 h-5 fill-[#C5A059]" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-[#FFFDF9]">
              Wedding Admin
            </h2>
            <p className="text-[10px] text-[#E8DCC4]/70 uppercase tracking-widest">
              Ahmad & Nabila
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#C5A059] text-white shadow-md font-semibold"
                    : "text-[#E8DCC4]/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors w-full cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Keluar (Logout)
      </button>
    </aside>
  );
}
