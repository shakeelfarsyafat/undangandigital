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
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
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

interface CreatedAccountInfo {
  name: string;
  email: string;
  password: string;
}

// Generate email dari nama mempelai
function generateEmail(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, ".")
      .slice(0, 30) +
    "@wedding.com"
  );
}

// Generate password dari nama awal mempelai + diakhiri "123"
function generatePassword(name?: string): string {
  if (!name || !name.trim()) return "mempelai123";
  const firstWord = name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return (firstWord || "mempelai") + "123";
}

export default function SuperAdminUsersPage() {
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Tambah Akun
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [autoEmail, setAutoEmail] = useState("");
  const [autoPassword, setAutoPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Hasil Akun Dibuat
  const [createdAccount, setCreatedAccount] = useState<CreatedAccountInfo | null>(null);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  // Modal Reset Password
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetUserName, setResetUserName] = useState("");
  const [newResetPassword, setNewResetPassword] = useState("");
  const [showResetPw, setShowResetPw] = useState(false);
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

  // Update auto email & auto password saat nama berubah
  useEffect(() => {
    if (nameInput) {
      setAutoEmail(generateEmail(nameInput));
      setAutoPassword(generatePassword(nameInput));
    } else {
      setAutoEmail("");
      setAutoPassword("");
    }
  }, [nameInput]);

  // Buka modal tambah
  const openAddModal = () => {
    setNameInput("");
    setAutoEmail("");
    setAutoPassword("");
    setIsAddModalOpen(true);
  };

  const copyToClipboard = async (text: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.trim(),
          email: autoEmail,
          password: autoPassword,
          weddingSlug: "", // kosong, diisi nanti via Data Mempelai
          role: "admin_mempelai",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat akun");

      // Tutup modal form, buka modal hasil
      setIsAddModalOpen(false);
      setCreatedAccount({
        name: nameInput.trim(),
        email: autoEmail,
        password: autoPassword,
      });
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
    if (!resetUserId || !newResetPassword) return;
    setIsResetting(true);
    try {
      const res = await fetch(`/api/admin/users/${resetUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newResetPassword }),
      });
      if (res.ok) {
        toast.success("Password akun berhasil direset!");
        setResetUserId(null);
        setNewResetPassword("");
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
              Kelola Akun Mempelai
            </h1>
          </div>
          <p className="text-xs text-[#5C4649] font-light mt-1">
            Daftarkan pasangan mempelai. Cukup isi nama — email & password otomatis dibuat.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-gold py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          + Daftarkan Mempelai Baru
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
          <div className="p-8 text-center text-xs text-[#5C4649]">Belum ada akun yang terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#2C1A1D] border-b border-[#C5A059]/20 font-semibold">
                <tr>
                  <th className="p-4">Nama Mempelai</th>
                  <th className="p-4">Email Login</th>
                  <th className="p-4">Peran</th>
                  <th className="p-4">URL Undangan</th>
                  <th className="p-4 text-right">Dibuat</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A059]/10 text-[#5C4649]">
                {usersList.map((user) => {
                  const isSuperAdmin = user.role === "superadmin";
                  return (
                    <tr key={user.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4 font-semibold text-[#2C1A1D]">{user.name}</td>
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
                            /w/{user.weddingSlug}/...
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Belum diisi (isi di Data Mempelai)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right text-[10px] text-[#5C4649]/70">
                        {formatRelativeTime(user.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setResetUserId(user.id);
                              setResetUserName(user.name);
                              setNewResetPassword(generatePassword(user.name));
                              setShowResetPw(true);
                            }}
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

      {/* ===== MODAL: Daftarkan Mempelai Baru ===== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-md rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C1A1D]">
                Daftarkan Mempelai Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#5C4649] hover:text-[#2C1A1D] p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Nama */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Pasangan Mempelai *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ahmad & Nabila"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Preview otomatis */}
              {nameInput && (
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#C5A059]/20 p-4 space-y-2.5">
                  <p className="text-[10px] font-bold text-[#A47E3B] uppercase tracking-wider">
                    ✨ Akan dibuat otomatis:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#5C4649] font-medium">Email Login</span>
                      <span className="font-mono text-[11px] text-[#2C1A1D] font-semibold">{autoEmail}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#5C4649] font-medium">Password</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-[#2C1A1D] font-semibold">{autoPassword}</span>
                        <button
                          type="button"
                          onClick={() => setAutoPassword(generatePassword(nameInput))}
                          title="Generate ulang password"
                          className="p-1 rounded-lg text-[#A47E3B] hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#5C4649] font-medium">URL Undangan</span>
                      <span className="font-mono text-[11px] text-slate-400 italic">Diisi saat login pertama</span>
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={isSubmitting || !nameInput.trim()}
                  className="btn-gold py-2.5 px-5 rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Mendaftarkan..." : "Daftarkan Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: Akun Berhasil Dibuat ===== */}
      {createdAccount && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-md rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1 pb-2 border-b border-[#C5A059]/20">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1A1D]">Akun Berhasil Dibuat! 🎉</h3>
              <p className="text-xs text-[#5C4649]">
                Simpan informasi login berikut untuk diberikan ke mempelai.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-[#FAF8F5] rounded-2xl p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-[#5C4649] uppercase font-semibold mb-0.5">Nama Mempelai</p>
                  <p className="font-semibold text-sm text-[#2C1A1D]">{createdAccount.name}</p>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-[#5C4649] uppercase font-semibold mb-0.5">Email Login</p>
                    <p className="font-mono text-xs text-[#2C1A1D] font-semibold">{createdAccount.email}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(createdAccount.email, "email")}
                    className="p-2 rounded-xl bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#A47E3B] transition-all cursor-pointer shrink-0"
                  >
                    {copiedField === "email" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-[#5C4649] uppercase font-semibold mb-0.5">Password</p>
                    <p className="font-mono text-xs text-[#2C1A1D] font-semibold">{createdAccount.password}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(createdAccount.password, "password")}
                    className="p-2 rounded-xl bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#A47E3B] transition-all cursor-pointer shrink-0"
                  >
                    {copiedField === "password" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-800">
                ⚠️ <strong>Catatan:</strong> Setelah login, mempelai perlu mengisi nama pengantin di halaman <strong>Data Mempelai</strong> — URL undangan akan otomatis terbentuk dari nama depan keduanya.
              </div>
            </div>

            <button
              onClick={() => setCreatedAccount(null)}
              className="w-full btn-gold py-2.5 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL: Reset Password ===== */}
      {resetUserId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] w-full max-w-sm rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
              <h3 className="font-serif text-base font-bold text-[#2C1A1D]">Reset Password Akun</h3>
              <button onClick={() => setResetUserId(null)} className="text-[#5C4649] hover:text-[#2C1A1D] p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Password Baru *</label>
                <div className="relative">
                  <input
                    type={showResetPw ? "text" : "password"}
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    className="w-full p-3 pr-16 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button type="button" onClick={() => setNewResetPassword(generatePassword(resetUserName))} className="p-1.5 text-[#A47E3B] hover:bg-[#C5A059]/10 rounded-lg cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => setShowResetPw(!showResetPw)} className="p-1.5 text-[#A47E3B] hover:bg-[#C5A059]/10 rounded-lg cursor-pointer">
                      {showResetPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => setResetUserId(null)} className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#5C4649] hover:bg-[#FAF8F5] cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isResetting} className="btn-gold py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer">
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
