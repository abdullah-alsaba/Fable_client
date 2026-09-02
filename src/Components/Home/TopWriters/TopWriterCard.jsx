import { Card } from "@heroui/react";
import Image from "next/image";
import { Star } from "lucide-react";
import React from "react";

const TopWriterCard = ({ topWriter }) => {
  const { image, genre, rating, name } = topWriter;

  return (
    <Card
      radius="none"
      shadow="none"
      className="flex flex-col items-center border border-[#e5e2dc] bg-white rounded-[9px] py-8 px-6"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <h3 className="mt-3 font-playfair text-lg font-bold text-[#252525]">
        {name}
      </h3>

      <p className="mt-1 font-playfair text-sm font-semibold text-[#855210]">
        {genre}
      </p>

      <p className="mt-1 flex items-center gap-1 font-sans text-sm text-[#77736d]">
        <Star size={14} className="fill-[#855210] text-[#855210]" />
        {rating} Ratings
      </p>
    </Card>
  );
};

export default TopWriterCard;
