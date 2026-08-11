"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Bookmark,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { StatCard, Btn } from "@/components/Dashboard/founder-dashboard-shared";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2 bg-[#0D1528] border border-slate-800 text-xs shadow-xl space-y-1">
      <p className="font-semibold text-slate-200">{label}</p>
      <p
        className="font-mono font-bold"
        style={{ color: payload[0].payload.fill }}
      >
        Count: {payload[0].value}
      </p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 bg-[#0D1528] border border-slate-800 text-xs shadow-xl">
      <p className="text-slate-200">
        {payload[0].name}:{" "}
        <span className="font-mono font-bold text-amber-400">
          {payload[0].value}
        </span>
      </p>
    </div>
  );
};

export default function CollaboratorDashboardPage({
  user,
  myApplications = [],
  bookmarks = [],
}) {
  // 1. Safely Parse Dynamic Datasets
  const applicationsList = useMemo(
    () => parseArrayData(myApplications, "myApplications"),
    [myApplications],
  );
  const bookmarksList = useMemo(
    () => parseArrayData(bookmarks, "bookmarks"),
    [bookmarks],
  );

  // 2. Compute Real-time Metric Aggregations
  const totalApplications = applicationsList.length;
  const acceptedRoles = useMemo(
    () => applicationsList.filter((a) => a.status === "Accepted").length,
    [applicationsList],
  );
  const rejectedRoles = useMemo(
    () => applicationsList.filter((a) => a.status === "Rejected").length,
    [applicationsList],
  );
  const pendingRoles = useMemo(
    () => applicationsList.filter((a) => a.status === "Pending").length,
    [applicationsList],
  );
  const totalBookmarks = bookmarksList.length;

  // 3. User Plan Status
  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  // 4. Bar Chart Dataset (Total Applications, Accepted Roles, Rejected Roles, Bookmarks)
  const metricsChartData = useMemo(() => {
    return [
      { name: "Total Apply", value: totalApplications, fill: "#818CF8" },
      { name: "Accepted", value: acceptedRoles, fill: "#10B981" },
      { name: "Rejected", value: rejectedRoles, fill: "#EF4444" },
      { name: "Bookmarks", value: totalBookmarks, fill: "#F59E0B" },
    ];
  }, [totalApplications, acceptedRoles, rejectedRoles, totalBookmarks]);

  // 5. Pie/Donut Chart Dataset (Application Status Breakdown)
  const statusPieData = useMemo(() => {
    return [
      { name: "Accepted", value: acceptedRoles, color: "#10B981" },
      { name: "Pending", value: pendingRoles, color: "#F59E0B" },
      { name: "Rejected", value: rejectedRoles, color: "#EF4444" },
    ].filter((item) => item.value > 0);
  }, [acceptedRoles, pendingRoles, rejectedRoles]);

  return (
    <div className="p-8 space-y-6 font-sans">
      {/* Header with Welcome Greeting & Verified Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-bold text-slate-100">
              Welcome back, {user?.name || "Collaborator"}!
            </h2>

            {/* Verified Badge or Upgrade Link */}
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

      {/* Dynamic Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={totalApplications}
          sub="submitted roles"
          color="#818CF8"
        />
        <StatCard
          label="Accepted Roles"
          value={acceptedRoles}
          sub="joined startup teams"
          color="#10B981"
        />
        <StatCard
          label="Rejected Roles"
          value={rejectedRoles}
          sub="unsuccessful applications"
          color="#EF4444"
        />
        <StatCard
          label="Bookmarks"
          value={totalBookmarks}
          sub="saved opportunities"
          color="#F59E0B"
        />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                Activity Overview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of applications, acceptances, rejections, and
                bookmarks
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono font-semibold">
              <TrendingUp className="w-4 h-4" /> Live Metrics
            </div>
          </div>

          <div className="pt-2">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={metricsChartData}
                barSize={36}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#5A6480",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "#5A6480",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {metricsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Donut Chart */}
        <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
              Application Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current status of submitted roles
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center my-2">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 italic">
                No applications submitted yet.
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {statusPieData.length > 0 ? (
              statusPieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2 text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-100">{item.value}</span>
                </div>
              ))
            ) : (
              <p className="text-[11px] font-mono text-slate-500 text-center">
                Submit applications to view breakdown
              </p>
            )}
          </div>
        </div>
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
          <Link href="/dashboard/collaborator/bookmarks">
            <Btn variant="outline" size="sm">
              🔖 Saved Bookmarks
            </Btn>
          </Link>
        </div>
      </div>
    </div>
  );
}
