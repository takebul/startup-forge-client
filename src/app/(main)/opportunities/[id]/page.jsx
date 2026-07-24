"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// Mock server data for a single opportunity detail
const OPPORTUNITY_DATA = {
  id: "opp-1",
  startup_id: "start-101",
  startup_name: "NexusAI",
  startup_logo:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  industry: "Artificial Intelligence",
  funding_stage: "Seed Stage",
  role_title: "Senior Full Stack Engineer",
  required_skills: [
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "PostgreSQL",
  ],
  work_type: "Remote",
  commitment_level: "Part-Time (15-20 hrs/wk)",
  compensation_type: "Equity Share + Monthly Stipend",
  deadline: "2026-08-15",
  created_at: "2026-07-10",
  founder_name: "Sarah Chen",
  founder_email: "sarah@nexusai.io",
  founder_avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role_overview:
    "We are seeking a proactive Senior Full Stack Engineer to lead front-end architecture and API integration for our autonomous workflow agent engine. You will work directly alongside the founder to build scalable UI interfaces and integrate back-end pipeline orchestration.",
  responsibilities: [
    "Architect responsive, high-performance dashboards using Next.js and Tailwind CSS.",
    "Design and optimize REST & WebSocket API client integrations for real-time AI agent status logs.",
    "Collaborate directly with the founder to scope feature requirements and ship weekly MVPs.",
    "Ensure clean, maintainable code structures with rigorous client-side state handling.",
  ],
  preferred_qualifications: [
    "3+ years of hands-on experience building production web applications in React/Next.js.",
    "Strong familiarity with server/client component boundaries and modern Tailwind layouts.",
    "Prior experience or active interest in AI tools, agentic workflows, or developer tooling.",
    "Self-starter mindset comfortable working asynchronously in early-stage startups.",
  ],
};

// Helper for human-readable dates
const formatDate = (dateString) => {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const OpportunityDetailsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setPortfolioUrl("");
      setCoverNote("");
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
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
              <img
                src={OPPORTUNITY_DATA.startup_logo}
                alt={OPPORTUNITY_DATA.startup_name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800 shadow-md"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {OPPORTUNITY_DATA.work_type}
                  </span>
                  <span className="rounded-md bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {OPPORTUNITY_DATA.commitment_level}
                  </span>
                </div>

                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                  {OPPORTUNITY_DATA.role_title}
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Opportunity by{" "}
                  <Link
                    href={`/startups/${OPPORTUNITY_DATA.startup_id}`}
                    className="font-bold text-violet-600 hover:underline dark:text-violet-400"
                  >
                    @{OPPORTUNITY_DATA.startup_name}
                  </Link>{" "}
                  • {OPPORTUNITY_DATA.industry} (
                  {OPPORTUNITY_DATA.funding_stage})
                </p>
              </div>
            </div>

            {/* Apply Action */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 dark:hover:bg-violet-500"
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
                {OPPORTUNITY_DATA.role_overview}
              </p>
            </div>

            {/* Required Skills Badges */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Required Core Tech Stack & Skills
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {OPPORTUNITY_DATA.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Key Responsibilities
              </h2>
              <ul className="mt-4 space-y-3">
                {OPPORTUNITY_DATA.responsibilities.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-1 flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Preferred Experience
              </h2>
              <ul className="mt-4 space-y-3">
                {OPPORTUNITY_DATA.preferred_qualifications.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-1 flex h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar Summary (1 Column) */}
          <div className="space-y-6">
            {/* Quick Specs Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Opportunity Metadata
              </h3>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Compensation:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">
                    {OPPORTUNITY_DATA.compensation_type}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Work Setup:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {OPPORTUNITY_DATA.work_type}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Commitment:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {OPPORTUNITY_DATA.commitment_level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Application Deadline:
                  </span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    {formatDate(OPPORTUNITY_DATA.deadline)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:hover:bg-violet-500"
              >
                Apply Now
              </button>
            </div>

            {/* Founder Contact Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Listed By
              </h3>
              <div className="mt-4 flex items-center space-x-3">
                <img
                  src={OPPORTUNITY_DATA.founder_avatar}
                  alt={OPPORTUNITY_DATA.founder_name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/20"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {OPPORTUNITY_DATA.founder_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Founder @ {OPPORTUNITY_DATA.startup_name}
                  </p>
                </div>
              </div>
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
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Apply for {OPPORTUNITY_DATA.role_title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Direct Application pitch to {OPPORTUNITY_DATA.founder_name} (@
                {OPPORTUNITY_DATA.startup_name})
              </p>

              {isSubmitted ? (
                <div className="my-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    ✓
                  </div>
                  <p className="mt-3 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Application Pitch Submitted!
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    You can track the status of this application directly in
                    your Collaborator Dashboard.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitApplication}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Portfolio / GitHub URL
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
                      Why are you interested in joining @
                      {OPPORTUNITY_DATA.startup_name}?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Briefly state your experience with these skills and why this pitch excites you..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition-colors focus:border-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:hover:bg-violet-500"
                    >
                      Submit Application
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
};

export default OpportunityDetailsPage;
