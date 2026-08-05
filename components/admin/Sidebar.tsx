"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Heart,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";

interface SidebarProps {
  userRole?: string;
  userEmail?: string;
  weddingTitle?: string;
}

export function Sidebar({ userRole = "admin_mempelai", userEmail = "", weddingTitle = "Mempelai" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const navItems =
    userRole === "superadmin"
      ? [
          { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
          { label: "Kelola Akun Mempelai", href: "/admin/users", icon: UserCheck },
        ]
      : [
          { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
          { label: "Daftar Tamu & RSVP", href: "/admin/guests", icon: Users },
          { label: "Data Mempelai", href: "/admin/settings", icon: Settings },
        ];

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-6">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#E6C887] flex items-center justify-center font-serif text-lg font-bold border border-[#C5A059]/30">
              <Heart className="w-5 h-5 fill-[#C5A059]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#FFFDF9]">
                Wedding Admin
              </h2>
              <p className="text-[10px] text-[#E8DCC4]/70 uppercase tracking-widest truncate max-w-[120px]">
                {weddingTitle}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-[#E8DCC4] p-1.5 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
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

      {/* Logout & Footer */}
      <div className="space-y-3 pt-6 border-t border-[#C5A059]/20">
        {userEmail && (
          <div className="text-[11px] text-[#E8DCC4]/60 truncate px-1">
            Logged in as: <strong className="text-white">{userEmail}</strong>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar (Logout)
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar with Hamburger */}
      <div className="md:hidden bg-[#2C1A1D] text-white px-4 py-3 flex items-center justify-between border-b border-[#C5A059]/20 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center font-serif text-sm font-bold border border-[#C5A059]/30">
            <Heart className="w-4 h-4 fill-[#C5A059]" />
          </div>
          <span className="font-serif font-bold text-sm text-[#FFFDF9]">Wedding Admin</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-72 bg-[#2C1A1D] text-white h-full z-10 shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-[#2C1A1D] text-white min-h-screen border-r border-[#C5A059]/20 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
