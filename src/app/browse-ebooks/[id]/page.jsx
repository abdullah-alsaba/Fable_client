import Link from "next/link";
import { getEBookById, getDataAllEBooks } from "@/utils/data";
import { User, Calendar, Tag, AlertCircle, ArrowLeft } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import BuyButton from "./BuyButton";
import EbookContent from "./EbookContent";
import BookGallery from "./BookGallery";
import BookReviews from "./BookReviews";
import BookCard from "@/Components/BookCard/BookCard";

export const dynamic = "force-dynamic";

export default async function EBookDetailsPage({ params }) {
  const resolvedParams = await params;
  const bookId = resolvedParams?.id;
  const book = await getEBookById(bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-[#eae2d5] dark:bg-[#0c101c] py-16 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md rounded-2xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-8 sm:p-10 shadow-sm flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
            <AlertCircle size={36} />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#090e14] dark:text-[#f3f3f3]">
            Ebook not found
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#77736d] dark:text-[#a09c95]">
            The requested ebook with ID <span className="font-mono font-semibold text-[#252525] dark:text-[#d4af37]">&quot;{bookId || "N/A"}&quot;</span> could not be found or does not exist.
          </p>
          <div className="mt-6 pt-6 border-t border-[#e5e2dc] dark:border-[#253252] w-full">
            <Link
              href="/browse-ebooks"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#050d16] dark:bg-[#d4af37] px-6 text-xs font-semibold uppercase tracking-wider text-white dark:text-[#090e14] shadow-xs transition-all hover:bg-[#182230] dark:hover:bg-[#b8952b] active:scale-[0.99]"
            >
              <ArrowLeft size={16} />
              Back to Browse Ebooks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSold =
    book.isSold ||
    book.sold ||
    (typeof book.status === "string" && book.status.toLowerCase() === "sold") ||
    (typeof book.availability === "string" && book.availability.toLowerCase() === "sold");

  const statusLabel = isSold ? "Sold" : "Available";

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

  // Fetch related books in the same genre
  let relatedBooks = [];
  try {
    const relatedData = await getDataAllEBooks({ genre: book.genre, limit: 5 });
    const all = Array.isArray(relatedData) ? relatedData : relatedData?.ebooks || [];
    relatedBooks = all.filter((b) => String(b._id || b.id) !== String(bookId)).slice(0, 4);

    if (relatedBooks.length < 4) {
      const fallbackData = await getDataAllEBooks({ limit: 6 });
      const fallbackList = Array.isArray(fallbackData) ? fallbackData : fallbackData?.ebooks || [];
      const additional = fallbackList.filter(
        (b) =>
          String(b._id || b.id) !== String(bookId) &&
          !relatedBooks.some((r) => String(r._id || r.id) === String(b._id || b.id))
      );
      relatedBooks = [...relatedBooks, ...additional].slice(0, 4);
    }
  } catch (err) {
    console.error("Error fetching related books:", err);
  }

  return (
    <div className="min-h-screen bg-[#eae2d5] dark:bg-[#0c101c] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/browse-ebooks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#855210] dark:text-[#d4af37] hover:text-[#5f390c] dark:hover:text-amber-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Browse Ebooks
        </Link>

        {/* Primary Book Card / Info Container */}
        <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Interactive Image Gallery / Previews */}
            <BookGallery book={book} isSold={isSold} statusLabel={statusLabel} />

            <div className="flex-1 space-y-4 text-left w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0ece3] dark:border-[#202940] pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3eb] dark:bg-[#1d273f] px-3 py-1 font-playfair text-xs font-bold uppercase tracking-widest text-[#855210] dark:text-[#d4af37]">
                  <Tag size={12} />
                  {book.genre || "General"}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="text-[#77736d] dark:text-[#a09c95]">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isSold
                        ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
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

              <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#090e14] dark:text-[#f3f3f3] leading-tight">
                {book.title}
              </h1>

              <div className="flex items-center gap-2 font-sans text-sm text-[#77736d] dark:text-[#a09c95]">
                <User size={16} className="text-[#855210] dark:text-[#d4af37]" />
                <span>Written by</span>
                <Link
                  href={writerLink}
                  title={`View all ebooks by ${writerName}`}
                  className="font-semibold text-[#855210] dark:text-[#d4af37] hover:underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {writerName}
                </Link>
              </div>

              <div className="flex items-center gap-2 font-sans text-xs text-[#77736d] dark:text-[#a09c95]">
                <Calendar size={14} className="text-[#a09c95] dark:text-[#707584]" />
                <span>Date Uploaded:</span>
                <span className="font-medium text-[#252525] dark:text-[#dedede]">{formattedDate}</span>
              </div>

              <div className="py-3 px-4 rounded-xl bg-[#fcfbfa] dark:bg-[#1a2238] border border-[#e5e2dc] dark:border-[#253252] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#77736d] dark:text-[#a09c95]">Price</p>
                  <p className="font-playfair text-2xl font-bold text-[#855210] dark:text-[#d4af37]">
                    {typeof book.price === "number"
                      ? `$${book.price.toFixed(2)}`
                      : book.price
                      ? `$${book.price}`
                      : "$0.00"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#77736d] dark:text-[#a09c95]">Availability</p>
                  <p className="text-xs font-semibold text-[#252525] dark:text-[#dedede]">
                    {isSold ? "Out of Stock" : "In Stock (Ready to Read)"}
                  </p>
                </div>
              </div>

              <EbookContent book={book} />

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <BuyButton book={book} />
                <BookmarkButton book={book} />
              </div>
            </div>
          </div>

          {/* Key Specifications Section */}
          <div className="mt-10 border-t border-[#f0ece3] dark:border-[#202940] pt-8 text-left">
            <h3 className="font-playfair text-lg font-bold text-[#090e14] dark:text-[#f3f3f3] mb-4">
              Book Specifications & Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg bg-[#faf8f5] dark:bg-[#182035] p-3.5 border border-[#eee8dc] dark:border-[#253252]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77736d] dark:text-[#a09c95] block">
                  Format
                </span>
                <span className="font-semibold text-[#252525] dark:text-[#f0f0f0] mt-1 block">
                  EPUB / PDF / MOBI
                </span>
              </div>
              <div className="rounded-lg bg-[#faf8f5] dark:bg-[#182035] p-3.5 border border-[#eee8dc] dark:border-[#253252]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77736d] dark:text-[#a09c95] block">
                  Language
                </span>
                <span className="font-semibold text-[#252525] dark:text-[#f0f0f0] mt-1 block">
                  {book.language || "English"}
                </span>
              </div>
              <div className="rounded-lg bg-[#faf8f5] dark:bg-[#182035] p-3.5 border border-[#eee8dc] dark:border-[#253252]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77736d] dark:text-[#a09c95] block">
                  Print Length
                </span>
                <span className="font-semibold text-[#252525] dark:text-[#f0f0f0] mt-1 block">
                  {book.pages || 284} Pages
                </span>
              </div>
              <div className="rounded-lg bg-[#faf8f5] dark:bg-[#182035] p-3.5 border border-[#eee8dc] dark:border-[#253252]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77736d] dark:text-[#a09c95] block">
                  Digital Rights
                </span>
                <span className="font-semibold text-[#252525] dark:text-[#f0f0f0] mt-1 block">
                  DRM-Free (Open Reader)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reader Reviews & Ratings Section */}
        <BookReviews bookId={bookId} />

        {/* Related Items Section */}
        {relatedBooks.length > 0 && (
          <section className="mt-12 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#090e14] dark:text-[#f3f3f3]">
                  Readers Also Explored
                </h2>
                <p className="text-xs text-[#77736d] dark:text-[#a09c95]">
                  Curated titles from the {book.genre || "same"} literary collection
                </p>
              </div>
              <Link
                href={`/browse-ebooks?genre=${encodeURIComponent(book.genre || "")}`}
                className="text-xs font-semibold text-[#855210] dark:text-[#d4af37] hover:underline"
              >
                View all in {book.genre || "Collection"} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedBooks.map((relBook) => (
                <BookCard key={relBook._id || relBook.id} book={relBook} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
