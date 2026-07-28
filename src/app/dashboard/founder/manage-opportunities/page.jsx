"use client";

import { useState } from "react";
import {
  Btn,
  Input,
  Label,
  Select,
  Badge,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";

// Seed data to render initially
const INITIAL_OPPORTUNITIES = [
  {
    id: "op-1",
    startupId: "st-1",
    startupName: "NexusAI",
    roleTitle: "Senior Full Stack Engineer",
    requiredSkills: ["React", "Node.js", "PostgreSQL"],
    workType: "Remote",
    commitmentLevel: "Part-Time",
    deadline: "2026-08-15",
  },
  {
    id: "op-2",
    startupId: "st-1",
    startupName: "NexusAI",
    roleTitle: "AI/ML Backend Developer",
    requiredSkills: ["Python", "PyTorch", "FastAPI"],
    workType: "Remote",
    commitmentLevel: "Co-Founder",
    deadline: "2026-09-01",
  },
  {
    id: "op-3",
    startupId: "st-1",
    startupName: "NexusAI",
    roleTitle: "Growth Marketer",
    requiredSkills: ["SEO", "Paid Ads", "Analytics"],
    workType: "Hybrid",
    commitmentLevel: "Part-Time",
    deadline: "2026-08-20",
  },
];

const WORK_TYPE_STYLES = {
  Remote: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Hybrid: { bg: "rgba(99,102,241,0.12)", color: "#818CF8" },
  "On-site": { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
};

export default function ManageOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Update existing opportunity state
  function handleUpdate() {
    if (!editing) return;
    setOpportunities(
      opportunities.map((o) => (o.id === editing.id ? editing : o)),
    );
    setEditing(null);
  }

  // Delete opportunity state
  function handleDelete(id) {
    setOpportunities(opportunities.filter((o) => o.id !== id));
    setConfirmDelete(null);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Manage Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View, edit, or remove active job postings for your startup.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Total Posted:{" "}
          <span className="text-amber-500 font-bold">
            {opportunities.length}
          </span>
        </span>
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-2xl p-14 text-center bg-[#0D1528] border border-slate-800">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold text-base text-slate-200 mb-1">
            No active opportunities
          </p>
          <p className="text-sm text-slate-500">
            You haven't posted any open roles yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((o) => {
            const badgeStyle = WORK_TYPE_STYLES[o.workType] || {
              bg: "rgba(255,255,255,0.05)",
              color: "#94A3B8",
            };

            return (
              <div
                key={o.id}
                className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header badges & Title */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-slate-100">
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
                      {o.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-white/5 text-slate-400 border border-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Deadline */}
                    <p className="text-xs font-mono text-slate-500">
                      Application Deadline:{" "}
                      <span className="text-slate-400">{o.deadline}</span>
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
                      onClick={() => setConfirmDelete(o.id)}
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
                value={editing.roleTitle}
                onChange={(v) => setEditing({ ...editing, roleTitle: v })}
              />
            </div>
            <div>
              <Label>Required Skills (comma-separated)</Label>
              <Input
                value={editing.requiredSkills.join(", ")}
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
                  value={editing.workType}
                  onChange={(v) => setEditing({ ...editing, workType: v })}
                  options={["Remote", "Hybrid", "On-site"]}
                />
              </div>
              <div>
                <Label>Commitment</Label>
                <Select
                  value={editing.commitmentLevel}
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
                value={editing.deadline}
                onChange={(v) => setEditing({ ...editing, deadline: v })}
                type="date"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Btn onClick={handleUpdate}>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setEditing(null)}>
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
          <p className="text-sm text-slate-400 mb-5">
            Are you sure you want to remove this opportunity? Applicants will no
            longer be able to submit applications.
          </p>
          <div className="flex gap-3">
            <Btn onClick={() => handleDelete(confirmDelete)} variant="danger">
              Yes, Delete
            </Btn>
            <Btn onClick={() => setConfirmDelete(null)} variant="ghost">
              Cancel
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
