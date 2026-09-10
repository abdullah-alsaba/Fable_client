"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { EmblaCarousel } from "@/Components/EmblaCarousel/EmblaCarousel";

const Hero = () => {
  return (
    <section className="w-full py-4 sm:py-8 lg:py-12">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col text-center lg:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-playfair text-3xl font-bold leading-tight tracking-tight text-[#090e14] sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            Discover &amp; Read Original Ebooks
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#555555] sm:text-sm lg:mx-0 lg:max-w-lg lg:text-base"
          >
            Connecting readers with independent writers and original digital
            stories. Immerse yourself in worlds crafted by passionate authors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link href="/browse-ebooks" className="w-full sm:w-auto">
              <button
                type="button"
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] sm:w-auto"
              >
                Browse Ebooks
              </button>
            </Link>

            <Link href="/register" className="w-full sm:w-auto">
              <button
                type="button"
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-[#090e14] bg-white px-6 text-xs font-semibold uppercase tracking-wider text-[#090e14] transition-all hover:bg-[#f8f7f5] active:scale-[0.99] sm:w-auto"
              >
                Become a Writer
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <EmblaCarousel />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;