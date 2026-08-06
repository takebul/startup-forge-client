"use client";

import { StatCard, Btn } from "@/components/Dashboard/founder-dashboard-shared";
import Link from "next/link";
import { BadgeCheck, Sparkles } from "lucide-react";

export default function CollaboratorDashboardPage({ user }) {
  // Check if collaborator has an upgraded plan (Premium or Enterprise)
  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  return (
    <div className="p-8 space-y-6">
      {/* Header with Welcome Greeting & Verified Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-bold text-slate-100">
              Welcome back, {user?.name || "Collaborator"}!
            </h2>

            {/* Verified Badge or Get Verified Pill */}
            {isUpgraded ? (
              <div
                className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                title="Verified Collaborator Account"
              >
                <BadgeCheck className="h-4 w-4 fill-amber-500/20 text-amber-400 shrink-0" />
                <span>VERIFIED</span>
              </div>
            ) : (
              <Link href="/dashboard/collaborator/premium">
                <span className="text-[11px] font-mono text-slate-400 bg-white/5 hover:bg-white/10 border border-slate-800 px-2.5 py-1 rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>Get Verified Badge</span>
                </span>
              </Link>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Track your active applications, saved bookmarks, and platform
            engagement.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
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

      {/* Quick Actions */}
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
