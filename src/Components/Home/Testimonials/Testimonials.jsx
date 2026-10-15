"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Elena Vance",
    role: "Sci-Fi Author",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote:
      "Publishing on Fable was a breath of fresh air. I received 85% of my royalties directly, and the reader community engaged with my worldbuilding immediately.",
    rating: 5,
  },
  {
    name: "Marcus Brody",
    role: "Verified Reader",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote:
      "The reader dashboard is clean and free of unnecessary clutter. I bought three fantasy novellas in one sitting and have them saved permanently in my collection.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Book Club Curator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      "Finding high-quality independent authors that aren't pushed by big commercial algorithms makes Fable our club's favorite digital storefront.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="my-16 w-full py-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-white border border-[#e2d9cb] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#855210] shadow-2xs">
          Community Reviews
        </span>
        <h2 className="mt-3 font-playfair text-2xl font-bold tracking-tight text-[#090e14] sm:text-3xl">
          Loved by Readers & Authors
        </h2>
        <p className="mt-2 text-xs text-[#666666] sm:text-sm">
          Hear how Fable empowers independent storytelling and authentic literary connections.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-[#e2d9cb] bg-white p-6 shadow-xs hover:border-[#855210] transition-colors"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" stroke="none" />
                ))}
              </div>
              <p className="text-xs text-[#444444] leading-relaxed italic">
                "{rev.quote}"
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#f0ece3]">
              <img
                src={rev.image}
                alt={rev.name}
                className="h-10 w-10 rounded-full object-cover border border-[#e2d9cb]"
              />
              <div>
                <p className="font-playfair text-sm font-bold text-[#090e14]">
                  {rev.name}
                </p>
                <p className="text-[11px] font-medium text-[#777777]">
                  {rev.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
