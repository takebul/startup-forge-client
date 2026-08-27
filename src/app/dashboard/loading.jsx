"use client";

export default function DashboardRootLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
      </div>

      {/* 4 Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl p-5 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 flex items-start justify-between"
          >
            <div className="space-y-2.5 flex-1">
              <div className="h-3 w-24 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
              <div className="h-7 w-20 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
              <div className="h-3 w-32 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Skeleton */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
              <div className="h-3 w-56 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
            </div>
            <div className="h-7 w-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="h-56 w-full rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 animate-pulse" />
        </div>

        {/* Secondary Donut / Breakdown Skeleton */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            <div className="h-3 w-44 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
          </div>
          <div className="flex items-center justify-center my-4">
            <div className="w-36 h-36 rounded-full border-8 border-slate-100 dark:border-slate-800 animate-pulse" />
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="h-3.5 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
            <div className="h-3.5 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
