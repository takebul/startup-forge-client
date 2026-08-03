"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  "On-site": "amber",
};

export default function BookmarkedPage({ initialBookmarks = [], user }) {
  const router = useRouter();
  const activeUserId = user?.id || user?._id;

  console.log(initialBookmarks);

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
          deadline: opp.deadline || item.deadline || "N/A",
          requiredSkills: opp.requiredSkills || item.requiredSkills || [],
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Saved Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access bookmarked roles for quick review and future applications.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl w-fit">
          Total Saved:{" "}
          <span className="text-amber-500 font-bold">{bookmarks.length}</span>
        </span>
      </div>

      {/* Empty State vs Bookmarks List */}
      {bookmarks.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No bookmarked roles"
          sub="Save opportunities from the Browse page to review them here."
        />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item, idx) => {
            const variant = WORK_TYPE_VARIANTS[item.workType] || "gray";

            return (
              <div
                key={idx}
                className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 hover:border-slate-700/80 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* Role Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-100">
                      {item.roleTitle}
                    </h4>
                    <Badge label={item.workType} variant={variant} />
                    <Badge label={item.commitmentLevel} variant="gray" />
                  </div>

                  <p className="text-xs text-amber-500 font-medium">
                    @{item.startupName}
                  </p>

                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Deadline:{" "}
                    <span className="text-slate-400">{item.deadline}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
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
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {removingId === item.opportunityId
                      ? "Removing..."
                      : "Remove"}
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
          title="Saved Opportunity Details"
          onClose={() => setSelectedOpp(null)}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                Role
              </p>
              <h3 className="font-bold text-lg text-slate-100">
                {selectedOpp.roleTitle}
              </h3>
              <p className="text-sm text-amber-500 font-medium mt-0.5">
                @{selectedOpp.startupName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Work Type
                </p>
                <p className="text-sm text-slate-200">{selectedOpp.workType}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Commitment
                </p>
                <p className="text-sm text-slate-200">
                  {selectedOpp.commitmentLevel}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                Application Deadline
              </p>
              <p className="text-sm font-mono text-slate-200">
                {selectedOpp.deadline}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Btn
                variant="danger"
                fullWidth
                onClick={() => handleRemoveBookmark(selectedOpp.opportunityId)}
              >
                Remove Bookmark
              </Btn>
              <Btn
                variant="ghost"
                fullWidth
                onClick={() => setSelectedOpp(null)}
              >
                Close
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
