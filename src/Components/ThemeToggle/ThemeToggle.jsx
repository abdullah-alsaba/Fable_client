"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c7] bg-[#fafaf8] text-[#090e14] transition-all hover:border-[#090e14] hover:bg-[#050d16] hover:text-white dark:border-[#374151] dark:bg-[#111827] dark:text-amber-300 dark:hover:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-[#111827] shadow-2xs cursor-pointer shrink-0"
    >
      <span className="sr-only">Toggle theme</span>
      {mounted ? (
        isDark ? (
          <Sun size={16} className="shrink-0" />
        ) : (
          <Moon size={16} className="shrink-0" />
        )
      ) : (
        <span className="block h-4 w-4" />
      )}
    </button>
  );
}
