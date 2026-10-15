"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, CreditCard, BookOpenCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Compass,
    title: "Discover & Preview",
    description:
      "Explore curated fiction and non-fiction indies. Filter by genre, author, and price, and read synopsis previews before purchasing.",
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Instant 1-Click Checkout",
    description:
      "Seamlessly complete transactions with secure Stripe Checkout. Ebooks are immediately added to your personal permanent cloud library.",
  },
  {
    step: "03",
    icon: BookOpenCheck,
    title: "Read & Sync Anywhere",
    description:
      "Access full digital editions right in your reader dashboard. Save bookmarks and pick up your reading across phone, tablet, or desktop.",
  },
];

export default function HowItWorks() {
  return (
    <section className="my-16 w-full py-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-white border border-[#e2d9cb] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#855210] shadow-2xs">
          Seamless Experience
        </span>
        <h2 className="mt-3 font-playfair text-2xl font-bold tracking-tight text-[#090e14] sm:text-3xl">
          How Fable Works
        </h2>
        <p className="mt-2 text-xs text-[#666666] sm:text-sm">
          A frictionless pathway from discovering a new author to diving into chapter one.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="relative flex flex-col rounded-2xl border border-[#e2d9cb] bg-white p-7 shadow-xs hover:border-[#855210] transition-colors"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#090e14] text-white">
                  <Icon size={20} />
                </div>
                <span className="font-playfair text-3xl font-bold text-[#e2d9cb]">
                  {item.step}
                </span>
              </div>

              <h3 className="font-playfair text-lg font-bold text-[#090e14]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-[#555555] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
