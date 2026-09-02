import FeaturedBooks from "@/Components/Home/FeaturedBooks/FeaturedBooks";
import Genre from "@/Components/Home/Genre/Genre";
import Hero from "@/Components/Home/Hero/Hero";
import TopWriters from "@/Components/Home/TopWriters/TopWriters";

export default function Home() {
  return (
    <main className="w-full bg-[#eae2d5] py-4 sm:py-8 lg:py-12 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Hero />
        <FeaturedBooks />
        <TopWriters />
        <Genre/>
      </div>
    </main>
  );
}
