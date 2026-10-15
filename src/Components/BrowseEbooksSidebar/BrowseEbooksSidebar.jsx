"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GENRES = [
  { id: "all", label: "All Genres" },
  { id: "fiction", label: "Fiction" },
  { id: "mystery", label: "Mystery" },
  { id: "romance", label: "Romance" },
  { id: "sci-fi", label: "Sci-Fi / Fantasy" },
  { id: "fantasy", label: "Fantasy" },
  { id: "non-fiction", label: "Non-Fiction" },
  { id: "biography", label: "Biography" },
  { id: "horror", label: "Horror" },
];

export default function BrowseEbooksSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get("genre") || "all";
  const currentAvailability = searchParams.get("availability") || "all";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse-ebooks?${params.toString()}`);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (minPriceInput) params.set("minPrice", minPriceInput);
    else params.delete("minPrice");

    if (maxPriceInput) params.set("maxPrice", maxPriceInput);
    else params.delete("maxPrice");

    router.push(`/browse-ebooks?${params.toString()}`);
  };

  const handleClearAll = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    router.push("/browse-ebooks");
  };

  const hasActiveFilters =
    searchParams.has("genre") ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    searchParams.has("availability") ||
    searchParams.has("search") ||
    searchParams.has("writer");

  return (
    <aside className="w-full shrink-0 space-y-6 md:w-56 lg:w-64 rounded-2xl border border-[#e5e2dc] dark:border-[#252d48] bg-white/80 dark:bg-[#141a2e] p-5 shadow-xs transition-colors text-left">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-base font-bold text-[#090e14] dark:text-[#f3f3f3]">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-[#855210] dark:text-[#d4af37] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <hr className="border-[#e5e2dc] dark:border-[#202940]" />

      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#090e14] dark:text-[#f3f3f3]">Genre</h3>
        <div className="space-y-2 text-xs font-medium text-[#252525] dark:text-[#dedede]">
          {GENRES.map((item) => {
            const isSelected =
              currentGenre.toLowerCase() === item.label.toLowerCase() ||
              currentGenre.toLowerCase() === item.id.toLowerCase() ||
              (item.id === "all" && (!currentGenre || currentGenre.toLowerCase() === "all"));

            return (
              <label
                key={item.id}
                className="flex items-center gap-2.5 cursor-pointer hover:text-[#855210] dark:hover:text-[#d4af37] transition-colors"
              >
                <input
                  type="radio"
                  name="genreFilter"
                  checked={isSelected}
                  onChange={() => updateParam("genre", item.id === "all" ? "" : item.label)}
                  className="h-3.5 w-3.5 accent-[#855210] dark:accent-[#d4af37]"
                />
                <span className={isSelected ? "font-bold text-[#855210] dark:text-[#d4af37]" : ""}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-[#e5e2dc] dark:border-[#202940]" />

      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#090e14] dark:text-[#f3f3f3]">
          Price Range ($)
        </h3>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full rounded-md border border-[#e5e2dc] dark:border-[#252d48] bg-[#f9f8f6] dark:bg-[#1d273f] px-3 py-1.5 text-xs text-[#252525] dark:text-[#f0f0f0] placeholder:text-[#a09c95] dark:placeholder:text-[#6b7280] focus:border-[#855210] dark:focus:border-[#d4af37] focus:bg-white dark:focus:bg-[#161f36] focus:outline-none transition-colors"
            />
            <span className="text-xs text-[#77736d] dark:text-[#a09c95]">-</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full rounded-md border border-[#e5e2dc] dark:border-[#252d48] bg-[#f9f8f6] dark:bg-[#1d273f] px-3 py-1.5 text-xs text-[#252525] dark:text-[#f0f0f0] placeholder:text-[#a09c95] dark:placeholder:text-[#6b7280] focus:border-[#855210] dark:focus:border-[#d4af37] focus:bg-white dark:focus:bg-[#161f36] focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#050d16] dark:bg-[#d4af37] py-1.5 text-xs font-semibold text-white dark:text-[#090e14] shadow-xs hover:bg-[#182230] dark:hover:bg-[#b8952b] cursor-pointer transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      <hr className="border-[#e5e2dc] dark:border-[#202940]" />

      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#090e14] dark:text-[#f3f3f3]">
          Availability
        </h3>
        <div className="space-y-2 text-xs font-medium text-[#252525] dark:text-[#dedede]">
          {[
            { value: "all", label: "All Items" },
            { value: "available", label: "Available / In Stock" },
            { value: "sold", label: "Sold / Out of Print" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2.5 cursor-pointer hover:text-[#855210] dark:hover:text-[#d4af37] transition-colors"
            >
              <input
                type="radio"
                name="availability"
                value={item.value}
                checked={currentAvailability === item.value}
                onChange={() => updateParam("availability", item.value)}
                className="h-3.5 w-3.5 accent-[#855210] dark:accent-[#d4af37]"
              />
              <span className={currentAvailability === item.value ? "font-bold text-[#855210] dark:text-[#d4af37]" : ""}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}