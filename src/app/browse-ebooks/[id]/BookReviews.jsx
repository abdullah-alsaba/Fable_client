"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function BookReviews({ bookId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(4.9);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${serverUri}/api/ebooks/${bookId}/reviews`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setTotalReviews(data.totalReviews || 0);
        setAverageRating(data.averageRating || 4.9);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!rating || rating < 1 || rating > 5) {
      setFormError("Please select a star rating between 1 and 5.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setFormError("Please write at least 5 characters in your review.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("fable-jwt") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("fable-jwt="))
            ?.split("=")[1]
        : null;

    if (!token && !session?.user) {
      setFormError("You must be signed in to submit a review.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${serverUri}/api/ebooks/${bookId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setFormSuccess("Your review has been successfully submitted! Thank you.");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      setFormError(err.message || "Something went wrong while posting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 rounded-2xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-6 sm:p-8 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ece3] dark:border-[#202940] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-[#855210] dark:text-[#d4af37]" />
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#090e14] dark:text-[#f3f3f3]">
              Reader Reviews & Ratings
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#77736d] dark:text-[#a09c95]">
            Verified impressions from readers who unlocked and read this work.
          </p>
        </div>

        {/* Aggregate Score */}
        <div className="flex items-center gap-3 rounded-xl bg-[#faf8f5] dark:bg-[#1a2238] px-4 py-2 border border-[#eae4d8] dark:border-[#253252] shrink-0">
          <div className="font-playfair text-3xl font-bold text-[#855210] dark:text-[#d4af37]">
            {averageRating}
          </div>
          <div>
            <div className="flex items-center text-amber-500 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(averageRating) ? "fill-amber-500" : "text-gray-300 dark:text-gray-600"}
                />
              ))}
            </div>
            <p className="text-[11px] font-medium text-[#77736d] dark:text-[#a09c95]">
              {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="my-6 rounded-xl bg-[#fdfbf7] dark:bg-[#161e31] p-5 border border-[#eee8dc] dark:border-[#232e49]">
        <h3 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#090e14] dark:text-[#eaeaea] mb-2">
          Leave a Review
        </h3>

        {formSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertCircle size={16} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#333333] dark:text-[#d1d5db] mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  title={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    size={22}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-[#855210] dark:text-[#d4af37]">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="block text-xs font-semibold text-[#333333] dark:text-[#d1d5db] mb-1.5"
            >
              Your Thoughts & Literary Impression
            </label>
            <textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What captivated you about the narrative, pacing, or characters?"
              required
              className="w-full rounded-lg border border-[#e5e2dc] dark:border-[#2a375a] bg-white dark:bg-[#111726] p-3 text-xs text-[#222222] dark:text-[#f3f3f3] placeholder:text-[#999999] focus:border-[#855210] dark:focus:border-[#d4af37] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#888888]">
              {comment.trim().length} characters
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#050d16] dark:bg-[#d4af37] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white dark:text-[#090e14] transition-all hover:bg-[#182230] dark:hover:bg-[#b8952b] active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Posting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-[#f5f4f0] dark:bg-[#1a2238]" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-6 text-center text-xs text-[#77736d] dark:text-[#a09c95]">
            No reviews yet. Be the first reader to share your impression!
          </p>
        ) : (
          reviews.map((rev, idx) => {
            const revDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recently";

            return (
              <div
                key={rev._id || idx}
                className="rounded-xl border border-[#f0ece3] dark:border-[#202940] bg-[#faf8f5]/60 dark:bg-[#121829]/60 p-4 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#855210] dark:bg-[#d4af37] text-white dark:text-[#090e14] text-[11px] font-bold uppercase">
                      {(rev.reviewerName || "R").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-playfair text-xs font-bold text-[#090e14] dark:text-[#f0f0f0]">
                          {rev.reviewerName}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 size={10} />
                          Verified Reader
                        </span>
                      </div>
                      <span className="text-[10px] text-[#888888]">{revDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < (rev.rating || 5) ? "fill-amber-500" : "text-gray-300 dark:text-gray-700"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#444444] dark:text-[#cfcfcf] pl-9">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
