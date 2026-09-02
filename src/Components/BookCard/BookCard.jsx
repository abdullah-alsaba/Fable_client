import { Card } from "@heroui/react";
import Image from "next/image";
import React from "react";

const BookCard = ({ book }) => {
  const { coverImage, title, price, genre, writerName } = book;

  return (
    <Card
      radius="none"
      shadow="none"
      className="w-full h-auto rounded-[9px] border border-[#e5e2dc] bg-white p-3.25"
    >
      <div className="relative h-48.5 w-full shrink-0 overflow-hidden rounded-sm bg-[#f5f4f0]">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 45vw, 160px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col px-px pt-1.5 pb-1 gap-0.5">
        <p className="truncate font-bold font-playfair text-[10px] leading-3 text-[#855210]">
          {genre}
        </p>

        <h2 className="line-clamp-2 h-10 overflow-hidden font-playfair text-[17px] font-semibold leading-5 tracking-[-0.15px] text-[#252525]">
          {title}
        </h2>

        <p className="truncate font-sans text-[12px] leading-3.75 text-[#77736d]">
          {writerName}
        </p>

        <p className="mt-1 font-playfair text-[14px] font-bold leading-4.25 text-[#855210]">
          ${price}
        </p>
      </div>
    </Card>
  );
};

export default BookCard;
