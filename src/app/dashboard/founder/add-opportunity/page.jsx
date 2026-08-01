"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  TextField,
  Label,
  InputGroup,
  Button,
  Description,
  FieldError,
} from "@heroui/react";

import { Select, Modal } from "@/components/Dashboard/founder-dashboard-shared";
import { createOpportunity } from "@/lib/actions/opportunities";
import { authClient } from "@/lib/auth-client";

export default function AddOpportunityPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote",
    commitmentLevel: "Part-Time",
    deadline: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User session not found. Please log in again.");
      }

      const response = await createOpportunity({ ...form, userId: user.id });

      // Handle case where server response indicates an error or falsy return
      if (response?.error) {
        throw new Error(response.error);
      }

      console.log("Posted Opportunity Successfully:", response);
      setIsSuccess(true);
    } catch (err) {
      console.error("Error creating opportunity:", err);
      setError(err.message || "Failed to add opportunity. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({
      roleTitle: "",
      requiredSkills: "",
      workType: "Remote",
      commitmentLevel: "Part-Time",
      deadline: "",
    });
    setError(null);
  }

  function handleCreateAnother() {
    handleReset();
    setIsSuccess(false);
  }

  return (
    <div className="p-8 space-y-6 max-w-8xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Add Opportunity</h2>
        <p className="text-xs text-slate-400 mt-1">
          Post a new collaborative role to recruit talent for your startup.
        </p>
      </div>

      {/* Error Message Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-mono underline hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

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
            isDisabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Opportunity"}
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

      {/* Success Modal */}
      {isSuccess && (
        <Modal title="Opportunity Created!" onClose={() => setIsSuccess(false)}>
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Opportunity Posted Successfully
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your role for{" "}
                <span className="text-amber-500 font-semibold">
                  {form.roleTitle}
                </span>{" "}
                is now live. What would you like to do next?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                onClick={() =>
                  router.push(
                    `/dashboard/founder/manage-opportunities?userId=${user?.id}`,
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer"
              >
                Go to Manage Opportunities
              </Button>
              <Button
                type="button"
                onClick={handleCreateAnother}
                className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-all cursor-pointer"
              >
                Create Another Opportunity
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
