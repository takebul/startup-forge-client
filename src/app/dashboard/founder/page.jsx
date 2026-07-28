"use client";

import { Btn, Label } from "@/components/Dashboard/founder-dashboard-shared";

export default function FounderDashboardOverviewPage() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-100">
        Founder Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800">
          <p className="text-xs font-mono uppercase text-slate-500 mb-2">
            Total Opportunities
          </p>
          <p className="text-3xl font-extrabold text-amber-500 mb-1">3</p>
          <p className="text-xs text-slate-500">active roles posted</p>
        </div>
        <div className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800">
          <p className="text-xs font-mono uppercase text-slate-500 mb-2">
            Total Applications
          </p>
          <p className="text-3xl font-extrabold text-indigo-400 mb-1">3</p>
          <p className="text-xs text-slate-500">across all roles</p>
        </div>
        <div className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800">
          <p className="text-xs font-mono uppercase text-slate-500 mb-2">
            Accepted Members
          </p>
          <p className="text-3xl font-extrabold text-emerald-400 mb-1">1</p>
          <p className="text-xs text-slate-500">team members onboarded</p>
        </div>
      </div>
    </div>
  );
}
