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
        <h2 className="text-3xl font-extrabold text-white">
          Plan Comparison Breakdown
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Compare tier quotas and capabilities side by side
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-[#1E212B] bg-[#12141D]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-[#1E212B] bg-[#0F111A] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold">Feature</th>
              <th className="px-6 py-4 text-center font-bold">Free</th>
              <th className="px-6 py-4 text-center font-bold text-amber-400">
                Premium Tier
              </th>
              <th className="px-6 py-4 text-center font-bold text-purple-400">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E212B]">
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={i} className="hover:bg-[#151722]">
                <td className="px-6 py-4 font-semibold text-white">
                  {row.feature}
                </td>
                <td className="px-6 py-4 text-center text-slate-400">
                  {row.free}
                </td>
                <td className="px-6 py-4 text-center font-bold text-amber-400">
                  {row.premium}
                </td>
                <td className="px-6 py-4 text-center font-bold text-purple-400">
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
