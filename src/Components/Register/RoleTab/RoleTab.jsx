"use client";

import React, { useState } from "react";

export function RoleTab({ selectedRole, onChange }) {
  const [role, setRole] = useState(selectedRole || "reader");

  const handleSelect = (newRole) => {
    setRole(newRole);
    if (onChange) onChange(newRole);
  };

  return (
    <div className="grid w-full grid-cols-2 rounded-lg bg-[#edece8] p-1 select-none">
      <button
        type="button"
        onClick={() => handleSelect("reader")}
        className={`flex items-center justify-center py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
          role === "reader"
            ? "bg-white text-[#090e14] shadow-xs"
            : "text-[#666666] hover:text-[#090e14]"
        }`}
      >
        Reader
      </button>

      <button
        type="button"
        onClick={() => handleSelect("writer")}
        className={`flex items-center justify-center py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
          role === "writer"
            ? "bg-white text-[#090e14] shadow-xs"
            : "text-[#666666] hover:text-[#090e14]"
        }`}
      >
        Writer
      </button>
    </div>
  );
}

