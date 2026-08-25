"use client";

export default function BookmarksLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Bookmarks List Skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-52 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="h-3.5 w-44 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-28 rounded-xl bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
                <div className="h-8 w-8 rounded-xl bg-red-600/20 dark:bg-red-600/30 animate-pulse" />
              </div>
            </div>

            <div className="h-12 w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
