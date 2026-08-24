"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Sparkles, Zap } from "lucide-react";

const LOADING_STATUSES = [
  "Connecting to venture intelligence network...",
  "Retrieving active startups & open opportunities...",
  "Synchronizing co-founder & talent graph...",
  "Preparing your personalized workspace...",
];

export default function GlobalLoading() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-6 font-sans overflow-hidden bg-slate-50/50 text-slate-900 transition-colors duration-300 dark:bg-[#080E1C] dark:text-slate-100">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15 animate-pulse-glow" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15 animate-float-slow" />
      <div className="pointer-events-none absolute -right-20 bottom-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-600/15 animate-float-reverse" />

      {/* Center Animated Loader Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-md w-full rounded-3xl border border-slate-200/90 bg-white/85 p-10 shadow-2xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/85"
      >
        {/* Multi-Orbital Floating Rocket Icon */}
        <div className="relative flex items-center justify-center h-28 w-28">
          {/* Outer Orbital Ring 1 */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/30 dark:border-violet-400/30 animate-spin-slow" />

          {/* Outer Orbital Ring 2 */}
          <div className="absolute inset-2 rounded-full border border-indigo-400/20 dark:border-indigo-400/20 animate-float-reverse" />

          {/* Glowing Aura Orb */}
          <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 opacity-20 blur-lg animate-pulse-glow" />

          {/* Center Rocket Emblem */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-600/30"
          >
            <Rocket className="h-8 w-8" />
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-md font-bold text-[10px]"
            >
              <Sparkles className="h-3 w-3" />
            </motion.span>
          </motion.div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>StartupForge Neural Engine</span>
        </div>

        <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Launching Workspace
        </h3>

        {/* Dynamic Status Text with Smooth Fade */}
        <div className="mt-3 h-10 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
            >
              {LOADING_STATUSES[statusIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Shimmering Radiant Progress Bar */}
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
