"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import heroImg from "@/assets/heroImg.png";
import heroImg1 from "@/assets/heroImg_1.png";
import heroImg2 from "@/assets/heroImg_2.png";
import heroImg3 from "@/assets/heroImg_3.png";

const ChevronLeftIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const slides = [
  {
    id: 1,
    image: heroImg,
    alt: "Discover Original Stories",
    badge: "Discover Original Stories",
  },
  {
    id: 2,
    image: heroImg1,
    alt: "Curated Collections",
    badge: "Curated Collections",
  },
  {
    id: 3,
    image: heroImg2,
    alt: "Featured Originals",
    badge: "Featured Originals",
  },
  {
    id: 4,
    image: heroImg3,
    alt: "Independent Authors",
    badge: "Independent Authors",
  },
];

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const updateCarouselState = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    const animFrameId = requestAnimationFrame(updateCarouselState);

    emblaApi.on("select", updateCarouselState);
    emblaApi.on("reInit", updateCarouselState);

    return () => {
      cancelAnimationFrame(animFrameId);
      emblaApi.off("select", updateCarouselState);
      emblaApi.off("reInit", updateCarouselState);
    };
  }, [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#e2d9cb] bg-[#e5ded2] shadow-lg select-none group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative aspect-4/3 w-full shrink-0 min-w-0"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={slide.id === 1}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10">
                <span className="inline-block rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#090e14] shadow-sm backdrop-blur-md">
                  {slide.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#090e14] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer z-10 opacity-90 hover:opacity-100"
      >
        <ChevronLeftIcon />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#090e14] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer z-10 opacity-90 hover:opacity-100"
      >
        <ChevronRightIcon />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              index === selectedIndex
                ? "w-6 bg-white shadow-xs"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
