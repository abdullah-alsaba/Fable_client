"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import book404Img from "@/assets/404book.png";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center bg-[#eae2d5] px-4 py-12 sm:px-6 md:px-8">
      {/* Header section */}
      <div className="mb-8 text-center sm:mb-12">
        <h1 className="font-playfair text-3xl font-bold tracking-tight text-[#090e14] sm:text-4xl md:text-5xl">
          UI Patterns &amp; Edge States
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-xs text-[#555555] sm:text-sm leading-relaxed">
          A comprehensive showcase of Fable&apos;s edge cases, loading states, and user feedback mechanisms, designed with editorial elegance.
        </p>
      </div>

      {/* 404 Card */}
      <div className="flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-[#e5e5e0] bg-white p-8 text-center shadow-xs sm:p-12 md:p-16">
        {/* Book Illustration Circle */}
        <div className="relative mb-6 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#f6f5f0] p-4 sm:h-48 sm:w-48">
          <Image
            src={book404Img}
            alt="Page Not Found"
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="font-playfair text-2xl font-bold text-[#090e14] sm:text-3xl md:text-[34px]">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 mb-8 max-w-md text-xs leading-relaxed text-[#555555] sm:text-sm">
          The chapter you are looking for has been misplaced. It may have been moved, or perhaps it never existed at all.
        </p>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;