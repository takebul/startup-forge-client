"use client";

export default function CollaboratorPremiumLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="h-6 w-36 mx-auto rounded-full bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
        <div className="h-9 w-72 mx-auto rounded-2xl bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
        <div className="h-4 w-96 mx-auto rounded-lg bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
      </div>

      {/* Pricing Tier Cards Skeleton (2 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl p-8 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-6 w-28 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
              <div className="h-10 w-36 rounded-xl bg-slate-200/90 dark:bg-slate-800/90 animate-pulse" />
              <div className="h-4 w-52 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />

              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-3.5 w-48 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-12 w-full rounded-2xl bg-violet-600/20 dark:bg-violet-600/30 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
