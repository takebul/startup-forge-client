"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Sparkles, Calendar } from "lucide-react";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

// Helper to normalize and parse skills into an array of strings
function parseSkills(skillsData) {
  if (!skillsData) return [];
  if (Array.isArray(skillsData)) {
    return skillsData.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof skillsData === "string") {
    return skillsData
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

// Helper to format readable dates
const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "Open";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Check if deadline has passed
const isDeadlinePassed = (dateString) => {
  if (!dateString || dateString === "N/A") return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

// Work type badge styling helper
const getWorkTypeBadgeStyle = (workType = "") => {
  const type = workType.toLowerCase();
  if (type.includes("remote")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (type.includes("hybrid")) {
    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";
  }
  return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300";
};

const FeaturedOpportunities = ({
  featuredOpportunities = [],
  startups = [],
}) => {
  // 1. Safely Parse Input Datasets
  const rawOpportunities = useMemo(
    () => parseArrayData(featuredOpportunities, "featuredOpportunities"),
    [featuredOpportunities],
  );
  const rawStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );

  // 2. Build Fast Startup Lookup Map
  const startupLookup = useMemo(() => {
    const map = new Map();
    rawStartups.forEach((s) => {
      if (s._id) map.set(String(s._id), s);
      if (s.id) map.set(String(s.id), s);
      if (s.startupId) map.set(String(s.startupId), s);
      if (s.startup_name) map.set(String(s.startup_name).toLowerCase(), s);
    });
    return map;
  }, [rawStartups]);

  // 3. Normalize Opportunities Data
  const opportunities = useMemo(() => {
    return rawOpportunities.map((opp, idx) => {
      const oppId = String(opp._id || opp.id || idx);
      const targetStartupId = String(opp.startupId || opp.startup_id || "");
      const targetStartupName = String(opp.startupName || opp.startup_name || "");

      // Resolve linked startup for metadata
      const matchedStartup =
        startupLookup.get(targetStartupId) ||
        startupLookup.get(targetStartupName.toLowerCase());

      const finalStartupName =
        matchedStartup?.startup_name || targetStartupName || "Venture";
      const finalLogo = matchedStartup?.logo || opp.logo || null;
      const finalDeadline = opp.deadline || opp.application_deadline || "N/A";

      return {
        oppId,
        roleTitle: opp.role_title || opp.title || "Collaborator",
        startupName: finalStartupName,
        startupId: matchedStartup?._id || matchedStartup?.id || targetStartupId,
        logo: finalLogo,
        skills: parseSkills(opp.skills_required || opp.skills || []),
        commitment: opp.commitment || "Part-time",
        workType: opp.work_type || opp.workType || "Remote",
        deadline: finalDeadline,
        expired: isDeadlinePassed(finalDeadline),
      };
    });
  }, [rawOpportunities, startupLookup]);

  return (
    <section className="relative overflow-hidden py-10 md:py-12 lg:py-14 text-slate-900 transition-colors duration-300 dark:text-slate-100 font-sans">
      <div className="container relative mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Section Header with Motion Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2"
        >
          <div className="max-w-2xl text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <span>Open Collaborative Roles</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
                Opportunities
              </span>
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed">
              Find your next collaborative role. Join early-stage teams as an
              engineer, designer, or growth specialist and build groundbreaking
              ventures together.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 group shrink-0 pb-1"
          >
            <span>Explore All Roles ({opportunities.length})</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Opportunities Grid */}
        {opportunities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto mt-8 max-w-xl rounded-3xl border border-slate-200/90 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-200">
              No Featured Roles Available
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check back soon or explore our full catalog of active startup roles.
            </p>
            <div className="mt-6">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/20 hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
              >
                <span>Browse All Roles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="mt-8 md:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.slice(0, 5).map((item, idx) => {
              const roleTitle =
                item.roleTitle || item.role_title || item.title || "Collaborator Role";
              const workTypeBadgeStyle = getWorkTypeBadgeStyle(item.workType);

              return (
                <motion.div
                  key={item.oppId}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-violet-500/40 dark:hover:shadow-2xl dark:hover:shadow-violet-500/10"
                >
                  <div>
                    {/* Header Tags: Work Type & Commitment */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-mono font-semibold transition-colors ${workTypeBadgeStyle}`}
                      >
                        {item.workType}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                          {item.commitment}
                        </span>
                        {item.expired && (
                          <span className="rounded-full border border-red-500/20 bg-red-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Title & Startup Info */}
                    <div className="mt-4">
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 line-clamp-1">
                        {roleTitle}
                      </h3>

                      {/* Startup Identity / Link */}
                      <div className="mt-2 flex items-center gap-2">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.startupName}
                            className="h-5 w-5 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-violet-100 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:ring-violet-800/60 shrink-0">
                            {item.startupName[0]?.toUpperCase() || "S"}
                          </div>
                        )}

                        {item.startupId ? (
                          <Link
                            href={`/startups/${item.startupId}`}
                            className="text-xs font-semibold text-slate-600 transition-colors hover:text-violet-600 hover:underline dark:text-slate-400 dark:hover:text-violet-400 truncate max-w-[200px]"
                          >
                            @{item.startupName}
                          </Link>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                            @{item.startupName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Required Skills Badges */}
                    <div className="mt-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                        Required Skills
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 min-h-[52px]">
                        {item.skills.length > 0 ? (
                          <>
                            {item.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-700 transition-colors group-hover:border-violet-200 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:group-hover:border-violet-500/30"
                              >
                                {skill}
                              </span>
                            ))}
                            {item.skills.length > 3 && (
                              <span className="rounded-xl border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                +{item.skills.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs italic text-slate-400 dark:text-slate-500 self-center">
                            Role details outline skills
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Application Deadline & Action */}
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 font-mono">
                          <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-400" />
                          <span>Deadline</span>
                        </div>
                        <p className="mt-0.5 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                          {formatDate(item.deadline)}
                        </p>
                      </div>

                      <Link
                        href={`/opportunities/${item.oppId}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
                      >
                        <span>Apply</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* 6th Card: Explore All Opportunities CTA Card with Motion */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 5 * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Link
                href="/opportunities"
                className="group flex h-full flex-col justify-between rounded-3xl border-2 border-dashed border-violet-300/80 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-white p-7 shadow-sm transition-all duration-300 hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-600/40 dark:from-violet-950/40 dark:via-purple-950/20 dark:to-slate-900/90 dark:hover:border-violet-400 dark:hover:shadow-violet-500/20 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/25 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <span className="rounded-full border border-violet-300/80 bg-violet-100/90 px-3 py-1 text-xs font-mono font-bold text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-300">
                      All Roles
                    </span>
                  </div>

                  <div className="mt-7">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 transition-colors">
                      Explore All Opportunities
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Browse open engineering, design, marketing, and product positions across all high-growth startups.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-violet-200/60 dark:border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between font-bold text-xs text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
                    <span>View All Active Roles</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white shadow-xs group-hover:bg-violet-700">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* View All Opportunities Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 md:mt-12 text-center"
        >
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-violet-400 hover:bg-slate-50 hover:text-violet-600 hover:-translate-y-0.5 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-900 dark:hover:text-violet-300"
          >
            <span>Explore All Opportunities</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
