import BookCard from "@/Components/BookCard/BookCard";
import { getDataFeaturedBooks } from "@/utils/data";
import Link from "next/link";
import React from "react";

const FeaturedBooks = async () => {
  const featuredBooks = await getDataFeaturedBooks();

  return (
    <section className="w-full px-5.5">
      {/* Heading */}
      <div className="mb-6.75 flex items-center justify-between">
        <h2
          className="
            font-playfair
            text-[30px]
            font-bold
            leading-8
            tracking-[-0.5px]
            text-[#252525]
          "
        >
          Featured Ebooks
        </h2>

        <Link
          href="/browse-ebooks"
          className="
            font-sans
            text-[10px]
            font-medium
            leading-3
            text-[#855210]
            transition-colors
            hover:text-[#5f390c]
          "
        >
          View All
        </Link>
      </div>

      {/* Books */}
      <div
        className="
          grid
          grid-cols-2
          gap-5

          sm:grid-cols-3

          md:grid-cols-4

          lg:grid-cols-6
        "
      >
        {featuredBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedBooks;
