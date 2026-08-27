"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Inbox,
  XCircle,
  ShieldAlert,
  LogIn,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { createApplication } from "@/lib/actions/applications";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import { Modal } from "@/components/Dashboard/founder-dashboard-shared";

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

function getProfileCompletion(userData) {
  if (!userData) return 0;
  let score = 0;
  if (userData.name && String(userData.name).trim()) score += 25;
  if (userData.image && String(userData.image).trim()) score += 25;
  if (parseSkills(userData.skills).length > 0) score += 25;
  if (userData.bio && String(userData.bio).trim()) score += 25;
  return score;
}

// Helper to resolve user persona (admin, founder, collaborator)
function getUserPersona(u) {
  if (!u) return null;
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  if (accountType === "collaborator" || role === "collaborator")
    return "collaborator";
  return "collaborator";
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
  initialAppliedOppIds = [],
  initialUser,
}) {
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const isAuthenticated = !!user;

  // Resolve active persona (collaborator, founder, admin)
  const persona = useMemo(() => getUserPersona(user), [user]);
  const isCollaborator = persona === "collaborator";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Track applied opportunity IDs
  const [appliedOppIds, setAppliedOppIds] = useState(() =>
    Array.isArray(initialAppliedOppIds) ? initialAppliedOppIds.map(String) : [],
  );

  const [form, setForm] = useState({
    email: user?.email || "",
    portfolio: "",
    motivation: "",
  });

  // Sync user email when session loads
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user, form.email]);

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

  const oppId = String(opp?._id || opp?.id || "");

  // 2. Deadline Over / Expiration Check
  const isDeadlinePassed = useMemo(() => {
    if (!opp?.deadline || opp.deadline === "N/A" || opp.deadline === "Open")
      return false;
    const deadlineDate = new Date(opp.deadline);
    if (isNaN(deadlineDate.getTime())) return false;
    deadlineDate.setHours(23, 59, 59, 999);
    return new Date() > deadlineDate;
  }, [opp]);

  // Check if current user already submitted to this opportunity
  const isAlreadyApplied = appliedOppIds.includes(oppId);
  const profileCompletion = useMemo(() => getProfileCompletion(user), [user]);
  const isProfileComplete = profileCompletion === 100;

  const handleInitiateApply = () => {
    if (!isProfileComplete) {
      setShowIncompleteModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  // 3. Parse Related Datasets
  const startupsList = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );
  const usersList = useMemo(
    () => parseArrayData(userData, "userData"),
    [userData],
  );

  // 4. Match Associated Startup Document
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

  // 5. Match Founder Profile from Users Data
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

  // 6. Normalized Opportunity Display Values
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

  const isOwnPost = Boolean(
    user &&
    ((user.email &&
      founderEmail &&
      String(founderEmail).toLowerCase() ===
        String(user.email).toLowerCase()) ||
      (user.id &&
        (String(matchedStartup?.startupId) === String(user.id) ||
          String(opp?.startupId) === String(user.id) ||
          String(startupId) === String(user.id)))),
  );

  // =========================================================================
  // SUBMIT APPLICATION HANDLER
  // =========================================================================
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!opp || isDeadlinePassed || isAlreadyApplied || !isCollaborator) return;

    setIsSubmitting(true);

    const targetStartupId = String(
      opp.startupId || matchedStartup?._id || matchedStartup?.startupId || "",
    );

    try {
      const payload = {
        applicantEmail: form.email || user?.email || "",
        portfolioLink: form.portfolio,
        motivationMessage: form.motivation,
        opportunityId: oppId,
        startupId: targetStartupId,
        opportunityTitle: roleTitle,
        startupName: startupName,
        applicantName: user?.name || "Collaborator",
        collaboratorId: user?.id || user?._id || "",
      };

      const result = await createApplication(payload);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Mark as applied
      setAppliedOppIds((prev) => Array.from(new Set([...prev, oppId])));

      // Close apply modal & open success dialog
      setIsModalOpen(false);
      setForm({
        email: user?.email || "",
        portfolio: "",
        motivation: "",
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to submit application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!opp) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Opportunity Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested opportunity role could not be located.
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
                  {isOwnPost && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 shadow-xs dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Own Post
                    </span>
                  )}
                  {isDeadlinePassed && (
                    <span className="rounded-md bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-500/10 dark:text-red-400 font-mono border border-red-500/20">
                      Deadline Passed
                    </span>
                  )}
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

            {/* Apply Button in Hero Header */}
            <div className="flex items-center space-x-4">
              {isDeadlinePassed ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-6 py-3.5 text-sm font-semibold text-red-400 font-mono cursor-not-allowed opacity-90 shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Applications Closed</span>
                </button>
              ) : isAlreadyApplied ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-6 py-3.5 text-sm font-semibold text-emerald-400 font-mono cursor-not-allowed opacity-90 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Already Applied</span>
                </button>
              ) : !isAuthenticated ? (
                <Link
                  href={`/signin?redirect=/opportunities/${oppId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700 dark:hover:bg-violet-500 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Apply</span>
                </Link>
              ) : !isCollaborator ? (
                <div
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-5 py-3 text-xs font-mono font-bold text-amber-400"
                  title="Only collaborator accounts can apply for opportunity roles"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Collaborator Account Required</span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleInitiateApply}
                  className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 dark:hover:bg-violet-500 cursor-pointer"
                >
                  Apply for this Position
                </motion.button>
              )}
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

            {/* Key Expectations */}
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
                    Apply By:
                  </span>
                  <span
                    className={`font-bold font-mono ${
                      isDeadlinePassed
                        ? "text-red-500"
                        : "text-violet-600 dark:text-violet-400"
                    }`}
                  >
                    {deadlineFormatted} {isDeadlinePassed && "(Closed)"}
                  </span>
                </div>
              </div>

              {/* Sidebar Action Area */}
              {isDeadlinePassed ? (
                <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-xs font-mono text-red-400 font-semibold">
                  ⚠️ Applications are closed as the deadline has passed.
                </div>
              ) : isAlreadyApplied ? (
                <button
                  type="button"
                  disabled
                  className="mt-6 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-3 text-xs font-mono font-bold text-emerald-400 cursor-not-allowed opacity-90"
                >
                  ✓ Already Applied
                </button>
              ) : !isAuthenticated ? (
                <Link
                  href={`/signin?redirect=/opportunities/${oppId}`}
                  className="mt-6 block text-center w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white hover:bg-violet-700 dark:hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/10"
                >
                  Sign In as Collaborator to Apply
                </Link>
              ) : !isCollaborator ? (
                <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs font-mono text-amber-400 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Role Restricted</span>
                  </div>
                  <p className="text-[11px] text-amber-300/80">
                    Logged in as{" "}
                    <strong className="capitalize">{persona || "User"}</strong>.
                    Only collaborator accounts can apply.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleInitiateApply}
                  className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white transition-colors hover:bg-violet-700 dark:hover:bg-violet-500 cursor-pointer shadow-md shadow-violet-600/10"
                >
                  Apply Now
                </button>
              )}
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
          APPLY MODAL
      ----------------------------------------------------------------------------- */}
      {isModalOpen && (
        <ApplyModal
          opportunity={opp}
          onClose={() => setIsModalOpen(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmitApplication}
          isSubmitting={isSubmitting}
        />
      )}

      {showIncompleteModal && (
        <Modal
          title="Profile Completion Required"
          onClose={() => setShowIncompleteModal(false)}
        >
          <div className="space-y-4 text-center py-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-2xl dark:border-violet-500/20 dark:bg-violet-500/10">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Complete Your Profile First
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Your profile is currently{" "}
                <strong className="font-mono text-violet-600 dark:text-violet-400">
                  {profileCompletion}%
                </strong>{" "}
                complete. Add your full name, photo, skills, and bio before
                applying for an opportunity.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/dashboard/collaborator/profile"
                onClick={() => setShowIncompleteModal(false)}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-violet-700"
              >
                Complete Profile →
              </Link>
              <button
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* -----------------------------------------------------------------------------
          SUCCESS DIALOG MODAL
      ----------------------------------------------------------------------------- */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center font-sans"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Application Submitted!
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Your pitch for{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {roleTitle}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  @{startupName}
                </span>{" "}
                has been sent to the founder.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard/collaborator/my-applications"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 transition-colors"
                >
                  <Inbox className="w-4 h-4" />
                  <span>Go to Applications</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                >
                  Stay on This Page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
