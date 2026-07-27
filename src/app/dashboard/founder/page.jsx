"use client";

import {
  Rocket,
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Info,
} from "lucide-react";

export default function FounderDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Active
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">3</h2>
            <p className="mt-1 text-sm text-slate-400">Published Startups</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+1 this month</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <FileText className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              Pending
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">18</h2>
            <p className="mt-1 text-sm text-slate-400">Total Applications</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span>7 need review</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Users className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
              Team
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">6</h2>
            <p className="mt-1 text-sm text-slate-400">Accepted Members</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-indigo-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+2 this week</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Open
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">9</h2>
            <p className="mt-1 text-sm text-slate-400">Open Roles</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5" />
            <span>3 with applicants</span>
          </div>
        </div>
      </div>
    </div>
  );
}
