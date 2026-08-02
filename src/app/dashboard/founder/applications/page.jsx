"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Btn,
  Modal,
  StatusBadge,
  EmptyState,
} from "@/components/Dashboard/founder-dashboard-shared";

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

    try {
      // 1. Optimistic Local State Update
      setApplications((prev) =>
        prev.map((app) =>
          (app._id || app.id) === id ? { ...app, status: newStatus } : app,
        ),
      );

      // Update currently open detail modal if active
      if (selected && (selected._id || selected.id) === id) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      // 2. Trigger Next.js router refresh to update server-side caches
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Applications</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review applicant profiles, portfolio links, and motivation messages.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Total Applications:{" "}
          <span className="text-amber-500 font-bold">
            {applications.length}
          </span>
        </span>
      </div>

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
            const appId = app._id || app.id || idx;
            const applicantName =
              app.applicantName || app.name || "Unknown Applicant";
            const roleTitle =
              app.opportunityTitle ||
              app.roleTitle ||
              app.title ||
              "Collaborator Role";
            const email = app.applicantEmail || app.email || "N/A";
            const date = app.appliedDate || app.createdAt || "Recent";
            const isPending = app.status === "Pending";
            const isProcessing = loadingId === appId;

            return (
              <div
                key={appId}
                className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Applicant Summary Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-100">
                        {applicantName}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>

                    <p className="text-xs text-slate-400 mb-1">
                      Applied for:{" "}
                      <span className="text-amber-500 font-medium">
                        {roleTitle}
                      </span>
                    </p>

                    <p className="text-xs font-mono text-slate-500">
                      {email} · <span className="text-slate-400">{date}</span>
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
            const selectedId = selected._id || selected.id;
            const isPending = selected.status === "Pending";
            const isProcessing = loadingId === selectedId;

            return (
              <div className="space-y-4">
                {/* Applicant Info */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Applicant Name
                  </p>
                  <p className="font-semibold text-slate-100 text-base">
                    {selected.applicantName || selected.name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400 font-mono mt-0.5">
                    {selected.applicantEmail || selected.email || "N/A"}
                  </p>
                </div>

                {/* Role Title */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Role Title
                  </p>
                  <p className="text-sm font-medium text-amber-500">
                    {selected.opportunityTitle ||
                      selected.roleTitle ||
                      "Collaborator Role"}
                  </p>
                </div>

                {/* Portfolio Link */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Portfolio / Website
                  </p>
                  {selected.portfolioLink ? (
                    <a
                      href={selected.portfolioLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-amber-500 underline hover:text-amber-400 break-all"
                    >
                      {selected.portfolioLink} ↗
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No link provided
                    </p>
                  )}
                </div>

                {/* Motivation Message */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Motivation Message
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300 bg-[#060C1A] p-3 rounded-xl border border-slate-800">
                    {selected.motivationMessage ||
                      selected.motivation ||
                      "No message provided."}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
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
