"use client";

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "@/components/Toast/Toast";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <ToastContainer />
    </ThemeProvider>
  );
}

