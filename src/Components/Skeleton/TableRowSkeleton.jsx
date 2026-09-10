export default function TableRowSkeleton({ rows = 4, cols = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e2dc]">
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-4 border-b border-[#f0ece3] bg-white px-4 py-4 last:border-b-0"
          >
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-3 flex-1 animate-pulse rounded bg-[#eae2d5]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
