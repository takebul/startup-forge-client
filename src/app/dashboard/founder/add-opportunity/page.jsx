"use client";

import { useState } from "react";
import {
  Form,
  TextField,
  Label,
  InputGroup,
  Button,
  Description,
  FieldError,
} from "@heroui/react";

import { Select } from "@/components/Dashboard/founder-dashboard-shared";

export default function AddOpportunityPage() {
  const [form, setForm] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote",
    commitmentLevel: "Part-Time",
    deadline: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Posting Opportunity:", form);
  }

  function handleReset() {
    setForm({
      roleTitle: "",
      requiredSkills: "",
      workType: "Remote",
      commitmentLevel: "Part-Time",
      deadline: "",
    });
  }

  return (
    <div className="p-8 space-y-6 max-w-8xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Add Opportunity</h2>
        <p className="text-xs text-slate-400 mt-1">
          Post a new collaborative role to recruit talent for your startup.
        </p>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800"
      >
        {/* Role Title with HeroUI TextField & InputGroup */}
        <TextField isRequired className="w-full">
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Role Title
          </Label>
          <InputGroup>
            <InputGroup.Prefix className="pl-3 text-slate-500">
              💼
            </InputGroup.Prefix>
            <InputGroup.Input
              value={form.roleTitle}
              onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer"
              required
              className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200"
            />
          </InputGroup>
          <Description className="text-[11px] text-slate-500 mt-1">
            Specify the exact role title you are hiring for.
          </Description>
          <FieldError className="text-xs text-red-400" />
        </TextField>

        {/* Required Skills with HeroUI TextField & InputGroup */}
        <TextField isRequired className="w-full">
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Required Skills (comma-separated)
          </Label>
          <InputGroup>
            <InputGroup.Prefix className="pl-3 text-slate-500">
              🛠️
            </InputGroup.Prefix>
            <InputGroup.Input
              value={form.requiredSkills}
              onChange={(e) =>
                setForm({ ...form, requiredSkills: e.target.value })
              }
              placeholder="React, Node.js, PostgreSQL"
              required
              className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200"
            />
          </InputGroup>
          <Description className="text-[11px] text-slate-500 mt-1">
            Separate each required skill or tool with a comma.
          </Description>
          <FieldError className="text-xs text-red-400" />
        </TextField>

        {/* Work Type & Commitment Level using custom shared Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Work Type
            </Label>
            <Select
              value={form.workType}
              onChange={(v) => setForm({ ...form, workType: v })}
              options={["Remote", "Hybrid", "On-site"]}
            />
          </div>
          <div>
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Commitment Level
            </Label>
            <Select
              value={form.commitmentLevel}
              onChange={(v) => setForm({ ...form, commitmentLevel: v })}
              options={["Part-Time", "Full-Time", "Co-Founder", "Contract"]}
            />
          </div>
        </div>

        {/* Application Deadline with HeroUI TextField & InputGroup */}
        <TextField isRequired className="w-full">
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Application Deadline
          </Label>
          <InputGroup>
            <InputGroup.Prefix className="pl-3 text-slate-500">
              📅
            </InputGroup.Prefix>
            <InputGroup.Input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200"
            />
          </InputGroup>
          <FieldError className="text-xs text-red-400" />
        </TextField>

        {/* Actions with HeroUI Button */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer"
          >
            Post Opportunity
          </Button>
          <Button
            type="reset"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-all cursor-pointer"
          >
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
