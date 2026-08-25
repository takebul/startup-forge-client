"use client";

export default function MyStartupLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
      </div>

      {/* Startup Profile Card Skeleton */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 space-y-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-6 w-48 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
              <div className="h-5 w-24 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="h-4 w-40 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
            <div className="h-3 w-56 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
          </div>
        </div>

        <div className="h-24 w-full rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 animate-pulse" />

        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-32 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-8 w-28 rounded-xl bg-red-600/20 dark:bg-red-600/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
