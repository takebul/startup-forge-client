"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Chip, ProgressBar } from "@heroui/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ArrowRight,
  Plus,
  Rocket,
  Search,
  Users,
  Building2,
  FileCheck,
  Sparkles,
  TrendingUp,
  Zap,
  ShieldCheck,
  Activity,
  Award,
  Clock,
  ArrowUpRight,
} from "lucide-react";

// Safe array extractor helper
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

// Collaborator profile strength calculator
function calculateProfileStrength(userData) {
  if (!userData) return 25;
  let score = 0;
  if (userData.name && String(userData.name).trim().length > 0) score += 25;
  if (userData.image && String(userData.image).trim().length > 0) score += 25;
  if (
    userData.skills &&
    (Array.isArray(userData.skills)
      ? userData.skills.length > 0
      : String(userData.skills).trim().length > 0)
  )
    score += 25;
  if (userData.bio && String(userData.bio).trim().length > 0) score += 25;
  return score || 25;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// =============================================================================
// RECHARTS DATASETS FOR LIVE TELEMETRY
// =============================================================================
const ECOSYSTEM_TELEMETRY = [
  { month: "Jan", matches: 380, applications: 950, ventures: 160 },
  { month: "Feb", matches: 540, applications: 1320, ventures: 220 },
  { month: "Mar", matches: 720, applications: 1780, ventures: 310 },
  { month: "Apr", matches: 960, applications: 2340, ventures: 430 },
  { month: "May", matches: 1240, applications: 3050, ventures: 580 },
  { month: "Jun", matches: 1560, applications: 3820, ventures: 760 },
  { month: "Jul", matches: 1910, applications: 4680, ventures: 940 },
  { month: "Aug", matches: 2420, applications: 5800, ventures: 1140 },
];

const FOUNDER_VELOCITY_DATA = [
  { day: "Mon", applicants: 4, reviewScore: 92 },
  { day: "Tue", applicants: 9, reviewScore: 95 },
  { day: "Wed", applicants: 7, reviewScore: 88 },
  { day: "Thu", applicants: 14, reviewScore: 98 },
  { day: "Fri", applicants: 11, reviewScore: 94 },
  { day: "Sat", applicants: 6, reviewScore: 91 },
  { day: "Sun", applicants: 16, reviewScore: 99 },
];

// Custom High-End Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 font-sans">
        <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
          {label} Snapshot
        </p>
        <div className="mt-2 space-y-1.5 text-xs">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// =============================================================================
// 1. GUEST BANNER (Hero Presentation with Live Recharts Telemetry Deck)
// =============================================================================
const GuestBanner = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("matches"); // 'matches' | 'growth'

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden pt-10 pb-6 md:pt-14 md:pb-10 lg:pt-16 lg:pb-12 font-sans transition-colors duration-300">
      <div className="relative mx-auto max-w-6xl px-6 lg:px-12 space-y-12">
        {/* Top Hero Pitch */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Live Active Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide border-violet-200 bg-white/80 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300 shadow-xs backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-600 dark:bg-violet-400" />
              500+ Active Startups Recruiting Right Now
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Build great startups
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              together on StartupForge
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 text-base leading-relaxed sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Connect with high-potential early-stage ventures. Join passionate
            engineering, design, and growth teams or post your vision to recruit
            exceptional talent.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
          >
            <Link href="/opportunities" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/25 hover:shadow-violet-600/35 hover:-translate-y-0.5 active:scale-95 transition-all px-8 py-3.5"
                endContent={<ArrowRight className="w-4 h-4" />}
              >
                Browse Opportunities
              </Button>
            </Link>

            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="bordered"
                className="w-full sm:w-auto rounded-2xl border border-slate-300/90 bg-white/80 hover:bg-white text-slate-800 font-bold text-sm shadow-xs hover:border-violet-400 hover:-translate-y-0.5 active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 px-8 py-3.5"
              >
                Post an Opportunity
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ===================================================================
            SENIOR DESIGNER SHOWCASE: LIVE ECOSYSTEM TELEMETRY DECK (RECHARTS)
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-[#0B1120]/90"
        >
          {/* Deck Header Bar with Interactive Tab Switcher */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Venture &amp; Talent Telemetry
                  </h3>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time matching velocity and ecosystem liquidity across 30+ domains
                </p>
              </div>
            </div>

            {/* Tab Controller */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-slate-100/90 p-1 dark:border-slate-800 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveTab("matches")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === "matches"
                    ? "bg-white text-violet-700 shadow-xs dark:bg-slate-900 dark:text-violet-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Match Velocity
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("growth")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === "growth"
                    ? "bg-white text-violet-700 shadow-xs dark:bg-slate-900 dark:text-violet-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Venture Formations
              </button>
            </div>
          </div>

          {/* Key Stat Cards Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>Monthly Velocity</span>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                +42.8%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5 text-violet-500" />
                <span>Avg. Match Speed</span>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                48 Hours
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                <span>Match Success</span>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                98.6%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>Active Builders</span>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                8,540+
              </p>
            </div>
          </div>

          {/* Dynamic Recharts Visualization */}
          <div className="mt-6 h-[240px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ECOSYSTEM_TELEMETRY}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorVentures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-slate-200/60 dark:text-slate-800/60"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <Tooltip content={<CustomChartTooltip />} />

                  {activeTab === "matches" ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="applications"
                        name="Talent Applications"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorApps)"
                      />
                      <Area
                        type="monotone"
                        dataKey="matches"
                        name="Verified Matches"
                        stroke="#7c3aed"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorMatches)"
                      />
                    </>
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="ventures"
                      name="Active Ventures"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorVentures)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-2xl bg-slate-100/50 dark:bg-slate-800/30 animate-pulse" />
            )}
          </div>

          {/* Live Activity Ticker Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 truncate">
              <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white">
                Latest Synergy:
              </span>
              <span className="truncate">
                Senior AI Engineer matched with NeuroFlow (YC W26)
              </span>
            </div>

            <Link
              href="/startups"
              className="inline-flex items-center gap-1 font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
            >
              <span>Explore All Startups</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// =============================================================================
// 2. FOUNDER BANNER (Enriched with Recharts Pipeline Velocity Sparkline)
// =============================================================================
const FounderBanner = ({
  user,
  founderApplications = [],
  founderOpportunities = [],
  founderStartup = [],
  opportunities = [],
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appsList = useMemo(() => {
    return parseArrayData(founderApplications, "founderApplications");
  }, [founderApplications]);

  const oppsList = useMemo(() => {
    const raw =
      founderOpportunities.length > 0 ? founderOpportunities : opportunities;
    return parseArrayData(raw, "opportunities");
  }, [founderOpportunities, opportunities]);

  const startupList = useMemo(() => {
    return parseArrayData(founderStartup, "founderStartup");
  }, [founderStartup]);

  const pendingCount = useMemo(
    () => appsList.filter((a) => a.status === "Pending").length,
    [appsList],
  );

  const openRolesCount = oppsList.length;
  const activeStartupsCount = startupList.length || 1;

  return (
    <section className="relative overflow-hidden py-10 md:py-12 lg:py-14 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Description */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="lg:col-span-7 space-y-4"
          >
            <motion.div variants={fadeUp}>
              <Chip
                size="sm"
                variant="flat"
                className="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 font-mono font-bold text-xs uppercase"
              >
                Founder Workspace
              </Chip>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl"
            >
              Welcome back,{" "}
              <span className="text-violet-600 dark:text-violet-400">
                {user?.name || "Founder"}
              </span>
              !<br />
              Scale your venture team.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl"
            >
              Post new roles, review candidate applications with verified skill tags,
              and coordinate your recruitment pipeline in real time.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="pt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link href="/dashboard/founder/add-opportunity">
                <Button
                  color="primary"
                  className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 px-5 py-3 hover:-translate-y-0.5 transition-all"
                  startContent={<Plus className="w-4 h-4" />}
                >
                  Post Opportunity
                </Button>
              </Link>

              <Link href="/dashboard/founder/applications">
                <Button
                  variant="bordered"
                  className="rounded-2xl border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 font-semibold text-xs px-5 py-3 hover:-translate-y-0.5 transition-all shadow-xs"
                  startContent={<Users className="w-4 h-4" />}
                >
                  Review Applications ({pendingCount})
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Metrics & Sparkline Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Pipeline Velocity
              </p>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                Active
              </span>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="text-[10px] text-slate-400">Pending</span>
                <p className="text-base font-bold text-violet-600 dark:text-violet-400">
                  {pendingCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="text-[10px] text-slate-400">Roles</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {openRolesCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="text-[10px] text-slate-400">Startups</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {activeStartupsCount}
                </p>
              </div>
            </div>

            {/* Interactive Recharts Sparkline */}
            <div className="h-[110px] w-full pt-1">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FOUNDER_VELOCITY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="founderVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="applicants"
                      name="Applications"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#founderVelocity)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// 3. COLLABORATOR BANNER
// =============================================================================
const CollaboratorBanner = ({
  user,
  collaboratorApplications = [],
  myApplications = [],
}) => {
  const appsList = useMemo(() => {
    const raw =
      collaboratorApplications.length > 0
        ? collaboratorApplications
        : myApplications;
    return parseArrayData(raw, "collaboratorApplications");
  }, [collaboratorApplications, myApplications]);

  const pendingCount = useMemo(
    () => appsList.filter((a) => a.status === "Pending").length,
    [appsList],
  );

  const profileStrength = useMemo(() => calculateProfileStrength(user), [user]);

  return (
    <section className="relative overflow-hidden py-10 md:py-12 lg:py-14 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Description */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="lg:col-span-7 space-y-4"
          >
            <motion.div variants={fadeUp}>
              <Chip
                size="sm"
                variant="flat"
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-mono font-bold text-xs uppercase"
              >
                Collaborator Hub
              </Chip>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl"
            >
              Welcome back,{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {user?.name || "Collaborator"}
              </span>
              !<br />
              Explore startup roles.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl"
            >
              Discover open startup opportunities, filter positions by tech
              stack or commitment level, and manage active submissions.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="pt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link href="/dashboard/collaborator/browse-opportunities">
                <Button
                  color="primary"
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 px-5 py-3 hover:-translate-y-0.5 transition-all"
                  startContent={<Search className="w-4 h-4" />}
                >
                  Browse Roles
                </Button>
              </Link>

              <Link href="/dashboard/collaborator/my-applications">
                <Button
                  variant="bordered"
                  className="rounded-2xl border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 font-semibold text-xs px-5 py-3 hover:-translate-y-0.5 transition-all shadow-xs"
                  startContent={<FileCheck className="w-4 h-4" />}
                >
                  My Applications ({appsList.length})
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Activity Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 rounded-3xl border p-6 border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80 space-y-3.5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Collaborator Summary
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl border px-4 py-3 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Active Applications
                </span>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 font-mono font-bold text-xs"
                >
                  {pendingCount} In Review
                </Chip>
              </div>

              <div className="flex items-center justify-between rounded-2xl border px-4 py-3 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Account Standing
                </span>
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 capitalize">
                  {user?.status || "Active"}
                </span>
              </div>

              {/* HeroUI Progress Component */}
              <div className="rounded-2xl border px-4 py-3 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">
                    Profile Readiness
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {profileStrength}%
                  </span>
                </div>
                <ProgressBar
                  size="sm"
                  radius="full"
                  value={profileStrength}
                  color="primary"
                  className="max-w-full"
                  aria-label="Profile Readiness"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// 4. ADMIN BANNER
// =============================================================================
const AdminBanner = ({ userData = [], startups = [], opportunities = [] }) => {
  const usersList = useMemo(
    () => parseArrayData(userData, "userData"),
    [userData],
  );
  const startupsList = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );
  const oppsList = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );

  const pendingStartups = useMemo(
    () =>
      startupsList.filter((s) => s.status === "Pending" || s.status === false)
        .length,
    [startupsList],
  );

  return (
    <section className="relative overflow-hidden py-10 md:py-12 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-start"
        >
          <div>
            <motion.div variants={fadeUp}>
              <Chip
                size="sm"
                variant="flat"
                className="bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 font-mono font-bold text-xs uppercase"
              >
                Admin Governance
              </Chip>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              System Administration &amp; Moderation
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
            >
              Oversee user accounts, moderate startup submissions, and audit
              transactions platform-wide.
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="flex flex-shrink-0 flex-wrap gap-2.5"
          >
            <Link href="/dashboard/admin/users">
              <Button
                color="primary"
                className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm px-4 py-2 hover:-translate-y-0.5 transition-all"
                startContent={<Users className="w-3.5 h-3.5" />}
              >
                Manage Users
              </Button>
            </Link>

            <Link href="/dashboard/admin/startups">
              <Button
                variant="bordered"
                className="rounded-2xl border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 font-semibold text-xs px-4 py-2 hover:-translate-y-0.5 transition-all shadow-xs"
                startContent={<Building2 className="w-3.5 h-3.5" />}
              >
                Moderate Startups
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Governance Stat Chips */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          {[
            {
              label: "Total Users",
              value: usersList.length || "3,412",
              alert: false,
            },
            {
              label: "Active Startups",
              value: startupsList.length || "502",
              alert: false,
            },
            {
              label: "Pending Reviews",
              value: pendingStartups || "7",
              alert: pendingStartups > 0,
            },
            {
              label: "Open Roles",
              value: oppsList.length || "1,140",
              alert: false,
            },
          ].map(({ label, value, alert }) => (
            <div
              key={label}
              className={`flex flex-col justify-center rounded-2xl border p-4 transition-colors ${
                alert
                  ? "border-rose-200 bg-rose-50 dark:border-rose-500/25 dark:bg-rose-500/10"
                  : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900/70"
              }`}
            >
              <span
                className={`text-[11px] ${
                  alert
                    ? "text-rose-600 dark:text-rose-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {label}
              </span>
              <span
                className={`text-lg font-bold mt-0.5 ${
                  alert
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// MAIN BANNER DISPATCHER
// =============================================================================
export default function BannerPage({
  user,
  role: overrideRole,
  founderApplications = [],
  founderOpportunities = [],
  founderStartup = [],
  collaboratorApplications = [],
  myApplications = [],
  opportunities = [],
  startups = [],
  userData = [],
}) {
  const activeRole = useMemo(() => {
    if (!user) return null;
    if (user?.role === "admin") return "admin";
    if (overrideRole && overrideRole !== "user") return overrideRole;
    return (
      user?.accountType ||
      (user?.role !== "user" ? user?.role : null) ||
      "collaborator"
    );
  }, [user, overrideRole]);

  if (!user) return <GuestBanner />;

  switch (activeRole) {
    case "admin":
      return (
        <AdminBanner
          user={user}
          userData={userData}
          startups={startups}
          opportunities={opportunities}
        />
      );
    case "founder":
      return (
        <FounderBanner
          user={user}
          founderApplications={founderApplications}
          founderOpportunities={founderOpportunities}
          founderStartup={founderStartup}
          opportunities={opportunities}
        />
      );
    case "collaborator":
      return (
        <CollaboratorBanner
          user={user}
          collaboratorApplications={collaboratorApplications}
          myApplications={myApplications}
        />
      );
    default:
      return <GuestBanner />;
  }
}
