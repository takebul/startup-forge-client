"use client";

import { Sparkles, Search } from "lucide-react";

export default function OpportunitiesLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden py-10 md:py-14 font-sans text-slate-900 dark:text-slate-100">
      <div className="container relative mx-auto px-6 lg:px-12 max-w-6xl space-y-10">
        {/* ===================================================================
            1. HEADER SKELETON
            =================================================================== */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Roles</span>
          </div>

          <div className="space-y-2">
            <div className="h-9 w-72 sm:h-11 sm:w-96 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            <div className="h-4 w-full max-w-xl rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          </div>
        </div>

        {/* ===================================================================
            2. SEARCH & FILTER BAR SKELETON
            =================================================================== */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-4 md:p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
          <div className="grid gap-3.5 sm:grid-cols-3">
            {/* Search Input Skeleton */}
            <div className="relative flex h-11 items-center rounded-2xl border border-slate-200/80 bg-slate-50 px-3.5 dark:border-slate-800 dark:bg-slate-950/60 animate-pulse">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Work Type Filter Skeleton */}
            <div className="h-11 rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 animate-pulse flex items-center px-3.5">
              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Industry Filter Skeleton */}
            <div className="h-11 rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 animate-pulse flex items-center px-3.5">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. OPPORTUNITY CARDS 6-GRID SKELETON
            =================================================================== */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-5"
            >
              <div>
                {/* Work Type & Commitment Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800/80 animate-pulse" />
                  <div className="h-6 w-24 rounded-full bg-slate-100 dark:bg-slate-800/80 animate-pulse" />
                </div>

                {/* Role Title & Startup info */}
                <div className="mt-4 space-y-2">
                  <div className="h-6 w-48 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-5 w-5 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-3.5 w-28 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                  </div>
                </div>

                {/* Required Skills Section */}
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <div className="h-5 w-16 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-pulse" />
                    <div className="h-5 w-20 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-pulse" />
                    <div className="h-5 w-14 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Card Footer: Deadline & Apply Button */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800/80 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-2.5 w-14 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
                  <div className="h-3.5 w-20 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
                </div>
                <div className="h-8 w-20 rounded-xl bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* ===================================================================
            4. PAGINATION SKELETON
            =================================================================== */}
        <div className="flex items-center justify-center gap-2 pt-6">
          <div className="h-10 w-24 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          <div className="h-10 w-10 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          <div className="h-10 w-10 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          <div className="h-10 w-24 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
