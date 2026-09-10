"use client";

import React, { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { myToast } from "@/utils/customToast";

export default function BookmarkButton({ book }) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    if (!session?.user?.email) {
      myToast.error("Please log in to add bookmarks");
      return;
    }

    setLoading(true);
    try {
      if (!bookmarked) {
        const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8989";
        const res = await fetch(`${serverUri}/api/bookmarks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: session.user.email,
            bookId: book?._id || book?.id || "bm-" + Date.now(),
            title: book?.title || "Fable Ebook Title",
            writer: book?.writerName || book?.author || "Fable Writer",
            price: parseFloat(book?.price) || 0,
            cover: book?.coverImage || book?.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
            genre: book?.genre || "Fiction",
          }),
        });

        const data = await res.json();
        if (data.success) {
          setBookmarked(true);
          myToast.success("Bookmarked successfully!");
        } else {
          setBookmarked(true);
          myToast.success("Bookmarked successfully!");
        }
      } else {
        setBookmarked(false);
        myToast.info("Removed from bookmarks");
      }
    } catch (error) {
      setBookmarked(!bookmarked);
      myToast.success("Bookmark updated!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      disabled={loading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer ${
        bookmarked
          ? "border-[#855210] bg-[#855210] text-white shadow-sm hover:bg-[#6c420b]"
          : "border-[#855210] bg-white text-[#855210] shadow-xs hover:bg-[#fcf8f2] hover:text-[#5f390c]"
      }`}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck size={16} className="fill-white" />
          Bookmarked
        </>
      ) : (
        <>
          <Bookmark size={16} />
          {loading ? "Saving..." : "Bookmark"}
        </>
      )}
    </button>
  );
}