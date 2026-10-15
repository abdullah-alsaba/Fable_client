import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-[#e5e2dc] dark:border-[#253252] bg-white dark:bg-[#141b2d] text-[#090e14] dark:text-[#f3f3f3] shadow-xs transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-5 sm:p-6 border-b border-[#f0ece3] dark:border-[#202940] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3
      className={`font-playfair text-lg sm:text-xl font-bold tracking-tight text-[#090e14] dark:text-[#f3f3f3] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p
      className={`text-xs sm:text-sm text-[#77736d] dark:text-[#a09c95] leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`flex items-center justify-between p-5 sm:p-6 pt-0 border-t border-[#f0ece3] dark:border-[#202940] mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
