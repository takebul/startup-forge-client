"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// Mock server data for opportunities
const ALL_OPPORTUNITIES_DATA = [
  {
    id: "opp-1",
    startup_id: "start-101",
    startup_name: "NexusAI",
    industry: "Artificial Intelligence",
    role_title: "Senior Full Stack Engineer",
    required_skills: ["React", "Node.js", "Tailwind CSS", "PostgreSQL"],
    work_type: "Remote",
    commitment_level: "Part-Time (15 hrs/wk)",
    deadline: "2026-08-15",
  },
  {
    id: "opp-2",
    startup_id: "start-102",
    startup_name: "EcoGrid",
    industry: "CleanTech",
    role_title: "Lead UI/UX Designer",
    required_skills: [
      "Figma",
      "Design Systems",
      "Prototyping",
      "User Research",
    ],
    work_type: "Hybrid",
    commitment_level: "Full-Time",
    deadline: "2026-08-10",
  },
  {
    id: "opp-3",
    startup_id: "start-103",
    startup_name: "PayPulse",
    industry: "FinTech",
    role_title: "Growth & Digital Marketer",
    required_skills: [
      "SEO",
      "Content Strategy",
      "Google Analytics",
      "Social Media",
    ],
    work_type: "Remote",
    commitment_level: "Part-Time (10 hrs/wk)",
    deadline: "2026-08-20",
  },
  {
    id: "opp-4",
    startup_id: "start-104",
    startup_name: "HealthSphere",
    industry: "HealthTech",
    role_title: "AI/ML Backend Developer",
    required_skills: ["Python", "FastAPI", "PyTorch", "Docker"],
    work_type: "Remote",
    commitment_level: "Co-Founder Level",
    deadline: "2026-08-05",
  },
  {
    id: "opp-5",
    startup_id: "start-105",
    startup_name: "DevLoom",
    industry: "Developer Tools",
    role_title: "DevOps & Cloud Engineer",
    required_skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    work_type: "On-Site",
    commitment_level: "Full-Time",
    deadline: "2026-08-28",
  },
  {
    id: "opp-6",
    startup_id: "start-106",
    startup_name: "UrbanCrop",
    industry: "AgriTech",
    role_title: "Embedded Systems Developer",
    required_skills: ["C++", "IoT", "Raspberry Pi", "Sensors"],
    work_type: "Hybrid",
    commitment_level: "Part-Time (20 hrs/wk)",
    deadline: "2026-08-12",
  },
];

// Helper to format dates nicely
const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const OpportunitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Dynamically extract unique Work Types and Industries
  const workTypes = useMemo(
    () => [
      "All",
      ...new Set(ALL_OPPORTUNITIES_DATA.map((item) => item.work_type)),
    ],
    [],
  );

  const industries = useMemo(
    () => [
      "All",
      ...new Set(ALL_OPPORTUNITIES_DATA.map((item) => item.industry)),
    ],
    [],
  );

  // Search by Role Title OR Required Skills & Filter by Work Type + Industry
  const filteredOpportunities = useMemo(() => {
    let result = ALL_OPPORTUNITIES_DATA.filter((item) => {
      const searchLower = searchTerm.toLowerCase();

      // Search matching role title OR any required skill
      const matchesRoleTitle = item.role_title
        .toLowerCase()
        .includes(searchLower);
      const matchesRequiredSkills = item.required_skills.some((skill) =>
        skill.toLowerCase().includes(searchLower),
      );

      const matchesSearch = matchesRoleTitle || matchesRequiredSkills;

      // Filter matching work type and industry
      const matchesWorkType =
        selectedWorkType === "All" || item.work_type === selectedWorkType;
      const matchesIndustry =
        selectedIndustry === "All" || item.industry === selectedIndustry;

      return matchesSearch && matchesWorkType && matchesIndustry;
    });

    // Sorting logic
    if (sortBy === "deadline") {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === "title") {
      result.sort((a, b) => a.role_title.localeCompare(b.role_title));
    }

    return result;
  }, [searchTerm, selectedWorkType, selectedIndustry, sortBy]);

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
    <section className="min-h-screen bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
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
            {/* Search Input (By Role Title or Required Skills) */}
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
                placeholder="Search by role title or skills (e.g. React, Python, Figma)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-violet-500"
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                className="text-xs font-semibold text-rose-600 transition-colors hover:underline dark:text-rose-400"
              >
                Clear All
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
              {filteredOpportunities.map((item) => (
                <motion.div
                  key={item.id}
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
                      <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {item.work_type}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {item.commitment_level}
                      </span>
                    </div>

                    {/* Role Title & Startup Name */}
                    <div className="mt-4">
                      <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {item.role_title}
                      </h3>
                      <Link
                        href={`/startups/${item.startup_id}`}
                        className="inline-block text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400"
                      >
                        @{item.startup_name}
                      </Link>
                    </div>

                    {/* Required Skills Badges */}
                    <div className="mt-5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Required Skills
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Application Deadline & Action */}
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Apply By
                        </p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {formatDate(item.deadline)}
                        </p>
                      </div>

                      <Link
                        href={`/opportunities/${item.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                        <span>Apply Now</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800"
            >
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No opportunities match your search filters.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try searching for a different skill or reset your filters.
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

export default OpportunitiesPage;
