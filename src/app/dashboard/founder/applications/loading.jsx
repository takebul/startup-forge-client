"use client";

export default function FounderApplicationsLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="h-9 w-full sm:w-80 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-pulse" />
        <div className="flex gap-2 w-full sm:w-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Applications List Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="h-5 w-40 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
                <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
              <div className="h-3.5 w-60 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              <div className="h-3 w-48 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-8 w-20 rounded-xl bg-emerald-600/20 dark:bg-emerald-600/30 animate-pulse" />
              <div className="h-8 w-20 rounded-xl bg-red-600/20 dark:bg-red-600/30 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
