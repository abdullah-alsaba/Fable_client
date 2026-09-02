import { Skeleton } from "@heroui/react";

export function EBookSkeleton() {
  return (
    <div className="w-full rounded-[10px] border border-[#e5e2dc] bg-white p-3.5">
      
      <Skeleton className="aspect-3/4 w-full rounded-md bg-gray-200/70" />
      
    
      <div className="mt-3 space-y-2.5">
        <Skeleton className="h-2.5 w-1/4 rounded-sm bg-gray-200/70" />
        <Skeleton className="h-4 w-4/5 rounded-sm bg-gray-200/70" />
        <Skeleton className="h-3 w-1/2 rounded-sm bg-gray-200/70" />
        <div className="mt-2 flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-1/3 rounded-sm bg-gray-200/70" />
          <Skeleton className="h-6 w-20 rounded-md bg-gray-200/70" />
        </div>
      </div>
    </div>
  );
}

export default EBookSkeleton;
