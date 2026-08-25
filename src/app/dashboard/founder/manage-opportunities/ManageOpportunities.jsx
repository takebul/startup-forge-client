"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Btn,
  Input,
  Label,
  Select,
  Badge,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";
import {
  updateOpportunity,
  deleteOpportunity,
} from "@/lib/actions/opportunities";

const WORK_TYPE_STYLES = {
  Remote: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Hybrid: { bg: "rgba(99,102,241,0.12)", color: "#818CF8" },
  "On-site": { bg: "rgba(2,132,199,0.12)", color: "#0284C7" },
};

// Helper function: Safely converts strings or arrays into a clean Array
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

export default function ManageOpportunities({ founderOpportunities }) {
  const router = useRouter();

  // Normalize userOpportunities safely
  const parseOpportunities = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.opportunities)) return data.opportunities;
    return [];
  };

  const [opportunities, setOpportunities] = useState(() =>
    parseOpportunities(founderOpportunities),
  );

  useEffect(() => {
    setOpportunities(parseOpportunities(founderOpportunities));
  }, [founderOpportunities]);

  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Update API integration
  async function handleUpdate() {
    if (!editing) return;
    const targetId = editing._id || editing.id;
    if (!targetId) return;

    setLoading(true);
    try {
      const res = await updateOpportunity(targetId, editing);
      console.log("Updated opportunity successfully:", res);

      // Refresh Server Components to fetch fresh list
      router.refresh();
      setEditing(null);
    } catch (error) {
      console.error("Failed to update opportunity:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Delete API integration
  async function handleDelete(id) {
    if (!id) return;

    setLoading(true);
    try {
      const res = await deleteOpportunity(id);
      console.log("Deleted opportunity successfully:", res);

      // Refresh Server Components to fetch fresh list
      router.refresh();
      setConfirmDelete(null);
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Manage Opportunities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View, edit, or remove active job postings for your startup.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl w-fit shadow-xs">
          Total Posted:{" "}
          <span className="text-violet-600 dark:text-violet-400 font-bold font-mono">
            {opportunities.length}
          </span>
        </span>
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-3xl p-14 text-center bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
            No active opportunities
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You haven't posted any open roles yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((o) => {
            const itemId = o._id || o.id;
            const badgeStyle = WORK_TYPE_STYLES[o.workType] || {
              bg: "rgba(124,58,237,0.1)",
              color: "#7C3AED",
            };

            const skillsList = getSkillsArray(o.requiredSkills);

            return (
              <div
                key={itemId}
                className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm hover:border-violet-500/40 dark:bg-[#0D1528] dark:border-slate-800 dark:hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header badges & Title */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {o.roleTitle}
                      </h4>
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium"
                        style={{
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                        }}
                      >
                        {o.workType}
                      </span>
                      <Badge label={o.commitmentLevel} variant="gray" />
                    </div>

                    {/* Required Skills tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {skillsList.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Deadline */}
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Application Deadline:{" "}
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">
                        {o.deadline}
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Btn
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(o)}
                    >
                      Edit
                    </Btn>
                    <Btn
                      size="sm"
                      variant="danger"
                      onClick={() => setConfirmDelete(itemId)}
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

      {/* Edit Opportunity Modal */}
      {editing && (
        <Modal title="Edit Opportunity" onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <div>
              <Label>Role Title</Label>
              <Input
                value={editing.roleTitle || ""}
                onChange={(v) => setEditing({ ...editing, roleTitle: v })}
              />
            </div>

            <div>
              <Label>Required Skills (comma-separated)</Label>
              <Input
                value={getSkillsArray(editing.requiredSkills).join(", ")}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    requiredSkills: v.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Work Type</Label>
                <Select
                  value={editing.workType || "Remote"}
                  onChange={(v) => setEditing({ ...editing, workType: v })}
                  options={["Remote", "Hybrid", "On-site"]}
                />
              </div>
              <div>
                <Label>Commitment</Label>
                <Select
                  value={editing.commitmentLevel || "Part-Time"}
                  onChange={(v) =>
                    setEditing({ ...editing, commitmentLevel: v })
                  }
                  options={["Part-Time", "Full-Time", "Co-Founder", "Contract"]}
                />
              </div>
            </div>

            <div>
              <Label>Deadline</Label>
              <Input
                value={editing.deadline || ""}
                onChange={(v) => setEditing({ ...editing, deadline: v })}
                type="date"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Btn onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Btn>
              <Btn
                variant="ghost"
                onClick={() => setEditing(null)}
                disabled={loading}
              >
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <Modal
          title="Delete Opportunity?"
          onClose={() => setConfirmDelete(null)}
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Are you sure you want to remove this opportunity? Applicants will no
            longer be able to submit applications.
          </p>
          <div className="flex gap-3">
            <Btn
              onClick={() => handleDelete(confirmDelete)}
              variant="danger"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Btn>
            <Btn
              onClick={() => setConfirmDelete(null)}
              variant="ghost"
              disabled={loading}
            >
              Cancel
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
