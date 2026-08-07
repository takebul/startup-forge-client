"use client";

import { useState } from "react";
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Crown,
  BadgeCheck,
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

// Seed Data
const OVERVIEW_STATS = [
  {
    label: "Total Users",
    value: "1,248",
    sub: "+12% this month",
    icon: Users,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    label: "Total Startups",
    value: "86",
    sub: "4 pending review",
    icon: Building2,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    label: "Active Opportunities",
    value: "214",
    sub: "across all startups",
    icon: Briefcase,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    label: "Total Revenue",
    value: "$8,420",
    sub: "from subscriptions",
    icon: DollarSign,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

const MONTHLY_REVENUE_DATA = [
  { month: "Jan", Revenue: 1200 },
  { month: "Feb", Revenue: 1900 },
  { month: "Mar", Revenue: 2400 },
  { month: "Apr", Revenue: 3100 },
  { month: "May", Revenue: 4800 },
  { month: "Jun", Revenue: 6200 },
  { month: "Jul", Revenue: 8420 },
];

const USER_ROLE_DISTRIBUTION = [
  { name: "Collaborators", value: 840, color: "#818CF8" },
  { name: "Founders", value: 390, color: "#F59E0B" },
  { name: "Admins", value: 18, color: "#A855F7" },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2.5 bg-[#0D1528] border border-slate-800 text-xs shadow-xl space-y-1">
      <p className="font-semibold text-slate-200">{label}</p>
      <p className="text-amber-400 font-mono font-bold">
        Revenue: ${payload[0].value.toLocaleString()}
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

export default function AdminDashboardOverviewPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100">
              Platform Overview
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase">
              <Crown className="w-3 h-3" /> Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time platform metrics, user distribution, and monthly
            revenue performance.
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
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
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-[#0D1528] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                Monthly Revenue Growth
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Subscription payments accumulated over time
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
              <TrendingUp className="w-4 h-4" /> +28.4%
            </div>
          </div>

          <div className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={MONTHLY_REVENUE_DATA}
                barSize={32}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
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
        <div className="rounded-2xl p-6 bg-[#0D1528] border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
              User Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown by active ecosystem roles
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={USER_ROLE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {USER_ROLE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {USER_ROLE_DISTRIBUTION.map((item) => (
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
