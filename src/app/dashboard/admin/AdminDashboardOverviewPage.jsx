"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  Crown,
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
    <div className="rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 text-xs shadow-xl space-y-1 font-sans">
      <p className="font-semibold text-slate-900 dark:text-slate-200">
        {label}
      </p>
      <p className="text-violet-600 dark:text-violet-400 font-mono font-bold">
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
    <div className="rounded-xl px-3 py-2 bg-white dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 text-xs shadow-xl font-sans">
      <p className="text-slate-900 dark:text-slate-200">
        {payload[0].name}:{" "}
        <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
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

  // 2. Compute Real-time Aggregations
  const totalUsers = usersList.length;
  const totalStartups = startupsList.length;
  const totalOpportunities = opportunitiesList.length;

  const totalRevenueDollars = useMemo(() => {
    return subscriptionsList.reduce((acc, sub) => {
      const pStatus = String(
        sub.payment_status || sub.paymentStatus || sub.status || "",
      ).toLowerCase();
      if (
        pStatus === "paid" ||
        pStatus === "completed" ||
        pStatus === "succeeded"
      ) {
        return acc + (sub.amount || 0) / 100;
      }
      return acc;
    }, 0);
  }, [subscriptionsList]);

  const OVERVIEW_STATS = [
    {
      label: "Total Users",
      value: totalUsers,
      sub: "registered accounts",
      icon: Users,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20",
    },
    {
      label: "Startups Listed",
      value: totalStartups,
      sub: "active venture ventures",
      icon: Building2,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20",
    },
    {
      label: "Open Positions",
      value: totalOpportunities,
      sub: "opportunities posted",
      icon: Briefcase,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 border-sky-200 dark:bg-sky-500/10 dark:border-sky-500/20",
    },
    {
      label: "Platform Revenue",
      value: `$${totalRevenueDollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: "processed via Stripe",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    },
  ];

  // 3A. Compute Monthly Revenue Chart Data
  const monthlyRevenueChartData = useMemo(() => {
    const monthMap = {};
    MONTH_NAMES.forEach((m) => {
      monthMap[m] = 0;
    });

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
            const m = MONTH_NAMES[date.getMonth()];
            const amountInDollars = (sub.amount || 0) / 100;
            monthMap[m] = (monthMap[m] || 0) + amountInDollars;
          }
        }
      }
    });

    const chartData = MONTH_NAMES.filter((m) => monthMap[m] > 0).map((m) => ({
      label: m,
      Revenue: monthMap[m],
    }));

    if (chartData.length === 0) {
      return [{ label: "Aug", Revenue: totalRevenueDollars }];
    }

    return chartData;
  }, [subscriptionsList, totalRevenueDollars]);

  // 3B. Compute Daily Revenue Growth Chart Data
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

  const activeRevenueData =
    revenueView === "daily" ? dailyRevenueChartData : monthlyRevenueChartData;

  // 4. Compute User Persona Distribution
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
        collaborators++;
      }
    });

    return [
      { name: "Collaborators", value: collaborators, color: "#8B5CF6" },
      { name: "Founders", value: founders, color: "#6366F1" },
      { name: "Admins", value: admins, color: "#A855F7" },
    ];
  }, [usersList]);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Platform Overview
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase">
              <Crown className="w-3 h-3" /> Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
              className="rounded-3xl p-5 bg-white border border-slate-200/90 flex items-start justify-between shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90"
            >
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  {stat.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.sub}
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl border ${stat.bg} ${stat.color} shrink-0`}
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
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                <span>
                  {revenueView === "daily" ? "Daily" : "Monthly"} Revenue Growth
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real subscription payments accumulated{" "}
                {revenueView === "daily" ? "per day" : "per month"}
              </p>
            </div>

            {/* View Mode Switcher (Monthly vs Daily) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setRevenueView("monthly")}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer ${
                  revenueView === "monthly"
                    ? "bg-violet-600 text-white font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setRevenueView("daily")}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer ${
                  revenueView === "daily"
                    ? "bg-violet-600 text-white font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
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
                  stroke="rgba(100,116,139,0.12)"
                />
                <XAxis
                  dataKey="label"
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(124,58,237,0.04)" }}
                />
                <Bar dataKey="Revenue" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Role Donut Breakdown */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono tracking-wider">
              User Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {userRoleDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
