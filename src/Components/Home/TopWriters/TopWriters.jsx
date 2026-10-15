import { getTopWritersData } from "@/utils/data";
import React from "react";
import TopWriterCard from "./TopWriterCard";

const TopWriters = async () => {
  const topWriters = await getTopWritersData();

  return (
    <div className="mt-16 w-full rounded-3xl border border-[#e2d9cb] bg-[#f0e9dc] px-4 py-16 sm:px-8">
      <div className="text-center">
        <h2 className="font-playfair text-3xl font-bold text-[#252525]">
          Top Writers
        </h2>
        <p className="mt-3 font-sans text-[#77736d]">
          Discover our most celebrated authors with the highest sales this
          month.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
        {topWriters.map((topWriter) => (
          <TopWriterCard key={topWriter._id} topWriter={topWriter} />
        ))}
      </div>
    </div>
  );
};

export default TopWriters;
