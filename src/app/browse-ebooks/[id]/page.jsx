import Image from "next/image";
import Link from "next/link";
import { getEBookById } from "@/utils/data";
import { User, Calendar, Tag, BookOpen, AlertCircle, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import BookmarkButton from "./BookmarkButton";

export const dynamic = "force-dynamic";

export default async function EBookDetailsPage({ params }) {
  const resolvedParams = await params;
  const bookId = resolvedParams?.id;
  const book = await getEBookById(bookId);

  // Error State - Ebook not found for invalid ID
  if (!book) {
    return (
      <div className="min-h-screen bg-[#eae2d5] py-16 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md rounded-2xl border border-[#e5e2dc] bg-white p-8 sm:p-10 shadow-sm flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <AlertCircle size={36} />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#090e14]">
            Ebook not found
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#77736d]">
            The requested ebook with ID <span className="font-mono font-semibold text-[#252525]">&quot;{bookId || "N/A"}&quot;</span> could not be found or does not exist.
          </p>
          <div className="mt-6 pt-6 border-t border-[#e5e2dc] w-full">
            <Link
              href="/browse-ebooks"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99]"
            >
              <ArrowLeft size={16} />
              Back to Browse Ebooks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Status computation (Available vs Sold)
  const isSold =
    book.isSold ||
    book.sold ||
    (typeof book.status === "string" && book.status.toLowerCase() === "sold") ||
    (typeof book.availability === "string" && book.availability.toLowerCase() === "sold");

  const statusLabel = isSold ? "Sold" : "Available";

  // Date uploaded formatting
  const rawDate = book.dateUploaded || book.createdAt || book.uploadedDate || book.date;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Uploaded";

  const writerName = book.writerName || book.author || "Unknown Writer";
  const writerLink = `/browse-ebooks?writer=${encodeURIComponent(writerName)}`;

  return (
    <div className="min-h-screen bg-[#eae2d5] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          href="/browse-ebooks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#855210] hover:text-[#5f390c] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Browse Ebooks
        </Link>

        {/* Main Details Card */}
        <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-white p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* High-resolution cover image (from imgBB or external CDN) */}
            <div className="relative aspect-3/4 w-full max-w-65 mx-auto md:mx-0 shrink-0 overflow-hidden rounded-xl bg-[#f5f4f0] border border-[#e5e2dc] shadow-sm">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-[#f5f4f0]">
                  <BookOpen size={40} className="text-[#855210]/40 mb-2" />
                  <span className="font-playfair text-sm font-semibold text-[#855210]">
                    {book.title}
                  </span>
                </div>
              )}

              {/* Status Badge Over Image */}
              <div
                className={`absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs ${
                  isSold ? "bg-red-900/90" : "bg-emerald-800/90"
                }`}
              >
                {isSold ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                {statusLabel}
              </div>
            </div>

            {/* Book Details Content */}
            <div className="flex-1 space-y-4 text-left w-full">
              
              {/* Genre & Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0ece3] pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3eb] px-3 py-1 font-playfair text-xs font-bold uppercase tracking-widest text-[#855210]">
                  <Tag size={12} />
                  {book.genre || "General"}
                </span>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="text-[#77736d]">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isSold
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {isSold ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        Sold
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Available
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#090e14] leading-tight">
                {book.title}
              </h1>

              {/* Writer Name (Clickable link to writer's profile or ebook list) */}
              <div className="flex items-center gap-2 font-sans text-sm text-[#77736d]">
                <User size={16} className="text-[#855210]" />
                <span>Written by</span>
                <Link
                  href={writerLink}
                  title={`View all ebooks by ${writerName}`}
                  className="font-semibold text-[#855210] hover:text-[#5f390c] hover:underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {writerName}
                </Link>
              </div>

              {/* Date Uploaded */}
              <div className="flex items-center gap-2 font-sans text-xs text-[#77736d]">
                <Calendar size={14} className="text-[#a09c95]" />
                <span>Date Uploaded:</span>
                <span className="font-medium text-[#252525]">{formattedDate}</span>
              </div>

              {/* Price Banner */}
              <div className="py-3 px-4 rounded-xl bg-[#fcfbfa] border border-[#e5e2dc] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#77736d]">Price</p>
                  <p className="font-playfair text-2xl font-bold text-[#855210]">
                    {typeof book.price === "number"
                      ? `$${book.price.toFixed(2)}`
                      : book.price
                      ? `$${book.price}`
                      : "$0.00"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#77736d]">Availability</p>
                  <p className="text-xs font-semibold text-[#252525]">
                    {isSold ? "Out of Stock" : "In Stock (Ready to Read)"}
                  </p>
                </div>
              </div>

              {/* Description (Preview of content) */}
              <div className="space-y-2 pt-2">
                <h3 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#090e14]">
                  Description & Content Preview
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed whitespace-pre-line">
                  {book.description ||
                    "Discover an extraordinary literary work available on Fable. Explores captivating themes with rich narrative depth, perfectly suited for the discerning reader."}
                </p>
              </div>

              {/* Content Excerpt if available */}
              {book.content && (
                <div className="mt-4 p-4 rounded-lg bg-[#f8f7f4] border border-[#e8e4dc] space-y-1.5">
                  <h4 className="font-playfair text-xs font-bold text-[#855210] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} />
                    Content Excerpt
                  </h4>
                  <p className="text-xs text-[#666] italic leading-relaxed line-clamp-4">
                    &quot;{book.content}&quot;
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4 items-center">
                {isSold ? (
                  <button
                    disabled
                    className="cursor-not-allowed rounded-lg bg-gray-200 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-300"
                  >
                    Item Sold Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-[#050d16] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99]"
                  >
                    Get This Ebook
                  </Link>
                )}

                <BookmarkButton />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
