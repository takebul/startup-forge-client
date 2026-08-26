"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  ArrowRight,
  RotateCcw,
  Building2,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

export default function StartupsPage({ startups = [], opportunities = [] }) {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // 1. Safely Parse Live Datasets
  const rawStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );
  const rawOpportunities = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );

  // 2. Filter Active & Approved Startups
  const approvedStartups = useMemo(() => {
    return rawStartups.filter((item) => {
      const status = String(item.status || "").toLowerCase();
      return (
        status === "approved" || status === "active" || item.status === true
      );
    });
  }, [rawStartups]);

  // 3. Helper to Count Active Opportunities per Startup
  const getOpenRolesCount = (startupItem) => {
    const sId = String(startupItem._id || startupItem.id || "");
    const customId = String(startupItem.startupId || "");
    const sName = String(startupItem.startup_name || "")
      .toLowerCase()
      .trim();

    return rawOpportunities.filter((opp) => {
      const oppStartupId = String(opp.startupId || "");
      const oppStartupName = String(opp.startupName || "")
        .toLowerCase()
        .trim();

      return (
        (oppStartupId && (oppStartupId === sId || oppStartupId === customId)) ||
        (oppStartupName && sName && oppStartupName === sName)
      );
    }).length;
  };

  // 4. Extract Dynamic Filter Options from Live Data
  const industries = useMemo(() => {
    const list = approvedStartups.map((item) => item.industry).filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [approvedStartups]);

  const fundingStages = useMemo(() => {
    const list = approvedStartups
      .map((item) => item.funding_stage)
      .filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [approvedStartups]);

  // 5. Search, Filter, and Sort
  const filteredStartups = useMemo(() => {
    let result = approvedStartups.filter((startup) => {
      const name = String(startup.startup_name || "").toLowerCase();
      const desc = String(startup.description || "").toLowerCase();
      const founder = String(
        startup.founder_name || startup.founder_email || "",
      ).toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        search === "" ||
        name.includes(search) ||
        desc.includes(search) ||
        founder.includes(search);

      const matchesIndustry =
        selectedIndustry === "All" || startup.industry === selectedIndustry;

      const matchesStage =
        selectedStage === "All" || startup.funding_stage === selectedStage;

      return matchesSearch && matchesIndustry && matchesStage;
    });

    // Apply Sorting
    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.startup_name || "").localeCompare(
          String(b.startup_name || ""),
        ),
      );
    } else if (sortBy === "roles") {
      result.sort((a, b) => getOpenRolesCount(b) - getOpenRolesCount(a));
    }

    return result;
  }, [
    approvedStartups,
    searchTerm,
    selectedIndustry,
    selectedStage,
    sortBy,
    rawOpportunities,
  ]);

  const hasActiveFilters =
    searchTerm !== "" || selectedIndustry !== "All" || selectedStage !== "All";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("All");
    setSelectedStage("All");
    setSortBy("default");
  };

  return (
    <section className="min-h-screen bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Directory & Recruitment
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Explore Active Startups
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Browse early-stage startup ideas looking for developers, designers,
            and marketers to build their core teams.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by startup name, founder, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-violet-500 [color-scheme:light] dark:[color-scheme:dark]"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Industry Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Industry:
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:focus:bg-slate-950 dark:focus:border-violet-500 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                >
                  {industries.map((ind, index) => (
                    <option key={index} value={ind} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Stage:
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:focus:bg-slate-950 dark:focus:border-violet-500 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                >
                  {fundingStages.map((stage, index) => (
                    <option key={index} value={stage} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {stage}
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:focus:bg-slate-950 dark:focus:border-violet-500 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                >
                  <option value="default" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Default</option>
                  <option value="name" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Name (A-Z)</option>
                  <option value="roles" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Most Open Roles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Indicator */}
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
                {selectedIndustry !== "All" && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    Industry: {selectedIndustry}
                  </span>
                )}
                {selectedStage !== "All" && (
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    Stage: {selectedStage}
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

        {/* Startups Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredStartups.length > 0 ? (
            <motion.div
              layout
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredStartups.map((startup, idx) => {
                const startupId = String(startup._id || startup.id || idx);
                const startupName = startup.startup_name || "Untitled Startup";
                const openRolesCount = getOpenRolesCount(startup);
                const founderDisplay =
                  startup.founder_name ||
                  (startup.founder_email
                    ? startup.founder_email.split("@")[0]
                    : "Founder");
                const startupFounderEmail = String(
                  startup.founder_email || startup.founderEmail || "",
                )
                  .toLowerCase()
                  .trim();
                const userEmail = String(currentUser?.email || "")
                  .toLowerCase()
                  .trim();
                const userId = String(currentUser?.id || currentUser?._id || "");
                const sOwnerId = String(startup.startupId || startup.userId || "");
                const sDocId = String(startup._id || startup.id || "");

                const isOwnStartup = Boolean(
                  currentUser && (
                    (userEmail && startupFounderEmail && startupFounderEmail === userEmail) ||
                    (userId && (sOwnerId === userId || sDocId === userId))
                  )
                );

                return (
                  <motion.div
                    key={startupId}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-violet-500/50"
                  >
                    <div>
                      {/* Card Header: Logo & Funding Stage / Own Startup Badge */}
                      <div className="flex items-start justify-between gap-4">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={`${startupName} Logo`}
                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold flex items-center justify-center text-xl shrink-0">
                            {startupName[0]}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {isOwnStartup && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 shadow-xs dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Own Startup
                            </span>
                          )}
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {startup.funding_stage || "Early Stage"}
                          </span>
                        </div>
                      </div>

                      {/* Startup Name & Founder */}
                      <div className="mt-5">
                        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                          {startupName}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                          Founded by{" "}
                          <span className="text-slate-700 dark:text-slate-200">
                            {founderDisplay}
                          </span>
                        </p>
                      </div>

                      {/* Industry Badge */}
                      <div className="mt-3">
                        <span className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                          {startup.industry || "General"}
                        </span>
                      </div>

                      {/* Pitch Description */}
                      <p className="mt-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {startup.description || "No description provided."}
                      </p>
                    </div>

                    {/* Card Footer: Open Roles & Action */}
                    <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                            Open Roles
                          </p>
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            <Briefcase className="w-3.5 h-3.5 text-violet-500" />
                            <span>
                              {openRolesCount}{" "}
                              {openRolesCount === 1 ? "Position" : "Positions"}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/startups/${startupId}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-md shadow-violet-600/15"
                        >
                          <span>View Startup</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Empty Search State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800"
            >
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No startups found matching your criteria.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search terms or resetting the selected
                filters.
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
