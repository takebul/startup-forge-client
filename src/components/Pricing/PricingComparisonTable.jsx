const COMPARISON_ROWS = [
  {
    feature: "Active Listings / Profile Status",
    free: "Standard",
    premium: "Priority Placement",
    enterprise: "Top Tier Showcase",
  },
  {
    feature: "Opportunity Postings / Application Limits",
    free: "3 / Month",
    premium: "10 / Month",
    enterprise: "100 / Month",
  },
  {
    feature: "Priority Placement & Highlighting",
    free: "—",
    premium: "Included",
    enterprise: "Top Tier",
  },
  {
    feature: "Advanced Search & Filtering",
    free: "—",
    premium: "Included",
    enterprise: "Included",
  },
  {
    feature: "Analytics & Funnel Tracking",
    free: "Basic",
    premium: "Full Tracking",
    enterprise: "Advanced Custom",
  },
  {
    feature: "Verified Platform Badge",
    free: "—",
    premium: "Included",
    enterprise: "Verified Studio / Pro",
  },
  {
    feature: "Support Tier",
    free: "Community",
    premium: "Priority Email",
    enterprise: "24/7 SLA + Dedicated Rep",
  },
];

export default function PricingComparisonTable() {
  return (
    <section className="mt-28 hidden md:block">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          Feature Matrix
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Plan Comparison Breakdown
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Compare tier quotas and capabilities side by side
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            <tr>
              <th className="px-6 py-4 font-bold">Feature</th>
              <th className="px-6 py-4 text-center font-bold">Free</th>
              <th className="px-6 py-4 text-center font-bold text-violet-600 dark:text-violet-400">
                Premium Tier
              </th>
              <th className="px-6 py-4 text-center font-bold text-purple-600 dark:text-purple-400">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                  {row.feature}
                </td>
                <td className="px-6 py-4 text-center text-slate-500 dark:text-slate-400 font-mono">
                  {row.free}
                </td>
                <td className="px-6 py-4 text-center font-bold text-violet-600 dark:text-violet-400 font-mono">
                  {row.premium}
                </td>
                <td className="px-6 py-4 text-center font-bold text-purple-600 dark:text-purple-400 font-mono">
                  {row.enterprise}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

