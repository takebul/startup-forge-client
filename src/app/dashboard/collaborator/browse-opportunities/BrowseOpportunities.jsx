"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Btn,
  Badge,
  Modal,
  EmptyState,
} from "@/components/Dashboard/founder-dashboard-shared";
import { Bookmark } from "@gravity-ui/icons";
import {
  CheckCircle2,
  Inbox,
  XCircle,
  Clock,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  Rocket,
} from "lucide-react";
import { createApplication } from "@/lib/actions/applications";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmarks";
import ApplyModal from "@/components/ApplyModal/ApplyModal";

const WORK_TYPE_VARIANTS = {
  Remote: "green",
  Hybrid: "indigo",
  "On-site": "amber",
};

const PAGE_SIZE = 4;

// Helper to normalize skills array
function getSkillsArray(skills) {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string" && skills.trim()) {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
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

// Helper to resolve user persona
function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

// ─── Pagination Controls ───────────────────────────────────────────────────────

function PaginationControls({
  page,
  totalPages,
  total,
  onPageChange,
  loading,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-800 font-sans">
      <p className="text-xs font-mono text-slate-500">
        Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
        {Math.min(page * PAGE_SIZE, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          ← Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={loading}
            className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              p === page
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-transparent text-slate-400 hover:bg-white/5"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || loading}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BrowseOpportunities({
  opportunitiesData,
  initialBookmarks = [],
  initialAppliedOppIds = [],
  user,
}) {
  const router = useRouter();
  const activeUserId = String(user?.id || user?._id || "");

  const [fullUser, setFullUser] = useState(() => user || {});

  useEffect(() => {
    if (user) {
      setFullUser((prev) => ({ ...prev, ...user }));
    }
  }, [user]);

  const fetchLatestProfile = useCallback(async () => {
    if (!activeUserId) return;
    try {
      const res = await fetch(
        `/api/user/profile/${activeUserId}?t=${Date.now()}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const dbUser = await res.json();
        const profileData = dbUser?.data || dbUser?.user || dbUser;
        if (profileData && typeof profileData === "object") {
          setFullUser((prev) => ({ ...prev, ...profileData }));
        }
      }
    } catch (err) {
      console.error("Error fetching latest profile:", err);
    }
  }, [activeUserId]);

  useEffect(() => {
    fetchLatestProfile();
  }, [fetchLatestProfile]);

  const parseOpportunities = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.opportunities)) return data.opportunities;
    return [];
  };

  const parseBookmarks = (data) => {
    if (!data) return [];
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
    const ids = list
      .map((b) =>
        String(typeof b === "string" ? b : b.opportunityId || b._id || b.id),
      )
      .filter(Boolean);
    return Array.from(new Set(ids));
  };

  const [opportunities, setOpportunities] = useState(() =>
    parseOpportunities(opportunitiesData),
  );

  const [bookmarks, setBookmarks] = useState(() =>
    parseBookmarks(initialBookmarks),
  );

  const [submitted, setSubmitted] = useState(() =>
    Array.isArray(initialAppliedOppIds)
      ? Array.from(new Set(initialAppliedOppIds.map(String)))
      : [],
  );

  useEffect(() => {
    setOpportunities(parseOpportunities(opportunitiesData));
  }, [opportunitiesData]);

  useEffect(() => {
    setBookmarks(parseBookmarks(initialBookmarks));
  }, [initialBookmarks]);

  useEffect(() => {
    setSubmitted(
      Array.isArray(initialAppliedOppIds)
        ? Array.from(new Set(initialAppliedOppIds.map(String)))
        : [],
    );
  }, [initialAppliedOppIds]);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayedOpps, setDisplayedOpps] = useState([]);

  const [selected, setSelected] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showFounderRoleModal, setShowFounderRoleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRoleInfo, setSubmittedRoleInfo] = useState(null);

  const [form, setForm] = useState({
    email: fullUser?.email || "",
    portfolio: "",
    motivation: "",
  });

  useEffect(() => {
    if (fullUser?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: fullUser.email }));
    }
  }, [fullUser, form.email]);

  // Determine active persona (checks role & accountType)
  const currentPersona = useMemo(() => getUserPersona(fullUser), [fullUser]);

  // =========================================================================
  // 1. PROFILE COMPLETION CALCULATOR
  // =========================================================================
  const getProfileCompletion = (userData) => {
    if (!userData) return { percentage: 0, isComplete: false };
    let score = 0;

    if (userData.name && String(userData.name).trim().length > 0) score += 25;
    if (userData.image && String(userData.image).trim().length > 0) score += 25;

    const skills = getSkillsArray(userData.skills);
    if (skills.length > 0) score += 25;

    if (userData.bio && String(userData.bio).trim().length > 0) score += 25;

    return {
      percentage: score,
      isComplete: score === 100,
    };
  };

  const { percentage: completionPercentage, isComplete: isProfileComplete } =
    getProfileCompletion(fullUser);

  // =========================================================================
  // 2. COLLABORATOR PLAN APPLICATION QUOTA CALCULATOR
  // =========================================================================
  const planInfo = useMemo(() => {
    const activePlanKey = String(
      fullUser?.plan || fullUser?.plan_id || "collaborator_free",
    ).toLowerCase();

    if (activePlanKey.includes("enterprise")) {
      return { name: "Enterprise", limit: 100 };
    }
    if (activePlanKey.includes("premium")) {
      return { name: "Premium Collaborator", limit: 10 };
    }
    return { name: "Free", limit: 3 };
  }, [fullUser]);

  const appliedCount = submitted.length;
  const isApplicationLimitReached = appliedCount >= planInfo.limit;

  // =========================================================================
  // 3. APPLICATION GATEKEEPER
  // =========================================================================
  const handleInitiateApply = (opportunity) => {
    if (!opportunity) return;

    // 1. Role Guard: Founders cannot apply to collaborator roles
    if (currentPersona === "founder") {
      setShowFounderRoleModal(true);
      return;
    }

    // 2. Check if deadline has passed
    if (checkIsDeadlinePassed(opportunity.deadline)) {
      return;
    }

    // 3. Check profile completeness
    if (!isProfileComplete) {
      setShowIncompleteModal(true);
      return;
    }

    // 4. Check monthly application quota
    if (isApplicationLimitReached) {
      setShowLimitModal(true);
      return;
    }

    setApplyModal(opportunity);
  };

  // =========================================================================
  // BOOKMARK TOGGLE HANDLER
  // =========================================================================
  const toggleBookmark = async (id) => {
    if (!id || !activeUserId) return;
    const targetId = String(id);
    const isBookmarked = bookmarks.includes(targetId);

    setBookmarks((prev) =>
      isBookmarked ? prev.filter((b) => b !== targetId) : [...prev, targetId],
    );

    try {
      if (isBookmarked) {
        await deleteBookmark(targetId, activeUserId);
      } else {
        const targetOpp = opportunities.find(
          (o) => String(o._id || o.id) === targetId,
        );

        await createBookmark({
          opportunityId: targetId,
          startupId: String(targetOpp?.startupId || ""),
          userId: String(activeUserId),
          roleTitle: targetOpp?.roleTitle || "Collaborator Role",
          startupName: targetOpp?.startupName || "Startup",
          workType: targetOpp?.workType || "Remote",
          commitmentLevel: targetOpp?.commitmentLevel || "Part-Time",
          deadline: targetOpp?.deadline || "N/A",
          requiredSkills: getSkillsArray(targetOpp?.requiredSkills),
        });
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setBookmarks((prev) =>
        isBookmarked ? [...prev, targetId] : prev.filter((b) => b !== targetId),
      );
    }
  };

  const filteredOpps = useMemo(() => {
    return filter === "bookmarked"
      ? opportunities.filter((o) => bookmarks.includes(String(o._id || o.id)))
      : opportunities;
  }, [opportunities, bookmarks, filter]);

  const totalPages = Math.ceil(filteredOpps.length / PAGE_SIZE) || 1;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      setDisplayedOpps(filteredOpps.slice(start, start + PAGE_SIZE));
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [page, filteredOpps]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // =========================================================================
  // APPLICATION SUBMIT HANDLER
  // =========================================================================
  const submitApplication = async (e) => {
    e.preventDefault();
    if (!form.email || !form.motivation || !applyModal) return;

    const targetOpportunityId = String(applyModal._id || applyModal.id);
    const targetStartupId = String(applyModal.startupId || "");
    setIsSubmitting(true);

    try {
      const payload = {
        applicantEmail: form.email,
        portfolioLink: form.portfolio,
        motivationMessage: form.motivation,
        opportunityId: targetOpportunityId,
        startupId: targetStartupId,
        opportunityTitle:
          applyModal.roleTitle || applyModal.title || "Collaborator Role",
        startupName: applyModal.startupName || "Startup",
        applicantName: fullUser?.name || "Collaborator",
        collaboratorId: activeUserId,
      };

      const result = await createApplication(payload);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Mark this opportunity as applied
      setSubmitted((prev) =>
        Array.from(new Set([...prev, targetOpportunityId])),
      );

      // Store submitted info for success dialog
      setSubmittedRoleInfo(applyModal);

      // Close apply modal & open success dialog
      setApplyModal(null);
      setForm({
        email: fullUser?.email || "",
        portfolio: "",
        motivation: "",
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to post application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 font-sans">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Browse Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore open roles posted by verified startups and apply directly.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl p-1 bg-[#0D1528] border border-slate-800">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("bookmarked")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === "bookmarked"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🔖 Bookmarked ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 animate-pulse space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-4 w-1/3 bg-white/5 rounded" />
                <div className="h-4 w-12 bg-white/5 rounded" />
              </div>
              <div className="h-5 w-2/3 bg-white/5 rounded" />
              <div className="h-3 w-1/4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : displayedOpps.length === 0 ? (
        <EmptyState
          icon="🔖"
          title={
            filter === "bookmarked"
              ? "No bookmarks saved yet"
              : "No opportunities found"
          }
          sub={
            filter === "bookmarked"
              ? "Click the bookmark icon on an opportunity to save it here."
              : "Check back later for new role postings."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedOpps.map((o, idx) => {
            const itemId = String(o._id || o.id || idx);
            const isBookmarked = bookmarks.includes(itemId);
            const isApplied = submitted.includes(itemId);
            const isDeadlinePassed = checkIsDeadlinePassed(o.deadline);
            const variant = WORK_TYPE_VARIANTS[o.workType] || "gray";
            const skillsList = getSkillsArray(o.requiredSkills);

            return (
              <div
                key={itemId}
                className={`rounded-2xl p-5 bg-[#0D1528] border transition-all duration-200 flex flex-col justify-between ${
                  isBookmarked
                    ? "border-amber-500/30"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge label={o.workType} variant={variant} />
                      <Badge label={o.commitmentLevel} variant="gray" />
                      {isDeadlinePassed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          Deadline Passed
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleBookmark(itemId)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors cursor-pointer ${
                        isBookmarked
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-white/5 text-slate-500 hover:bg-white/10"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Bookmark role"}
                    >
                      <Bookmark />
                    </button>
                  </div>

                  <h4 className="font-semibold text-base text-slate-100 mb-0.5">
                    {o.roleTitle}
                  </h4>
                  <p className="text-xs text-amber-500 mb-3 font-medium">
                    @{o.startupName}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skillsList.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-white/5 text-slate-400 border border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-500">
                    Deadline: {o.deadline}
                  </span>
                  <div className="flex items-center gap-2">
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(o)}
                    >
                      Details
                    </Btn>

                    {/* Action button states */}
                    {isDeadlinePassed ? (
                      <button
                        type="button"
                        disabled
                        className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed opacity-90"
                      >
                        Closed
                      </button>
                    ) : isApplied ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed opacity-90"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </button>
                    ) : (
                      <Btn size="sm" onClick={() => handleInitiateApply(o)}>
                        Apply
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredOpps.length > PAGE_SIZE && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          total={filteredOpps.length}
          onPageChange={setPage}
          loading={loading}
        />
      )}

      {/* Details Modal */}
      {selected && (
        <Modal title="Opportunity Details" onClose={() => setSelected(null)}>
          {(() => {
            const selectedId = String(selected._id || selected.id);
            const isBookmarked = bookmarks.includes(selectedId);
            const isApplied = submitted.includes(selectedId);
            const isDeadlinePassed = checkIsDeadlinePassed(selected.deadline);
            const skillsList = getSkillsArray(selected.requiredSkills);

            return (
              <div className="space-y-4 font-sans">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Role
                  </p>
                  <h3 className="font-bold text-lg text-slate-100">
                    {selected.roleTitle}
                  </h3>
                  <p className="text-sm text-amber-500 font-medium mt-0.5">
                    @{selected.startupName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                      Work Type
                    </p>
                    <p className="text-sm text-slate-200">
                      {selected.workType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                      Commitment
                    </p>
                    <p className="text-sm text-slate-200">
                      {selected.commitmentLevel}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsList.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md font-mono bg-white/5 text-slate-300 border border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Application Deadline
                  </p>
                  <p
                    className={`text-sm font-mono ${
                      isDeadlinePassed
                        ? "text-red-400 font-bold"
                        : "text-slate-200"
                    }`}
                  >
                    {selected.deadline} {isDeadlinePassed && "(Closed)"}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  {isDeadlinePassed ? (
                    <div className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-xs font-mono">
                      Applications Closed
                    </div>
                  ) : isApplied ? (
                    <div className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs font-mono">
                      ✓ Already Applied
                    </div>
                  ) : (
                    <Btn
                      fullWidth
                      onClick={() => {
                        const target = selected;
                        setSelected(null);
                        handleInitiateApply(target);
                      }}
                    >
                      Apply Now
                    </Btn>
                  )}
                  <button
                    onClick={() => toggleBookmark(selectedId)}
                    className={`px-4 py-2 rounded-xl text-sm transition-colors border font-medium cursor-pointer ${
                      isBookmarked
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-white/5 text-slate-400 border-slate-800 hover:bg-white/10"
                    }`}
                  >
                    🔖 {isBookmarked ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Founder Application Restriction Warning Modal */}
      {showFounderRoleModal && (
        <Modal
          title="Role Restriction"
          onClose={() => setShowFounderRoleModal(false)}
        >
          <div className="space-y-4 text-center py-2 font-sans">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto font-bold">
              <Rocket className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Founder Account Detected
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                You are currently signed in with a{" "}
                <span className="text-amber-400 font-semibold font-mono">
                  Founder Account
                </span>
                . Role applications are designated for Collaborators. As a
                Founder, you can create and manage your startup roles from your
                dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Btn
                fullWidth
                onClick={() => {
                  setShowFounderRoleModal(false);
                  router.push("/dashboard/founder/add-opportunity");
                }}
              >
                + Post a New Role
              </Btn>
              <Btn
                variant="ghost"
                fullWidth
                onClick={() => setShowFounderRoleModal(false)}
              >
                Dismiss
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Profile Incomplete Warning Modal */}
      {showIncompleteModal && (
        <Modal
          title="Profile Completion Required"
          onClose={() => setShowIncompleteModal(false)}
        >
          <div className="space-y-4 text-center py-2 font-sans">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-2xl mx-auto font-bold">
              ⚠️
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Complete Your Profile First
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Your profile is currently{" "}
                <span className="text-amber-500 font-bold font-mono">
                  {completionPercentage}%
                </span>{" "}
                complete. Startup founders require a 100% completed profile
                (Full Name, Photo, Skills, and Bio) before accepting
                applications.
              </p>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden my-3">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Btn
                fullWidth
                onClick={() => {
                  setShowIncompleteModal(false);
                  router.push("/dashboard/collaborator/profile");
                }}
              >
                Go to Profile Settings →
              </Btn>
              <Btn
                variant="ghost"
                fullWidth
                onClick={() => setShowIncompleteModal(false)}
              >
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Application Quota Limit Reached Modal */}
      {showLimitModal && (
        <Modal
          title="Application Limit Reached"
          onClose={() => setShowLimitModal(false)}
        >
          <div className="space-y-4 text-center py-2 font-sans">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-2xl mx-auto font-bold">
              🔒
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Monthly Application Limit Reached
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                You have submitted{" "}
                <span className="text-amber-500 font-bold font-mono">
                  {appliedCount} / {planInfo.limit}
                </span>{" "}
                applications this month on your{" "}
                <span className="text-slate-200 font-semibold">
                  {planInfo.name}
                </span>{" "}
                plan. Upgrade your membership to unlock more applications.
              </p>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden my-3">
              <div className="bg-red-500 h-full rounded-full w-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Btn
                fullWidth
                onClick={() => {
                  setShowLimitModal(false);
                  router.push("/dashboard/collaborator/premium");
                }}
              >
                ⚡ Upgrade Plan →
              </Btn>
              <Btn
                variant="ghost"
                fullWidth
                onClick={() => setShowLimitModal(false)}
              >
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Separated Clean Apply Modal */}
      {applyModal && (
        <ApplyModal
          opportunity={applyModal}
          onClose={() => setApplyModal(null)}
          form={form}
          setForm={setForm}
          onSubmit={submitApplication}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Success Dialog Modal */}
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
              className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0D1528] p-6 shadow-2xl text-center font-sans"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-100">
                Application Submitted!
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your pitch for{" "}
                <span className="font-semibold text-slate-200">
                  {submittedRoleInfo?.roleTitle || "this role"}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-amber-500">
                  @{submittedRoleInfo?.startupName || "the startup"}
                </span>{" "}
                has been recorded and sent to the founder.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard/collaborator/my-applications"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/10"
                >
                  <Inbox className="w-4 h-4" />
                  <span>Go to Applications</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 rounded-xl border border-slate-800 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
