"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Chip, ProgressBar } from "@heroui/react";
import {
  ArrowRight,
  Plus,
  Rocket,
  Search,
  Users,
  ShieldCheck,
  Building2,
  FileCheck,
  Sparkles,
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
// 1. GUEST BANNER (Seamless Flow & Ambient Glow)
// =============================================================================
const GuestBanner = () => (
  <section className="relative overflow-hidden py-24 lg:py-32 font-sans transition-colors duration-300">
    {/* Ambient Glow & Floating Orbs */}
    <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[750px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl bg-gradient-to-tr from-violet-500/20 via-purple-500/15 to-indigo-500/20 dark:from-violet-600/25 dark:via-purple-600/20 dark:to-indigo-600/25 animate-pulse-glow" />
    <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full blur-3xl bg-violet-400/15 dark:bg-violet-600/15 animate-float-slow" />
    <div className="pointer-events-none absolute -right-20 top-44 h-80 w-80 rounded-full blur-3xl bg-indigo-400/15 dark:bg-indigo-600/15 animate-float-reverse" />

    <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-12">
      {/* Live Active Badge */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
        <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide border-violet-200 bg-white/80 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300 shadow-xs backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-600 dark:bg-violet-400" />
          500+ active startups recruiting now
        </span>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
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
        className="mt-6 text-base leading-relaxed sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
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
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link href="/opportunities" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/25 hover:shadow-violet-600/35 hover:-translate-y-0.5 active:scale-95 transition-all px-7 py-4"
            endContent={<ArrowRight className="w-4 h-4" />}
          >
            Browse Opportunities
          </Button>
        </Link>

        <Link href="/signup" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="bordered"
            className="w-full sm:w-auto rounded-2xl border border-slate-300/90 bg-white/80 hover:bg-white text-slate-800 font-bold text-sm shadow-xs hover:border-violet-400 hover:-translate-y-0.5 active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 px-7 py-4"
          >
            Post an Opportunity
          </Button>
        </Link>
      </motion.div>

      {/* Metric Badges */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
        className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-t border-slate-200/80 dark:border-slate-800/80 pt-8 text-xs font-mono text-slate-500 dark:text-slate-400"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
            2,400+
          </span>{" "}
          Active Roles
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
            1,100+
          </span>{" "}
          Vetted Startups
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
            8,500+
          </span>{" "}
          Collaborators
        </div>
      </motion.div>
    </div>
  </section>
);

// =============================================================================
// 2. FOUNDER BANNER
// =============================================================================
const FounderBanner = ({
  user,
  founderApplications = [],
  founderOpportunities = [],
  founderStartup = [],
  opportunities = [],
}) => {
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
    <section className="relative overflow-hidden py-16 lg:py-20 font-sans transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full blur-3xl bg-violet-400/10 dark:bg-violet-600/15 animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-64 w-64 rounded-full blur-3xl bg-indigo-400/10 dark:bg-indigo-600/15 animate-float-reverse" />

      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Description */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
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
              className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
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
              className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
            >
              Post new team roles, review candidate applications from developers
              and designers, and coordinate matching pipelines.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
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

          {/* Right Metrics Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            className="rounded-3xl border p-7 border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Recruitment Pipeline Overview
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Pending Applications
                </span>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 font-mono font-bold text-xs"
                >
                  {pendingCount} New
                </Chip>
              </div>

              <div className="flex items-center justify-between rounded-2xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Active Startups
                </span>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  {activeStartupsCount} Active
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Open Positions
                </span>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  {openRolesCount} Listed
                </span>
              </div>
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
    <section className="relative overflow-hidden py-16 lg:py-20 font-sans transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full blur-3xl bg-indigo-400/10 dark:bg-indigo-600/15 animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-64 w-64 rounded-full blur-3xl bg-violet-400/10 dark:bg-violet-600/15 animate-float-reverse" />

      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Description */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
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
              className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
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
              className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
            >
              Discover open startup opportunities, filter positions by tech
              stack or commitment level, and manage active submissions.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
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
            className="rounded-3xl border p-7 border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Collaborator Summary
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
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

              <div className="flex items-center justify-between rounded-2xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Account Standing
                </span>
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 capitalize">
                  {user?.status || "Active"}
                </span>
              </div>

              {/* HeroUI Progress Component */}
              <div className="rounded-2xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 space-y-2">
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
    <section className="relative overflow-hidden py-14 lg:py-16 font-sans transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full blur-3xl bg-purple-400/10 dark:bg-purple-600/15 animate-float-slow" />

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
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
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
          ].map(({ label, value, alert }, i) => (
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
