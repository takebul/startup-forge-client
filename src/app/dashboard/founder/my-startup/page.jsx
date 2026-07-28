"use client";

import { useState } from "react";
import {
  Btn,
  Input,
  Label,
  Select,
  Textarea,
  ImageUpload,
  Badge,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";

export default function FounderMyStartupPage() {
  const [startup, setStartup] = useState({
    id: "st-1",
    name: "NexusAI",
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop",
    industry: "Artificial Intelligence",
    description:
      "Autonomous workflow agents that eliminate repetitive enterprise tasks.",
    fundingStage: "Seed",
    founderEmail: "sarah@nexusai.io",
    approved: true,
  });

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const industries = [
    "Artificial Intelligence",
    "CleanTech",
    "FinTech",
    "HealthTech",
    "Other",
  ];
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped"];

  if (editing) {
    return (
      <div className="p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-100">Update Startup</h2>
        <div className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800">
          <div>
            <Label>Startup Name</Label>
            <Input
              value={startup.name}
              onChange={(v) => setStartup({ ...startup, name: v })}
            />
          </div>
          <div>
            <Label>Logo</Label>
            <ImageUpload
              value={startup.logo}
              onChange={(url) => setStartup({ ...startup, logo: url })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Industry</Label>
              <Select
                value={startup.industry}
                onChange={(v) => setStartup({ ...startup, industry: v })}
                options={industries}
              />
            </div>
            <div>
              <Label>Funding Stage</Label>
              <Select
                value={startup.fundingStage}
                onChange={(v) => setStartup({ ...startup, fundingStage: v })}
                options={stages}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={startup.description}
              onChange={(v) => setStartup({ ...startup, description: v })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Btn onClick={() => setEditing(false)}>Save Changes</Btn>
            <Btn variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-100">My Startup</h2>
      <div className="rounded-2xl bg-[#0D1528] border border-slate-800 p-6">
        <div className="flex items-start gap-4 mb-5">
          <img
            src={startup.logo}
            alt={startup.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-100">
                {startup.name}
              </h3>
              <Badge
                label={startup.approved ? "Approved" : "Pending"}
                variant={startup.approved ? "green" : "amber"}
              />
            </div>
            <p className="text-sm text-slate-400">
              {startup.industry} · {startup.fundingStage}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-6">{startup.description}</p>
        <div className="flex gap-3 border-t border-slate-800 pt-4">
          <Btn onClick={() => setEditing(true)} variant="outline">
            Update Startup
          </Btn>
          <Btn onClick={() => setConfirmDelete(true)} variant="danger">
            Delete Startup
          </Btn>
        </div>
      </div>

      {confirmDelete && (
        <Modal title="Delete Startup?" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-slate-400 mb-5">
            Are you sure? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Btn onClick={() => setStartup(null)} variant="danger">
              Yes, Delete
            </Btn>
            <Btn onClick={() => setConfirmDelete(false)} variant="ghost">
              Cancel
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
