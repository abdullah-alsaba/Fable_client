import React from "react";

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full tracking-wide transition-colors select-none";

  const variantStyles = {
    default:
      "bg-[#f5f4f0] dark:bg-[#1a2238] text-[#252525] dark:text-[#e0e0e0] border border-[#e5e2dc] dark:border-[#253252]",
    gold:
      "bg-[#f6f3eb] dark:bg-[#252014] text-[#855210] dark:text-[#d4af37] border border-[#e8dfcf] dark:border-[#40351d]",
    success:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    warning:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    danger:
      "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
    outline:
      "bg-transparent text-[#090e14] dark:text-[#f3f3f3] border border-[#d8d1c7] dark:border-[#323b5c]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-xs sm:text-sm gap-2",
  };

  const dotColors = {
    default: "bg-[#77736d]",
    gold: "bg-[#855210] dark:bg-[#d4af37]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    outline: "bg-current",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dotColors[variant] || "bg-current"
          }`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
