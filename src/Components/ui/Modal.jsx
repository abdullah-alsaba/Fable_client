"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer = null,
  size = "md",
  className = "",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050d16]/60 dark:bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${
          sizeStyles[size] || sizeStyles.md
        } rounded-2xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 text-left ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#f0ece3] dark:border-[#202940] pb-4">
          <div>
            {title && (
              <h3 className="font-playfair text-xl font-bold text-[#090e14] dark:text-[#f3f3f3]">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-xs text-[#77736d] dark:text-[#a09c95]">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-[#77736d] hover:bg-[#f5f4f0] hover:text-[#090e14] dark:text-[#a09c95] dark:hover:bg-[#1e273f] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 text-xs sm:text-sm text-[#252525] dark:text-[#e0e0e0] leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-[#f0ece3] dark:border-[#202940] pt-4 mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
