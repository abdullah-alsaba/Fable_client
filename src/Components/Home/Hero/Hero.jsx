"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import heroImg from "@/assets/heroImg.png";

const Hero = () => {
  return (
    <section className="w-full py-4 sm:py-8 lg:py-12">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col text-center lg:text-left">
          <h1 className="font-playfair text-3xl font-bold leading-tight tracking-tight text-[#090e14] sm:text-4xl lg:text-5xl xl:text-6xl">
            Discover &amp; Read Original Ebooks
          </h1>

          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#555555] sm:text-sm lg:mx-0 lg:max-w-lg lg:text-base">
            Connecting readers with independent writers and original digital
            stories. Immerse yourself in worlds crafted by passionate authors.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/browse-ebooks" className="w-full sm:w-auto">
              <button
                type="button"
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[#855310] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#6e440c] active:scale-[0.99] sm:w-auto"
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
          </div>
        </div>

        <div className="relative aspect-4/3 w-full select-none overflow-hidden rounded-2xl border border-[#e2d9cb] shadow-lg">
          <Image
            src={heroImg}
            alt="Discover & Read Original Ebooks"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;