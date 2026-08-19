"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  Search,
  RotateCcw,
  Building2,
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

// Helper to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

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
        Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          ← Prev
        </button>
        {pages.map((p) => {
          if (
            totalPages > 7 &&
            p !== 1 &&
            p !== totalPages &&
            Math.abs(p - page) > 1
          ) {
            if (Math.abs(p - page) === 2) {
              return (
                <span key={p} className="px-1 text-xs text-slate-500 font-mono">
                  ...
                </span>
              );
            }
            return null;
          }

          return (
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
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
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
  startups = [],
  initialBookmarks = [],
  initialAppliedOppIds = [],
  user,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeUserId = String(user?.id || user?._id || "");

  // URL query params synchronization
  const urlSearch = searchParams.get("search") || "";
  const urlWorkType = searchParams.get("workType") || "All";
  const urlIndustry = searchParams.get("industry") || "All";
  const activePage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'bookmarked'
  const [fullUser, setFullUser] = useState(() => user || {});

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

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

  // Parse datasets
  const parsedStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );

  const rawOpportunities = useMemo(() => {
    return parseArrayData(
      opportunitiesData?.data ||
        opportunitiesData?.opportunities ||
        opportunitiesData,
      "data",
    );
  }, [opportunitiesData]);

  // Associate Opportunities with Real Startup Details & Navigation IDs
  const opportunitiesList = useMemo(() => {
    return rawOpportunities.map((opp) => {
      const oppStartupId = String(opp.startupId || opp.startup_id || "");
      const oppStartupName = String(opp.startupName || opp.startup_name || "")
        .toLowerCase()
        .trim();

      const matchedStartup = parsedStartups.find((s) => {
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
      });

      const resolvedStartupId =
        matchedStartup?._id ||
        matchedStartup?.id ||
        opp.startupId ||
        opp.startup_id ||
        "";

      return {
        ...opp,
        resolvedStartupId: String(resolvedStartupId),
        startupName:
          matchedStartup?.startup_name ||
          matchedStartup?.name ||
          opp.startupName ||
          opp.startup_name ||
          "Startup",
        industry: opp.industry || matchedStartup?.industry || "Technology",
        startupLogo: matchedStartup?.logo || null,
      };
    });
  }, [rawOpportunities, parsedStartups]);

  // 1. EXTRACT REAL DYNAMIC INDUSTRIES FROM DATABASE STARTUPS
  const industries = useMemo(() => {
    const list = parsedStartups
      .map((item) => item.industry)
      .filter((ind) => ind && typeof ind === "string" && ind.trim().length > 0)
      .map((ind) => ind.trim());

    // Also include any industries explicitly on opportunities
    opportunitiesList.forEach((opp) => {
      if (
        opp.industry &&
        typeof opp.industry === "string" &&
        opp.industry.trim().length > 0
      ) {
        list.push(opp.industry.trim());
      }
    });

    const uniqueIndustries = Array.from(new Set(list));
    return ["All", ...uniqueIndustries];
  }, [parsedStartups, opportunitiesList]);

  // 2. EXTRACT REAL DYNAMIC WORK TYPES FROM DATABASE LISTINGS
  const workTypes = useMemo(() => {
    const list = opportunitiesList
      .map((item) => item.workType || item.work_type)
      .filter(Boolean)
      .map((w) => w.trim());

    const defaults = ["Remote", "Hybrid", "On-site"];
    const uniqueTypes = Array.from(new Set([...defaults, ...list]));
    return ["All", ...uniqueTypes];
  }, [opportunitiesList]);

  const totalItems = Number(
    opportunitiesData?.total_data ??
      opportunitiesData?.totalData ??
      opportunitiesData?.totalCount ??
      opportunitiesList.length,
  );

  const totalPages = Number(
    opportunitiesData?.total_page ??
      opportunitiesData?.totalPages ??
      (totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1),
  );

  // Normalize Bookmarks
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

  const [bookmarks, setBookmarks] = useState(() =>
    parseBookmarks(initialBookmarks),
  );

  const [submitted, setSubmitted] = useState(() =>
    Array.isArray(initialAppliedOppIds)
      ? Array.from(new Set(initialAppliedOppIds.map(String)))
      : [],
  );

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

  const [selected, setSelected] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showFounderRoleModal, setShowFounderRoleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRoleInfo, setSubmittedRoleInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const currentPersona = useMemo(() => getUserPersona(fullUser), [fullUser]);

  // Centralized URL Param updater
  const updateQueryParam = (updates = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All" && String(value).trim() !== "") {
        params.set(key, String(value).trim());
      } else {
        params.delete(key);
      }
    });

    if (!updates.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam({ search: searchInput });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setFilterMode("all");
    router.push(pathname);
  };

  const hasActiveFilters =
    urlSearch !== "" || urlWorkType !== "All" || urlIndustry !== "All";

  // Profile completion calculator
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

  // Plan Quota Calculator
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

  const handleInitiateApply = (opportunity) => {
    if (!opportunity) return;

    if (currentPersona === "founder") {
      setShowFounderRoleModal(true);
      return;
    }

    if (checkIsDeadlinePassed(opportunity.deadline)) {
      return;
    }

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
        const targetOpp = opportunitiesList.find(
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

  const displayedOpportunities = useMemo(() => {
    if (filterMode === "bookmarked") {
      return opportunitiesList.filter((o) =>
        bookmarks.includes(String(o._id || o.id)),
      );
    }
    return opportunitiesList;
  }, [opportunitiesList, bookmarks, filterMode]);

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

      setSubmitted((prev) =>
        Array.from(new Set([...prev, targetOpportunityId])),
      );

      setSubmittedRoleInfo(applyModal);
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
    <div className="p-8 space-y-6 font-sans max-w-7xl mx-auto">
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl p-1 bg-[#0D1528] border border-slate-800">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterMode === "all"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode("bookmarked")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterMode === "bookmarked"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🔖 Bookmarked ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0D1528] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by role title or skills (e.g. React, Node, Python)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#060C1A] py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition-colors focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-amber-500 text-slate-950 font-bold text-xs px-4 h-10 hover:bg-amber-600 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Real Dynamic MongoDB Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Work Type Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                Work Type:
              </label>
              <select
                value={urlWorkType}
                onChange={(e) => updateQueryParam({ workType: e.target.value })}
                className="rounded-xl border border-slate-800 bg-[#060C1A] px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-amber-500 cursor-pointer"
              >
                {workTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Real Industry Filter from Startups */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                Industry:
              </label>
              <select
                value={urlIndustry}
                onChange={(e) => updateQueryParam({ industry: e.target.value })}
                className="rounded-xl border border-slate-800 bg-[#060C1A] px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-amber-500 cursor-pointer"
              >
                {industries.map((ind, index) => (
                  <option key={index} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between border-t border-slate-800 pt-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 font-mono">
                Active Filters:
              </span>
              {urlSearch && (
                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 font-medium text-amber-400">
                  &quot;{urlSearch}&quot;
                </span>
              )}
              {urlWorkType !== "All" && (
                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 font-medium text-amber-400">
                  Type: {urlWorkType}
                </span>
              )}
              {urlIndustry !== "All" && (
                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 font-medium text-amber-400">
                  Industry: {urlIndustry}
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 transition-colors hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Opportunities Grid Content */}
      {displayedOpportunities.length === 0 ? (
        <EmptyState
          icon="🔖"
          title={
            filterMode === "bookmarked"
              ? "No bookmarks saved yet"
              : "No opportunities found"
          }
          sub={
            filterMode === "bookmarked"
              ? "Click the bookmark icon on an opportunity to save it here."
              : "Try searching for a different skill or reset your filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedOpportunities.map((o, idx) => {
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
                      <Badge label={o.workType || "Remote"} variant={variant} />
                      <Badge
                        label={o.commitmentLevel || "Part-Time"}
                        variant="gray"
                      />
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

                  {/* Interactive Startup Link */}
                  <div className="flex items-center gap-2 mb-3">
                    {o.resolvedStartupId ? (
                      <Link
                        href={`/startups/${o.resolvedStartupId}`}
                        className="text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 transition-colors hover:underline"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>@{o.startupName}</span>
                      </Link>
                    ) : (
                      <p className="text-xs text-amber-500 font-medium flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>@{o.startupName}</span>
                      </p>
                    )}

                    {o.industry && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {o.industry}
                      </span>
                    )}
                  </div>

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
                    Deadline: {o.deadline || "Open"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(o)}
                    >
                      Details
                    </Btn>

                    {/* Action Button States */}
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
      {totalPages > 1 && (
        <PaginationControls
          page={activePage}
          totalPages={totalPages}
          total={totalItems}
          onPageChange={(p) => updateQueryParam({ page: p })}
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

                  {selected.resolvedStartupId ? (
                    <Link
                      href={`/startups/${selected.resolvedStartupId}`}
                      className="text-sm text-amber-500 hover:text-amber-400 font-medium mt-0.5 inline-block hover:underline"
                    >
                      @{selected.startupName}{" "}
                      {selected.industry && `• ${selected.industry}`}
                    </Link>
                  ) : (
                    <p className="text-sm text-amber-500 font-medium mt-0.5">
                      @{selected.startupName}{" "}
                      {selected.industry && `• ${selected.industry}`}
                    </p>
                  )}
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

      {/* Role Restriction Modal */}
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

      {/* Profile Incomplete Modal */}
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

      {/* Limit Modal */}
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

      {/* Apply Modal */}
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
