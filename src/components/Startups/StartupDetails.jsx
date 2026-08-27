"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
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

// Helper to normalize skills whether stored as a comma-separated string or an array
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

// Helper to check if a specific deadline date has expired
function checkIsDeadlinePassed(deadlineStr) {
  if (!deadlineStr || deadlineStr === "N/A" || deadlineStr === "Open")
    return false;
  const deadlineDate = new Date(deadlineStr);
  if (isNaN(deadlineDate.getTime())) return false;
  deadlineDate.setHours(23, 59, 59, 999);
  return new Date() > deadlineDate;
}

export default function StartupDetails({
  startups,
  opportunities = [],
  userData = [],
  initialAppliedOppIds = [],
  initialUser,
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const isAuthenticated = !!user;

  // Resolve active persona (collaborator, founder, admin)
  const persona = useMemo(() => getUserPersona(user), [user]);
  const isCollaborator = persona === "collaborator";

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Track applied opportunity IDs
  const [appliedOppIds, setAppliedOppIds] = useState(() =>
    Array.isArray(initialAppliedOppIds) ? initialAppliedOppIds.map(String) : [],
  );

  // Success dialog modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRoleInfo, setSubmittedRoleInfo] = useState(null);

  const [form, setForm] = useState({
    email: user?.email || "",
    portfolio: "",
    motivation: "",
  });

  // Sync user email into form state when session loads
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user, form.email]);

  // 1. Safely Extract Startup Document
  const startup = useMemo(() => {
    if (!startups) return null;
    if (Array.isArray(startups)) return startups[0] || null;
    if (startups?.data) {
      return Array.isArray(startups.data) ? startups.data[0] : startups.data;
    }
    return startups;
  }, [startups]);

  // 2. Parse Related Datasets
  const opportunitiesList = useMemo(
    () => parseArrayData(opportunities, "opportunities"),
    [opportunities],
  );
  const usersList = useMemo(
    () => parseArrayData(userData, "userData"),
    [userData],
  );

  // 3. Match Founder Profile from userData
  const founder = useMemo(() => {
    if (!startup) return null;
    const founderEmail = (startup.founder_email || "").toLowerCase();
    const startupId = String(startup.startupId || startup._id || "");

    return (
      usersList.find(
        (u) =>
          (u.email && u.email.toLowerCase() === founderEmail) ||
          String(u._id || u.id) === startupId,
      ) || null
    );
  }, [startup, usersList]);

  // 4. Match and Filter Opportunities for this Startup
  const startupRoles = useMemo(() => {
    if (!startup) return [];
    const sId = String(startup._id || startup.id || "");
    const customStartupId = String(startup.startupId || "");
    const sName = String(startup.startup_name || "")
      .toLowerCase()
      .trim();

    return opportunitiesList.filter((opp) => {
      const oppStartupId = String(opp.startupId || "");
      const oppStartupName = String(opp.startupName || "")
        .toLowerCase()
        .trim();

      return (
        (oppStartupId &&
          (oppStartupId === sId || oppStartupId === customStartupId)) ||
        (oppStartupName && sName && oppStartupName === sName)
      );
    });
  }, [startup, opportunitiesList]);

  const profileCompletion = useMemo(() => getProfileCompletion(user), [user]);
  const handleInitiateApply = (role) => {
    if (!isCollaborator) return;
    if (profileCompletion < 100) {
      setShowIncompleteModal(true);
      return;
    }
    setSelectedRole(role);
    setSubmitError(null);
  };

  // =========================================================================
  // SUBMIT APPLICATION HANDLER
  // =========================================================================
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedRole || !isCollaborator) return;

    const roleDeadlinePassed = checkIsDeadlinePassed(selectedRole.deadline);
    const targetOpportunityId = String(
      selectedRole._id || selectedRole.id || "",
    );
    if (roleDeadlinePassed || appliedOppIds.includes(targetOpportunityId))
      return;

    setIsSubmitting(true);
    setSubmitError(null);

    const targetStartupId = String(
      selectedRole.startupId || startup?._id || startup?.startupId || "",
    );

    try {
      const payload = {
        applicantEmail: form.email || user?.email || "",
        portfolioLink: form.portfolio,
        motivationMessage: form.motivation,
        opportunityId: targetOpportunityId,
        startupId: targetStartupId,
        opportunityTitle:
          selectedRole.roleTitle || selectedRole.title || "Collaborator Role",
        startupName:
          startup?.startup_name || selectedRole.startupName || "Startup",
        applicantName: user?.name || "Collaborator",
        collaboratorId: user?.id || user?._id || "",
      };

      const result = await createApplication(payload);

      if (result?.error) {
        throw new Error(result.error);
      }

      // 1. Mark this role as applied in local state
      setAppliedOppIds((prev) =>
        Array.from(new Set([...prev, targetOpportunityId])),
      );

      // 2. Set submitted role info for the success dialog
      setSubmittedRoleInfo(selectedRole);

      // 3. Close the apply modal and open success modal
      setSelectedRole(null);
      setForm({
        email: user?.email || "",
        portfolio: "",
        motivation: "",
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to submit application:", err);
      setSubmitError(err?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!startup) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Startup Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested startup profile could not be located.
        </p>
        <Link
          href="/startups"
          className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 transition-colors"
        >
          ← Back to All Startups
        </Link>
      </div>
    );
  }

  const startupName = startup.startup_name || "Untitled Startup";
  const fundingStage = startup.funding_stage || "Seed Stage";
  const industry = startup.industry || "Technology";
  const founderName =
    founder?.name || startup.founder_email?.split("@")[0] || "Founder";
  const founderEmail = startup.founder_email || founder?.email || "N/A";
  const founderAvatar =
    founder?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  const isOwnStartup = Boolean(
    user &&
    ((user.email &&
      startup?.founder_email &&
      String(startup.founder_email).toLowerCase() ===
        String(user.email).toLowerCase()) ||
      (user.id &&
        (String(startup?.startupId) === String(user.id) ||
          String(startup?.userId) === String(user.id) ||
          String(startup?._id || startup?.id) === String(user.id)))),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* -----------------------------------------------------------------------------
          HERO BANNER SECTION
      ----------------------------------------------------------------------------- */}
      <section className="relative border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back Navigation */}
          <Link
            href="/startups"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400"
          >
            <span>← Back to All Startups</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start sm:items-center space-x-5">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startupName}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800 shadow-md shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold flex items-center justify-center text-3xl shadow-md shrink-0">
                  {startupName[0]}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                    {startupName}
                  </h1>
                  {isOwnStartup && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-mono font-bold text-amber-800 shadow-xs dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Own Startup
                    </span>
                  )}
                  <span className="rounded-md bg-violet-100 px-2.5 py-1 text-xs font-mono font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {fundingStage}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Industry:{" "}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {industry}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Founder:{" "}
                    <strong className="text-slate-700 dark:text-slate-200 capitalize">
                      {founderName}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Status:{" "}
                    <strong className="text-emerald-500 dark:text-emerald-400">
                      {startup.status || "Active"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("roles")}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 dark:hover:bg-violet-500 cursor-pointer self-start md:self-auto shrink-0"
            >
              View Open Roles ({startupRoles.length})
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          TAB NAVIGATION & CONTENT
      ----------------------------------------------------------------------------- */}
      <section className="container mx-auto px-6 py-10 lg:px-12">
        {/* Navigation Tabs */}
        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: "overview", label: "Overview & Description" },
            {
              id: "roles",
              label: `Open Roles (${startupRoles.length})`,
            },
            { id: "team", label: "Founder & Team" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid gap-8 lg:grid-cols-3"
              >
                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      About the Startup
                    </h2>
                    <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                      {startup.description ||
                        "No detailed description provided."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Mission & Objective
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {startupName} is currently operating in the{" "}
                      <strong>{industry}</strong> space at the{" "}
                      <strong>{fundingStage}</strong> level, actively seeking
                      dedicated collaborators and team members to expand
                      platform capabilities.
                    </p>
                  </div>
                </div>

                {/* Sidebar Founder Summary Card */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Founder Profile
                    </h3>
                    <div className="mt-4 flex items-center space-x-3">
                      <img
                        src={founderAvatar}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/20"
                        alt={founderName}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate capitalize">
                          {founderName}
                        </p>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                          {founderEmail}
                        </p>
                      </div>
                    </div>

                    {founder?.bio && (
                      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {founder.bio}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* OPEN ROLES TAB */}
            {activeTab === "roles" && (
              <motion.div
                key="roles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {startupRoles.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 italic text-sm">
                    No open opportunity roles posted for this startup right now.
                  </div>
                ) : (
                  startupRoles.map((role) => {
                    const roleId = String(role._id || role.id);
                    const skillsList = parseSkills(role.requiredSkills);
                    const isAlreadyApplied = appliedOppIds.includes(roleId);
                    const isRoleDeadlinePassed = checkIsDeadlinePassed(
                      role.deadline,
                    );

                    return (
                      <motion.div
                        key={roleId}
                        whileHover={{ x: 4 }}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center gap-4 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono">
                              {role.workType || "Remote"}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {role.commitmentLevel || "Contract"}
                            </span>
                            {role.deadline && (
                              <span className="text-[11px] font-mono text-slate-400">
                                • Deadline: {role.deadline}
                              </span>
                            )}
                            {isRoleDeadlinePassed && (
                              <span className="rounded-md bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-500/10 dark:text-red-400 font-mono border border-red-500/20">
                                Deadline Passed
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            {role.roleTitle}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {skillsList.map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons with Persona Checks */}
                        <div className="mt-2 md:mt-0 flex items-center md:flex-col md:items-end gap-3 shrink-0">
                          {isRoleDeadlinePassed ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-400 font-mono cursor-not-allowed opacity-90 shadow-sm"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Closed</span>
                            </button>
                          ) : isAlreadyApplied ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-400 font-mono cursor-not-allowed opacity-90 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>✓ Applied</span>
                            </button>
                          ) : !isAuthenticated ? (
                            <Link
                              href={`/signin?redirect=/startups/${startup._id || startup.id}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-md shadow-violet-600/15"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>Sign In to Apply</span>
                            </Link>
                          ) : !isCollaborator ? (
                            <div
                              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 text-xs font-mono font-bold text-amber-400"
                              title="Only collaborator accounts can apply for opportunity roles"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span>Collaborator Account Required</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleInitiateApply(role);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-md shadow-violet-600/15 cursor-pointer"
                            >
                              <span>Apply for Role</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* TEAM MEMBERS TAB */}
            {activeTab === "team" && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <div className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                  <img
                    src={founderAvatar}
                    alt={founderName}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white capitalize truncate">
                      {founderName}
                    </h4>
                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                      Founder & Creator
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {founderEmail}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* -----------------------------------------------------------------------------
          APPLY MODAL
      ----------------------------------------------------------------------------- */}
      {selectedRole && (
        <ApplyModal
          opportunity={selectedRole}
          onClose={() => {
            setSelectedRole(null);
            setSubmitError(null);
          }}
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
          <div className="space-y-4 py-2 text-center">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

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
                  {submittedRoleInfo?.roleTitle || "this role"}
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
