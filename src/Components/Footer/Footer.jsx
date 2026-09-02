"use client";

import Link from "next/link";
import React, { useState } from "react";
import { myToast } from "@/utils/customToast";

const FacebookIcon = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SendIcon = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    if (myToast && myToast.success) {
      myToast.success("Thank you for subscribing to our newsletter!");
    }
  };

  return (
    <footer className="w-full border-t border-[#e2d9cb] bg-[#eae2d5] text-[#090e14] transition-all">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col items-start lg:col-span-4">
            <Link
              href="/"
              className="font-playfair text-2xl font-bold tracking-tight text-[#090e14] transition-opacity hover:opacity-90 sm:text-3xl"
            >
              Fable
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#555555] sm:text-sm">
              Connecting readers with independent writers and original digital stories. A curated sanctuary designed for focus, immersion, and deep reading.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#090e14]">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c7] bg-[#fafaf8] text-[#090e14] transition-all hover:border-[#090e14] hover:bg-[#050d16] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter or X"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c7] bg-[#fafaf8] text-[#090e14] transition-all hover:border-[#090e14] hover:bg-[#050d16] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <TwitterIcon />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c7] bg-[#fafaf8] text-[#090e14] transition-all hover:border-[#090e14] hover:bg-[#050d16] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <LinkedinIcon />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c7] bg-[#fafaf8] text-[#090e14] transition-all hover:border-[#090e14] hover:bg-[#050d16] hover:text-white hover:scale-105 shadow-2xs"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-3">
            <h3 className="font-playfair text-base font-bold tracking-tight text-[#090e14] sm:text-lg">
              Quick Links
            </h3>

            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium text-[#444444] sm:text-sm">
              <li>
                <Link
                  href="/about"
                  className="inline-block transition-colors hover:text-[#090e14] hover:underline underline-offset-4"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block transition-colors hover:text-[#090e14] hover:underline underline-offset-4"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-block transition-colors hover:text-[#090e14] hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:col-span-2 lg:col-span-5">
            <h3 className="font-playfair text-base font-bold tracking-tight text-[#090e14] sm:text-lg">
              Subscribe to our newsletter
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#555555] sm:text-sm">
              Receive handpicked story recommendations, new release alerts, and exclusive author insights directly in your inbox.
            </p>

            <div className="mt-4 w-full">
              {subscribed ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] p-3 text-xs font-medium text-[#166534]">
                  <CheckCircleIcon className="shrink-0 text-[#16a34a]" />
                  <span>You are subscribed! Thank you for joining our community.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
                >
                  <div className="relative w-full flex-1">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-10 w-full rounded-lg border border-[#d8d1c7] bg-white px-3.5 text-xs text-[#090e14] placeholder:text-[#888888] focus:border-[#090e14] focus:outline-none focus:ring-1 focus:ring-[#090e14] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#050d16] px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer shrink-0"
                  >
                    <span>Subscribe</span>
                    <SendIcon />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e2d9cb] pt-8 text-center">
          <p className="text-xs font-normal text-[#666666]">
            © 2026 Fable. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;