"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import about1 from "@/assets/about_1.png";
import about2 from "@/assets/about_2.png";
import about3 from "@/assets/about_3.png";

const BookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#a2753b]"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CompassIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#a2753b]"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const QuillIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#a2753b]"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const AboutPage = () => {
  return (
    <main className="w-full bg-[#eae2d5] py-12 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 sm:gap-24">
        {/* Section 1: Hero */}
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1 className="font-playfair text-3xl font-bold leading-tight tracking-tight text-[#090e14] sm:text-4xl lg:text-5xl">
              Redefining the reading experience.
            </h1>

            <p className="mt-4 max-w-lg text-xs leading-relaxed text-[#555555] sm:text-sm">
              Fable connects discerning readers with independent writers in a
              space designed for focus, immersion, and discovery. We believe
              great stories deserve a beautiful home.
            </p>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-[#e2d9cb] shadow-sm select-none">
            <Image
              src={about1}
              alt="Redefining the reading experience - Fable Craft & Community"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center"
            />
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="text-center">
          <h2 className="font-playfair text-2xl font-bold tracking-tight text-[#090e14] sm:text-3xl lg:text-4xl">
            Our Mission
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-xs text-[#555555] sm:text-sm">
            Bridging the gap between brilliant independent minds and readers
            seeking substance over noise.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col items-start rounded-xl border border-[#e5e5e0] bg-[#fafaf8] p-6 text-left shadow-2xs transition-all hover:bg-white hover:shadow-xs">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eae2d5]/60">
                <BookIcon />
              </div>

              <h3 className="font-playfair text-base font-bold text-[#090e14]">
                Curated Quality
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#555555]">
                We hand-select stories that challenge, inspire, and captivate,
                ensuring every read is worthwhile.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-start rounded-xl border border-[#e5e5e0] bg-[#fafaf8] p-6 text-left shadow-2xs transition-all hover:bg-white hover:shadow-xs">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eae2d5]/60">
                <CompassIcon />
              </div>

              <h3 className="font-playfair text-base font-bold text-[#090e14]">
                Designed for Focus
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#555555]">
                Our platform is stripped of distractions, allowing the written
                word to take center stage in a clean, editorial layout.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-start rounded-xl border border-[#e5e5e0] bg-[#fafaf8] p-6 text-left shadow-2xs transition-all hover:bg-white hover:shadow-xs sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eae2d5]/60">
                <QuillIcon />
              </div>

              <h3 className="font-playfair text-base font-bold text-[#090e14]">
                Empowering Writers
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#555555]">
                We provide independent authors with the tools and audience they
                need to thrive in a professional environment.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: For Readers */}
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-[#e2d9cb] shadow-sm select-none lg:order-1">
            <Image
              src={about2}
              alt="A sanctuary for the mind"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center"
            />
          </div>

          <div className="lg:order-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a2753b]">
              FOR READERS
            </span>

            <h2 className="mt-2 font-playfair text-2xl font-bold leading-tight tracking-tight text-[#090e14] sm:text-3xl lg:text-4xl">
              A sanctuary for the mind.
            </h2>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#555555] sm:text-sm">
              Escape the endless scroll. Fable offers a meticulously curated
              library of original stories presented in a distraction-free,
              magazine-quality interface. Lose yourself in deep reading.
            </p>

            <div className="mt-6">
              <Link
                href="/browse-ebooks"
                className="text-xs font-semibold text-[#090e14] underline underline-offset-4 hover:text-[#a2753b] transition-colors"
              >
                Explore the Library
              </Link>
            </div>
          </div>
        </section>

        {/* Section 4: For Writers */}
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a2753b]">
              FOR WRITERS
            </span>

            <h2 className="mt-2 font-playfair text-2xl font-bold leading-tight tracking-tight text-[#090e14] sm:text-3xl lg:text-4xl">
              Your professional home.
            </h2>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#555555] sm:text-sm">
              Publish your best work in an environment that respects the craft.
              We offer powerful editorial tools, insightful analytics, and a
              community of readers who value quality writing.
            </p>

            <div className="mt-6">
              <Link
                href="/register"
                className="text-xs font-semibold text-[#090e14] underline underline-offset-4 hover:text-[#a2753b] transition-colors"
              >
                Start Publishing
              </Link>
            </div>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-[#e2d9cb] shadow-sm select-none">
            <Image
              src={about3}
              alt="Your professional home"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;