"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import errorBooksImg from "@/assets/errorBooks.png";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Boundary caught error:", error);
    toast.error("Something went wrong. Reload.");
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center bg-[#eae2d5] px-4 py-12">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl border border-[#e5e2dc] bg-white p-8 text-center shadow-xs sm:p-12">
        <div className="relative mb-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#f6f5f0] p-4 sm:h-44 sm:w-44">
          <Image
            src={errorBooksImg}
            alt="Something went wrong"
            fill
            className="object-contain p-4"
          />
        </div>

        <h2 className="font-playfair text-2xl font-bold text-[#090e14] sm:text-3xl">
          Something went wrong
        </h2>

        <p className="mt-2 mb-6 max-w-md text-xs sm:text-sm text-[#555555] leading-relaxed">
          An unexpected runtime error occurred. Please try reloading the page.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer"
          >
            Reload / Try Again
          </button>
        </div>
      </div>
    </div>
  );
}