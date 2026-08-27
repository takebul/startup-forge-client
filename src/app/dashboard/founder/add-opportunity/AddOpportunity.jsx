"use client";

import { useState, useEffect, useMemo } from "react";
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
import { toast } from "@/components/Toast/Toast";

function parseOpportunities(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function AddOpportunity({ opportunities = [], plans }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // 1. Maintain local state for opportunities so count updates instantly
  const [localOpps, setLocalOpps] = useState(() =>
    parseOpportunities(opportunities),
  );

  // Sync state if server props update
  useEffect(() => {
    setLocalOpps(parseOpportunities(opportunities));
  }, [opportunities]);

  // 2. Extract active plan cleanly
  const activePlan = useMemo(() => {
    const p = Array.isArray(plans) ? plans[0] : plans?.data || plans;
    return (
      p || {
        name: "Free",
        maxApplicationPerMonth: 3,
      }
    );
  }, [plans]);

  // 3. Plan quota & locking logic (Calculated from localOpps)
  const createdCount = localOpps.length;
  const maxAllowed = activePlan?.maxApplicationPerMonth || 3;
  const planName = activePlan?.name || "Free";
  const isLocked = createdCount >= maxAllowed;
  const usagePercentage = Math.min(
    Math.round((createdCount / maxAllowed) * 100),
    100,
  );

  // Extract startup name from existing opportunities or fallback
  const startupName = localOpps[0]?.startupName || "My Startup";

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

    if (isLocked) return;

    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User session not found. Please log in again.");
      }

      const payload = {
        ...form,
        startupId: user?.id,
        startupName: startupName,
      };

      const response = await createOpportunity(payload);

      if (response?.error) {
        throw new Error(response.error);
      }

      console.log("Opportunity posted successfully:", response);

      // 🔥 INSTANT LOCAL STATE UPDATE: Increments count immediately in UI
      const createdItem =
        response?.insertedId || response?._id
          ? { ...payload, _id: response.insertedId || response._id }
          : payload;

      setLocalOpps((prev) => [...prev, createdItem]);

      // Refresh Next.js Server Components in the background
      router.refresh();

      setIsSuccess(true);
      toast.create("Opportunity Published!", "Your role is now live and accepting applications.");
    } catch (err) {
      console.error("Error creating opportunity:", err);
      setError(err.message || "Failed to add opportunity. Please try again.");
      toast.error("Failed to Post Opportunity", err.message || "Please try again.");
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Add Opportunity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Post a new collaborative role to recruit talent for{" "}
          <span className="text-violet-600 dark:text-violet-400 font-semibold font-mono">
            @{startupName}
          </span>
          .
        </p>
      </div>

      {/* PLAN USAGE CARD WITH VIEW PLANS BUTTON */}
      <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                Current Plan:
              </span>
              <span className="font-bold font-mono text-violet-700 bg-violet-50 border border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20 px-2.5 py-0.5 rounded-lg">
                {planName}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">
              |
            </span>

            <span className="font-mono text-slate-700 dark:text-slate-300">
              <strong
                className={
                  isLocked
                    ? "text-red-500 dark:text-red-400"
                    : "text-violet-600 dark:text-violet-400 font-bold"
                }
              >
                {createdCount}
              </strong>{" "}
              / {maxAllowed} Posted
            </span>
          </div>

          {/* View Plans Button */}
          <Button
            type="button"
            onClick={() => router.push("/pricing")}
            className="px-3.5 py-1.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer w-fit flex items-center gap-1.5"
          >
            <span>⚡</span>
            <span>View Plans</span>
          </Button>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-100 dark:bg-[#060C1A] border border-slate-200 dark:border-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isLocked
                ? "bg-red-500"
                : "bg-gradient-to-r from-violet-600 to-indigo-500"
            }`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Error Message Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center justify-between font-mono">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="font-mono underline hover:text-red-600 dark:hover:text-red-300 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PAGE STATE: LOCKED VS FORM */}
      {isLocked ? (
        <div className="rounded-2xl p-10 bg-white border border-slate-200 dark:bg-[#0D1528] dark:border-slate-800 text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20 flex items-center justify-center text-3xl mx-auto font-bold">
            🔒
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Opportunity Limit Reached
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You have used all{" "}
              <span className="text-violet-600 dark:text-violet-400 font-mono font-bold">
                {maxAllowed}
              </span>{" "}
              posting slots on your{" "}
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {planName}
              </span>{" "}
              plan. Upgrade your subscription to continue recruiting top talent.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => router.push("/pricing")}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all cursor-pointer shadow-md shadow-violet-600/20"
            >
              ⚡ Upgrade Your Plan
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/pricing")}
              className="px-5 py-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
            >
              View All Plans
            </Button>
          </div>
        </div>
      ) : (
        <Form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800"
        >
          {/* Role Title */}
          <TextField isRequired className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Role Title
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-400 dark:text-slate-500">
                💼
              </InputGroup.Prefix>
              <InputGroup.Input
                value={form.roleTitle}
                onChange={(e) =>
                  setForm({ ...form, roleTitle: e.target.value })
                }
                placeholder="e.g. Senior Full Stack Engineer"
                required
                className="w-full px-3 py-2.5 text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 rounded-xl"
              />
            </InputGroup>
            <Description className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Specify the exact role title you are hiring for.
            </Description>
            <FieldError className="text-xs text-red-500 dark:text-red-400" />
          </TextField>

          {/* Required Skills */}
          <TextField isRequired className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Required Skills (comma-separated)
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-400 dark:text-slate-500">
                🛠️
              </InputGroup.Prefix>
              <InputGroup.Input
                value={form.requiredSkills}
                onChange={(e) =>
                  setForm({ ...form, requiredSkills: e.target.value })
                }
                placeholder="React, Node.js, PostgreSQL"
                required
                className="w-full px-3 py-2.5 text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 rounded-xl"
              />
            </InputGroup>
            <Description className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Separate each required skill or tool with a comma.
            </Description>
            <FieldError className="text-xs text-red-500 dark:text-red-400" />
          </TextField>

          {/* Work Type & Commitment Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Work Type
              </Label>
              <Select
                value={form.workType}
                onChange={(v) => setForm({ ...form, workType: v })}
                options={["Remote", "Hybrid", "On-site"]}
                className="dark:focus:bg-[#060C1A]"
              />
            </div>

            <div>
              <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Commitment Level
              </Label>
              <Select
                value={form.commitmentLevel}
                onChange={(v) => setForm({ ...form, commitmentLevel: v })}
                options={["Part-Time", "Full-Time", "Co-Founder", "Contract"]}
                className="dark:focus:bg-[#060C1A]"
              />
            </div>
          </div>

          {/* Application Deadline */}
          <TextField isRequired className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Application Deadline
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-400 dark:text-slate-500">
                📅
              </InputGroup.Prefix>
              <InputGroup.Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
                className="w-full px-3 py-2.5 text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 rounded-xl"
              />
            </InputGroup>
            <FieldError className="text-xs text-red-500 dark:text-red-400" />
          </TextField>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="submit"
              isDisabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Opportunity"}
            </Button>
            <Button
              type="reset"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </Form>
      )}

      {/* Success Modal */}
      {isSuccess && (
        <Modal title="Opportunity Created!" onClose={() => setIsSuccess(false)}>
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Opportunity Posted Successfully
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your role for{" "}
                <span className="text-violet-600 dark:text-violet-400 font-semibold font-mono">
                  {form.roleTitle}
                </span>{" "}
                is now live. What would you like to do next?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                onClick={() =>
                  router.push("/dashboard/founder/manage-opportunities")
                }
                className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              >
                Go to Manage Opportunities
              </Button>
              <Button
                type="button"
                onClick={handleCreateAnother}
                className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
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
