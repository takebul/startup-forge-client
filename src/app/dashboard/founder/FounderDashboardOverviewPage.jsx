"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BadgeCheck,
  Sparkles,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
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
    <div className="rounded-xl px-3.5 py-2.5 bg-[#0D1528] border border-slate-800 text-xs shadow-xl space-y-1 font-sans">
      <p className="font-semibold text-slate-200">
        {payload[0]?.payload?.fullTitle || label}
      </p>
      <p className="text-amber-400 font-mono font-bold">
        Applications: {payload[0].value}
      </p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 bg-[#0D1528] border border-slate-800 text-xs shadow-xl font-sans">
      <p className="text-slate-200">
        {payload[0].name}:{" "}
        <span className="font-mono font-bold text-amber-400">
          {payload[0].value}
        </span>
      </p>
    </div>
  );
};

export default function FounderDashboardOverviewPage({
  user,
  opportunities = [],
  applications = [],
}) {
  // 1. Safely Parse Input Datasets
  const opportunitiesList = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );
  const applicationsList = useMemo(
    () => parseArrayData(applications, "applications"),
    [applications],
  );

  // 2. Compute Real-time Metric Aggregations (Case-Insensitive)
  const totalOpportunities = opportunitiesList.length;
  const totalApplications = applicationsList.length;

  const acceptedMembers = useMemo(
    () =>
      applicationsList.filter(
        (a) => String(a.status || "").toLowerCase() === "accepted",
      ).length,
    [applicationsList],
  );

  const pendingApplications = useMemo(
    () =>
      applicationsList.filter((a) => {
        const s = String(a.status || "").toLowerCase();
        return s === "pending" || s === "" || s === "reviewing";
      }).length,
    [applicationsList],
  );

  const rejectedApplications = useMemo(
    () =>
      applicationsList.filter(
        (a) => String(a.status || "").toLowerCase() === "rejected",
      ).length,
    [applicationsList],
  );

  // 3. User Plan & Verified Status
  const planKey = String(
    user?.plan || user?.plan_id || "founder_free",
  ).toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  const planDisplayName = planKey.includes("enterprise")
    ? "Enterprise"
    : planKey.includes("premium")
      ? "Founder Premium"
      : "Founder Free";

  // 4. Compute Applications per Opportunity Role (Bar Chart Data)
  const applicationsPerRoleData = useMemo(() => {
    if (opportunitiesList.length === 0) return [];

    return opportunitiesList.map((opp) => {
      const oppId = String(opp._id || opp.id || "");
      const count = applicationsList.filter((app) => {
        const appOppId = String(
          app.opportunityId || app.convertedOppId || app.opportunity_id || "",
        );
        return (
          (oppId && appOppId === oppId) ||
          (app.opportunityTitle &&
            opp.roleTitle &&
            app.opportunityTitle.trim().toLowerCase() ===
              opp.roleTitle.trim().toLowerCase())
        );
      }).length;

      const title = opp.roleTitle || opp.title || "Untitled Role";
      const shortTitle = title.length > 15 ? `${title.slice(0, 13)}...` : title;

      return {
        role: shortTitle,
        fullTitle: title,
        Applications: count,
      };
    });
  }, [opportunitiesList, applicationsList]);

  // 5. Compute Application Status Breakdown (Donut Chart Data)
  const statusPieData = useMemo(() => {
    return [
      { name: "Accepted", value: acceptedMembers, color: "#10B981" },
      { name: "Pending", value: pendingApplications, color: "#F59E0B" },
      { name: "Rejected", value: rejectedApplications, color: "#EF4444" },
    ].filter((item) => item.value > 0);
  }, [acceptedMembers, pendingApplications, rejectedApplications]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header with Welcome Greeting & Plan Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-bold text-slate-100">
              Welcome back, {user?.name || "Founder"}!
            </h2>

            {isUpgraded ? (
              <div
                className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                title="Verified Founder Account"
              >
                <BadgeCheck className="h-4 w-4 fill-amber-500/20 text-amber-400 shrink-0" />
                <span>{planDisplayName.toUpperCase()}</span>
              </div>
            ) : (
              <Link href="/dashboard/founder/pricing">
                <span className="text-[11px] font-mono text-slate-400 bg-white/5 hover:bg-white/10 border border-slate-800 px-2.5 py-1 rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>Upgrade to Premium</span>
                </span>
              </Link>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor your recruitment pipeline, applicant conversions, and role
            engagement.
          </p>
        </div>

        <Link href="/dashboard/founder/add-opportunity">
          <Btn variant="primary" size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Post New Role</span>
          </Btn>
        </Link>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Opportunities"
          value={totalOpportunities}
          sub="active roles posted"
          color="#F59E0B"
        />
        <StatCard
          label="Total Applications"
          value={totalApplications}
          sub="across all roles"
          color="#818CF8"
        />
        <StatCard
          label="Accepted Members"
          value={acceptedMembers}
          sub="team members onboarded"
          color="#10B981"
        />
        <StatCard
          label="Pending Review"
          value={pendingApplications}
          sub="awaiting review"
          color="#3B82F6"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Per Opportunity Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                Applications per Role
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Number of applicants received for each posted opportunity
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
              <TrendingUp className="w-4 h-4" /> Role Metrics
            </div>
          </div>

          <div className="pt-2">
            {applicationsPerRoleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={applicationsPerRoleData}
                  barSize={32}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="role"
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
                  <Bar
                    dataKey="Applications"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500 italic">
                No opportunities posted yet to show application metrics.
              </div>
            )}
          </div>
        </div>

        {/* Application Status Breakdown Donut Chart */}
        <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
              Status Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review status distribution of received applications
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
                No applications received yet.
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
                Applicant statuses will be graphed here
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 space-y-3 shadow-sm">
        <h3 className="font-semibold text-sm text-slate-200">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/founder/add-opportunity">
            <Btn variant="primary" size="sm">
              + Post New Opportunity
            </Btn>
          </Link>
          <Link href="/dashboard/founder/applications">
            <Btn variant="ghost" size="sm">
              📬 Review Applications ({pendingApplications} New)
            </Btn>
          </Link>
          <Link href="/dashboard/founder/opportunities">
            <Btn variant="outline" size="sm">
              📋 Manage Active Roles ({totalOpportunities})
            </Btn>
          </Link>
          <Link href="/dashboard/founder/startup">
            <Btn variant="ghost" size="sm">
              🏢 Startup Profile
            </Btn>
          </Link>
        </div>
      </div>
    </div>
  );
}
