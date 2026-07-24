"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const ALL_STARTUPS_DATA = [
  {
    id: "start-101",
    startup_name: "NexusAI",
    founder_name: "Sarah Chen",
    founder_email: "sarah@nexusai.io",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    industry: "Artificial Intelligence",
    description:
      "Building autonomous workflow agents to automate complex multi-step enterprise operations.",
    funding_stage: "Seed",
    team_size_needed: "3 Collaborators",
    status: "active",
  },
  {
    id: "start-102",
    startup_name: "EcoGrid",
    founder_name: "David Miller",
    founder_email: "david@ecogrid.tech",
    logo: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80",
    industry: "CleanTech",
    description:
      "Decentralized energy trading platform for micro-grids and community solar networks.",
    funding_stage: "Pre-Seed",
    team_size_needed: "5 Collaborators",
    status: "active",
  },
  {
    id: "start-103",
    startup_name: "PayPulse",
    founder_name: "Elena Rostova",
    founder_email: "elena@paypulse.fin",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80",
    industry: "FinTech",
    description:
      "Cross-border instant payroll solution designed specifically for global remote engineering teams.",
    funding_stage: "Series A",
    team_size_needed: "2 Collaborators",
    status: "active",
  },
  {
    id: "start-104",
    startup_name: "HealthSphere",
    founder_name: "Dr. Marcus Vance",
    founder_email: "marcus@healthsphere.med",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    industry: "HealthTech",
    description:
      "AI-assisted remote patient monitoring platform designed for post-surgery recovery tracking.",
    funding_stage: "Seed",
    team_size_needed: "4 Collaborators",
    status: "active",
  },
  {
    id: "start-105",
    startup_name: "DevLoom",
    founder_name: "Alex Rivera",
    founder_email: "alex@devloom.dev",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80",
    industry: "Developer Tools",
    description:
      "Cloud-native dev environment orchestration tool that reduces local setup time to seconds.",
    funding_stage: "Bootstrapped",
    team_size_needed: "3 Collaborators",
    status: "active",
  },
  {
    id: "start-106",
    startup_name: "UrbanCrop",
    founder_name: "Maya Lin",
    founder_email: "maya@urbancrop.io",
    logo: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=150&auto=format&fit=crop&q=80",
    industry: "AgriTech",
    description:
      "Automated indoor hydroponic farming systems utilizing IoT sensors for hyper-local food supply.",
    funding_stage: "Pre-Seed",
    team_size_needed: "2 Collaborators",
    status: "active",
  },
];

const StartupsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Extract unique industries and funding stages dynamically
  const industries = useMemo(
    () => ["All", ...new Set(ALL_STARTUPS_DATA.map((item) => item.industry))],
    [],
  );

  const fundingStages = useMemo(
    () => [
      "All",
      ...new Set(ALL_STARTUPS_DATA.map((item) => item.funding_stage)),
    ],
    [],
  );

  // Filter and sort startups
  const filteredStartups = useMemo(() => {
    let result = ALL_STARTUPS_DATA.filter((startup) => {
      const matchesSearch =
        startup.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.founder_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry =
        selectedIndustry === "All" || startup.industry === selectedIndustry;

      const matchesStage =
        selectedStage === "All" || startup.funding_stage === selectedStage;

      return (
        startup.status === "active" &&
        matchesSearch &&
        matchesIndustry &&
        matchesStage
      );
    });

    // Apply sorting logic
    if (sortBy === "name") {
      result.sort((a, b) => a.startup_name.localeCompare(b.startup_name));
    } else if (sortBy === "team") {
      result.sort(
        (a, b) => parseInt(b.team_size_needed) - parseInt(a.team_size_needed),
      );
    }

    return result;
  }, [searchTerm, selectedIndustry, selectedStage, sortBy]);

  const hasActiveFilters =
    searchTerm !== "" || selectedIndustry !== "All" || selectedStage !== "All";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("All");
    setSelectedStage("All");
    setSortBy("default");
  };

  return (
    <section className="min-h-screen bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
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
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by startup name, founder, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-violet-500"
              />
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {industries.map((ind, index) => (
                    <option key={index} value={ind}>
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {fundingStages.map((stage, index) => (
                    <option key={index} value={stage}>
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="default">Default</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="team">Most Collaborators Needed</option>
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
                className="text-xs font-semibold text-rose-600 transition-colors hover:underline dark:text-rose-400"
              >
                Clear All
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
              {filteredStartups.map((startup) => (
                <motion.div
                  key={startup.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-violet-500/50"
                >
                  <div>
                    {/* Card Header: Logo & Funding Stage Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <img
                        src={startup.logo}
                        alt={`${startup.startup_name} Logo`}
                        className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                      />
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {startup.funding_stage}
                      </span>
                    </div>

                    {/* Startup Name & Founder */}
                    <div className="mt-5">
                      <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {startup.startup_name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Founded by{" "}
                        <span className="text-slate-700 dark:text-slate-200">
                          {startup.founder_name}
                        </span>
                      </p>
                    </div>

                    {/* Industry Badge */}
                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {startup.industry}
                      </span>
                    </div>

                    {/* Pitch Description */}
                    <p className="mt-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                      {startup.description}
                    </p>
                  </div>

                  {/* Card Footer: Team Size Needed & Action */}
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Team Needed
                        </p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {startup.team_size_needed}
                        </p>
                      </div>

                      <Link
                        href={`/startups/${startup.id}`}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500"
                      >
                        View Startup
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty Search State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800"
            >
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No startups found matching your criteria.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search terms or resetting the selected
                filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StartupsPage;
