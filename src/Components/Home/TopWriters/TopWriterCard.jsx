"use client";

import { Card } from "@heroui/react";
import Image from "next/image";
import { Star } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const TopWriterCard = ({ topWriter }) => {
  const { image, genre, rating, name } = topWriter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card
        radius="none"
        shadow="none"
        className="flex flex-col items-center border border-[#e5e2dc] bg-white rounded-[9px] py-8 px-6 transition-all hover:border-[#c5bcad] hover:shadow-md"
      >
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[#e5e2dc]">
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
    </motion.div>
  );
};

export default TopWriterCard;
