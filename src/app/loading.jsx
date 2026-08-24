"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center p-6 font-sans overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80"
      >
        {/* Animated Brand Loader Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 shadow-inner">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white shadow">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>

        <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          StartupForge
        </h3>

        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Loading workspace & resources…
        </p>

        {/* Pulse Bar */}
        <div className="mt-5 h-1.5 w-36 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
