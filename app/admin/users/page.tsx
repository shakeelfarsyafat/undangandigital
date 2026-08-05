"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import {
  UserPlus,
  Users,
  KeyRound,
  Trash2,
  X,
  ShieldCheck,
  Heart,
  ExternalLink,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatRelativeTime } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  weddingSlug?: string | null;
  createdAt: string | Date;
}

export default function SuperAdminUsersPage() {
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [roleInput, setRoleInput] = useState("admin_mempelai");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset Password Modal State
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPasswordInput, setResetPasswordInput] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        setUsersList(json.users || []);
      }
    } catch {
      toast.error("Gagal memuat daftar akun");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          password: passwordInput,
          weddingSlug: slugInput,
          role: roleInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat akun");
      }

      toast.success(data.message || "Akun berhasil dibuat!");
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
      setSlugInput("");
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun "${name}"? Seluruh data undangan milik akun ini akan terhapus permanen.`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Akun "${name}" berhasil dihapus`);
        fetchUsers();
      } else {
        toast.error("Gagal menghapus akun");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus akun");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUserId || !resetPasswordInput) return;
    setIsResetting(true);

    try {
      const res = await fetch(`/api/admin/users/${resetUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: resetPasswordInput }),
      });

      if (res.ok) {
        toast.success("Password akun berhasil direset!");
        setResetUserId(null);
        setResetPasswordInput("");
      } else {
        toast.error("Gagal mereset password");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mereset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            <h1 className="font-serif text-3xl font-bold text-[#2C1A1D]">
              Kelola Akun Mempelai (Super Admin)
            </h1>
          </div>
          <p className="text-xs text-[#5C4649] font-light mt-1">
            Buat & kelola akun admin mempelai. Setiap akun mengelola data undangannya masing-masing secara terisolasi.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-gold py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          + Buat Akun Mempelai Baru
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-5 bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-[#5C4649] uppercase">Total Akun Terdaftar</p>
            <p className="font-serif text-3xl font-bold text-[#2C1A1D]">{usersList.length} Akun</p>
          </div>
          <Users className="w-8 h-8 text-[#C5A059] opacity-80" />
        </div>

        <div className="p-5 bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-[#5C4649] uppercase">Akun Admin Mempelai</p>
            <p className="font-serif text-3xl font-bold text-[#2C1A1D]">
              {usersList.filter((u) => u.role === "admin_mempelai" || u.role === "admin").length} Mempelai
            </p>
          </div>
          <Heart className="w-8 h-8 text-rose-500 opacity-80" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/30 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#5C4649]">Memuat daftar akun...</div>
        ) : usersList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5C4649]">
            Belum ada akun yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#2C1A1D] border-b border-[#C5A059]/20 font-semibold">
                <tr>
                  <th className="p-4">Nama Akun / Mempelai</th>
                  <th className="p-4">Email Login</th>
                  <th className="p-4">Peran (Role)</th>
                  <th className="p-4">Slug Undangan Publik</th>
                  <th className="p-4 text-right">Tanggal Dibuat</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A059]/10 text-[#5C4649]">
                {usersList.map((user) => {
                  const isSuperAdmin = user.role === "superadmin";

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4 font-semibold text-[#2C1A1D]">
                        {user.name}
                      </td>
                      <td className="p-4 font-mono text-[#5C4649]">{user.email}</td>
                      <td className="p-4">
                        {isSuperAdmin ? (
                          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold text-[10px]">
                            Super Admin
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
                            Admin Mempelai
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {user.weddingSlug ? (
                          <a
                            href={`/w/${user.weddingSlug}/tamu-undangan`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-[#8B6508] hover:underline"
                          >
                            /w/{user.weddingSlug}/[guestSlug]
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right text-[10px] text-[#5C4649]/70">
                        {formatRelativeTime(user.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setResetUserId(user.id)}
                            title="Reset Password"
                            className="p-2 rounded-lg bg-[#FAF8F5] border border-[#C5A059]/30 text-[#8B6508] hover:bg-[#C5A059] hover:text-white transition-all cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          {!isSuperAdmin && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              title="Hapus Akun"
                              className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Akun Mempelai Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-md rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C1A1D]">
                Buat Akun Mempelai Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#5C4649] hover:text-[#2C1A1D] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Pasangan Mempelai *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ahmad & Nabila"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (!slugInput) {
                      setSlugInput(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                      );
                    }
                  }}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Email Login Admin *</label>
                <input
                  type="email"
                  required
                  placeholder="Misal: ahmad@wedding.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Password Login *</label>
                <input
                  type="text"
                  required
                  placeholder="Password rahasia login admin"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Custom Wedding Slug (URL Undangan)</label>
                <input
                  type="text"
                  placeholder="Misal: ahmad-nabila"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059] font-mono"
                />
                <span className="text-[10px] text-[#5C4649]/70">
                  URL Undangan Publik: /invite/{slugInput || "ahmad-nabila"}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#5C4649] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Membuat Akun..." : "Buat Akun Mempelai"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {resetUserId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-sm rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <h3 className="font-serif text-base font-bold text-[#2C1A1D]">
                Reset Password Akun
              </h3>
              <button
                onClick={() => setResetUserId(null)}
                className="text-[#5C4649] hover:text-[#2C1A1D] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Password Baru *</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan password baru"
                  value={resetPasswordInput}
                  onChange={(e) => setResetPasswordInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetUserId(null)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#5C4649] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="btn-gold py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isResetting ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
