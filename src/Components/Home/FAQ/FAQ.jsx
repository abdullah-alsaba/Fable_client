"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I access my purchased ebooks?",
    a: "Immediately upon completing your Stripe checkout, your purchased title appears in your User Dashboard under 'Purchased Ebooks'. You can read directly in your browser or download it at any time.",
  },
  {
    q: "What digital formats are supported on Fable?",
    a: "All ebooks on Fable are formatted for high-legibility web reading and are available in universal EPUB and PDF standards compatible with Kindle, Apple Books, and Kobo.",
  },
  {
    q: "How does the author verification process work?",
    a: "To prevent spam and protect readers, new writers complete a one-time verification fee via Stripe. Once verified, writers unlock full publishing privileges, custom pricing, and analytics.",
  },
  {
    q: "Can I bookmark stories to read later without purchasing?",
    a: "Yes! Simply click the Bookmark icon on any title while browsing. Bookmarked books are saved in your reader dashboard under 'Bookmarks' so you never lose track of a story.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="my-16 w-full rounded-3xl border border-[#e2d9cb] bg-white p-8 sm:p-12 shadow-xs">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <span className="rounded-full bg-[#f6f4ee] border border-[#e2d9cb] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#855210]">
          Help & Answers
        </span>
        <h2 className="mt-3 font-playfair text-2xl font-bold tracking-tight text-[#090e14] sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xs text-[#666666] sm:text-sm">
          Everything you need to know about reader ownership, downloads, and author royalties.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-[#e5e2dc] bg-[#fafaf8] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-[#090e14] hover:text-[#855210] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#777777] transition-transform duration-200 shrink-0 ml-3 ${
                    isOpen ? "rotate-180 text-[#855210]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-[#555555] leading-relaxed border-t border-[#f0ece3] mt-1 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
