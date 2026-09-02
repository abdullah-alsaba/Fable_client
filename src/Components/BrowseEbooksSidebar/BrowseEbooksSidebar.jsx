import React from "react";

const BrowseEbooksSidebar = () => {
  return (
    <aside className="w-full shrink-0 space-y-6 md:w-56 lg:w-64">
    
      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#090e14]">Genre</h3>
        <div className="space-y-2 text-xs font-medium text-[#252525]">
          {[
            { id: "fiction", label: "Fiction", defaultChecked: true },
            { id: "mystery", label: "Mystery" },
            { id: "romance", label: "Romance" },
            { id: "sci-fi", label: "Science Fiction" },
            { id: "non-fiction", label: "Non-Fiction" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2.5 cursor-pointer hover:text-[#855210] transition-colors"
            >
              <input
                type="checkbox"
                id={item.id}
                defaultChecked={item.defaultChecked}
                className="h-3.5 w-3.5 rounded border-gray-300 accent-[#050d16]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-[#e5e2dc]" />

      
      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#090e14]">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full rounded-md border border-[#e5e2dc] bg-[#f9f8f6] px-3 py-1.5 text-xs text-[#252525] placeholder:text-[#a09c95] focus:border-[#050d16] focus:bg-white focus:outline-none"
          />
          <span className="text-xs text-[#77736d]">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full rounded-md border border-[#e5e2dc] bg-[#f9f8f6] px-3 py-1.5 text-xs text-[#252525] placeholder:text-[#a09c95] focus:border-[#050d16] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <hr className="border-[#e5e2dc]" />

      
      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#090e14]">
          Availability
        </h3>
        <div className="space-y-2 text-xs font-medium text-[#252525]">
          <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#855210] transition-colors">
            <input
              type="radio"
              name="availability"
              value="available"
              defaultChecked
              className="h-3.5 w-3.5 accent-[#050d16]"
            />
            <span>Available</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#855210] transition-colors">
            <input
              type="radio"
              name="availability"
              value="sold"
              className="h-3.5 w-3.5 accent-[#050d16]"
            />
            <span>Sold / Out of Print</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default BrowseEbooksSidebar;