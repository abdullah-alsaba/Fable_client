import Hero from "@/Components/Home/Hero/Hero";
import PlatformStats from "@/Components/Home/PlatformStats/PlatformStats";
import FeaturedBooks from "@/Components/Home/FeaturedBooks/FeaturedBooks";
import HowItWorks from "@/Components/Home/HowItWorks/HowItWorks";
import TopWriters from "@/Components/Home/TopWriters/TopWriters";
import Genre from "@/Components/Home/Genre/Genre";
import Testimonials from "@/Components/Home/Testimonials/Testimonials";
import WriterCTA from "@/Components/Home/WriterCTA/WriterCTA";
import FAQ from "@/Components/Home/FAQ/FAQ";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="w-full bg-[#eae2d5] py-4 sm:py-8 lg:py-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section 1: Hero Banner */}
        <Hero />

        {/* Section 2: Platform Real-Time Stats */}
        <PlatformStats />

        {/* Section 3: Dynamic Featured Ebooks */}
        <FeaturedBooks />

        {/* Section 4: How Platform Works */}
        <HowItWorks />

        {/* Section 5: Top Selling Writers */}
        <TopWriters />

        {/* Section 6: Genre Explorer */}
        <Genre />

        {/* Section 7: Reader & Author Reviews */}
        <Testimonials />

        {/* Section 8: Author Publishing Call To Action */}
        <WriterCTA />

        {/* Section 9: Frequently Asked Questions */}
        <FAQ />
      </div>
    </main>
  );
}
