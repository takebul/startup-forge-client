"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

// -----------------------------------------------------------------------------
// ANIMATION VARIANTS
// -----------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// -----------------------------------------------------------------------------
// 1. GUEST BANNER
// -----------------------------------------------------------------------------
const GuestBanner = () => (
  <section className="relative overflow-hidden py-20 lg:py-28 bg-[#ebebf5] dark:bg-[#0c0c16] transition-colors duration-300 font-sans">
    {/* Ambient Glow Blob */}
    <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl bg-violet-300/30 dark:bg-violet-600/15" />

    <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-12">
      {/* Badge */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
        <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide border-violet-300/60 bg-white/70 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 dark:bg-violet-400" />
          500+ active startups recruiting now
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[52px]"
      >
        Build great startups
        <br />
        <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-300 dark:to-indigo-400">
          together on StartupForge
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-5 text-base leading-relaxed sm:text-lg text-slate-600 dark:text-slate-400"
      >
        The bridge between visionary founders and world-class collaborators.
        Publish your idea or join an ambitious team today.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-9 flex flex-wrap justify-center gap-3"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/register?role=founder"
            className="inline-block rounded-xl px-7 py-3.5 text-sm font-semibold text-white bg-violet-600 shadow-lg shadow-violet-600/25 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 transition-colors"
          >
            Post your startup idea
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/opportunities"
            className="inline-block rounded-xl border px-7 py-3.5 text-sm font-semibold border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-800 transition-colors"
          >
            Explore open roles →
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Strip */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
        className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:border-slate-800"
      >
        {[
          { num: "500+", label: "Active Startups" },
          { num: "2,400+", label: "Collaborators" },
          { num: "1,100+", label: "Roles Filled" },
          { num: "98%", label: "Match Rate" },
        ].map(({ num, label }, i) => (
          <motion.div
            key={label}
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={5 + i}
            className="bg-white px-4 py-5 text-center dark:bg-[#0c0c16]"
          >
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {num}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 2. FOUNDER BANNER
// -----------------------------------------------------------------------------
const FounderBanner = ({
  user,
  founderApplications = [],
  founderOpportunities = [],
  founderStartup = [],
  applications = [],
  opportunities = [],
}) => {
  const appsList = useMemo(() => {
    const raw =
      founderApplications.length > 0 ? founderApplications : applications;
    return parseArrayData(raw, "applications");
  }, [founderApplications, applications]);

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
    <section className="py-16 transition-colors duration-300 bg-[#f0f0f8] dark:bg-[#0c0c16] font-sans">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left — Copy */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-md px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-1 dark:ring-inset dark:ring-indigo-500/20"
            >
              Founder Workspace
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
            >
              Welcome back,{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {user?.name || "Founder"}
              </span>
              !<br />
              Ready to build your dream team?
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
            >
              Post new team requirements, review incoming applications from
              developers, designers, and marketers, and accelerate your
              startup's journey.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/dashboard/founder/add-opportunity"
                  className="inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white bg-indigo-600 shadow-md shadow-indigo-600/20 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                >
                  + Post new requirement
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/dashboard/founder/applications"
                  className="inline-block rounded-xl border px-6 py-3 text-sm font-semibold border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800 transition-colors"
                >
                  Review applications
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right — Recruitment Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            className="rounded-2xl border p-6 border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1a1a2e]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Recruitment overview
            </p>

            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Pending applications",
                  value: `${pendingCount} New`,
                  valueClass:
                    "rounded-full px-3 py-1 text-xs font-bold font-mono bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
                },
                {
                  label: "Active startup listings",
                  value: `${activeStartupsCount} Active`,
                  valueClass:
                    "text-sm font-semibold font-mono text-slate-900 dark:text-white",
                },
                {
                  label: "Open team roles",
                  value: `${openRolesCount} Positions`,
                  valueClass:
                    "text-sm font-semibold font-mono text-slate-900 dark:text-white",
                },
              ].map(({ label, value, valueClass }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={i}
                  className="flex items-center justify-between rounded-xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {label}
                  </span>
                  <span className={valueClass}>{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 3. COLLABORATOR BANNER
// -----------------------------------------------------------------------------
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

  return (
    <section className="py-16 transition-colors duration-300 bg-[#f0f0f8] dark:bg-[#0c0c16] font-sans">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left — Copy */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-md px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-500/20"
            >
              Collaborator Hub
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
            >
              Welcome back,{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {user?.name || "Collaborator"}
              </span>
              !<br />
              Discover your next big project.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
            >
              Explore early-stage startup ideas, filter open positions by tech
              stack or role type, and track your application status in real
              time.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/dashboard/collaborator/browse-opportunities"
                  className="inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white bg-emerald-600 shadow-md shadow-emerald-600/20 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
                >
                  Explore startups
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/dashboard/collaborator/my-applications"
                  className="inline-block rounded-xl border px-6 py-3 text-sm font-semibold border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-slate-800 transition-colors"
                >
                  Track my applications
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right — Activity Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            className="rounded-2xl border p-6 border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1a1a2e]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Your activity
            </p>

            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Active applications",
                  value: `${pendingCount} Pending`,
                  valueClass:
                    "rounded-full px-3 py-1 text-xs font-bold font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                },
                {
                  label: "Profile completeness",
                  value: "85%",
                  valueClass:
                    "text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "Team invites",
                  value: "1 New invite",
                  valueClass:
                    "text-sm font-semibold font-mono text-slate-900 dark:text-white",
                },
              ].map(({ label, value, valueClass }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={i}
                  className="flex items-center justify-between rounded-xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {label}
                  </span>
                  <span className={valueClass}>{value}</span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-3 rounded-xl border px-4 py-3.5 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Profile strength
                </span>
                <span className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                  85%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 4. ADMIN BANNER
// -----------------------------------------------------------------------------
const AdminBanner = ({
  user,
  userData = [],
  startups = [],
  opportunities = [],
}) => {
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
    <section className="py-12 transition-colors duration-300 border-b border-slate-200 bg-[#f0f0f8] dark:border-slate-800 dark:bg-[#0c0c16] font-sans">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        {/* Top row */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-start"
        >
          <div>
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-md px-2.5 py-1 text-xs font-bold font-mono uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
            >
              Admin Console
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              System administration &amp; platform health
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-1.5 text-sm text-slate-500 dark:text-slate-400"
            >
              Manage user accounts, review flagged startup pitches, and monitor
              platform activity.
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="flex flex-shrink-0 flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard/admin/users"
                className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 transition-colors"
              >
                Manage users
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard/admin/startups"
                className="inline-block rounded-xl border px-5 py-2.5 text-sm font-semibold border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-500 dark:hover:bg-slate-800 transition-colors"
              >
                Moderate startups
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stat chips */}
        <div className="mt-8 flex flex-wrap gap-3 font-mono">
          {[
            {
              label: "Total users",
              value: usersList.length || "3,412",
              alert: false,
            },
            {
              label: "Active startups",
              value: startupsList.length || "502",
              alert: false,
            },
            {
              label: "Pending reviews",
              value: pendingStartups || "7",
              alert: pendingStartups > 0,
            },
            {
              label: "Open roles",
              value: oppsList.length || "1,140",
              alert: false,
            },
          ].map(({ label, value, alert }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i}
              whileHover={{ y: -2 }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                alert
                  ? "border-rose-200 bg-rose-50 dark:border-rose-500/25 dark:bg-rose-500/10"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1a1a2e]"
              }`}
            >
              <span
                className={`text-xs ${
                  alert
                    ? "text-rose-500 dark:text-rose-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {label}
              </span>
              <span
                className={`text-sm font-bold ${
                  alert
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// MAIN CLIENT COMPONENT
// -----------------------------------------------------------------------------
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
  const activeRole = overrideRole || user?.role;

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
