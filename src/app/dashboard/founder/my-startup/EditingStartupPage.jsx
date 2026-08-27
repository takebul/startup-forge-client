"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, TextField, Label, Input, Button } from "@heroui/react";
import {
  Select,
  Textarea,
  ImageUpload,
  Btn,
} from "@/components/Dashboard/founder-dashboard-shared";
import { updateStartup } from "@/lib/actions/startup";
import { toast } from "@/components/Toast/Toast";

export default function EditingStartupPage({ startup, onCancel }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startupId = startup?.id || startup?._id;

  // Initial form state seeded from the startup prop
  const [formData, setFormData] = useState({
    startup_name: startup?.startup_name || startup?.name || "",
    logo: startup?.logo || "",
    industry: startup?.industry || "Artificial Intelligence",
    funding_stage: startup?.funding_stage || startup?.fundingStage || "Seed",
    founder_email: startup?.founder_email || startup?.founderEmail || "",
    description: startup?.description || "",
  });

  // Dropdown options for industry & funding stage
  const industries = [
    "Artificial Intelligence",
    "CleanTech",
    "FinTech",
    "HealthTech",
    "Other",
  ];
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped"];

  // Submit handler: update startup, refresh server data, then exit edit mode
  async function handleUpdate(e) {
    e.preventDefault();
    if (!startupId) return;

    setLoading(true);
    try {
      const res = await updateStartup(startupId, formData);
      console.log("Update Success:", res);

      // Re-trigger Next.js server fetch to refresh page data
      router.refresh();
      toast.update("Startup Updated!", `"${formData.startup_name}" details have been updated successfully.`);

      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to update startup:", error);
      toast.error("Update Failed", error.message || "Failed to update startup details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl font-sans">
      {/* Page Header & Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Update Startup
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Modify details for {formData.startup_name || "your startup"}.
          </p>
        </div>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
          >
            ← Back to List
          </Button>
        )}
      </div>

      {/* Edit Startup Form */}
      <Form
        onSubmit={handleUpdate}
        className="rounded-2xl p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800"
      >
        {/* Startup Name */}
        <TextField className="w-full">
          <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Startup Name
          </Label>
          <Input
            value={formData.startup_name}
            onChange={(e) =>
              setFormData({ ...formData, startup_name: e.target.value })
            }
            required
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500"
          />
        </TextField>

        {/* Logo Upload */}
        <div>
          <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Logo
          </Label>
          <ImageUpload
            value={formData.logo}
            onChange={(url) => setFormData({ ...formData, logo: url })}
          />
        </div>

        {/* Industry & Funding Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Industry
            </Label>
            <Select
              value={formData.industry}
              onChange={(v) => setFormData({ ...formData, industry: v })}
              options={industries}
            />
          </div>
          <div>
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Funding Stage
            </Label>
            <Select
              value={formData.funding_stage}
              onChange={(v) => setFormData({ ...formData, funding_stage: v })}
              options={stages}
            />
          </div>
        </div>

        {/* Founder Email (read-only) */}
        <TextField className="w-full">
          <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Founder Email
          </Label>
          <Input
            type="email"
            disabled
            value={formData.founder_email}
            onChange={(e) =>
              setFormData({ ...formData, founder_email: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-slate-100 border border-slate-200 text-slate-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-400 cursor-not-allowed"
          />
        </TextField>

        {/* Description */}
        <TextField className="w-full">
          <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description
          </Label>
          <Textarea
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
          />
        </TextField>

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            isDisabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
