import { Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BookCard = ({ book = {} }) => {
  const {
    _id,
    id,
    coverImage,
    title = "Untitled Ebook",
    price = 0,
    genre = "General",
    writerName = "Unknown Writer",
    status,
    isSold,
    sold,
  } = book;

  const bookId = _id || id || "#";
  const isBookSold = isSold || sold || (status && status.toLowerCase() === "sold");

  return (
    <Link href={`/browse-ebooks/${bookId}`} className="group block w-full text-left">
      <Card
        radius="none"
        shadow="none"
        className="w-full h-full rounded-[10px] border border-[#e5e2dc] bg-white p-3.5 transition-all duration-200 hover:border-[#c5bcad] hover:shadow-sm"
      >
        
        <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden rounded-md bg-[#f5f4f0]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <span className="font-playfair text-xs font-semibold text-[#855210]/60">
                {title}
              </span>
            </div>
          )}

          
          {isBookSold && (
            <div className="absolute top-2.5 right-2.5 z-10 rounded-md bg-[#050d16]/90 px-2 py-0.9 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
              Sold
            </div>
          )}
        </div>

        
        <div className="flex flex-col pt-3 pb-1 gap-1">
          <p className="truncate font-playfair text-[10px] font-bold uppercase tracking-wider text-[#855210]">
            {genre}
          </p>

          <h2 className="line-clamp-2 min-h-10 font-playfair text-[16px] font-semibold leading-5 text-[#252525] group-hover:text-[#855210] transition-colors">
            {title}
          </h2>

          <p className="truncate font-sans text-[12px] text-[#77736d]">
            {writerName}
          </p>

          <div className="mt-1 flex items-center justify-between">
            <p className="font-playfair text-[15px] font-bold text-[#855210]">
              {typeof price === "number" ? `$${price.toFixed(2)}` : price ? `$${price}` : "$0.00"}
            </p>

            <span className="rounded bg-[#f5f4f0] px-2 py-1 font-sans text-[11px] font-medium text-[#252525] group-hover:bg-[#050d16] group-hover:text-white transition-colors">
              View Details
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BookCard;
