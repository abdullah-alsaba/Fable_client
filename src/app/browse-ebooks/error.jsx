"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import errorBooksImg from "@/assets/errorBooks.png";

export default function BrowseEbooksError({ error, reset }) {
  useEffect(() => {
    console.error("Browse Ebooks Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#eae2d5] py-12 px-4 sm:px-6 lg:px-12 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e2dc] bg-white p-8 text-center shadow-xs sm:p-12 max-w-lg w-full">
        <div className="relative mb-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#f6f5f0] p-4 sm:h-44 sm:w-44">
          <Image
            src={errorBooksImg}
            alt="Error Fetching Ebooks"
            fill
            className="object-contain p-4"
          />
        </div>

        <h2 className="font-playfair text-2xl font-bold text-[#090e14] sm:text-3xl">
          Error Fetching Ebooks
        </h2>

        <p className="mt-2 mb-6 max-w-md text-xs sm:text-sm text-[#555555]">
          Something went wrong while attempting to fetch ebooks. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
