"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Sparkles,
  User,
  ArrowRight,
} from "lucide-react";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

// Helper to normalize skills whether stored as a comma-separated string or an array
function parseSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export default function StartupDetails({
  startups,
  opportunities = [],
  userData = [],
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    portfolioLink: "",
    motivationMessage: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // 1. Safely Extract Startup Document
  const startup = useMemo(() => {
    if (!startups) return null;
    if (Array.isArray(startups)) return startups[0] || null;
    if (startups?.data) {
      return Array.isArray(startups.data) ? startups.data[0] : startups.data;
    }
    return startups;
  }, [startups]);

  // 2. Parse Related Datasets
  const opportunitiesList = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );
  const usersList = useMemo(
    () => parseArrayData(userData, "userData"),
    [userData],
  );

  // 3. Match Founder Profile from userData
  const founder = useMemo(() => {
    if (!startup) return null;
    const founderEmail = (startup.founder_email || "").toLowerCase();
    const startupId = String(startup.startupId || startup._id || "");

    return (
      usersList.find(
        (u) =>
          (u.email && u.email.toLowerCase() === founderEmail) ||
          String(u._id || u.id) === startupId,
      ) || null
    );
  }, [startup, usersList]);

  // 4. Match and Filter Opportunities for this Startup
  const startupRoles = useMemo(() => {
    if (!startup) return [];
    const sId = String(startup._id || startup.id || "");
    const customStartupId = String(startup.startupId || "");
    const sName = String(startup.startup_name || "").toLowerCase();

    return opportunitiesList.filter((opp) => {
      const oppStartupId = String(opp.startupId || "");
      const oppStartupName = String(opp.startupName || "").toLowerCase();

      return (
        (oppStartupId &&
          (oppStartupId === sId || oppStartupId === customStartupId)) ||
        (oppStartupName && sName && oppStartupName === sName)
      );
    });
  }, [startup, opportunitiesList]);

  const handleApply = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate application dispatch
    setTimeout(() => {
      setSubmitting(false);
      setApplicationSubmitted(true);
      setTimeout(() => {
        setApplicationSubmitted(false);
        setSelectedRole(null);
        setApplicationForm({ portfolioLink: "", motivationMessage: "" });
      }, 2000);
    }, 800);
  };

  if (!startup) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Startup Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested startup profile could not be located.
        </p>
        <Link
          href="/startups"
          className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 transition-colors"
        >
          ← Back to All Startups
        </Link>
      </div>
    );
  }

  const startupName = startup.startup_name || "Untitled Startup";
  const fundingStage = startup.funding_stage || "Seed Stage";
  const industry = startup.industry || "Technology";
  const founderName =
    founder?.name || startup.founder_email?.split("@")[0] || "Founder";
  const founderEmail = startup.founder_email || founder?.email || "N/A";
  const founderAvatar =
    founder?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
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
            <div className="flex items-start sm:items-center space-x-5">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startupName}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800 shadow-md shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold flex items-center justify-center text-3xl shadow-md shrink-0">
                  {startupName[0]}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                    {startupName}
                  </h1>
                  <span className="rounded-md bg-violet-100 px-2.5 py-1 text-xs font-mono font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {fundingStage}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Industry:{" "}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {industry}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Founder:{" "}
                    <strong className="text-slate-700 dark:text-slate-200 capitalize">
                      {founderName}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Status:{" "}
                    <strong className="text-emerald-500 dark:text-emerald-400">
                      {startup.status || "Active"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("roles")}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 dark:hover:bg-violet-500 cursor-pointer self-start md:self-auto shrink-0"
            >
              View Open Roles ({startupRoles.length})
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          TAB NAVIGATION & CONTENT
      ----------------------------------------------------------------------------- */}
      <section className="container mx-auto px-6 py-10 lg:px-12">
        {/* Navigation Tabs */}
        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: "overview", label: "Overview & Description" },
            {
              id: "roles",
              label: `Open Roles (${startupRoles.length})`,
            },
            { id: "team", label: "Founder & Team" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative space-x-6 pb-3 text-sm font-bold transition-colors cursor-pointer ${
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
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      About the Startup
                    </h2>
                    <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                      {startup.description ||
                        "No detailed description provided."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Mission & Objective
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {startupName} is currently operating in the{" "}
                      <strong>{industry}</strong> space at the{" "}
                      <strong>{fundingStage}</strong> level, actively seeking
                      dedicated collaborators and team members to expand
                      platform capabilities.
                    </p>
                  </div>
                </div>

                {/* Sidebar Founder Summary Card */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Founder Profile
                    </h3>
                    <div className="mt-4 flex items-center space-x-3">
                      <img
                        src={founderAvatar}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/20"
                        alt={founderName}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate capitalize">
                          {founderName}
                        </p>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                          {founderEmail}
                        </p>
                      </div>
                    </div>

                    {founder?.bio && (
                      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {founder.bio}
                      </p>
                    )}
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
                {startupRoles.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 italic text-sm">
                    No open opportunity roles posted for this startup right now.
                  </div>
                ) : (
                  startupRoles.map((role) => {
                    const roleId = String(role._id || role.id);
                    const skillsList = parseSkills(role.requiredSkills);

                    return (
                      <motion.div
                        key={roleId}
                        whileHover={{ x: 4 }}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center gap-4 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono">
                              {role.workType || "Remote"}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {role.commitmentLevel || "Contract"}
                            </span>
                            {role.deadline && (
                              <span className="text-[11px] font-mono text-slate-400">
                                • Deadline: {role.deadline}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            {role.roleTitle}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {skillsList.map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-2 md:mt-0 flex items-center md:flex-col md:items-end gap-3 shrink-0">
                          <button
                            onClick={() => setSelectedRole(role)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-md shadow-violet-600/15 cursor-pointer"
                          >
                            <span>Apply for Role</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
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
                <div className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                  <img
                    src={founderAvatar}
                    alt={founderName}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white capitalize truncate">
                      {founderName}
                    </h4>
                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                      Founder & Creator
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {founderEmail}
                    </p>
                  </div>
                </div>
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
                Apply for {selectedRole.roleTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Submit your pitch to @{startupName}
              </p>

              {applicationSubmitted ? (
                <div className="my-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
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
                      Portfolio / GitHub / Website Link
                    </label>
                    <input
                      type="url"
                      required
                      value={applicationForm.portfolioLink}
                      onChange={(e) =>
                        setApplicationForm({
                          ...applicationForm,
                          portfolioLink: e.target.value,
                        })
                      }
                      placeholder="https://yourportfolio.com"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Why are you a great fit for this role?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={applicationForm.motivationMessage}
                      onChange={(e) =>
                        setApplicationForm({
                          ...applicationForm,
                          motivationMessage: e.target.value,
                        })
                      }
                      placeholder="Highlight your experience, background, and what you will build..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setSelectedRole(null)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
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
}
