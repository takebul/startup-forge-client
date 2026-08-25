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
  "On-site": "blue",
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 font-sans">
      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
        Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, total)} of {total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
                <span
                  key={p}
                  className="px-1 text-xs text-slate-400 dark:text-slate-500 font-mono"
                >
                  ...
                </span>
              );
            }
            return null;
          }

          return (
            <button
              type="button"
              key={p}
              onClick={() => onPageChange(p)}
              disabled={loading}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                p === page
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                  : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
  rawBookmarks = [],
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
  const [bookmarkedPage, setBookmarkedPage] = useState(1);
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

  // Parse Startups dataset
  const parsedStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );

  // Parse Raw Opportunities dataset (from server-side paginated API)
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
        roleTitle:
          opp.roleTitle || opp.role_title || opp.title || "Collaborator Role",
        startupName:
          matchedStartup?.startup_name ||
          matchedStartup?.name ||
          opp.startupName ||
          opp.startup_name ||
          "Startup",
        industry:
          matchedStartup?.industry ||
          opp.industry ||
          "Technology",
        logo: matchedStartup?.logo || opp.logo || null,
        resolvedStartupId: String(resolvedStartupId),
      };
    });
  }, [rawOpportunities, parsedStartups]);

  // Parse Full Bookmarked Opportunities from database
  const fullBookmarkedList = useMemo(() => {
    const list = Array.isArray(rawBookmarks)
      ? rawBookmarks
      : Array.isArray(rawBookmarks?.data)
        ? rawBookmarks.data
        : [];

    return list
      .map((item) => {
        const opp =
          Array.isArray(item.opportunityDetails) &&
          item.opportunityDetails.length > 0
            ? item.opportunityDetails[0]
            : item;

        const oppId = String(item.opportunityId || opp._id || opp.id || "");
        if (!oppId) return null;

        const oppStartupId = String(opp.startupId || item.startupId || "");
        const oppStartupName = String(
          opp.startupName || item.startupName || "",
        )
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
          item.startupId ||
          "";

        return {
          _id: oppId,
          id: oppId,
          opportunityId: oppId,
          roleTitle:
            opp.roleTitle ||
            opp.role_title ||
            item.roleTitle ||
            "Collaborator Role",
          startupName:
            matchedStartup?.startup_name ||
            matchedStartup?.name ||
            opp.startupName ||
            item.startupName ||
            "Startup",
          workType: opp.workType || item.workType || "Remote",
          commitmentLevel:
            opp.commitmentLevel || item.commitmentLevel || "Part-Time",
          deadline: opp.deadline || item.deadline || "Open",
          requiredSkills: getSkillsArray(
            opp.requiredSkills || item.requiredSkills,
          ),
          description: opp.description || item.description || "",
          industry:
            matchedStartup?.industry ||
            opp.industry ||
            item.industry ||
            "Technology",
          logo: matchedStartup?.logo || opp.logo || null,
          resolvedStartupId: String(resolvedStartupId),
        };
      })
      .filter(Boolean);
  }, [rawBookmarks, parsedStartups]);

  // Extraction of dynamic industries from MongoDB startups
  const industries = useMemo(() => {
    const set = new Set();
    parsedStartups.forEach((s) => {
      if (s.industry && s.industry.trim()) set.add(s.industry.trim());
    });
    opportunitiesList.forEach((o) => {
      if (o.industry && o.industry.trim()) set.add(o.industry.trim());
    });
    fullBookmarkedList.forEach((b) => {
      if (b.industry && b.industry.trim()) set.add(b.industry.trim());
    });
    return ["All", ...Array.from(set)];
  }, [parsedStartups, opportunitiesList, fullBookmarkedList]);

  const workTypes = ["All", "Remote", "Hybrid", "On-site"];

  // Normalize Bookmarks IDs
  const parseBookmarkIds = (data) => {
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

  const [bookmarks, setBookmarks] = useState(() => {
    const fromProps = parseBookmarkIds(initialBookmarks);
    if (fromProps.length > 0) return fromProps;
    return parseBookmarkIds(rawBookmarks);
  });

  const [submitted, setSubmitted] = useState(() => {
    return Array.isArray(initialAppliedOppIds)
      ? Array.from(new Set(initialAppliedOppIds.map(String)))
      : [];
  });

  useEffect(() => {
    const fromProps = parseBookmarkIds(initialBookmarks);
    if (fromProps.length > 0) {
      setBookmarks(fromProps);
    } else if (rawBookmarks?.length > 0) {
      setBookmarks(parseBookmarkIds(rawBookmarks));
    }
  }, [initialBookmarks, rawBookmarks]);

  useEffect(() => {
    setSubmitted(
      Array.isArray(initialAppliedOppIds)
        ? Array.from(new Set(initialAppliedOppIds.map(String)))
        : [],
    );
  }, [initialAppliedOppIds]);

  // Modals & form state
  const [selected, setSelected] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showFounderRoleModal, setShowFounderRoleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRoleInfo, setSubmittedRoleInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: user?.email || "",
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
  const updateQueryParam = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, val]) => {
        if (val === "" || val === "All" || (key === "page" && val === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filterMode === "bookmarked") {
      setBookmarkedPage(1);
    }
    updateQueryParam({ search: searchInput, page: 1 });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setBookmarkedPage(1);
    router.push(pathname);
  };

  const hasActiveFilters =
    urlSearch !== "" || urlWorkType !== "All" || urlIndustry !== "All";

  // Filtered Bookmarked list with in-memory search and filter criteria
  const filteredBookmarkedList = useMemo(() => {
    return fullBookmarkedList.filter((b) => {
      // Must be currently bookmarked
      if (!bookmarks.includes(String(b._id || b.id || b.opportunityId))) {
        return false;
      }

      // Filter by search term
      if (urlSearch) {
        const query = urlSearch.toLowerCase();
        const titleMatch = b.roleTitle?.toLowerCase().includes(query);
        const startupMatch = b.startupName?.toLowerCase().includes(query);
        const skillsMatch = b.requiredSkills?.some((s) =>
          s.toLowerCase().includes(query),
        );
        if (!titleMatch && !startupMatch && !skillsMatch) return false;
      }

      // Filter by workType
      if (urlWorkType !== "All" && b.workType !== urlWorkType) {
        return false;
      }

      // Filter by industry
      if (urlIndustry !== "All" && b.industry !== urlIndustry) {
        return false;
      }

      return true;
    });
  }, [fullBookmarkedList, bookmarks, urlSearch, urlWorkType, urlIndustry]);

  // Compute pagination parameters depending on active mode
  const isBookmarkedMode = filterMode === "bookmarked";

  const totalItems = isBookmarkedMode
    ? filteredBookmarkedList.length
    : Number(
        opportunitiesData?.total_data ??
          opportunitiesData?.totalData ??
          opportunitiesData?.totalCount ??
          opportunitiesList.length,
      );

  const totalPages = isBookmarkedMode
    ? Math.max(1, Math.ceil(filteredBookmarkedList.length / PAGE_SIZE))
    : Number(
        opportunitiesData?.total_page ??
          opportunitiesData?.totalPages ??
          (totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1),
      );

  const currentDisplayPage = isBookmarkedMode ? bookmarkedPage : activePage;

  const displayedOpportunities = useMemo(() => {
    if (isBookmarkedMode) {
      const startIndex = (bookmarkedPage - 1) * PAGE_SIZE;
      return filteredBookmarkedList.slice(startIndex, startIndex + PAGE_SIZE);
    }
    return opportunitiesList;
  }, [isBookmarkedMode, filteredBookmarkedList, bookmarkedPage, opportunitiesList]);

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
        const targetOpp =
          opportunitiesList.find((o) => String(o._id || o.id) === targetId) ||
          fullBookmarkedList.find((b) => String(b._id || b.id) === targetId);

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Browse Opportunities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore open roles posted by verified startups and apply directly.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl p-1 bg-slate-100 border border-slate-200 dark:bg-[#0D1528] dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setFilterMode("all");
              setBookmarkedPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === "all"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterMode("bookmarked");
              setBookmarkedPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === "bookmarked"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            🔖 Bookmarked ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1528]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by role title or skills (e.g. React, Node, Python)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:bg-white focus:border-violet-500 dark:border-slate-800 dark:bg-[#060C1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-[#060C1A] dark:focus:border-violet-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs px-5 h-10 transition-all cursor-pointer shadow-md shadow-violet-600/20 shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Real Dynamic MongoDB Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Work Type Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                Work Type:
              </label>
              <select
                value={urlWorkType}
                onChange={(e) => {
                  if (filterMode === "bookmarked") setBookmarkedPage(1);
                  updateQueryParam({ workType: e.target.value, page: 1 });
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-violet-500 cursor-pointer dark:border-slate-800 dark:bg-[#060C1A] dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 [color-scheme:light] dark:[color-scheme:dark]"
              >
                {workTypes.map((type, index) => (
                  <option
                    key={index}
                    value={type}
                    className="bg-white text-slate-900 dark:bg-[#0D1528] dark:text-slate-100"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Real Industry Filter from Startups */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                Industry:
              </label>
              <select
                value={urlIndustry}
                onChange={(e) => {
                  if (filterMode === "bookmarked") setBookmarkedPage(1);
                  updateQueryParam({ industry: e.target.value, page: 1 });
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-violet-500 cursor-pointer dark:border-slate-800 dark:bg-[#060C1A] dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 [color-scheme:light] dark:[color-scheme:dark]"
              >
                {industries.map((ind, index) => (
                  <option
                    key={index}
                    value={ind}
                    className="bg-white text-slate-900 dark:bg-[#0D1528] dark:text-slate-100"
                  >
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 font-mono">
                Active Filters:
              </span>
              {urlSearch && (
                <span className="rounded-lg bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300 px-2.5 py-0.5 font-medium">
                  &quot;{urlSearch}&quot;
                </span>
              )}
              {urlWorkType !== "All" && (
                <span className="rounded-lg bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300 px-2.5 py-0.5 font-medium">
                  Type: {urlWorkType}
                </span>
              )}
              {urlIndustry !== "All" && (
                <span className="rounded-lg bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300 px-2.5 py-0.5 font-medium">
                  Industry: {urlIndustry}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors hover:underline cursor-pointer"
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
              ? "No saved opportunities"
              : "No opportunities found"
          }
          sub={
            filterMode === "bookmarked"
              ? "Click the bookmark icon on an opportunity in 'All' to save it here."
              : "Try searching for a different skill or reset your filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedOpportunities.map((o, idx) => {
            const itemId = String(o._id || o.id || o.opportunityId || idx);
            const isBookmarked = bookmarks.includes(itemId);
            const isApplied = submitted.includes(itemId);
            const isDeadlinePassed = checkIsDeadlinePassed(o.deadline);
            const skillsList = getSkillsArray(o.requiredSkills);

            return (
              <div
                key={itemId}
                className={`group flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0D1528] ${
                  isBookmarked
                    ? "border-violet-500/40 shadow-violet-500/5 ring-1 ring-violet-500/20"
                    : "border-slate-200 hover:border-violet-300 dark:border-slate-800 dark:hover:border-violet-500/40"
                }`}
              >
                <div>
                  {/* Header Tags: Work Type, Commitment, Expired & Bookmark Button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-mono font-semibold transition-colors ${
                          o.workType === "Remote"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20"
                            : o.workType === "Hybrid"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20"
                              : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20"
                        }`}
                      >
                        {o.workType || "Remote"}
                      </span>
                      <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                        {o.commitmentLevel || "Part-Time"}
                      </span>
                      {isDeadlinePassed && (
                        <span className="rounded-full border border-red-500/20 bg-red-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                          Closed
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(itemId)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors cursor-pointer shrink-0 ${
                        isBookmarked
                          ? "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Bookmark role"}
                    >
                      <Bookmark />
                    </button>
                  </div>

                  {/* Role Title & Startup Info */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 line-clamp-1">
                      {o.roleTitle}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      {o.logo ? (
                        <img
                          src={o.logo}
                          alt={o.startupName}
                          className="h-5 w-5 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-violet-100 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:ring-violet-800/60 shrink-0">
                          {o.startupName?.[0]?.toUpperCase() || "S"}
                        </div>
                      )}

                      {o.resolvedStartupId ? (
                        <Link
                          href={`/startups/${o.resolvedStartupId}`}
                          className="text-xs font-semibold text-slate-600 transition-colors hover:text-violet-600 hover:underline dark:text-slate-400 dark:hover:text-violet-400 truncate max-w-[160px]"
                        >
                          @{o.startupName}
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                          @{o.startupName}
                        </span>
                      )}

                      {o.industry && (
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 dark:text-slate-400 dark:bg-slate-800/80 dark:border-transparent px-2 py-0.5 rounded shrink-0">
                          {o.industry}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Required Skills Badges */}
                  <div className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                      Required Skills
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 min-h-[48px]">
                      {skillsList.length > 0 ? (
                        <>
                          {skillsList.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-700 transition-colors group-hover:border-violet-200 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:group-hover:border-violet-500/30"
                            >
                              {skill}
                            </span>
                          ))}
                          {skillsList.length > 3 && (
                            <span className="rounded-xl border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                              +{skillsList.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Skills described in role details
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Apply By Date & Action Buttons */}
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                        Apply By
                      </p>
                      <p
                        className={`text-xs font-bold font-mono ${
                          isDeadlinePassed
                            ? "text-red-500"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {o.deadline || "Open"}
                      </p>
                    </div>

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
                          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 cursor-not-allowed opacity-90"
                        >
                          Closed
                        </button>
                      ) : isApplied ? (
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 cursor-not-allowed opacity-90"
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
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls for BOTH 'all' and 'bookmarked' modes */}
      {totalPages > 1 && (
        <PaginationControls
          page={currentDisplayPage}
          totalPages={totalPages}
          total={totalItems}
          onPageChange={(p) => {
            if (isBookmarkedMode) {
              setBookmarkedPage(p);
            } else {
              updateQueryParam({ page: p });
            }
          }}
        />
      )}

      {/* Details Modal */}
      {selected && (
        <Modal title="Opportunity Details" onClose={() => setSelected(null)}>
          {(() => {
            const selectedId = String(
              selected._id || selected.id || selected.opportunityId,
            );
            const isBookmarked = bookmarks.includes(selectedId);
            const isApplied = submitted.includes(selectedId);
            const isDeadlinePassed = checkIsDeadlinePassed(selected.deadline);
            const skillsList = getSkillsArray(selected.requiredSkills);

            return (
              <div className="space-y-4 font-sans">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Role
                  </p>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {selected.roleTitle}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5">
                    {selected.logo ? (
                      <img
                        src={selected.logo}
                        alt={selected.startupName}
                        className="h-5 w-5 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-violet-100 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:ring-violet-800/60">
                        {selected.startupName?.[0]?.toUpperCase() || "S"}
                      </div>
                    )}
                    {selected.resolvedStartupId ? (
                      <Link
                        href={`/startups/${selected.resolvedStartupId}`}
                        className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold font-mono inline-block hover:underline"
                      >
                        @{selected.startupName}{" "}
                        {selected.industry && `• ${selected.industry}`}
                      </Link>
                    ) : (
                      <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold font-mono">
                        @{selected.startupName}{" "}
                        {selected.industry && `• ${selected.industry}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                      Work Type
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {selected.workType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                      Commitment
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {selected.commitmentLevel}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-semibold">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsList.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md font-mono bg-slate-100 text-slate-800 border border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Application Deadline
                  </p>
                  <p
                    className={`text-sm font-mono font-semibold ${
                      isDeadlinePassed
                        ? "text-red-500 dark:text-red-400"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {selected.deadline} {isDeadlinePassed && "(Closed)"}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  {isDeadlinePassed ? (
                    <div className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 font-semibold text-xs font-mono">
                      Applications Closed
                    </div>
                  ) : isApplied ? (
                    <div className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 font-semibold text-xs font-mono">
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
                    type="button"
                    onClick={() => toggleBookmark(selectedId)}
                    className={`px-4 py-2 rounded-xl text-sm transition-colors border font-medium cursor-pointer ${
                      isBookmarked
                        ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-white/10"
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
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400 flex items-center justify-center text-2xl mx-auto font-bold">
              <Rocket className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Founder Account Detected
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                You are currently signed in with a{" "}
                <span className="text-violet-600 dark:text-violet-400 font-semibold font-mono">
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
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400 flex items-center justify-center text-2xl mx-auto font-bold">
              ⚠️
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Complete Your Profile First
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Your profile is currently{" "}
                <span className="text-violet-600 dark:text-violet-400 font-bold font-mono">
                  {completionPercentage}%
                </span>{" "}
                complete. Startup founders require a 100% completed profile
                (Full Name, Photo, Skills, and Bio) before accepting
                applications.
              </p>
            </div>

            <div className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-full h-2.5 overflow-hidden my-3">
              <div
                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-300"
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
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400 flex items-center justify-center text-2xl mx-auto font-bold">
              🔒
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Monthly Application Limit Reached
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                You have submitted{" "}
                <span className="text-violet-600 dark:text-violet-400 font-bold font-mono">
                  {appliedCount} / {planInfo.limit}
                </span>{" "}
                applications this month on your{" "}
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {planInfo.name}
                </span>{" "}
                plan. Upgrade your membership to unlock more applications.
              </p>
            </div>

            <div className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-full h-2.5 overflow-hidden my-3">
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
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1528] p-6 sm:p-8 shadow-2xl text-center font-sans"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Application Submitted!
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Your pitch for{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {submittedRoleInfo?.roleTitle || "this role"}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  @{submittedRoleInfo?.startupName || "the startup"}
                </span>{" "}
                has been recorded and sent to the founder.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard/collaborator/my-applications"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-md shadow-violet-600/20"
                >
                  <Inbox className="w-4 h-4" />
                  <span>Go to Applications</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
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
