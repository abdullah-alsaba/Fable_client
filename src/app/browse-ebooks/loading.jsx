import EBookSkeleton from "@/Components/Skeleton/EBookSkeleton";
import BrowseEbooksSidebar from "@/Components/BrowseEbooksSidebar/BrowseEbooksSidebar";

export default function BrowseEbooksLoading() {
  return (
    <div className="min-h-screen bg-[#eae2d5] py-6 sm:py-10 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
      
        <div className="space-y-4">
          <div className="h-10 w-64 rounded-md bg-[#e5e2dc] animate-pulse" />
          <div className="h-4 w-full max-w-2xl rounded-md bg-[#e5e2dc] animate-pulse" />
          <div className="h-10 w-full max-w-md rounded-lg bg-[#e5e2dc] animate-pulse" />
        </div>

        
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
         
          <BrowseEbooksSidebar />

          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2d9cb] pb-3 text-xs text-[#77736d]">
              <span>Loading results...</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <EBookSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
