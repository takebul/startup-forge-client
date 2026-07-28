"use client";

import { useState } from "react";
import {
  Btn,
  Input,
  Label,
  Select,
} from "@/components/Dashboard/founder-dashboard-shared";

export default function AddOpportunityPage() {
  const [form, setForm] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote",
    commitmentLevel: "Part-Time",
    deadline: "",
  });

  function handleSubmit() {
    console.log("Posting Opportunity:", form);
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-slate-100">Add Opportunity</h2>
      <div className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800">
        <div>
          <Label>Role Title</Label>
          <Input
            value={form.roleTitle}
            onChange={(v) => setForm({ ...form, roleTitle: v })}
            placeholder="e.g. Senior Full Stack Engineer"
          />
        </div>
        <div>
          <Label>Required Skills (comma-separated)</Label>
          <Input
            value={form.requiredSkills}
            onChange={(v) => setForm({ ...form, requiredSkills: v })}
            placeholder="React, Node.js, PostgreSQL"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Work Type</Label>
            <Select
              value={form.workType}
              onChange={(v) => setForm({ ...form, workType: v })}
              options={["Remote", "Hybrid", "On-site"]}
            />
          </div>
          <div>
            <Label>Commitment Level</Label>
            <Select
              value={form.commitmentLevel}
              onChange={(v) => setForm({ ...form, commitmentLevel: v })}
              options={["Part-Time", "Full-Time", "Co-Founder", "Contract"]}
            />
          </div>
        </div>
        <div>
          <Label>Application Deadline</Label>
          <Input
            value={form.deadline}
            onChange={(v) => setForm({ ...form, deadline: v })}
            type="date"
          />
        </div>
        <div className="pt-2">
          <Btn onClick={handleSubmit}>Post Opportunity</Btn>
        </div>
      </div>
    </div>
  );
}
