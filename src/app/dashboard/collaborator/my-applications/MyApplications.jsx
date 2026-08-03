"use client";

import { useState, useEffect } from "react";
import {
  StatusBadge,
  EmptyState,
  Btn,
  Badge,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";
import { deleteApplications } from "@/lib/actions/applications";

export default function MyApplications({ myApplications = [] }) {
  // Helper to safely extract applications array from props
  const parseApplications = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.applications)) return data.applications;
    return [];
  };

  const [applications, setApplications] = useState(() =>
    parseApplications(myApplications),
  );

  // Sync state whenever props update
  useEffect(() => {
    setApplications(parseApplications(myApplications));
  }, [myApplications]);

  const [selectedApp, setSelectedApp] = useState(null); // Details Modal
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Delete Modal
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================================================================
  // DELETE APPLICATION HANDLER
  // =========================================================================
  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    setIsDeleting(true);
    try {
      // 1. Optimistic Local State Update
      setApplications((prev) =>
        prev.filter((a) => (a._id || a.id) !== confirmDeleteId),
      );

      // 2. Call Server Action
      const result = await deleteApplications(confirmDeleteId);
      console.log("Application deleted:", result);

      // Reset modals
      setConfirmDeleteId(null);
      if (
        selectedApp &&
        (selectedApp._id || selectedApp.id) === confirmDeleteId
      ) {
        setSelectedApp(null);
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">My Applications</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track the status of roles you have applied for across different
            startups.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Total Applied:{" "}
          <span className="text-amber-500 font-bold">
            {applications.length}
          </span>
        </span>
      </div>

      {/* Empty State vs Applications List */}
      {applications.length === 0 ? (
        <EmptyState
          icon="📬"
          title="No applications yet"
          sub="Browse open opportunities and apply to get started."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app, idx) => {
            const appId = app._id || app.id || idx;
            const roleTitle =
              app.opportunityTitle || app.roleTitle || "Collaborator Role";
            const startupName = app.startupName || "Startup";
            const appliedDate = app.appliedDate || app.createdAt || "Recent";

            return (
              <div
                key={appId}
                className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left Column: Role Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-100">
                        {roleTitle}
                      </h4>
                      <StatusBadge status={app.status} />
                    </div>

                    <p className="text-xs text-amber-500 font-medium">
                      @{startupName}
                    </p>

                    <p className="text-xs font-mono text-slate-500 mt-1">
                      Applied:{" "}
                      <span className="text-slate-400">{appliedDate}</span>
                    </p>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedApp(app)}
                    >
                      View Details
                    </Btn>

                    <Btn
                      size="sm"
                      variant="danger"
                      onClick={() => setConfirmDeleteId(appId)}
                    >
                      Delete
                    </Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          title="Submitted Application Details"
          onClose={() => setSelectedApp(null)}
        >
          {(() => {
            const appId = selectedApp._id || selectedApp.id;
            const roleTitle =
              selectedApp.opportunityTitle ||
              selectedApp.roleTitle ||
              "Collaborator Role";

            return (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Role Title
                  </p>
                  <h3 className="font-bold text-lg text-slate-100">
                    {roleTitle}
                  </h3>
                  <p className="text-sm text-amber-500 font-medium mt-0.5">
                    @{selectedApp.startupName || "Startup"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Portfolio / Website Link
                  </p>
                  {selectedApp.portfolioLink ? (
                    <a
                      href={selectedApp.portfolioLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-amber-500 underline hover:text-amber-400 break-all"
                    >
                      {selectedApp.portfolioLink} ↗
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No link provided
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Your Motivation Message
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300 bg-[#060C1A] p-3.5 rounded-xl border border-slate-800">
                    {selectedApp.motivationMessage ||
                      selectedApp.motivation ||
                      "No message provided."}
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    Current Status
                  </span>
                  <StatusBadge status={selectedApp.status} />
                </div>

                <div className="flex gap-3 pt-2">
                  <Btn
                    variant="danger"
                    fullWidth
                    onClick={() => {
                      setConfirmDeleteId(appId);
                    }}
                  >
                    Withdraw & Delete Application
                  </Btn>
                  <Btn
                    variant="ghost"
                    fullWidth
                    onClick={() => setSelectedApp(null)}
                  >
                    Close
                  </Btn>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId !== null && (
        <Modal
          title="Withdraw Application?"
          onClose={() => setConfirmDeleteId(null)}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Are you sure you want to delete this application? Startup founders
              will no longer be able to view your submission.
            </p>

            <div className="flex gap-3 pt-2">
              <Btn
                onClick={handleDelete}
                variant="danger"
                disabled={isDeleting}
                fullWidth
              >
                {isDeleting ? "Deleting..." : "Yes, Withdraw & Delete"}
              </Btn>
              <Btn
                onClick={() => setConfirmDeleteId(null)}
                variant="ghost"
                disabled={isDeleting}
                fullWidth
              >
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
