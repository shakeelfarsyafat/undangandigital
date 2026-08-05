"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    async function checkRole() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        const role = data.user?.role || null;
        setUserRole(role);

        // Superadmin hanya boleh akses /admin/users
        if (role === "superadmin" && !pathname.startsWith("/admin/users")) {
          router.replace("/admin/users");
          return;
        }

        // Admin mempelai tidak boleh akses /admin/users
        if (role !== "superadmin" && pathname.startsWith("/admin/users")) {
          router.replace("/admin");
          return;
        }
      } catch {
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    }

    checkRole();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-xs text-[#5C4649]">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row font-sans text-[#2C1A1D]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
