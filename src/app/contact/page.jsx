"use client";

import React, { useState } from "react";

const LocationPinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 shrink-0 text-[#777777]"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 shrink-0 text-[#777777]"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const SupportIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 shrink-0 text-[#777777]"
  >
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777]"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-[#eae2d5] py-12 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Contact Info */}
        <div className="flex flex-col">
          <h1 className="font-playfair text-4xl font-bold tracking-tight text-[#090e14] sm:text-5xl lg:text-6xl">
            Get in touch.
          </h1>

          <p className="mt-4 max-w-md text-xs leading-relaxed text-[#555555] sm:text-sm">
            Whether you&apos;re an author seeking to publish, a reader with
            feedback, or just curious about what we do at Fable, we&apos;re here
            for the conversation.
          </p>

          <div className="my-6 max-w-md border-t border-[#e2d9cb]" />

          {/* Info list */}
          <div className="flex flex-col gap-6">
            {/* Location */}
            <div className="flex items-start gap-3">
              <LocationPinIcon />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  London Office
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#555555]">
                  42 Publishing Row
                  <br />
                  Clerkenwell, London
                  <br />
                  EC1R 0BE, United Kingdom
                </p>
              </div>
            </div>

            {/* Email General */}
            <div className="flex items-start gap-3">
              <MailIcon />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  General Inquiries
                </h3>
                <a
                  href="mailto:hello@fablepublishing.com"
                  className="mt-0.5 block text-xs font-medium text-[#090e14] underline underline-offset-2 hover:text-[#a2753b] transition-colors"
                >
                  hello@fablepublishing.com
                </a>
              </div>
            </div>

            {/* Author Support */}
            <div className="flex items-start gap-3">
              <SupportIcon />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Author Support
                </h3>
                <a
                  href="mailto:support@fablepublishing.com"
                  className="mt-0.5 block text-xs font-medium text-[#090e14] underline underline-offset-2 hover:text-[#a2753b] transition-colors"
                >
                  support@fablepublishing.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form Card */}
        <div className="w-full">
          <div className="w-full rounded-2xl border border-[#e5e5e0] bg-white p-6 shadow-xl sm:p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a]">
                  ✓
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#090e14]">
                  Message Sent!
                </h3>
                <p className="mt-2 text-xs text-[#555555]">
                  Thank you for contacting us. We will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-semibold text-[#090e14] underline hover:text-[#a2753b]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#171717]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Austen"
                      className="h-10 w-full rounded-lg bg-[#e8e7e5] px-3.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#171717]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="h-10 w-full rounded-lg bg-[#e8e7e5] px-3.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#171717]">
                    Subject
                  </label>

                  <div className="relative">
                    <select
                      defaultValue=""
                      required
                      className="h-10 w-full appearance-none rounded-lg bg-[#e8e7e5] px-3.5 pr-10 text-xs text-[#090e14] focus:bg-white focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Select an inquiry type...
                      </option>
                      <option value="general">General Inquiry</option>
                      <option value="author">Author Publishing</option>
                      <option value="reader">Reader Feedback</option>
                      <option value="support">Support</option>
                    </select>

                    <ChevronDownIcon />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#171717]">
                    Your Message
                  </label>

                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you today?"
                    className="w-full rounded-lg bg-[#e8e7e5] p-3.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-white focus:outline-none transition-all resize-none min-h-35"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-2 flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99]"
                >
                  <span>Send Message</span>
                  <SendIcon />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;