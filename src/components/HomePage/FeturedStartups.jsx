"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

const FeaturedStartups = ({ featuredStartups = [], opportunities = [] }) => {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
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
              <span>Active Recruitment</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
                Startups
              </span>
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed">
              Explore high-potential startup projects looking for developers,
              designers, and growth specialists to join their core teams.
            </p>
          </div>

          <Link
            href="/startups"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 group shrink-0 pb-1"
          >
            <span>Explore All Startups ({startups.length})</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Startup Cards Grid */}
        {startups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto mt-8 max-w-xl rounded-3xl border border-slate-200/90 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-200">
              No Featured Startups Available
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check back soon as new ventures are onboarded daily.
            </p>
          </motion.div>
        ) : (
          <div className="mt-8 md:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {startups.slice(0, 5).map((startup, idx) => {
              const startupId = String(startup._id || startup.id || idx);
              const startupName = startup.startup_name || "Untitled Startup";
              const openRoles = getOpenRolesCount(startup);
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
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-violet-500/40 dark:hover:shadow-2xl dark:hover:shadow-violet-500/10"
                >
                  <div>
                    {/* Header: Logo & Funding Stage / Own Startup */}
                    <div className="flex items-start justify-between gap-4">
                      {startup.logo ? (
                        <img
                          src={startup.logo}
                          alt={`${startupName} Logo`}
                          className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-violet-100 border border-violet-200 text-violet-700 dark:bg-violet-950/80 dark:border-violet-800/60 dark:text-violet-300 font-bold flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                          {startupName[0]?.toUpperCase() || "S"}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {isOwnStartup && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 shadow-xs dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Own Startup
                          </span>
                        )}
                        <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-mono font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                          {startup.funding_stage || "Early Stage"}
                        </span>
                      </div>
                    </div>

                    {/* Startup & Founder Info */}
                    <div className="mt-5">
                      <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {startupName}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Founded by{" "}
                        <span className="text-slate-700 dark:text-slate-200 capitalize font-semibold">
                          {founderDisplay}
                        </span>
                      </p>
                    </div>

                    {/* Industry Tag */}
                    <div className="mt-3">
                      <span className="inline-block rounded-full border border-violet-200/70 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                        {startup.industry || "General"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {startup.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Footer: Open Roles & Navigation */}
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        <span className="text-xs font-mono font-bold">
                          {openRoles}{" "}
                          {openRoles === 1 ? "Open Role" : "Open Roles"}
                        </span>
                      </div>

                      <Link
                        href={`/startups/${startupId}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
                      >
                        <span>View Startup</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* 6th Card: Explore All Active Startups CTA Card with Motion */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 5 * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Link
                href="/startups"
                className="group flex h-full flex-col justify-between rounded-3xl border-2 border-dashed border-violet-300/80 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-white p-7 shadow-sm transition-all duration-300 hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-600/40 dark:from-violet-950/40 dark:via-purple-950/20 dark:to-slate-900/90 dark:hover:border-violet-400 dark:hover:shadow-violet-500/20 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/25 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <span className="rounded-full border border-violet-300/80 bg-violet-100/90 px-3 py-1 text-xs font-mono font-bold text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-300">
                      Directory
                    </span>
                  </div>

                  <div className="mt-7">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 transition-colors">
                      Explore All Active Startups
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Discover hundreds of fast-growing ventures seeking talent, co-founders, and specialized team members.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-violet-200/60 dark:border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between font-bold text-xs text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
                    <span>Browse Complete Directory</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white shadow-xs group-hover:bg-violet-700">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-violet-400 hover:bg-slate-50 hover:text-violet-600 hover:-translate-y-0.5 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-900 dark:hover:text-violet-300"
          >
            <span>Browse All Active Startups</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedStartups;



