"use client";

import { useEffect } from "react";

// Lightweight theme handler to avoid injecting script tags from third-party providers.
// This sets a 'dark' class on document.documentElement when the user prefers dark mode
// or when a saved preference is found in localStorage under 'theme'.
export function Providers({ children }) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const useDark = saved === "dark" || (saved === null && prefersDark);
      if (useDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {
      // ignore (e.g., during SSR hydration mismatch prevention)
    }
  }, []);

  return <>{children}</>;
}
