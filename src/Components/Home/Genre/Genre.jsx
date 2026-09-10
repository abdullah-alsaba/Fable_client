"use client";

import { Card } from "@heroui/react";
import { BookOpen, Search, Heart, Rocket, Castle, Feather } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const genres = [
  { name: "Fiction", icon: BookOpen },
  { name: "Mystery", icon: Search },
  { name: "Romance", icon: Heart },
  { name: "Sci-Fi", icon: Rocket },
  { name: "Fantasy", icon: Castle },
  { name: "Horror", icon: Feather },
];

const Genre = () => {
  return (
    <div className="relative left-1/2 right-1/2 mx-[-50vw] mt-16 w-screen px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center font-playfair text-2xl font-bold text-[#18212b]"
      >
        Explore Genres
      </motion.h2>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {genres.map(({ name, icon: Icon }, index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04, y: -3 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <Link
              href={`/browse-ebooks?genre=${encodeURIComponent(name)}`}
              className="block"
            >
              <Card
                radius="none"
                shadow="none"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#dbdad6] bg-[#f5f3ef] py-6 transition-all cursor-pointer hover:border-[#855210] hover:shadow-md"
              >
                <Icon size={22} className="text-[#18212b]" strokeWidth={1.75} />
                <span className="font-sans text-sm font-bold text-[#18212b]">
                  {name}
                </span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Genre;
