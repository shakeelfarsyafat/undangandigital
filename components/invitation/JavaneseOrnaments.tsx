"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function GununganHeader({ className = "w-44 h-60 sm:w-56 sm:h-72" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.75, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`relative mx-auto gunungan-glow-large ${className}`}
    >
      <Image
        src="/images/javanese/gunungan.png"
        alt="Gunungan Wayang"
        fill
        className="object-contain"
        priority
      />
    </motion.div>
  );
}

export function GununganWhite({ className = "w-44 h-60 sm:w-56 sm:h-72" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.75, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`relative mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.7)] ${className}`}
    >
      <Image
        src="/images/javanese/gunungan-white.png"
        alt="Gunungan White"
        fill
        className="object-contain"
        priority
      />
    </motion.div>
  );
}

export function JavaneseDivider({ className = "w-64 h-14 sm:w-80 sm:h-20" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`relative mx-auto ${className}`}
    >
      <Image
        src="/images/javanese/divider.png"
        alt="Ukiran Jawa Divider"
        fill
        className="object-contain"
      />
    </motion.div>
  );
}

export function MegamendungCloud({ className = "w-36 h-24 sm:w-48 sm:h-32" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.9, scale: 1, y: [0, -8, 0] }}
      transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      className={`relative ${className}`}
    >
      <Image
        src="/images/javanese/cloud.png"
        alt="Awan Megamendung Jawa"
        fill
        className="object-contain"
      />
    </motion.div>
  );
}

export function JavaneseCorner({
  position = "bottom-left",
  className = "w-28 h-28 sm:w-40 sm:h-40",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const getTransforms = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0 scale-x-[-1]";
      case "top-left":
        return "top-0 left-0 scale-y-[-1]";
      case "top-right":
        return "top-0 right-0 scale-x-[-1] scale-y-[-1]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 0.95, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`absolute pointer-events-none z-10 ${getTransforms()} ${className}`}
    >
      <Image
        src="/images/javanese/corner.png"
        alt="Ornamen Sudut Jawa"
        fill
        className="object-contain"
      />
    </motion.div>
  );
}

export function JavaneseBottomCorners({ className = "w-32 h-32 sm:w-44 sm:h-44" }: { className?: string }) {
  return (
    <>
      <JavaneseCorner position="bottom-left" className={className} />
      <JavaneseCorner position="bottom-right" className={className} />
    </>
  );
}

export function GununganCornerSide({ position = "bottom-left", className = "w-36 h-48 sm:w-44 sm:h-60" }: { position?: "bottom-left" | "bottom-right"; className?: string }) {
  const isLeft = position === "bottom-left";
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className={`absolute bottom-0 ${isLeft ? "left-0" : "right-0 scale-x-[-1]"} z-10 pointer-events-none drop-shadow-[0_4px_20px_rgba(197,160,89,0.4)] ${className}`}
    >
      <Image
        src="/images/javanese/gunungan.png"
        alt="Gunungan Corner"
        fill
        className="object-contain object-bottom opacity-95"
      />
    </motion.div>
  );
}
