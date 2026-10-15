"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    leftIcon = null,
    rightIcon = null,
    className = "",
    type = "button",
    ...props
  },
  ref
) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[#050d16] text-white hover:bg-[#182230] dark:bg-[#d4af37] dark:text-[#090e14] dark:hover:bg-[#b8952b] shadow-xs",
    secondary:
      "bg-[#f5f4f0] text-[#090e14] hover:bg-[#e8e4dc] dark:bg-[#1a2238] dark:text-[#e6e6e6] dark:hover:bg-[#253252] border border-[#e5e2dc] dark:border-[#252d48]",
    gold:
      "bg-[#855210] text-white hover:bg-[#6b420d] dark:bg-[#d4af37] dark:text-[#090e14] dark:hover:bg-[#c49b2c] shadow-xs",
    outline:
      "border border-[#d8d1c7] dark:border-[#252d48] bg-transparent text-[#090e14] dark:text-[#e6e6e6] hover:bg-[#fafaf8] dark:hover:bg-[#141a2e]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-xs",
    ghost:
      "bg-transparent hover:bg-[#f0ece3] dark:hover:bg-[#141a2e] text-[#090e14] dark:text-[#e6e6e6]",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-xs sm:text-sm gap-2",
    lg: "h-12 px-6 text-sm sm:text-base gap-2.5",
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

export default Button;
