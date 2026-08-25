"use client";

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#e2d9cb] bg-[#eae2d5] py-10 px-6 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:items-center md:text-left">
        {/* Left Section: Brand & Copyright */}
        <div>
          <Link
            href="/"
            className="inline-block font-playfair text-2xl font-bold tracking-tight text-[#090e14] sm:text-3xl"
          >
            Fable
          </Link>

          <p className="mt-2 text-xs leading-relaxed text-[#666666]">
            © 2024 Fable. All rights reserved. Crafted for the focused reader.
          </p>
        </div>

        {/* Right Section: Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#333333] md:justify-end">
          <Link
            href="/browse-ebooks"
            className="transition-colors hover:text-[#090e14]"
          >
            Browse
          </Link>

          <Link
            href="/about"
            className="transition-colors hover:text-[#090e14]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition-colors hover:text-[#090e14]"
          >
            Contact
          </Link>

          <Link
            href="/privacy"
            className="transition-colors hover:text-[#090e14]"
          >
            Privacy
          </Link>
          <Link
            href="/newsletter"
            className="transition-colors hover:text-[#090e14]"
          >
            Newsletter
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;