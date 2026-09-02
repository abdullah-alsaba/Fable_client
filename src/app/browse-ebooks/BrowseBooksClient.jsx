"use client";

import BookCard from "@/Components/BookCard/BookCard";
import BrowseEbooksSidebar from "@/Components/BrowseEbooksSidebar/BrowseEbooksSidebar";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import noBooksImg from "@/assets/noBooksFound.png";
import errorBooksImg from "@/assets/errorBooks.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function BrowseBooksClient({ serverData = {}, initialError = false, currentParams = {} }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ebooks = serverData.ebooks || (Array.isArray(serverData) ? serverData : []);
  const totalBooks = serverData.totalBooks !== undefined ? serverData.totalBooks : ebooks.length;
  const totalPages = serverData.totalPages || 1;
  const currentPage = serverData.currentPage || currentParams.page || 1;
  const limit = serverData.limit || currentParams.limit || 8;

  const [searchInput, setSearchInput] = useState(currentParams.search || "");

  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/browse-ebooks?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParams({ search: searchInput, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateQueryParams({ search: "", writer: "", page: 1 });
  };

  const handleSortChange = (e) => {
    updateQueryParams({ sortBy: e.target.value, page: 1 });
  };

  const startResult = totalBooks === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalBooks);

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
          <form onSubmit={handleSearchSubmit} className="relative max-w-md pt-1 flex gap-2 items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full rounded-lg border border-[#e5e2dc] bg-white/80 px-4 py-2.5 text-xs sm:text-sm text-[#252525] placeholder:text-[#a09c95] focus:border-[#050d16] focus:bg-white focus:outline-none shadow-xs"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#050d16] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#182230] cursor-pointer"
            >
              Search
            </button>
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs font-semibold text-[#855210] hover:underline px-1 cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}
          </form>
        </div>

      
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
       
          <BrowseEbooksSidebar />

          
          <div className="flex-1 space-y-5">
         
            {!initialError && (
              <div className="flex items-center justify-between border-b border-[#e2d9cb] pb-3.5 text-xs text-[#77736d]">
                <p className="font-sans text-xs text-[#77736d]">
                  {`Showing ${startResult}-${endResult} of ${totalBooks} results`}
                </p>
                <div className="flex items-center gap-1.5 font-sans text-xs text-[#252525]">
                  <span className="text-[#77736d]">Sort by:</span>
                  <div className="relative inline-flex items-center">
                    <select
                      value={currentParams.sortBy || "newest"}
                      onChange={handleSortChange}
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

           
            {initialError && (
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
                  onClick={() => router.refresh()}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

           
            {!initialError && ebooks.length === 0 && (
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
                  onClick={handleClearSearch}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

           
            {!initialError && ebooks.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {ebooks.map((book, idx) => (
                    <BookCard key={book._id || book.id || idx} book={book} />
                  ))}
                </div>

                {/* Server-Side Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-[#e2d9cb]">
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#e5e2dc] bg-white px-3 text-xs font-semibold text-[#252525] shadow-xs hover:bg-[#f5f4f0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      <ChevronLeft size={14} />
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => handlePageChange(pg)}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pg
                            ? "bg-[#050d16] text-white shadow-sm"
                            : "bg-white border border-[#e5e2dc] text-[#252525] hover:bg-[#f5f4f0]"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#e5e2dc] bg-white px-3 text-xs font-semibold text-[#252525] shadow-xs hover:bg-[#f5f4f0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}