"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Btn,
  Badge,
  Modal,
  Input,
  Textarea,
  Label,
  EmptyState,
} from "@/components/Dashboard/founder-dashboard-shared";
import { Bookmark } from "@gravity-ui/icons";
import { createApplication } from "@/lib/actions/applications";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmarks";

const WORK_TYPE_VARIANTS = {
  Remote: "green",
  Hybrid: "indigo",
  "On-site": "amber",
};

const PAGE_SIZE = 4;

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-800">
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
  const activeUserId = user?.id || user?._id;

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
  // 3. APPLICATION GATEKEEPER (PROFILE 100% CHECK + PLAN LIMIT CHECK)
  // =========================================================================
  const handleInitiateApply = (opportunity) => {
    if (!isProfileComplete) {
      setShowIncompleteModal(true);
      return;
    }
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
      console.log("Application posted successfully:", result);

      setSubmitted((prev) =>
        Array.from(new Set([...prev, targetOpportunityId])),
      );
      setApplyModal(null);
      setForm({
        email: fullUser?.email || "",
        portfolio: "",
        motivation: "",
      });
    } catch (err) {
      console.error("Failed to post application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
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

                    {isApplied ? (
                      <Badge label="Applied" variant="green" />
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
            const skillsList = getSkillsArray(selected.requiredSkills);

            return (
              <div className="space-y-4">
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
                  <p className="text-sm font-mono text-slate-200">
                    {selected.deadline}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  {isApplied ? (
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

      {/* Profile Incomplete Warning Modal */}
      {showIncompleteModal && (
        <Modal
          title="Profile Completion Required"
          onClose={() => setShowIncompleteModal(false)}
        >
          <div className="space-y-4 text-center py-2">
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
          <div className="space-y-4 text-center py-2">
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

            {/* Quota Progress Line */}
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

      {/* Apply Modal */}
      {applyModal && (
        <Modal
          title={`Apply — ${applyModal.roleTitle}`}
          onClose={() => setApplyModal(null)}
        >
          <form onSubmit={submitApplication} className="space-y-4">
            <div>
              <Label>Opportunity ID</Label>
              <Input value={applyModal._id || applyModal.id} disabled />
            </div>

            {applyModal.startupId && (
              <div>
                <Label>Startup ID</Label>
                <Input value={applyModal.startupId} disabled />
              </div>
            )}

            <div>
              <Label>Your Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@example.com"
                disabled
              />
            </div>

            <div>
              <Label>Portfolio / GitHub Link</Label>
              <Input
                value={form.portfolio}
                onChange={(v) => setForm({ ...form, portfolio: v })}
                placeholder="https://github.com/yourhandle"
              />
            </div>

            <div>
              <Label>Motivation Message</Label>
              <Textarea
                value={form.motivation}
                onChange={(v) => setForm({ ...form, motivation: v })}
                placeholder="Why are you a great fit for this role?"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Btn type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Btn>
              <Btn variant="ghost" onClick={() => setApplyModal(null)}>
                Cancel
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
