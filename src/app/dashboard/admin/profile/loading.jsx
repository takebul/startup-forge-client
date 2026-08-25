"use client";

export default function AdminProfileLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-52 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          </div>
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
      </div>

      {/* Admin Identity Card Skeleton */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/90 space-y-6 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-44 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
                <div className="h-5 w-32 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
              <div className="h-4 w-40 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              <div className="h-3.5 w-48 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-32 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>

        <div className="h-20 w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 animate-pulse" />
      </div>

      {/* Permissions Grid Skeleton */}
      <div className="rounded-2xl p-6 bg-white border border-slate-200/90 space-y-4 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="h-5 w-48 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-950/60 dark:border-slate-800 space-y-2"
            >
              <div className="h-4 w-32 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
              <div className="h-3 w-48 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
