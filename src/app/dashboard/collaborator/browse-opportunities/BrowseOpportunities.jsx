"use client";

import { useState, useEffect, useMemo } from "react";
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

const WORK_TYPE_VARIANTS = {
  Remote: "green",
  Hybrid: "indigo",
  "On-site": "amber",
};

const PAGE_SIZE = 4;

// 🔥 Helper function: Safely converts strings, arrays, or null/undefined into a clean Array
function getSkillsArray(skills) {
  if (Array.isArray(skills)) return skills;
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
  opportunityId,
}) {
  // Normalize incoming props safely
  const parseOpportunities = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.opportunities)) return data.opportunities;
    return [];
  };

  const [opportunities, setOpportunities] = useState(() =>
    parseOpportunities(opportunitiesData),
  );

  // Sync state whenever props update
  useEffect(() => {
    setOpportunities(parseOpportunities(opportunitiesData));
  }, [opportunitiesData]);

  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "bookmarked"
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [displayedOpps, setDisplayedOpps] = useState([]);

  // Modals state
  const [selected, setSelected] = useState(null); // Details Modal
  const [applyModal, setApplyModal] = useState(null); // Apply Modal
  const [submitted, setSubmitted] = useState([]);
  const [form, setForm] = useState({
    email: "",
    portfolio: "",
    motivation: "",
  });

  // Bookmark Toggle (checks both _id and id)
  const toggleBookmark = (id) => {
    if (!id) return;
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  // Filtered List based on tab selection
  const filteredOpps = useMemo(() => {
    return filter === "bookmarked"
      ? opportunities.filter((o) => bookmarks.includes(o._id || o.id))
      : opportunities;
  }, [opportunities, bookmarks, filter]);

  const totalPages = Math.ceil(filteredOpps.length / PAGE_SIZE) || 1;

  // Pagination Effect with loading skeleton
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      setDisplayedOpps(filteredOpps.slice(start, start + PAGE_SIZE));
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [page, filteredOpps]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Submit Application Handler
  const submitApplication = async (e) => {
    e.preventDefault();
    if (!form.email || !form.motivation || !applyModal) return;

    const targetId = applyModal._id || applyModal.id;
    setSubmitted((prev) => [...prev, targetId]);
    setApplyModal(null);

    const addApplication = await createApplication({
      ...form,
      opportunityId,
    });
    console.log(addApplication);
  };

  console.log("form", form);

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

      {/* Grid Content with Skeleton loading */}
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
              <div className="flex gap-2 pt-2">
                <div className="h-5 w-12 bg-white/5 rounded" />
                <div className="h-5 w-16 bg-white/5 rounded" />
              </div>
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
            const itemId = o._id || o.id || idx;
            const isBookmarked = bookmarks.includes(itemId);
            const isApplied = submitted.includes(itemId);
            const variant = WORK_TYPE_VARIANTS[o.workType] || "gray";

            // 🔥 Safely get skills array whether DB returned String or Array
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

                    {/* Bookmark Toggle */}
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
                      <Btn size="sm" onClick={() => setApplyModal(o)}>
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
            const selectedId = selected._id || selected.id;
            const isBookmarked = bookmarks.includes(selectedId);
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
                  <Btn
                    fullWidth
                    onClick={() => {
                      const target = selected;
                      setSelected(null);
                      setApplyModal(target);
                    }}
                  >
                    Apply Now
                  </Btn>
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

            <div>
              <Label>Your Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@example.com"
                required
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

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-slate-300">
              <span className="text-amber-500">ℹ</span>
              Initial Application Status:{" "}
              <Badge label="Pending" variant="amber" />
            </div>

            <div className="flex gap-3 pt-2">
              <Btn type="submit">Submit Application</Btn>
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
