"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function Dropdown({
  trigger,
  label = "Options",
  items = [],
  align = "right",
  children,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);

  const alignStyles = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={toggle} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] px-3.5 py-2 text-xs font-semibold text-[#090e14] dark:text-[#f3f3f3] shadow-xs hover:bg-[#faf8f5] dark:hover:bg-[#1a2238] transition-colors cursor-pointer"
        >
          <span>{label}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* Menu */}
      {isOpen && (
        <div
          role="menu"
          className={`absolute ${
            alignStyles[align] || alignStyles.right
          } z-50 mt-2 w-48 rounded-xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-1.5 shadow-xl transition-all animate-in fade-in zoom-in-95 duration-150`}
        >
          {children ? (
            <div onClick={() => setIsOpen(false)}>{children}</div>
          ) : (
            items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`div-${index}`}
                    className="my-1 border-t border-[#f0ece3] dark:border-[#202940]"
                  />
                );
              }

              const itemContent = (
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    item.danger
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                      : "text-[#252525] dark:text-[#e0e0e0] hover:bg-[#faf8f5] dark:hover:bg-[#1a2238] hover:text-[#090e14] dark:hover:text-white"
                  } ${item.disabled ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.label || index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    {itemContent}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label || index}
                  type="button"
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left"
                >
                  {itemContent}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
