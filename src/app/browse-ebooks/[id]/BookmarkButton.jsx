"use client";

import React, { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={toggleBookmark}
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
          Bookmark
        </>
      )}
    </button>
  );
}