export default function EBookDetailLoading() {
  return (
    <div className="min-h-screen bg-[#eae2d5] py-8 sm:py-12 px-4 sm:px-6 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="h-5 w-36 rounded-md bg-[#d8cebe] animate-pulse" />
        
        <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-white p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="aspect-[3/4] w-full max-w-[260px] mx-auto md:mx-0 shrink-0 rounded-xl bg-[#e5e2dc] animate-pulse" />
            
            <div className="flex-1 space-y-4 w-full">
              <div className="h-4 w-24 rounded bg-[#e5e2dc] animate-pulse" />
              <div className="h-8 w-3/4 rounded-md bg-[#e5e2dc] animate-pulse" />
              <div className="h-5 w-1/3 rounded-md bg-[#e5e2dc] animate-pulse" />
              <div className="h-10 w-32 rounded-lg bg-[#e5e2dc] animate-pulse" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-[#e5e2dc] animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-[#e5e2dc] animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-[#e5e2dc] animate-pulse" />
              </div>
              <div className="h-12 w-48 rounded-lg bg-[#e5e2dc] animate-pulse pt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}