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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please provide your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!formData.subject) {
      setErrorMessage("Please select an inquiry subject.");
      return;
    }

    if (formData.message.trim().length < 5) {
      setErrorMessage("Message must be at least 5 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
      const res = await fetch(`${serverUri}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send your message. Please try again.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMessage(err.message || "An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#eae2d5] dark:bg-[#0c101c] py-12 px-4 sm:px-8 lg:px-16 transition-colors">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col text-left">
          <h1 className="font-playfair text-4xl font-bold tracking-tight text-[#090e14] dark:text-[#f3f3f3] sm:text-5xl lg:text-6xl">
            Get in touch.
          </h1>

          <p className="mt-4 max-w-md text-xs leading-relaxed text-[#555555] dark:text-[#a09c95] sm:text-sm">
            Whether you&apos;re an author seeking to publish, a reader with
            feedback, or just curious about what we do at Fable, we&apos;re here
            for the conversation.
          </p>

          <div className="my-6 max-w-md border-t border-[#e2d9cb] dark:border-[#253252]" />

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <LocationPinIcon />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#f0f0f0]">
                  London Office
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#555555] dark:text-[#a09c95]">
                  42 Publishing Row
                  <br />
                  Clerkenwell, London
                  <br />
                  EC1R 0BE, United Kingdom
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MailIcon />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#f0f0f0]">
                  General Inquiries
                </h3>
                <a
                  href="mailto:hello@fablepublishing.com"
                  className="mt-0.5 block text-xs font-medium text-[#090e14] dark:text-[#d4af37] underline underline-offset-2 hover:text-[#a2753b] transition-colors"
                >
                  hello@fablepublishing.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SupportIcon />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#f0f0f0]">
                  Author Support
                </h3>
                <a
                  href="mailto:support@fablepublishing.com"
                  className="mt-0.5 block text-xs font-medium text-[#090e14] dark:text-[#d4af37] underline underline-offset-2 hover:text-[#a2753b] transition-colors"
                >
                  support@fablepublishing.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full text-left">
          <div className="w-full rounded-2xl border border-[#e5e5e0] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-6 shadow-xl sm:p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#16a34a]/10 dark:bg-[#16a34a]/20 text-[#16a34a] dark:text-[#4ade80] text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#090e14] dark:text-[#f3f3f3]">
                  Message Received!
                </h3>
                <p className="mt-2 text-xs text-[#555555] dark:text-[#a09c95] max-w-sm mx-auto">
                  Thank you for reaching out. Your dispatch has been saved in our correspondence log, and our editorial team will reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#855210] dark:text-[#d4af37] underline hover:text-[#5f390c] cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 text-xs text-red-700 dark:text-red-300">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-semibold text-[#171717] dark:text-[#d1d5db]"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Austen"
                      className="h-10 w-full rounded-lg bg-[#e8e7e5] dark:bg-[#1d273f] px-3.5 text-xs text-[#090e14] dark:text-[#f0f0f0] placeholder:text-[#999999] dark:placeholder:text-[#6b7280] border border-transparent dark:border-[#2a375a] focus:bg-white dark:focus:bg-[#161f36] focus:border-[#855210] dark:focus:border-[#d4af37] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-semibold text-[#171717] dark:text-[#d1d5db]"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="h-10 w-full rounded-lg bg-[#e8e7e5] dark:bg-[#1d273f] px-3.5 text-xs text-[#090e14] dark:text-[#f0f0f0] placeholder:text-[#999999] dark:placeholder:text-[#6b7280] border border-transparent dark:border-[#2a375a] focus:bg-white dark:focus:bg-[#161f36] focus:border-[#855210] dark:focus:border-[#d4af37] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block text-xs font-semibold text-[#171717] dark:text-[#d1d5db]"
                  >
                    Subject *
                  </label>

                  <div className="relative">
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="h-10 w-full appearance-none rounded-lg bg-[#e8e7e5] dark:bg-[#1d273f] px-3.5 pr-10 text-xs text-[#090e14] dark:text-[#f0f0f0] border border-transparent dark:border-[#2a375a] focus:bg-white dark:focus:bg-[#161f36] focus:border-[#855210] dark:focus:border-[#d4af37] focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Select an inquiry type...
                      </option>
                      <option value="general">General Inquiry</option>
                      <option value="author">Author Publishing</option>
                      <option value="reader">Reader Feedback</option>
                      <option value="support">Technical Support</option>
                    </select>

                    <ChevronDownIcon />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-semibold text-[#171717] dark:text-[#d1d5db]"
                  >
                    Your Message *
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can our editorial team assist you today?"
                    className="w-full rounded-lg bg-[#e8e7e5] dark:bg-[#1d273f] p-3.5 text-xs text-[#090e14] dark:text-[#f0f0f0] placeholder:text-[#999999] dark:placeholder:text-[#6b7280] border border-transparent dark:border-[#2a375a] focus:bg-white dark:focus:bg-[#161f36] focus:border-[#855210] dark:focus:border-[#d4af37] focus:outline-none transition-all resize-none min-h-35"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#050d16] dark:bg-[#d4af37] px-6 text-xs font-semibold uppercase tracking-wider text-white dark:text-[#090e14] shadow-xs transition-all hover:bg-[#182230] dark:hover:bg-[#b8952b] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Sending Dispatch..." : "Send Message"}</span>
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