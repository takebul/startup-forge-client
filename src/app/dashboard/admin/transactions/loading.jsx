"use client";

export default function TransactionsLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>

        {/* Revenue Card Skeleton */}
        <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3 w-fit shadow-xs dark:bg-slate-900/80 dark:border-slate-800/90">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-slate-800 animate-pulse" />
          <div className="space-y-1">
            <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-24 rounded bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter Controls Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="h-9 w-full sm:w-72 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-pulse" />
        <div className="flex gap-2 w-full sm:w-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="h-10 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200/90 dark:border-slate-800 animate-pulse" />
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-44 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
                <div className="h-3 w-32 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
              </div>
              <div className="h-4 w-28 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              <div className="h-4 w-16 rounded bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
              <div className="h-4 w-24 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
