import { Card } from "@heroui/react";
import { BookOpen, Search, Heart, Rocket, Castle, Feather } from "lucide-react";
import Link from "next/link";
import React from "react";

const genres = [
  { name: "Fiction", icon: BookOpen },
  { name: "Mystery", icon: Search },
  { name: "Romance", icon: Heart },
  { name: "Sci-Fi", icon: Rocket },
  { name: "Fantasy", icon: Castle },
  { name: "Biography", icon: Feather },
];

const Genre = () => {
  return (
    <div className="relative left-1/2 right-1/2 mx-[-50vw] mt-16 w-screen px-6 py-16">
      <h2 className="text-center font-playfair text-2xl font-bold text-[#18212b]">
        Explore Genres
      </h2>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 gap-4 lg:grid-cols-6">
        {genres.map(({ name, icon: Icon }) => (
          <Link
            key={name}
            href={`/browse-ebooks?genre=${encodeURIComponent(name)}`}
            className="block"
          >
            <Card
              radius="none"
              shadow="none"
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#dbdad6] bg-[#f5f3ef] py-6 transition-transform duration-200 ease-out hover:scale-[1.02] cursor-pointer hover:border-[#855210]"
            >
              <Icon size={22} className="text-[#18212b]" strokeWidth={1.75} />
              <span className="font-sans text-sm font-bold text-[#18212b]">
                {name}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genre;
