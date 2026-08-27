"use client";

import { Sparkles } from "lucide-react";

export default function PricingLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden py-10 md:py-14 font-sans text-slate-900 dark:text-slate-100">
      <div className="container relative mx-auto px-6 lg:px-12 max-w-6xl space-y-12">
        {/* ===================================================================
            1. HEADER SKELETON WITH PERSONA TOGGLE
            =================================================================== */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pricing &amp; Upgrades</span>
          </div>

          <div className="space-y-2">
            <div className="mx-auto h-9 w-72 sm:h-11 sm:w-96 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            <div className="mx-auto h-4 w-full max-w-xl rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          </div>

          {/* Persona Switcher Skeleton */}
          <div className="pt-3 flex justify-center">
            <div className="h-12 w-64 rounded-2xl border border-slate-200/90 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 animate-pulse" />
          </div>
        </div>

        {/* ===================================================================
            2. 3-TIER PRICING CARDS SKELETON
            =================================================================== */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {/* Card 1: Free / Starter */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="h-3.5 w-16 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                <div className="h-6 w-28 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3.5 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>

              {/* Price */}
              <div className="py-2 border-y border-slate-100 dark:border-slate-800/80">
                <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-1 h-3 w-32 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-slate-200/70 dark:bg-slate-800/70 animate-pulse shrink-0" />
                    <div className="h-3.5 w-44 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-11 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          </div>

          {/* Card 2: Most Popular (Elevated) */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-violet-500/60 bg-gradient-to-b from-violet-500/5 via-white to-white p-7 shadow-xl dark:border-violet-500/50 dark:from-violet-950/20 dark:via-slate-900/90 dark:to-slate-900/90 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-20 rounded bg-violet-200/70 dark:bg-violet-800/70 animate-pulse" />
                  <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="h-6 w-24 rounded-full bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
              </div>

              <div className="h-3.5 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />

              {/* Price */}
              <div className="py-2 border-y border-violet-100 dark:border-slate-800/80">
                <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-1 h-3 w-36 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-violet-500/30 dark:bg-violet-500/40 animate-pulse shrink-0" />
                    <div className="h-3.5 w-48 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-11 w-full rounded-2xl bg-violet-600/40 dark:bg-violet-600/50 animate-pulse" />
          </div>

          {/* Card 3: Enterprise */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3.5 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>

              {/* Price */}
              <div className="py-2 border-y border-slate-100 dark:border-slate-800/80">
                <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-1 h-3 w-36 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-slate-200/70 dark:bg-slate-800/70 animate-pulse shrink-0" />
                    <div className="h-3.5 w-44 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-11 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
