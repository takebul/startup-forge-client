export default function StartupDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950">
      {/* Hero skeleton */}
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900 lg:py-16">
        <div className="container mx-auto space-y-6 px-6 lg:px-12">
          <div className="h-3 w-40 rounded bg-slate-200/80 animate-pulse dark:bg-slate-800/80" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-slate-200 animate-pulse dark:bg-slate-800" />
              <div className="space-y-3">
                <div className="h-9 w-56 rounded-xl bg-slate-200/90 animate-pulse dark:bg-slate-800/90 sm:w-72" />
                <div className="h-4 w-80 rounded bg-slate-200/60 animate-pulse dark:bg-slate-800/60" />
              </div>
            </div>
            <div className="h-11 w-48 rounded-xl bg-violet-600/20 animate-pulse dark:bg-violet-500/20" />
          </div>
        </div>
      </section>

      {/* Tabs and content skeleton */}
      <section className="container mx-auto px-6 py-10 lg:px-12">
        <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800">
          {["Overview & Description", "Open Roles", "Founder & Team"].map(
            (tab) => (
              <div
                key={tab}
                className="h-8 w-32 rounded bg-slate-200/70 animate-pulse dark:bg-slate-800/70"
              />
            ),
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {["About the Startup", "Mission & Objective"].map((section) => (
              <div
                key={section}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-5 w-48 rounded bg-slate-200/80 animate-pulse dark:bg-slate-800/80" />
                <div className="mt-4 space-y-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-3 rounded bg-slate-200/60 animate-pulse dark:bg-slate-800/60 ${
                        index === 3 ? "w-2/3" : "w-full"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-4 w-32 rounded bg-slate-200/80 animate-pulse dark:bg-slate-800/80" />
              <div className="mt-5 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800"
                  >
                    <div className="h-3 w-20 rounded bg-slate-200/60 animate-pulse dark:bg-slate-800/60" />
                    <div className="h-3 w-24 rounded bg-slate-200/80 animate-pulse dark:bg-slate-800/80" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-4 w-32 rounded bg-slate-200/80 animate-pulse dark:bg-slate-800/80" />
              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-200 animate-pulse dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200/80 animate-pulse dark:bg-slate-800/80" />
                  <div className="h-3 w-36 rounded bg-slate-200/60 animate-pulse dark:bg-slate-800/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
