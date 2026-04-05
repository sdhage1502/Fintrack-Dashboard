"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-all duration-300 group">
        <div className="w-5 h-5 opacity-0"><Sun className="w-5 h-5" /></div>
        <span className="font-medium tracking-tight">Theme</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Sun className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
        <Moon className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`} />
      </div>
      <span className="font-medium tracking-tight group-hover:text-primary transition-colors">{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
