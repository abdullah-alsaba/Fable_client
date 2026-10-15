"use client";

import { Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const BookCard = ({ book = {} }) => {
  const {
    _id,
    id,
    coverImage,
    title = "Untitled Ebook",
    price = 0,
    genre = "General",
    writerName = "Unknown Writer",
    description = "",
    rating = 4.8,
    status,
    isSold,
    sold,
  } = book;

  const bookId = _id || id || "#";
  const isBookSold = isSold || sold || (status && status.toLowerCase() === "sold");

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      <Link href={`/browse-ebooks/${bookId}`} className="group block w-full h-full text-left">
        <Card
          radius="none"
          shadow="none"
          className="w-full h-full rounded-[10px] border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-3.5 transition-all duration-200 hover:border-[#c5bcad] dark:hover:border-[#c4974f] hover:shadow-md"
        >
          
          <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden rounded-md bg-[#f5f4f0] dark:bg-[#1d273f]">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-4 text-center">
                <span className="font-playfair text-xs font-semibold text-[#855210]/60 dark:text-[#d4af37]/70">
                  {title}
                </span>
              </div>
            )}

            {isBookSold && (
              <div className="absolute top-2.5 right-2.5 z-10 rounded-md bg-[#050d16]/90 px-2 py-0.9 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                Sold
              </div>
            )}
          </div>

          <div className="flex flex-col pt-3 pb-1 gap-1.5">
            <div className="flex items-center justify-between">
              <p className="truncate font-playfair text-[10px] font-bold uppercase tracking-wider text-[#855210] dark:text-[#d4af37]">
                {genre}
              </p>
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <span>★</span>
                <span>{typeof rating === "number" ? rating.toFixed(1) : "4.8"}</span>
              </span>
            </div>

            <h2 className="line-clamp-1 font-playfair text-[16px] font-semibold leading-5 text-[#252525] dark:text-[#f0f0f0] group-hover:text-[#855210] dark:group-hover:text-[#d4af37] transition-colors">
              {title}
            </h2>

            <p className="truncate font-sans text-[12px] text-[#77736d] dark:text-[#a09c95]">
              by {writerName}
            </p>

            <p className="line-clamp-2 min-h-8 font-sans text-[11px] text-[#666666] dark:text-[#9e9e9e] leading-snug">
              {description || "Explore this captivating literary work published on Fable."}
            </p>

            <div className="mt-1 flex items-center justify-between pt-1 border-t border-[#f0ece3] dark:border-[#253252]">
              <p className="font-playfair text-[15px] font-bold text-[#855210] dark:text-[#d4af37]">
                {typeof price === "number" ? `$${price.toFixed(2)}` : price ? `$${price}` : "$0.00"}
              </p>

              <span className="rounded bg-[#f5f4f0] dark:bg-[#1d273f] px-2 py-1 font-sans text-[11px] font-medium text-[#252525] dark:text-[#e0e0e0] group-hover:bg-[#050d16] dark:group-hover:bg-[#d4af37] group-hover:text-white dark:group-hover:text-[#090e14] transition-colors">
                View Details
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default BookCard;
