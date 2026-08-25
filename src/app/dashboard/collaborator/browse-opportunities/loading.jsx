"use client";

export default function BrowseOpportunitiesLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-60 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-80 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-9 w-44 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Filter Controls Bar Skeleton */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-4 md:p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-10 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-pulse" />
          <div className="h-10 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-pulse" />
          <div className="h-10 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-pulse" />
          <div className="h-10 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Opportunities Grid Skeleton (6 Cards) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-5"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse shrink-0" />
                <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800/80 animate-pulse" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-5 w-44 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
                <div className="h-3.5 w-28 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="h-3 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-5 w-20 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-5 w-24 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800/80 flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              <div className="h-8 w-24 rounded-xl bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
