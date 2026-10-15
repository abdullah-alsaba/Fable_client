"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Feather, DollarSign, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export default function WriterCTA() {
  return (
    <section className="my-16 w-full rounded-3xl bg-[#090e14] text-white p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#855210]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1b2533] border border-[#2d3a4d] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f0b465]">
          <Feather size={12} />
          For Independent Writers
        </span>

        <h2 className="mt-4 font-playfair text-2xl font-bold tracking-tight text-white sm:text-4xl sm:leading-tight">
          Publish Directly to Passionate Readers. Keep 85% of Your Royalties.
        </h2>

        <p className="mt-3 text-xs text-[#b5b5c4] sm:text-sm leading-relaxed max-w-2xl">
          No gatekeepers, no complex contracts, and no hidden deductions. Join hundreds of verified authors publishing original fiction, essays, and memoirs with instant global delivery.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#141b24] border border-[#252f3e] p-3">
            <DollarSign size={18} className="text-[#f0b465] shrink-0" />
            <span className="text-xs font-semibold text-white">85% Author Revenue</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-[#141b24] border border-[#252f3e] p-3">
            <ShieldCheck size={18} className="text-[#f0b465] shrink-0" />
            <span className="text-xs font-semibold text-white">Stripe Verified Payouts</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-[#141b24] border border-[#252f3e] p-3">
            <Globe size={18} className="text-[#f0b465] shrink-0" />
            <span className="text-xs font-semibold text-white">Global Distribution</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            href="/dashboard/writer"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#855210] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#a2681c] transition-all"
          >
            <span>Start Publishing Today</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/about"
            className="flex h-11 items-center justify-center rounded-xl border border-[#3b4759] bg-[#141b24] px-5 text-xs font-semibold text-white hover:bg-[#1f2937] transition-colors"
          >
            How Publishing Works
          </Link>
        </div>
      </div>
    </section>
  );
}
