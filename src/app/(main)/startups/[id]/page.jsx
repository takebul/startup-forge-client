"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// Mock server data for a single startup
const STARTUP_DATA = {
  id: "start-101",
  startup_name: "NexusAI",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  industry: "Artificial Intelligence",
  funding_stage: "Seed",
  status: "active",
  founder_name: "Sarah Chen",
  founder_email: "sarah@nexusai.io",
  founder_avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  tagline: "Autonomous AI Agents for Enterprise Workflow Automation",
  description:
    "NexusAI is building next-generation multi-agent systems designed to autonomously execute complex operational workflows across enterprise software suites. We are backed by early-stage tech investors and are actively expanding our core team.",
  problem_statement:
    "Enterprise teams waste thousands of hours manually copying data, managing routine approvals, and coordinating across fragmented SaaS tools. Current automation tools are brittle and break easily.",
  solution_overview:
    "NexusAI deploys fine-tuned AI agents that learn workflow logic, handle edge cases autonomously, and integrate via secure API endpoints.",
  open_roles: [
    {
      id: "role-1",
      title: "Senior Lead Frontend Engineer",
      type: "Remote",
      commitment: "Full-Time (40 hrs/wk)",
      skills: ["React", "Next.js", "Tailwind CSS", "Motion"],
      compensation: "Equity + Salary",
    },
    {
      id: "role-2",
      title: "UI/UX Product Designer",
      type: "Remote / Hybrid",
      commitment: "Part-Time (15-20 hrs/wk)",
      skills: ["Figma", "Design Systems", "User Research"],
      compensation: "Equity Share",
    },
  ],
  team_members: [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Alex Rivera",
      role: "Founding Engineer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  ],
};

const StartupDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setApplicationSubmitted(false);
      setSelectedRole(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* -----------------------------------------------------------------------------
          HERO BANNER SECTION
      ----------------------------------------------------------------------------- */}
      <section className="relative border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back Navigation */}
          <Link
            href="/startups"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400"
          >
            <span>← Back to All Startups</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center space-x-5">
              <img
                src={STARTUP_DATA.logo}
                alt={STARTUP_DATA.startup_name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800 shadow-md"
              />
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                    {STARTUP_DATA.startup_name}
                  </h1>
                  <span className="rounded-md bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {STARTUP_DATA.funding_stage}
                  </span>
                </div>
                <p className="mt-1 text-base font-medium text-slate-600 dark:text-slate-300">
                  {STARTUP_DATA.tagline}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Industry: <strong>{STARTUP_DATA.industry}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Founder: <strong>{STARTUP_DATA.founder_name}</strong>
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("roles")}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 dark:hover:bg-violet-500"
            >
              View Open Roles ({STARTUP_DATA.open_roles.length})
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          TAB NAVIGATION & CONTENT
      ----------------------------------------------------------------------------- */}
      <section className="container mx-auto px-6 py-10 lg:px-12">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: "overview", label: "Overview & Pitch" },
            {
              id: "roles",
              label: `Open Roles (${STARTUP_DATA.open_roles.length})`,
            },
            { id: "team", label: "Team Members" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid gap-8 lg:grid-cols-3"
              >
                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      About the Startup
                    </h2>
                    <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                      {STARTUP_DATA.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      The Problem
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {STARTUP_DATA.problem_statement}
                    </p>
                    <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
                      The Solution
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {STARTUP_DATA.solution_overview}
                    </p>
                  </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Founder Details
                    </h3>
                    <div className="mt-4 flex items-center space-x-3">
                      <img
                        src={STARTUP_DATA.founder_avatar}
                        className="h-12 w-12 rounded-full object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {STARTUP_DATA.founder_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {STARTUP_DATA.founder_email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* OPEN ROLES TAB */}
            {activeTab === "roles" && (
              <motion.div
                key="roles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {STARTUP_DATA.open_roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ x: 4 }}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center"
                  >
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          {role.type}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {role.commitment}
                        </span>
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                        {role.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {role.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between md:mt-0 md:flex-col md:items-end md:space-y-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {role.compensation}
                      </span>
                      <button
                        onClick={() => setSelectedRole(role)}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
                      >
                        Apply for Role
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* TEAM MEMBERS TAB */}
            {activeTab === "team" && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {STARTUP_DATA.team_members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          APPLICATION MODAL WITH MOTION
      ----------------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRole(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Apply for {selectedRole.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Submit your pitch to @{STARTUP_DATA.startup_name}
              </p>

              {applicationSubmitted ? (
                <div className="my-8 text-center">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Application Sent Successfully!
                  </p>
                  <p className="text-xs text-slate-500">
                    The founder will review your application shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Why are you a fit for this team?
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Highlight relevant experience or projects..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartupDetailsPage;
