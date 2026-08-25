"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@heroui/react";

// Helper parser to safely extract array data
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

// Helper to normalize skills array
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

// Helper to check if deadline has expired
function checkIsDeadlinePassed(deadlineStr) {
  if (!deadlineStr || deadlineStr === "N/A" || deadlineStr === "Open") {
    return false;
  }
  const deadlineDate = new Date(deadlineStr);
  if (isNaN(deadlineDate.getTime())) return false;
  deadlineDate.setHours(23, 59, 59, 999);
  return new Date() > deadlineDate;
}

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

export default function OpportunitiesPage({
  opportunities = {},
  startups = [],
  currentPage = 1,
  pageSize = 9,
  totalData,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read active filter values from URL search parameters
  const urlSearch = searchParams.get("search") || "";
  const urlWorkType = searchParams.get("workType") || "All";
  const urlIndustry = searchParams.get("industry") || "All";
  const currentLimit =
    Number(searchParams.get("limit")) || Number(pageSize) || 9;

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // 1. Resolve Pagination Bounds
  const rawDataList =
    opportunities?.data ||
    opportunities?.opportunities ||
    opportunities?.result ||
    opportunities;

  const activePage = Number(opportunities?.page) || Number(currentPage) || 1;

  const totalItems =
    totalData ??
    opportunities?.total_data ??
    opportunities?.totalData ??
    opportunities?.totalCount ??
    (Array.isArray(rawDataList) ? rawDataList.length : 0);

  const totalPages =
    opportunities?.total_page ||
    opportunities?.totalPages ||
    (totalItems > 0 ? Math.ceil(totalItems / currentLimit) : 1);

  // 2. Parse Incoming Datasets
  const rawOpportunities = useMemo(
    () => parseArrayData(rawDataList, "data"),
    [rawDataList],
  );
  const rawStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );

  // 3. Associate Opportunities with Startup Details
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
        logo: matchedStartup?.logo || opp.logo || null,
        resolvedIndustry:
          matchedStartup?.industry || opp.industry || "Technology",
        parsedSkillsList: parseSkills(
          opp.requiredSkills || opp.required_skills,
        ),
        isExpired: checkIsDeadlinePassed(opp.deadline),
      };
    });
  }, [rawOpportunities, rawStartups]);

  // 4. Dynamic Options for Filter Dropdowns
  const workTypes = ["All", "Remote", "Hybrid", "On-site"];

  const industries = useMemo(() => {
    const list = rawStartups.map((item) => item.industry).filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [rawStartups]);

  // 5. Client-Side Sorting
  const sortedOpportunities = useMemo(() => {
    let list = [...enrichedOpportunities];

    if (sortBy === "deadline") {
      list.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === "title") {
      list.sort((a, b) =>
        String(a.roleTitle || a.role_title || "").localeCompare(
          String(b.roleTitle || b.role_title || ""),
        ),
      );
    }

    return list;
  }, [enrichedOpportunities, sortBy]);

  // Centralized URL Parameter Updater
  const updateQueryParam = (updates = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All" && String(value).trim() !== "") {
        params.set(key, String(value).trim());
      } else {
        params.delete(key);
      }
    });

    if (!updates.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam({ search: searchInput });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSortBy("default");
    router.push(pathname);
  };

  const hasActiveFilters =
    urlSearch !== "" || urlWorkType !== "All" || urlIndustry !== "All";

  const startItem = totalItems === 0 ? 0 : (activePage - 1) * currentLimit + 1;
  const endItem = Math.min(activePage * currentLimit, totalItems);

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
            {/* Search Input */}
            <div className="relative flex-1">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by role title or skills (e.g. React, Python, Figma)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-violet-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-xl bg-violet-600 text-white font-semibold text-xs px-4 h-10 hover:bg-violet-700 transition-colors cursor-pointer"
                >
                  Search
                </Button>
              </form>
            </div>

            {/* Filters Group */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Work Type Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Work Type:
                </label>
                <select
                  value={urlWorkType}
                  onChange={(e) =>
                    updateQueryParam({ workType: e.target.value })
                  }
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
                  value={urlIndustry}
                  onChange={(e) =>
                    updateQueryParam({ industry: e.target.value })
                  }
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
                  <option value="default">Default (Newest)</option>
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

                {urlSearch && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    &quot;{urlSearch}&quot;
                  </span>
                )}
                {urlWorkType !== "All" && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    Type: {urlWorkType}
                  </span>
                )}
                {urlIndustry !== "All" && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    Industry: {urlIndustry}
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
          {sortedOpportunities.length > 0 ? (
            <motion.div
              layout
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {sortedOpportunities.map((item, idx) => {
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
                    className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-violet-500/40 dark:hover:shadow-2xl dark:hover:shadow-violet-500/10"
                  >
                    <div>
                      {/* Header Tags: Work Type & Commitment */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-mono font-semibold transition-colors ${getWorkTypeBadgeStyle(workType)}`}
                        >
                          {workType}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                            {commitmentLevel}
                          </span>
                          {item.isExpired && (
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
                              alt={item.resolvedStartupName}
                              className="h-5 w-5 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-violet-100 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:ring-violet-800/60 shrink-0">
                              {item.resolvedStartupName?.[0]?.toUpperCase() || "S"}
                            </div>
                          )}

                          {item.resolvedStartupId ? (
                            <Link
                              href={`/startups/${item.resolvedStartupId}`}
                              className="text-xs font-semibold text-slate-600 transition-colors hover:text-violet-600 hover:underline dark:text-slate-400 dark:hover:text-violet-400 truncate max-w-[200px]"
                            >
                              @{item.resolvedStartupName}
                            </Link>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                              @{item.resolvedStartupName}
                            </span>
                          )}

                          {item.resolvedIndustry && (
                            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 dark:text-slate-400 dark:bg-slate-800/80 dark:border-transparent px-2 py-0.5 rounded shrink-0">
                              {item.resolvedIndustry}
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
                          {item.parsedSkillsList.length > 0 ? (
                            <>
                              {item.parsedSkillsList.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-700 transition-colors group-hover:border-violet-200 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:group-hover:border-violet-500/30"
                                >
                                  {skill}
                                </span>
                              ))}
                              {item.parsedSkillsList.length > 3 && (
                                <span className="rounded-xl border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                  +{item.parsedSkillsList.length - 3}
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

                    {/* Card Footer */}
                    <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 font-mono">
                            <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-400" />
                            <span>Deadline</span>
                          </div>
                          <p className="mt-0.5 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                            {deadlineFormatted}
                          </p>
                        </div>

                        <Link
                          href={`/opportunities/${oppId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
                        >
                          <span>{item.isExpired ? "View Details" : "Apply"}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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

        {/* Full Pagination Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800">
          {/* Results Summary Counter */}
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {startItem}
            </strong>
            –
            <strong className="text-slate-800 dark:text-slate-200">
              {endItem}
            </strong>{" "}
            of{" "}
            <strong className="text-violet-600 dark:text-violet-400 font-bold">
              {totalItems}
            </strong>{" "}
            opportunities
          </p>

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
              <span>Show</span>
              <select
                value={currentLimit}
                onChange={(e) => updateQueryParam({ limit: e.target.value })}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold font-mono text-slate-800 outline-none transition-colors focus:border-violet-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer shadow-sm"
              >
                {[6, 9, 18, 27, 36].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>per page</span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQueryParam({ page: activePage - 1 })}
                  disabled={activePage <= 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => {
                      if (
                        totalPages > 7 &&
                        p !== 1 &&
                        p !== totalPages &&
                        Math.abs(p - activePage) > 1
                      ) {
                        if (Math.abs(p - activePage) === 2) {
                          return (
                            <span
                              key={p}
                              className="px-1 text-xs text-slate-400 dark:text-slate-600"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      const isActive = p === activePage;
                      return (
                        <button
                          key={p}
                          onClick={() => updateQueryParam({ page: p })}
                          className={`h-8 w-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-violet-600 text-white shadow-md shadow-violet-600/25 dark:bg-violet-600"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => updateQueryParam({ page: activePage + 1 })}
                  disabled={activePage >= totalPages}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
