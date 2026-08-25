"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";
import {
  Badge,
  EmptyState,
  Btn,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";
import { deleteBookmark } from "@/lib/actions/bookmarks";

const WORK_TYPE_VARIANTS = {
  Remote: "green",
  Hybrid: "indigo",
  "On-site": "blue",
};

// Helper function to check if deadline has passed
function isDeadlinePassed(deadlineStr) {
  if (!deadlineStr || deadlineStr === "N/A" || deadlineStr === "Open")
    return false;
  const deadlineDate = new Date(deadlineStr);
  if (isNaN(deadlineDate.getTime())) return false;
  return deadlineDate < new Date();
}

export default function BookmarkedPage({ initialBookmarks = [], user }) {
  const router = useRouter();
  const activeUserId = String(user?.id || user?._id || "");

  // Safely parse aggregated MongoDB bookmarks
  const parseBookmarksList = (data) => {
    if (!data) return [];
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return list
      .map((item) => {
        // Extract inner opportunity object from MongoDB $lookup array if present
        const opp =
          Array.isArray(item.opportunityDetails) &&
          item.opportunityDetails.length > 0
            ? item.opportunityDetails[0]
            : item;

        const oppId = String(item.opportunityId || opp._id || opp.id || "");
        if (!oppId) return null;

        return {
          bookmarkDocId: String(item._id || ""),
          opportunityId: oppId,
          roleTitle: opp.roleTitle || item.roleTitle || "Collaborator Role",
          startupName: opp.startupName || item.startupName || "Startup",
          workType: opp.workType || item.workType || "Remote",
          commitmentLevel:
            opp.commitmentLevel || item.commitmentLevel || "Part-Time",
          deadline: opp.deadline || item.deadline || "Open",
          requiredSkills: opp.requiredSkills || item.requiredSkills || [],
          description: opp.description || item.description || "",
          location: opp.location || item.location || "Remote",
          equity: opp.equity || item.equity || null,
          stipend: opp.stipend || item.stipend || null,
        };
      })
      .filter(Boolean);
  };

  const [bookmarks, setBookmarks] = useState(() =>
    parseBookmarksList(initialBookmarks),
  );
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Sync state whenever props update from server component
  useEffect(() => {
    setBookmarks(parseBookmarksList(initialBookmarks));
  }, [initialBookmarks]);

  // =========================================================================
  // REMOVE BOOKMARK HANDLER (Optimistic UI + Server Action)
  // =========================================================================
  const handleRemoveBookmark = async (oppId) => {
    if (!oppId || !activeUserId) return;

    setRemovingId(oppId);

    // Optimistic local state update
    setBookmarks((prev) => prev.filter((item) => item.opportunityId !== oppId));

    try {
      const result = await deleteBookmark(oppId, activeUserId);
      if (result?.error) throw new Error(result.error);

      // Refresh server cache
      router.refresh();
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
      // Revert local state if server request fails
      setBookmarks(parseBookmarksList(initialBookmarks));
    } finally {
      setRemovingId(null);
      if (selectedOpp && selectedOpp.opportunityId === oppId) {
        setSelectedOpp(null);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Saved Opportunities</span>
            <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 border border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20 px-2.5 py-0.5 rounded-full">
              Collaborator
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access bookmarked roles for quick review, tracking, and future
            applications.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl w-fit shadow-xs">
          Total Saved:{" "}
          <span className="text-violet-600 dark:text-violet-400 font-bold font-mono">
            {bookmarks.length}
          </span>
        </span>
      </div>

      {/* Empty State vs Bookmarks List */}
      {bookmarks.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No bookmarked roles"
          sub="Save opportunities from the Browse page to review and apply to them here."
        />
      ) : (
        <div className="space-y-3.5">
          {bookmarks.map((item, idx) => {
            const variant = WORK_TYPE_VARIANTS[item.workType] || "gray";
            const expired = isDeadlinePassed(item.deadline);

            return (
              <div
                key={item.opportunityId || idx}
                className="rounded-2xl p-5 bg-white border border-slate-200 hover:border-violet-500/40 dark:bg-[#0D1528] dark:border-slate-800 dark:hover:border-slate-700/80 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm"
              >
                {/* Role Details */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                      <Link href={`/opportunities/${item.opportunityId}`}>
                        {item.roleTitle}
                      </Link>
                    </h4>
                    <Badge label={item.workType} variant={variant} />
                    <Badge label={item.commitmentLevel} variant="gray" />

                    {expired ? (
                      <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20 px-2 py-0.5 rounded-full">
                        Expired
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <p className="text-violet-600 dark:text-violet-400 font-semibold font-mono flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>@{item.startupName}</span>
                    </p>

                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>Deadline: {item.deadline}</span>
                    </p>

                    {item.location && (
                      <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{item.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Skills Tags */}
                  {Array.isArray(item.requiredSkills) &&
                    item.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.requiredSkills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:border-slate-700/60 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {item.requiredSkills.length > 4 && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            +{item.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/80">
                  <Link href={`/opportunities/${item.opportunityId}`}>
                    <Btn size="sm" variant="primary" className="gap-1">
                      <span>View Role</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Btn>
                  </Link>

                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedOpp(item)}
                  >
                    Details
                  </Btn>

                  <button
                    onClick={() => handleRemoveBookmark(item.opportunityId)}
                    disabled={removingId === item.opportunityId}
                    title="Remove from saved"
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedOpp && (
        <Modal
          title="Saved Opportunity Overview"
          onClose={() => setSelectedOpp(null)}
        >
          <div className="space-y-5 font-sans">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                Role &amp; Startup
              </p>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {selectedOpp.roleTitle}
              </h3>
              <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold font-mono mt-0.5">
                @{selectedOpp.startupName}
              </p>
            </div>

            {selectedOpp.description && (
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  Description
                </p>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#060C1A] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedOpp.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#060C1A] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] block">
                  Work Type:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {selectedOpp.workType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] block">
                  Commitment:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {selectedOpp.commitmentLevel}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] block">
                  Location:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {selectedOpp.location || "Remote"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] block">
                  Application Deadline:
                </span>
                <span
                  className={`font-mono font-semibold ${
                    isDeadlinePassed(selectedOpp.deadline)
                      ? "text-red-500 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {selectedOpp.deadline}
                </span>
              </div>
            </div>

            {/* Skills Requirement */}
            {Array.isArray(selectedOpp.requiredSkills) &&
              selectedOpp.requiredSkills.length > 0 && (
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpp.requiredSkills.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/opportunities/${selectedOpp.opportunityId}`}
                className="flex-1"
              >
                <Btn variant="primary" fullWidth className="gap-1.5">
                  <span>Open Full Application</span>
                  <ExternalLink className="w-4 h-4" />
                </Btn>
              </Link>

              <Btn
                variant="danger"
                onClick={() => handleRemoveBookmark(selectedOpp.opportunityId)}
              >
                Remove
              </Btn>

              <Btn variant="ghost" onClick={() => setSelectedOpp(null)}>
                Close
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
