"use client";

import React from "react";
import Link from "next/link";

const PrivacyPage = () => {
  return (
    <main className="w-full bg-[#eae2d5] py-12 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#e5e5e0] bg-white p-6 shadow-sm sm:p-10">
        <h1 className="font-playfair text-3xl font-bold tracking-tight text-[#090e14] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-[#666666]">
          Last updated: January 2026
        </p>

        <div className="my-6 border-t border-[#e2d9cb]" />

        <div className="flex flex-col gap-6 text-xs leading-relaxed text-[#444444] sm:text-sm">
          <section>
            <h2 className="font-playfair text-lg font-bold text-[#090e14] mb-2">
              1. Information We Collect
            </h2>
            <p>
              At Fable, we respect your privacy. We collect information you provide directly to us when creating an account, subscribing to our newsletter, or contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-lg font-bold text-[#090e14] mb-2">
              2. How We Use Information
            </h2>
            <p>
              We use the information we collect to deliver our reading and publishing services, personalize your reading experience, process transactions, and send periodic updates about curated stories.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-lg font-bold text-[#090e14] mb-2">
              3. Data Protection & Sharing
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties. Your data is securely stored and protected using industry-standard security measures.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-lg font-bold text-[#090e14] mb-2">
              4. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to us at{" "}
              <Link href="/contact" className="font-semibold text-[#090e14] underline hover:text-[#a2753b]">
                Contact Support
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;
