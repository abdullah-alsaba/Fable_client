"use client";

import BookCard from "@/Components/BookCard/BookCard";
import BrowseEbooksSidebar from "@/Components/BrowseEbooksSidebar/BrowseEbooksSidebar";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import noBooksImg from "@/assets/noBooksFound.png";
import errorBooksImg from "@/assets/errorBooks.png";

const ChevronDownIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 inline-block"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function BrowseBooksClient({ initialEBooks = [], initialError = false }) {
  const searchParams = useSearchParams();
  const writerParam = searchParams.get("writer") || searchParams.get("search") || "";

  const [eBooks] = useState(initialEBooks);
  const [error] = useState(initialError);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(writerParam);

  const activeSearchQuery = writerParam || searchQuery;

  // Filtered and Sorted EBooks memoized
  const sortedEBooks = useMemo(() => {
    if (!eBooks || !eBooks.length) return [];
    let list = [...eBooks];

    if (activeSearchQuery && activeSearchQuery.trim() !== "") {
      const q = activeSearchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.writerName && b.writerName.toLowerCase().includes(q)) ||
          (b.genre && b.genre.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-low") {
      return list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    if (sortBy === "title-az") {
      return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return list;
  }, [eBooks, sortBy, activeSearchQuery]);

  return (
    <div className="min-h-screen bg-[#eae2d5] py-6 sm:py-10 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <div className="space-y-4">
          <h1 className="font-playfair text-3xl font-bold tracking-tight text-[#090e14] sm:text-4xl lg:text-5xl">
            Explore Ebooks
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm text-[#555555] leading-relaxed">
            Discover your next compelling read. Our curated collection spans
            genres, carefully selected for the discerning reader.
          </p>
          <div className="relative max-w-md pt-1 flex gap-2 items-center">
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full rounded-lg border border-[#e5e2dc] bg-white/80 px-4 py-2.5 text-xs sm:text-sm text-[#252525] placeholder:text-[#a09c95] focus:border-[#050d16] focus:bg-white focus:outline-none shadow-xs"
            />
            {activeSearchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-[#855210] hover:underline px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

      
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
       
          <BrowseEbooksSidebar />

          
          <div className="flex-1 space-y-5">
         
            {!error && (
              <div className="flex items-center justify-between border-b border-[#e2d9cb] pb-3.5 text-xs text-[#77736d]">
                <p className="font-sans text-xs text-[#77736d]">
                  {`Showing 1-${sortedEBooks.length} of ${sortedEBooks.length} results`}
                </p>
                <div className="flex items-center gap-1.5 font-sans text-xs text-[#252525]">
                  <span className="text-[#77736d]">Sort by:</span>
                  <div className="relative inline-flex items-center">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-transparent pr-4 font-bold text-[#090e14] focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="title-az">Title: A to Z</option>
                    </select>
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            )}

           
            {error && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e2dc] bg-white p-8 text-center shadow-xs sm:p-12">
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
                  We encountered an issue while retrieving the ebooks. Please check your connection or try again.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

           
            {!error && sortedEBooks.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e2dc] bg-white p-8 text-center shadow-xs sm:p-12">
                <div className="relative mb-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#f6f5f0] p-4 sm:h-44 sm:w-44">
                  <Image
                    src={noBooksImg}
                    alt="No Ebooks Found"
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-[#090e14] sm:text-3xl">
                  No Ebooks Found
                </h2>
                <p className="mt-2 mb-6 max-w-md text-xs sm:text-sm text-[#77736d]">
                  We couldn&apos;t find any ebooks matching your search or filters.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

           
            {!error && sortedEBooks.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {sortedEBooks.map((book, idx) => (
                  <BookCard key={book._id || book.id || idx} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}