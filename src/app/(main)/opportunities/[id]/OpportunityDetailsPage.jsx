"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
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

// Helper to normalize skills whether stored as an array or a comma-separated string
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

// Helper for human-readable dates
const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "Open Deadline";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function OpportunityDetailsPage({
  opportunity,
  startups = [],
  userData = [],
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Safely Extract Opportunity Document
  const opp = useMemo(() => {
    if (!opportunity) return null;
    if (Array.isArray(opportunity)) return opportunity[0] || null;
    if (opportunity?.data) {
      return Array.isArray(opportunity.data)
        ? opportunity.data[0]
        : opportunity.data;
    }
    return opportunity;
  }, [opportunity]);

  // 2. Parse Related Datasets
  const startupsList = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );
  const usersList = useMemo(
    () => parseArrayData(userData, "userData"),
    [userData],
  );

  // 3. Match Associated Startup Document
  const matchedStartup = useMemo(() => {
    if (!opp) return null;
    const oppStartupId = String(opp.startupId || "");
    const oppStartupName = String(opp.startupName || "")
      .toLowerCase()
      .trim();

    return (
      startupsList.find((s) => {
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
      }) || null
    );
  }, [opp, startupsList]);

  // 4. Match Founder Profile from Users Data
  const founder = useMemo(() => {
    if (!matchedStartup && !opp) return null;
    const founderEmail = (matchedStartup?.founder_email || "").toLowerCase();
    const startupId = String(matchedStartup?.startupId || opp?.startupId || "");

    return (
      usersList.find(
        (u) =>
          (u.email && u.email.toLowerCase() === founderEmail) ||
          String(u._id || u.id) === startupId,
      ) || null
    );
  }, [matchedStartup, opp, usersList]);

  // 5. Normalization Values
  const roleTitle = opp?.roleTitle || opp?.role_title || "Untitled Role";
  const startupName =
    matchedStartup?.startup_name || opp?.startupName || "Startup Team";
  const startupId =
    matchedStartup?._id || matchedStartup?.id || opp?.startupId || "";
  const industry = matchedStartup?.industry || "Technology";
  const fundingStage = matchedStartup?.funding_stage || "Early Stage";
  const workType = opp?.workType || opp?.work_type || "Remote";
  const commitmentLevel =
    opp?.commitmentLevel || opp?.commitment_level || "Contract";
  const deadlineFormatted = formatDate(opp?.deadline);
  const skillsList = useMemo(
    () => parseSkills(opp?.requiredSkills || opp?.required_skills),
    [opp],
  );
  const founderName =
    founder?.name || matchedStartup?.founder_email?.split("@")[0] || "Founder";
  const founderEmail = matchedStartup?.founder_email || founder?.email || "N/A";
  const founderAvatar =
    founder?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalOpen(false);
        setPortfolioUrl("");
        setCoverNote("");
      }, 2200);
    }, 800);
  };

  if (!opp) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Opportunity Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested opportunity role could not be located or has expired.
        </p>
        <Link
          href="/opportunities"
          className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 transition-colors"
        >
          ← Back to All Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* -----------------------------------------------------------------------------
          HEADER & HERO SECTION
      ----------------------------------------------------------------------------- */}
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back Button */}
          <Link
            href="/opportunities"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400"
          >
            <span>← Back to Opportunities</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex items-start space-x-5">
              {matchedStartup?.logo ? (
                <img
                  src={matchedStartup.logo}
                  alt={startupName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800 shadow-md shrink-0"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold flex items-center justify-center text-2xl shadow-md shrink-0">
                  {startupName[0]}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono">
                    {workType}
                  </span>
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 font-mono">
                    {commitmentLevel}
                  </span>
                </div>

                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                  {roleTitle}
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Opportunity by{" "}
                  {startupId ? (
                    <Link
                      href={`/startups/${startupId}`}
                      className="font-bold text-violet-600 hover:underline dark:text-violet-400"
                    >
                      @{startupName}
                    </Link>
                  ) : (
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      @{startupName}
                    </span>
                  )}{" "}
                  • {industry} ({fundingStage})
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 dark:hover:bg-violet-500 cursor-pointer"
              >
                Apply for this Position
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          MAIN CONTENT & SIDEBAR GRID
      ----------------------------------------------------------------------------- */}
      <section className="container mx-auto px-6 py-12 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Details (2 Columns) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Role Overview
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                {matchedStartup?.description ||
                  `Join the ${startupName} team as a ${roleTitle}. We are actively looking for collaborators to contribute their expertise in ${industry} and help accelerate project milestones.`}
              </p>
            </div>

            {/* Required Skills Badges */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Required Core Tech Stack & Skills
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skillsList.length > 0 ? (
                  skillsList.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No specific skill prerequisites listed.
                  </p>
                )}
              </div>
            </div>

            {/* Key Deliverables & Scope */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Key Expectations
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  `Contribute actively to the core ${roleTitle} workflow and sprint deliverables.`,
                  `Collaborate directly with the founder and other team members in an asynchronous, remote-first setup.`,
                  `Design, test, and ship maintainable modules aligned with ${industry} standards.`,
                  `Participate in regular technical check-ins and review sessions.`,
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-1 flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400 shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Summary (1 Column) */}
          <div className="space-y-6">
            {/* Quick Metadata Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Opportunity Details
              </h3>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Work Setup:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {workType}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Commitment:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {commitmentLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Industry:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {industry}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Deadline:
                  </span>
                  <span className="font-bold text-violet-600 dark:text-violet-400 font-mono">
                    {deadlineFormatted}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white transition-colors hover:bg-violet-700 dark:hover:bg-violet-500 cursor-pointer shadow-md shadow-violet-600/10"
              >
                Apply Now
              </button>
            </div>

            {/* Founder Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Listed By Founder
              </h3>
              <div className="mt-4 flex items-center space-x-3">
                <img
                  src={founderAvatar}
                  alt={founderName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white capitalize truncate">
                    {founderName}
                  </p>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                    {founderEmail}
                  </p>
                </div>
              </div>

              {matchedStartup?._id && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/startups/${matchedStartup._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    <span>View Startup Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          APPLICATION MODAL WITH MOTION
      ----------------------------------------------------------------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 font-sans"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Apply for {roleTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Direct application pitch to @{startupName}
              </p>

              {isSubmitted ? (
                <div className="my-10 text-center space-y-2">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <p className="mt-3 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Application Pitch Submitted!
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The founder has received your pitch and will review it in
                    their Dashboard.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitApplication}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Portfolio / GitHub / Work Sample URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/yourusername or portfolio link"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Why are you interested in joining @{startupName}?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Briefly describe your background with these skills and why this role excites you..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:hover:bg-violet-500 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
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
