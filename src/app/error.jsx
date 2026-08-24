"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center p-6 font-sans overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl dark:bg-red-600/15" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-xl dark:border-slate-800/90 dark:bg-slate-900/90"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-50 px-3.5 py-1 text-xs font-mono font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400 uppercase tracking-wider mb-5">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Application Error</span>
        </div>

        {/* Warning Icon Container */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 mb-4 shadow-inner">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Something went wrong
        </h2>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          An unexpected error occurred while loading this page. You can try
          reloading the component or return to the home page.
        </p>

        {/* Error Details in Dev Mode (if available) */}
        {error?.message && (
          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-left font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onPress={() => reset()}
            className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500"
            startContent={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Try Again
          </Button>

          <Link href="/" className="flex-1">
            <Button
              variant="bordered"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              startContent={<Home className="h-3.5 w-3.5" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
