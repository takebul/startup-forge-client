"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, Calendar, MapPin } from "lucide-react";

// Helper parser to safely extract array data and filter out invalid/truncated server items
function parseArrayData(data, key) {
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data?.data)) list = data.data;
  else if (key && Array.isArray(data?.[key])) list = data[key];

  // Filter only valid objects with an identifier
  return list.filter(
    (item) =>
      typeof item === "object" && item !== null && (item._id || item.id),
  );
}

// Helper to normalize skills whether stored as an array or comma-separated string
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

// Helper function to format readable dates
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

const FeaturedOpportunities = ({
  featuredOpportunities = [],
  startups = [],
}) => {
  // 1. Parse and extract valid opportunities list
  const opportunities = useMemo(() => {
    const list = parseArrayData(featuredOpportunities, "featuredOpportunities");
    // Show the first 8 featured roles on the home page
    return list.slice(0, 8);
  }, [featuredOpportunities]);

  const parsedStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );

  return (
    <section className="bg-white py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Open Roles
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Featured Opportunities
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Find your next collaborative role. Join early-stage teams as a
            developer, designer, or marketer and build groundbreaking projects
            together.
          </p>
        </div>

        {/* Opportunities Grid */}
        {opportunities.length === 0 ? (
          <div className="mt-12 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 italic text-sm">
            No featured opportunities available at the moment.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.map((item, idx) => {
              const oppId = String(item._id || item.id || idx);
              const skillsList = parseSkills(
                item.requiredSkills || item.required_skills,
              );
              const startupName =
                item.startupName || item.startup_name || "Startup Team";
              const startupId = item.startupId || item.startup_id || "";
              const workType = item.workType || item.work_type || "Remote";
              const commitmentLevel =
                item.commitmentLevel || item.commitment_level || "Flexible";

              return (
                <div
                  key={oppId}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-violet-500/50"
                >
                  <div>
                    {/* Header Tags: Work Type & Commitment */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-mono font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {workType}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {commitmentLevel}
                      </span>
                    </div>

                    {/* Role Title & Startup Name */}
                    <div className="mt-4">
                      <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 line-clamp-1">
                        {item.roleTitle ||
                          item.role_title ||
                          "Collaborator Role"}
                      </h3>
                      {startupId ? (
                        <Link
                          href={`/startups/${startupId}`}
                          className="inline-block text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400 mt-0.5 truncate max-w-full"
                        >
                          @{startupName}
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate block">
                          @{startupName}
                        </span>
                      )}
                    </div>

                    {/* Required Skills Badges */}
                    <div className="mt-5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                        Required Skills
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 min-h-[52px]">
                        {skillsList.length > 0 ? (
                          skillsList.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Skills specified in details
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Application Deadline & Action */}
                  <div className="mt-6 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                          Apply By
                        </p>
                        <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                          {formatDate(item.deadline)}
                        </p>
                      </div>

                      <Link
                        href={`/opportunities/${oppId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Opportunities Button */}
        <div className="mt-12 text-center">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>Explore All Opportunities</span>
            <ArrowRight className="h-4 w-4 text-violet-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
