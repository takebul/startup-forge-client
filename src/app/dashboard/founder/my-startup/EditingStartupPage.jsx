"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, TextField, Label, Input, Button } from "@heroui/react";
import {
  Select,
  Textarea,
  ImageUpload,
} from "@/components/Dashboard/founder-dashboard-shared";
import { updateStartup } from "@/lib/actions/startup";

export default function EditingStartupPage({ startup, onCancel }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startupId = startup?.id || startup?._id;

  const [formData, setFormData] = useState({
    startup_name: startup?.startup_name || startup?.name || "",
    logo: startup?.logo || "",
    industry: startup?.industry || "Artificial Intelligence",
    funding_stage: startup?.funding_stage || startup?.fundingStage || "Seed",
    founder_email: startup?.founder_email || startup?.founderEmail || "",
    description: startup?.description || "",
  });

  const industries = [
    "Artificial Intelligence",
    "CleanTech",
    "FinTech",
    "HealthTech",
    "Other",
  ];
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped"];

  async function handleUpdate(e) {
    e.preventDefault();
    if (!startupId) return;

    setLoading(true);
    try {
      const res = await updateStartup(startupId, formData);
      console.log("Update Success:", res);

      // Re-trigger Next.js server fetch to refresh page data
      router.refresh();

      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to update startup:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Update Startup</h2>
          <p className="text-xs text-slate-400 mt-1">
            Modify details for {formData.startup_name || "your startup"}.
          </p>
        </div>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl font-medium text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-all cursor-pointer"
          >
            ← Back to List
          </Button>
        )}
      </div>

      <Form
        onSubmit={handleUpdate}
        className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800"
      >
        <TextField className="w-full">
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Startup Name
          </Label>
          <Input
            value={formData.startup_name}
            onChange={(e) =>
              setFormData({ ...formData, startup_name: e.target.value })
            }
            required
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50"
          />
        </TextField>

        <div>
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Logo
          </Label>
          <ImageUpload
            value={formData.logo}
            onChange={(url) => setFormData({ ...formData, logo: url })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Industry
            </Label>
            <Select
              value={formData.industry}
              onChange={(v) => setFormData({ ...formData, industry: v })}
              options={industries}
            />
          </div>
          <div>
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Funding Stage
            </Label>
            <Select
              value={formData.funding_stage}
              onChange={(v) => setFormData({ ...formData, funding_stage: v })}
              options={stages}
            />
          </div>
        </div>

        <TextField className="w-full">
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Founder Email
          </Label>
          <Input
            type="email"
            value={formData.founder_email}
            onChange={(e) =>
              setFormData({ ...formData, founder_email: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50"
          />
        </TextField>

        <TextField className="w-full">
          <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
            Description
          </Label>
          <Textarea
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
          />
        </TextField>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            isDisabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
