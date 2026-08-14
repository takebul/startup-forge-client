"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

const FeaturedStartups = ({ featuredStartups = [], opportunities = [] }) => {
  // 1. Safely Parse Input Datasets
  const rawStartups = useMemo(
    () => parseArrayData(featuredStartups, "featuredStartups"),
    [featuredStartups],
  );
  const rawOpportunities = useMemo(
    () => parseArrayData(opportunities, "featuredOpportunities"),
    [opportunities],
  );

  // 2. Filter Active / Approved Startups
  const startups = useMemo(() => {
    return rawStartups.filter((item) => {
      const status = String(item.status || "").toLowerCase();
      return (
        status === "approved" || status === "active" || item.status === true
      );
    });
  }, [rawStartups]);

  // 3. Helper to Calculate Open Roles count per Startup
  const getOpenRolesCount = (startup) => {
    const sId = String(startup._id || startup.id || "");
    const customStartupId = String(startup.startupId || "");
    const startupName = String(startup.startup_name || "").toLowerCase();

    return rawOpportunities.filter((opp) => {
      const oppStartupId = String(opp.startupId || "");
      const oppStartupName = String(opp.startupName || "").toLowerCase();

      return (
        (oppStartupId &&
          (oppStartupId === sId || oppStartupId === customStartupId)) ||
        (oppStartupName && startupName && oppStartupName === startupName)
      );
    }).length;
  };

  return (
    <section className="bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Active Recruitment
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Featured Startups
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Explore high-potential startup projects looking for developers,
            designers, and growth specialists to join their core teams.
          </p>
        </div>

        {/* Startup Cards Grid */}
        {startups.length === 0 ? (
          <div className="mt-12 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-500 italic text-sm">
            No featured startups available at the moment.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {startups.map((startup, idx) => {
              const startupId = String(startup._id || startup.id || idx);
              const startupName = startup.startup_name || "Untitled Startup";
              const openRoles = getOpenRolesCount(startup);
              const founderDisplay =
                startup.founder_name ||
                (startup.founder_email
                  ? startup.founder_email.split("@")[0]
                  : "Founder");

              return (
                <div
                  key={startupId}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
                >
                  <div>
                    {/* Header: Logo & Funding Stage */}
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

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {startup.funding_stage || "Early Stage"}
                      </span>
                    </div>

                    {/* Startup & Founder Info */}
                    <div className="mt-5">
                      <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {startupName}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Founded by{" "}
                        <span className="text-slate-700 dark:text-slate-200 capitalize">
                          {founderDisplay}
                        </span>
                      </p>
                    </div>

                    {/* Industry Tag */}
                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {startup.industry || "General"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {startup.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Footer: Open Roles & Navigation */}
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Briefcase className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                        <span className="text-xs font-mono font-bold">
                          {openRoles}{" "}
                          {openRoles === 1 ? "Open Role" : "Open Roles"}
                        </span>
                      </div>

                      <Link
                        href={`/startups/${startupId}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-sm"
                      >
                        <span>View Startup</span>
                        {/* <ArrowRight className="h-3 w-3" /> */}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>Browse All Active Startups</span>
            <ArrowRight className="h-4 w-4 text-violet-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStartups;
