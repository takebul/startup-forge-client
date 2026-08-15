"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  ArrowRight,
  RotateCcw,
  Calendar,
  Building2,
  Clock,
  XCircle,
} from "lucide-react";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

// Helper to normalize skills whether stored as an array or a comma-separated string
function parseSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string" && skills.trim()) {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

// Helper for human-readable dates
const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "Open Deadline";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper to check if a deadline has expired
function checkIsDeadlinePassed(deadlineStr) {
  if (!deadlineStr || deadlineStr === "N/A") return false;
  const deadlineDate = new Date(deadlineStr);
  if (isNaN(deadlineDate.getTime())) return false;
  deadlineDate.setHours(23, 59, 59, 999);
  return new Date() > deadlineDate;
}

export default function OpportunitiesPage({
  opportunities = [],
  startups = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // 1. Safely Parse Incoming Live Datasets
  const rawOpportunities = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );
  const rawStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );

  // 2. Associate Opportunities with Startup details (e.g., industry, logo)
  const enrichedOpportunities = useMemo(() => {
    return rawOpportunities.map((opp) => {
      const oppStartupId = String(opp.startupId || "");
      const oppStartupName = String(opp.startupName || "")
        .toLowerCase()
        .trim();

      const matchedStartup = rawStartups.find((s) => {
        const sId = String(s._id || s.id || "");
        const customId = String(s.startupId || "");
        const sName = String(s.startup_name || s.name || "")
          .toLowerCase()
          .trim();

        return (
          (oppStartupId &&
            (sId === oppStartupId || customId === oppStartupId)) ||
          (oppStartupName && sName === oppStartupName)
        );
      });

      return {
        ...opp,
        resolvedStartupName:
          matchedStartup?.startup_name || opp.startupName || "Startup Team",
        resolvedStartupId:
          matchedStartup?._id || matchedStartup?.id || opp.startupId || "",
        resolvedIndustry: matchedStartup?.industry || "Technology",
        parsedSkillsList: parseSkills(
          opp.requiredSkills || opp.required_skills,
        ),
        isExpired: checkIsDeadlinePassed(opp.deadline),
      };
    });
  }, [rawOpportunities, rawStartups]);

  // 3. Dynamically Extract Filter Dropdown Options
  const workTypes = useMemo(() => {
    const list = enrichedOpportunities
      .map((item) => item.workType || item.work_type)
      .filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [enrichedOpportunities]);

  const industries = useMemo(() => {
    const list = enrichedOpportunities
      .map((item) => item.resolvedIndustry)
      .filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [enrichedOpportunities]);

  // 4. Search, Filter, and Sort Opportunities
  const filteredOpportunities = useMemo(() => {
    let result = enrichedOpportunities.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const roleTitle = String(
        item.roleTitle || item.role_title || "",
      ).toLowerCase();
      const startupName = String(item.resolvedStartupName || "").toLowerCase();
      const skills = item.parsedSkillsList.map((s) => s.toLowerCase());

      const matchesSearch =
        search === "" ||
        roleTitle.includes(search) ||
        startupName.includes(search) ||
        skills.some((sk) => sk.includes(search));

      const workType = item.workType || item.work_type;
      const matchesWorkType =
        selectedWorkType === "All" || workType === selectedWorkType;

      const matchesIndustry =
        selectedIndustry === "All" ||
        item.resolvedIndustry === selectedIndustry;

      return matchesSearch && matchesWorkType && matchesIndustry;
    });

    // Apply Sorting
    if (sortBy === "deadline") {
      result.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === "title") {
      result.sort((a, b) =>
        String(a.roleTitle || a.role_title || "").localeCompare(
          String(b.roleTitle || b.role_title || ""),
        ),
      );
    }

    return result;
  }, [
    enrichedOpportunities,
    searchTerm,
    selectedWorkType,
    selectedIndustry,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedWorkType !== "All" ||
    selectedIndustry !== "All";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedWorkType("All");
    setSelectedIndustry("All");
    setSortBy("default");
  };

  return (
    <section className="min-h-screen bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Open Positions
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Explore Opportunities
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Find roles matching your exact skills. Join ambitious startup teams
            as a developer, designer, marketer, or co-founder.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input (Role Title, Startup, or Skills) */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by role title, startup, or skills (e.g. React, Python, Figma)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-violet-500"
              />
            </div>

            {/* Filters Group */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Work Type Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Work Type:
                </label>
                <select
                  value={selectedWorkType}
                  onChange={(e) => setSelectedWorkType(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {workTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Industry:
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {industries.map((ind, index) => (
                    <option key={index} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Sort:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="default">Default</option>
                  <option value="deadline">Closest Deadline</option>
                  <option value="title">Role Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Active Filters:
                </span>
                {searchTerm && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    "{searchTerm}"
                  </span>
                )}
                {selectedWorkType !== "All" && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    Type: {selectedWorkType}
                  </span>
                )}
                {selectedIndustry !== "All" && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    Industry: {selectedIndustry}
                  </span>
                )}
              </div>

              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition-colors hover:underline dark:text-rose-400 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Opportunities Grid */}
        <AnimatePresence mode="wait">
          {filteredOpportunities.length > 0 ? (
            <motion.div
              layout
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredOpportunities.map((item, idx) => {
                const oppId = String(item._id || item.id || idx);
                const roleTitle =
                  item.roleTitle || item.role_title || "Untitled Role";
                const workType = item.workType || item.work_type || "Remote";
                const commitmentLevel =
                  item.commitmentLevel || item.commitment_level || "Contract";
                const deadlineFormatted = formatDate(item.deadline);

                return (
                  <motion.div
                    key={oppId}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-violet-500/50"
                  >
                    <div>
                      {/* Header Tags: Work Type & Commitment */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-mono font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          {workType}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {commitmentLevel}
                          </span>
                          {item.isExpired && (
                            <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-500/20">
                              Closed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Role Title & Startup Name */}
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 line-clamp-1">
                          {roleTitle}
                        </h3>
                        {item.resolvedStartupId ? (
                          <Link
                            href={`/startups/${item.resolvedStartupId}`}
                            className="inline-block text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400 mt-0.5 truncate max-w-full"
                          >
                            @{item.resolvedStartupName}
                          </Link>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate block">
                            @{item.resolvedStartupName}
                          </span>
                        )}
                      </div>

                      {/* Required Skills Badges */}
                      <div className="mt-5">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                          Required Skills
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5 min-h-[52px]">
                          {item.parsedSkillsList.length > 0 ? (
                            item.parsedSkillsList.map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Skills described in role details
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Application Deadline & Action */}
                    <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                            Apply By
                          </p>
                          <p
                            className={`text-xs font-bold font-mono ${
                              item.isExpired
                                ? "text-red-500"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {deadlineFormatted}
                          </p>
                        </div>

                        <Link
                          href={`/opportunities/${oppId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                        >
                          <span>
                            {item.isExpired ? "View Details" : "Apply Now"}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800"
            >
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No opportunities match your search filters.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try searching for a different skill or reset your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 cursor-pointer"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
