"use client";

import { StatCard, Btn } from "@/components/Dashboard/founder-dashboard-shared";
import Link from "next/link";

export default function CollaboratorDashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Overview</h2>
        <p className="text-xs text-slate-400 mt-1">
          Track your active applications, saved bookmarks, and platform
          engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Applications"
          value="2"
          sub="submitted roles"
          color="#818CF8"
        />
        <StatCard
          label="Accepted Roles"
          value="1"
          sub="joined startup teams"
          color="#10B981"
        />
        <StatCard
          label="Bookmarks"
          value="2"
          sub="saved opportunities"
          color="#F59E0B"
        />
      </div>

      <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800 space-y-3">
        <h3 className="font-semibold text-sm text-slate-200">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/collaborator/browse-opportunities">
            <Btn variant="primary" size="sm">
              🔍 Browse Opportunities
            </Btn>
          </Link>
          <Link href="/dashboard/collaborator/my-applications">
            <Btn variant="ghost" size="sm">
              📬 View Applications
            </Btn>
          </Link>
        </div>
      </div>
    </div>
  );
}
