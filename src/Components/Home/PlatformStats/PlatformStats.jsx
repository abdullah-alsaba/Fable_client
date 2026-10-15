"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, HeartHandshake } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Readers",
    description: "Passionate book lovers exploring independent literature daily.",
  },
  {
    icon: BookOpen,
    value: "1,200+",
    label: "Original Ebooks",
    description: "Curated titles across 12+ fiction and non-fiction categories.",
  },
  {
    icon: Award,
    value: "450+",
    label: "Verified Authors",
    description: "Self-published writers earning fair 85% digital royalties.",
  },
  {
    icon: HeartHandshake,
    value: "99.4%",
    label: "Satisfaction Rate",
    description: "Instant downloads, secure checkout, and DRM-friendly reading.",
  },
];

export default function PlatformStats() {
  return (
    <section className="my-16 w-full rounded-3xl border border-[#e2d9cb] bg-white p-8 shadow-xs sm:p-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-[#f6f4ee] border border-[#e2d9cb] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#855210]">
          Platform Impact
        </span>
        <h2 className="mt-3 font-playfair text-2xl font-bold tracking-tight text-[#090e14] sm:text-3xl">
          Stories That Connect Across the Globe
        </h2>
        <p className="mt-2 text-xs text-[#666666] sm:text-sm">
          Fable is redefining independent publishing with transparent royalties and a focused reading sanctuary.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#fafaf8] border border-[#f0ece3] transition-all hover:border-[#855210] hover:shadow-xs"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f4ee] text-[#855210] mb-3">
                <Icon size={24} />
              </div>
              <span className="font-playfair text-3xl font-bold text-[#090e14]">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-bold uppercase tracking-wider text-[#090e14]">
                {stat.label}
              </span>
              <p className="mt-1.5 text-[11px] text-[#777777] leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
