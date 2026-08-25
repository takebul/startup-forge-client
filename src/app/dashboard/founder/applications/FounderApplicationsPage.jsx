"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Btn,
  Modal,
  StatusBadge,
  EmptyState,
} from "@/components/Dashboard/founder-dashboard-shared";
import { updateApplication } from "@/lib/actions/applications";

// Helper function to ensure portfolio URLs always open externally
function formatUrl(url) {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function FounderApplicationsPage({ founderApplications }) {
  const router = useRouter();

  // Helper to safely extract applications array from props or server responses
  const parseApplications = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.applications)) return data.applications;
    return [];
  };

  const [applications, setApplications] = useState(() =>
    parseApplications(founderApplications),
  );
  const [selected, setSelected] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Sync state whenever Server Component re-fetches founderApplications prop
  useEffect(() => {
    setApplications(parseApplications(founderApplications));
  }, [founderApplications]);

  // =========================================================================
  // STATUS UPDATE HANDLER (Accept / Reject)
  // =========================================================================
  async function handleStatusChange(id, newStatus) {
    if (!id) return;
    setLoadingId(id);
    setError(null);

    // Save previous state for rollback if server request fails
    const previousApplications = [...applications];

    try {
      // 1. Optimistic Local State Update
      setApplications((prev) =>
        prev.map((app) =>
          String(app._id || app.id) === String(id)
            ? { ...app, status: newStatus }
            : app,
        ),
      );

      // Update currently open detail modal if active
      if (selected && String(selected._id || selected.id) === String(id)) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      // 2. Call Server Action to update MongoDB database
      const response = await updateApplication(id, { status: newStatus });

      if (response?.error) {
        throw new Error(response.error);
      }

      // 3. Refresh Server Component cache
      router.refresh();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status. Reverting changes.");
      // Rollback to previous state on failure
      setApplications(previousApplications);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Applications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review applicant profiles, portfolio links, and motivation messages.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl w-fit shadow-xs">
          Total Applications:{" "}
          <span className="text-violet-600 dark:text-violet-400 font-bold font-mono">
            {applications.length}
          </span>
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-mono flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            className="underline hover:text-red-600 dark:hover:text-red-300 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Empty State vs List Display */}
      {applications.length === 0 ? (
        <EmptyState
          icon="📥"
          title="No applications yet"
          sub="Applications submitted by collaborators to your posted opportunities will appear here."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app, idx) => {
            const appId = String(app._id || app.id || idx);
            const applicantName =
              app.applicantName || app.name || "Unknown Applicant";
            const roleTitle =
              app.opportunityTitle ||
              app.roleTitle ||
              app.title ||
              "Collaborator Role";
            const email = app.applicantEmail || app.email || "N/A";
            const date = app.appliedDate || app.createdAt || "Recent";
            const isPending =
              String(app.status || "").toLowerCase() === "pending" ||
              String(app.status || "").toLowerCase() === "reviewing";
            const isProcessing = loadingId === appId;

            return (
              <div
                key={appId}
                className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm hover:border-violet-500/40 dark:bg-[#0D1528] dark:border-slate-800 dark:hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Applicant Summary Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {applicantName}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Applied for:{" "}
                      <span className="text-violet-600 dark:text-violet-400 font-semibold">
                        {roleTitle}
                      </span>
                    </p>

                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {email} ·{" "}
                      <span className="text-slate-700 dark:text-slate-300">
                        {date}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(app)}
                    >
                      View Details
                    </Btn>

                    {isPending && (
                      <>
                        <Btn
                          size="sm"
                          variant="success"
                          disabled={isProcessing}
                          onClick={() => handleStatusChange(appId, "Accepted")}
                        >
                          {isProcessing ? "Saving..." : "Accept"}
                        </Btn>
                        <Btn
                          size="sm"
                          variant="danger"
                          disabled={isProcessing}
                          onClick={() => handleStatusChange(appId, "Rejected")}
                        >
                          {isProcessing ? "Saving..." : "Reject"}
                        </Btn>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail View Modal */}
      {selected && (
        <Modal title="Application Details" onClose={() => setSelected(null)}>
          {(() => {
            const selectedId = String(selected._id || selected.id);
            const isPending =
              String(selected.status || "").toLowerCase() === "pending" ||
              String(selected.status || "").toLowerCase() === "reviewing";
            const isProcessing = loadingId === selectedId;

            return (
              <div className="space-y-4">
                {/* Applicant Info */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Applicant Name
                  </p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {selected.applicantName || selected.name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                    {selected.applicantEmail || selected.email || "N/A"}
                  </p>
                </div>

                {/* Role Title */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Role Title
                  </p>
                  <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                    {selected.opportunityTitle ||
                      selected.roleTitle ||
                      "Collaborator Role"}
                  </p>
                </div>

                {/* Portfolio Link */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Portfolio / Website
                  </p>
                  {selected.portfolioLink ? (
                    <a
                      href={formatUrl(selected.portfolioLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 dark:text-violet-400 underline hover:text-violet-700 dark:hover:text-violet-300 break-all inline-flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span>{selected.portfolioLink}</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                      No link provided
                    </p>
                  )}
                </div>

                {/* Motivation Message */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Motivation Message
                  </p>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#060C1A] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    {selected.motivationMessage ||
                      selected.motivation ||
                      "No message provided."}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                    Current Status
                  </span>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Modal Accept/Reject Action Row */}
                {isPending && (
                  <div className="flex gap-3 pt-2">
                    <Btn
                      variant="success"
                      fullWidth
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(selectedId, "Accepted")}
                    >
                      {isProcessing ? "Processing..." : "Accept Application"}
                    </Btn>
                    <Btn
                      variant="danger"
                      fullWidth
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(selectedId, "Rejected")}
                    >
                      {isProcessing ? "Processing..." : "Reject Application"}
                    </Btn>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
