"use client";

import { motion } from "framer-motion";
import { CreditCard, Copy, Gift, MapPin, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { GununganHeader, JavaneseDivider, JavaneseBottomCorners } from "./JavaneseOrnaments";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface GiftProps {
  banks: BankAccount[];
  recipient?: string | null;
  phone?: string | null;
  address?: string | null;
}

export function WeddingGift({ banks, recipient, phone, address }: GiftProps) {
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankId(id);
    toast.success("Nomor rekening berhasil disalin!");
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  const copyAddressToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    toast.success("Alamat pengiriman hadiah berhasil disalin!");
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-[#FDFBF7] text-center bg-batik-pattern snap-start overflow-hidden relative">
      <JavaneseBottomCorners className="w-64 h-64 sm:w-96 sm:h-96" />
      <div className="max-w-xl mx-auto space-y-12 relative z-20 my-auto w-full">
        {/* Wedding Gift Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <GununganHeader className="w-16 h-24" />
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8B6508] font-semibold">
            Tanda Kasih
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1E100A] font-bold">
            Hadiah Pernikahan
          </h2>
          <p className="text-xs text-[#4A2B18] leading-relaxed max-w-md mx-auto font-light">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Apabila ingin memberikan hadiah pernikahan dapat melalui:
          </p>
          <JavaneseDivider className="w-48 h-8" />
        </motion.div>

        {/* Bank Account Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {banks.map((bank, idx) => (
            <motion.div
              key={bank.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="glass-card-jawa p-6 rounded-3xl space-y-4 shadow-xl border border-[#D4AF37]/30 flex flex-col justify-between relative overflow-hidden text-left"
            >

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl font-bold text-[#D4AF37]">
                    {bank.bankName}
                  </span>
                  <CreditCard className="w-5 h-5 text-[#8B6508]" />
                </div>
                <div className="pt-2">
                  <p className="font-mono text-lg font-bold text-[#1E100A] tracking-wider">
                    {bank.accountNumber}
                  </p>
                  <p className="text-xs text-[#4A2B18] font-light">
                    a.n. <span className="font-semibold text-[#1E100A]">{bank.accountHolder}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(bank.accountNumber, bank.id)}
                className="w-full btn-jawa-gold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
              >
                {copiedBankId === bank.id ? (
                  <>
                    <Check className="w-4 h-4 text-[#1E100A]" />
                    Berhasil Disalin
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Salin Nomor Rekening
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
