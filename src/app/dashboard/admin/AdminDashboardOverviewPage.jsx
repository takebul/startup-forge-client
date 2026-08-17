"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  Crown,
  Calendar,
} from "lucide-react";
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

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2.5 bg-[#0D1528] border border-slate-800 text-xs shadow-xl space-y-1 font-sans">
      <p className="font-semibold text-slate-200">{label}</p>
      <p className="text-amber-400 font-mono font-bold">
        Revenue: $
        {payload[0].value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
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

export default function AdminDashboardOverviewPage({
  userData = [],
  startups = [],
  opportunities = [],
  subscriptions = [],
}) {
  // Chart View State: "monthly" | "daily"
  const [revenueView, setRevenueView] = useState("monthly");

  // 1. Safely Parse Input Datasets
  const usersList = useMemo(
    () => parseArrayData(userData, "userData"),
    [userData],
  );
  const startupsList = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );
  const opportunitiesList = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );
  const subscriptionsList = useMemo(
    () => parseArrayData(subscriptions, "subscriptions"),
    [subscriptions],
  );

  // 2. Compute Real-Time Key Statistics
  const pendingStartupsCount = useMemo(() => {
    return startupsList.filter(
      (s) => s.status === "Pending" || s.status === false,
    ).length;
  }, [startupsList]);

  const totalRevenueDollars = useMemo(() => {
    return subscriptionsList
      .filter((s) => {
        const pStatus = String(
          s.payment_status || s.paymentStatus || s.status || "",
        ).toLowerCase();
        return (
          pStatus === "paid" ||
          pStatus === "completed" ||
          pStatus === "succeeded"
        );
      })
      .reduce((sum, s) => sum + (s.amount || 0) / 100, 0);
  }, [subscriptionsList]);

  const OVERVIEW_STATS = useMemo(() => {
    return [
      {
        label: "Total Users",
        value: usersList.length.toLocaleString(),
        sub: `${usersList.filter((u) => u.status === "active").length} active members`,
        icon: Users,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10 border-indigo-500/20",
      },
      {
        label: "Total Startups",
        value: startupsList.length.toLocaleString(),
        sub: `${pendingStartupsCount} pending review`,
        icon: Building2,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
      },
      {
        label: "Active Opportunities",
        value: opportunitiesList.length.toLocaleString(),
        sub: "across all startups",
        icon: Briefcase,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      },
      {
        label: "Total Revenue",
        value: `$${totalRevenueDollars.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        sub: `${subscriptionsList.length} total payments`,
        icon: DollarSign,
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/20",
      },
    ];
  }, [
    usersList,
    startupsList,
    opportunitiesList,
    subscriptionsList,
    pendingStartupsCount,
    totalRevenueDollars,
  ]);

  // 3A. Compute Monthly Revenue Growth Chart Data
  const monthlyRevenueChartData = useMemo(() => {
    const monthMap = {};

    subscriptionsList.forEach((sub) => {
      const pStatus = String(
        sub.payment_status || sub.paymentStatus || sub.status || "",
      ).toLowerCase();
      if (
        pStatus === "paid" ||
        pStatus === "completed" ||
        pStatus === "succeeded"
      ) {
        const dateStr = sub.subscriptionAt || sub.createdAt || sub.date;
        if (dateStr) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const mName = MONTH_NAMES[date.getMonth()];
            const amountInDollars = (sub.amount || 0) / 100;
            monthMap[mName] = (monthMap[mName] || 0) + amountInDollars;
          }
        }
      }
    });

    const chartData = MONTH_NAMES.filter((m) => monthMap[m] !== undefined).map(
      (m) => ({
        label: m,
        Revenue: monthMap[m],
      }),
    );

    if (chartData.length === 0) {
      return [{ label: "Aug", Revenue: totalRevenueDollars }];
    }

    return chartData;
  }, [subscriptionsList, totalRevenueDollars]);

  // 3B. Compute Daily Revenue Growth Chart Data with Chronological Sorting
  const dailyRevenueChartData = useMemo(() => {
    const dayMap = {};

    subscriptionsList.forEach((sub) => {
      const pStatus = String(
        sub.payment_status || sub.paymentStatus || sub.status || "",
      ).toLowerCase();
      if (
        pStatus === "paid" ||
        pStatus === "completed" ||
        pStatus === "succeeded"
      ) {
        const dateStr = sub.subscriptionAt || sub.createdAt || sub.date;
        if (dateStr) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const dayKey = date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            });
            const amountInDollars = (sub.amount || 0) / 100;

            if (!dayMap[dayKey]) {
              dayMap[dayKey] = {
                label: dayKey,
                Revenue: 0,
                timestamp: new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                ).getTime(),
              };
            }
            dayMap[dayKey].Revenue += amountInDollars;
          }
        }
      }
    });

    const chartData = Object.values(dayMap)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ label, Revenue }) => ({ label, Revenue }));

    if (chartData.length === 0) {
      return [{ label: "Today", Revenue: totalRevenueDollars }];
    }

    return chartData;
  }, [subscriptionsList, totalRevenueDollars]);

  // Active revenue dataset based on current toggle view
  const activeRevenueData =
    revenueView === "daily" ? dailyRevenueChartData : monthlyRevenueChartData;

  // 4. Compute User Persona Distribution (Reads role and accountType)
  const userRoleDistribution = useMemo(() => {
    let collaborators = 0;
    let founders = 0;
    let admins = 0;

    usersList.forEach((u) => {
      const role = String(u.role || "").toLowerCase();
      const accountType = String(u.accountType || "").toLowerCase();

      if (role === "admin") {
        admins++;
      } else if (accountType === "founder" || role === "founder") {
        founders++;
      } else {
        // Defaults to collaborator for collaborator accounts or general members
        collaborators++;
      }
    });

    return [
      { name: "Collaborators", value: collaborators, color: "#818CF8" },
      { name: "Founders", value: founders, color: "#F59E0B" },
      { name: "Admins", value: admins, color: "#A855F7" },
    ];
  }, [usersList]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100">
              Platform Overview
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase">
              <Crown className="w-3 h-3" /> Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time platform metrics, user distribution, and
            daily/monthly revenue performance.
          </p>
        </div>
      </div>

      {/* Top Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800/80 flex items-start justify-between shadow-sm"
            >
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>

              <div
                className={`p-3 rounded-xl border ${stat.bg} ${stat.color} shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart Card with Monthly/Daily Toggle */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                <span>
                  {revenueView === "daily" ? "Daily" : "Monthly"} Revenue Growth
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real subscription payments accumulated{" "}
                {revenueView === "daily" ? "per day" : "per month"}
              </p>
            </div>

            {/* View Mode Switcher (Monthly vs Daily) */}
            <div className="flex items-center gap-1 bg-[#060C1A] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setRevenueView("monthly")}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                  revenueView === "monthly"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setRevenueView("daily")}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                  revenueView === "daily"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Daily
              </button>
            </div>
          </div>

          <div className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={activeRevenueData}
                barSize={32}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="label"
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
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="Revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Role Donut Breakdown */}
        <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800/80 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
              User Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real breakdown by active ecosystem personas
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={userRoleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {userRoleDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {userRoleDistribution.map((item) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
