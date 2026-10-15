"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, FileText, Sparkles, CheckCircle2, XCircle } from "lucide-react";

export default function BookGallery({ book = {}, isSold = false, statusLabel = "Available" }) {
  const [activeTab, setActiveTab] = useState("cover"); // "cover" | "interior" | "back"

  const coverUrl = book.coverImage || "";
  const title = book.title || "Untitled Ebook";

  const galleryItems = [
    {
      id: "cover",
      label: "Cover Art",
      icon: <Sparkles size={13} />,
      type: "image",
    },
    {
      id: "interior",
      label: "Interior Preview",
      icon: <FileText size={13} />,
      type: "interior",
    },
    {
      id: "back",
      label: "Synopsis & Blurb",
      icon: <BookOpen size={13} />,
      type: "back",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-72 mx-auto md:mx-0 shrink-0">
      {/* Main Preview Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-[#f5f4f0] dark:bg-[#1a2238] border border-[#e5e2dc] dark:border-[#253252] shadow-md transition-all duration-300">
        {activeTab === "cover" ? (
          coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <BookOpen size={44} className="text-[#855210]/40 dark:text-[#d4af37]/40 mb-2" />
              <span className="font-playfair text-sm font-semibold text-[#855210] dark:text-[#d4af37]">
                {title}
              </span>
            </div>
          )
        ) : activeTab === "interior" ? (
          /* Interior Sample Preview */
          <div className="h-full w-full p-5 bg-[#faf8f5] dark:bg-[#111726] flex flex-col justify-between select-none overflow-hidden text-left">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#e8e2d8] dark:border-[#202940] pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#855210] dark:text-[#d4af37]">
                  Chapter I
                </span>
                <span className="text-[10px] text-[#999999]">Sample Excerpt</span>
              </div>
              <p className="font-serif text-[11px] leading-relaxed text-[#333333] dark:text-[#d1d5db]">
                &ldquo;The morning mist gathered softly over the old stones of the square, whispering stories that time had long since set aside. In the quiet corridors of the library, pages turned like autumn leaves...&rdquo;
              </p>
              <p className="font-serif text-[10px] leading-relaxed text-[#666666] dark:text-[#9ca3af] hidden sm:block">
                &ldquo;Every chapter in this volume has been carefully calibrated for optimal digital typography, with justified margins and graceful ligature treatment across all modern reading devices.&rdquo;
              </p>
            </div>
            <div className="pt-2 border-t border-[#e8e2d8] dark:border-[#202940] flex items-center justify-between text-[10px] text-[#888888]">
              <span>Typography: Garamond Pro</span>
              <span>Page 14 of {book.pages || 284}</span>
            </div>
          </div>
        ) : (
          /* Back Cover & Synopsis Preview */
          <div className="h-full w-full p-5 bg-[#201d1a] dark:bg-[#0c101c] text-white flex flex-col justify-between text-left">
            <div className="space-y-3">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                Editorial Overview
              </span>
              <p className="font-sans text-[11px] leading-relaxed text-[#cccccc] line-clamp-8">
                {book.description ||
                  "A profound narrative exploring timeless themes of truth, ambition, and the human spirit. Crafted with unmatched narrative precision, this volume stands as an exceptional modern contribution to literature."}
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#aaaaaa]">
              <span className="font-mono">Fable Imprint</span>
              <span>ISBN: {String(book._id || book.id || "978149").slice(-6).toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-xs ${
            isSold ? "bg-red-900/90" : "bg-emerald-800/90"
          }`}
        >
          {isSold ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
          {statusLabel}
        </div>
      </div>

      {/* Multiple Images / Preview Tabs */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {galleryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border py-2 px-1 text-center transition-all cursor-pointer ${
                isActive
                  ? "border-[#855210] dark:border-[#d4af37] bg-white dark:bg-[#1a2238] shadow-xs text-[#855210] dark:text-[#d4af37] font-semibold"
                  : "border-[#e5e2dc] dark:border-[#253252] bg-[#f8f6f2] dark:bg-[#141b2d] text-[#666666] dark:text-[#a0a0a0] hover:border-[#b8afa0]"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-[10px] leading-tight truncate w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
