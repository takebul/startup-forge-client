"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  TextField,
  Label,
  Input,
  InputGroup,
  Button,
  Description,
  FieldError,
} from "@heroui/react";

import {
  Btn,
  Select,
  Textarea,
  ImageUpload,
  Badge,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";

import {
  createStartup,
  deleteStartup,
  updateStartup,
} from "@/lib/actions/startup";

export default function FounderMyStartups({ founder, startups }) {
  const router = useRouter();

  // Normalize initial prop to array
  const [startupList, setStartupList] = useState(
    Array.isArray(startups) ? startups : startups ? [startups] : [],
  );

  const [isCreating, setIsCreating] = useState(false);
  const [editingStartup, setEditingStartup] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state for creating a new startup
  const [newStartup, setNewStartup] = useState({
    startup_name: "",
    logo: "",
    industry: "Artificial Intelligence",
    description: "",
    funding_stage: "Seed",
    founder_email: "",
    status: "Pending",
  });

  const industries = [
    "Artificial Intelligence",
    "CleanTech",
    "FinTech",
    "HealthTech",
    "Other",
  ];
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped"];

  // Handler to create a new startup using HeroUI Form
  async function handleCreateStartup(e) {
    e.preventDefault();
    if (!newStartup.startup_name.trim()) return;

    const result = await createStartup({
      ...newStartup,
      startupId: founder?.id,
    });
    console.log(result);

    // Append new startup to local list
    setStartupList([...startupList, { ...newStartup, id: `st-${Date.now()}` }]);

    // Reset create form state & hide creation view
    setNewStartup({
      startup_name: "",
      logo: "",
      industry: "Artificial Intelligence",
      description: "",
      funding_stage: "Seed",
      founder_email: "",
    });
    setIsCreating(false);
  }

  // =========================================================================
  // HANDLER TO UPDATE / EDIT A STARTUP
  // =========================================================================
  async function handleEditing(e) {
    e.preventDefault();
    const id = editingStartup?._id || editingStartup?.id;

    setLoading(true);
    try {
      const result = await updateStartup(id, editingStartup);
      console.log("Update result:", result);

      // Re-fetch Server Component data & reset editing view
      router.refresh();
      setEditingStartup(null);
    } catch (error) {
      console.error("Failed to update startup:", error);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================================
  // HANDLER TO DELETE A STARTUP
  // =========================================================================
  async function handleDelete() {
    if (!confirmDeleteId) return;

    setLoading(true);
    try {
      const result = await deleteStartup(confirmDeleteId);
      console.log("Delete result:", result);

      // Re-fetch Server Component data & close modal
      router.refresh();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Failed to delete startup:", error);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================================
  // 1. IF EMPTY (startupList.length === 0) OR CREATING MODE: SHOW CREATE FORM
  // =========================================================================
  if (!startupList || startupList.length === 0 || isCreating) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Create Startup Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the details below to publish a new startup on StartupForge.
          </p>
        </div>

        <Form
          onSubmit={handleCreateStartup}
          className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800"
        >
          {/* Startup Name */}
          <TextField isRequired className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Startup Name
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-500">
                🚀
              </InputGroup.Prefix>
              <InputGroup.Input
                value={newStartup.startup_name}
                onChange={(e) =>
                  setNewStartup({ ...newStartup, startup_name: e.target.value })
                }
                placeholder="e.g. NexusAI"
                required
                className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200"
              />
            </InputGroup>
            <Description className="text-[11px] text-slate-500 mt-1">
              Your registered or brand name.
            </Description>
            <FieldError className="text-xs text-red-400" />
          </TextField>

          {/* Logo Upload */}
          <div>
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Logo
            </Label>
            <ImageUpload
              value={newStartup.logo}
              onChange={(url) => setNewStartup({ ...newStartup, logo: url })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
                Industry
              </Label>
              <Select
                value={newStartup.industry}
                onChange={(v) => setNewStartup({ ...newStartup, industry: v })}
                options={industries}
              />
            </div>
            <div>
              <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
                Funding Stage
              </Label>
              <Select
                value={newStartup.funding_stage}
                onChange={(v) =>
                  setNewStartup({ ...newStartup, funding_stage: v })
                }
                options={stages}
              />
            </div>
          </div>

          {/* Founder Email */}
          <TextField isRequired className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Founder Email
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-500">
                ✉️
              </InputGroup.Prefix>
              <InputGroup.Input
                type="email"
                value={newStartup.founder_email}
                onChange={(e) =>
                  setNewStartup({
                    ...newStartup,
                    founder_email: e.target.value,
                  })
                }
                placeholder="founder@example.com"
                className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200"
              />
            </InputGroup>
          </TextField>

          {/* Description */}
          <TextField className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Description
            </Label>
            <InputGroup>
              <InputGroup.TextArea
                value={newStartup.description}
                onChange={(e) =>
                  setNewStartup({ ...newStartup, description: e.target.value })
                }
                placeholder="Describe your startup's core mission and product..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200 resize-none"
              />
            </InputGroup>
          </TextField>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer"
            >
              Create Startup
            </Button>
            <Button
              type="reset"
              onClick={() =>
                setNewStartup({
                  startup_name: "",
                  logo: "",
                  industry: "Artificial Intelligence",
                  description: "",
                  funding_stage: "Seed",
                  founder_email: "",
                })
              }
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-all cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  // =========================================================================
  // 2. EDITING STATE: RENDER UPDATE FORM
  // =========================================================================
  if (editingStartup) {
    return (
      <div className="p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-100">Update Startup</h2>
        <Form
          onSubmit={handleEditing}
          className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800"
        >
          <TextField className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Startup Name
            </Label>
            <Input
              value={editingStartup.startup_name || editingStartup.name || ""}
              onChange={(e) =>
                setEditingStartup({
                  ...editingStartup,
                  startup_name: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50"
            />
          </TextField>

          <div>
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Logo
            </Label>
            <ImageUpload
              value={editingStartup.logo || ""}
              onChange={(url) =>
                setEditingStartup({ ...editingStartup, logo: url })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
                Industry
              </Label>
              <Select
                value={editingStartup.industry || "Artificial Intelligence"}
                onChange={(v) =>
                  setEditingStartup({ ...editingStartup, industry: v })
                }
                options={industries}
              />
            </div>
            <div>
              <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
                Funding Stage
              </Label>
              <Select
                value={
                  editingStartup.funding_stage ||
                  editingStartup.fundingStage ||
                  "Seed"
                }
                onChange={(v) =>
                  setEditingStartup({ ...editingStartup, funding_stage: v })
                }
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
              value={
                editingStartup.founder_email ||
                editingStartup.founderEmail ||
                ""
              }
              onChange={(e) =>
                setEditingStartup({
                  ...editingStartup,
                  founder_email: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50"
            />
          </TextField>

          <TextField className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Description
            </Label>
            <Textarea
              value={editingStartup.description || ""}
              onChange={(v) =>
                setEditingStartup({
                  ...editingStartup,
                  description: v,
                })
              }
            />
          </TextField>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isDisabled={loading}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={() => setEditingStartup(null)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  // =========================================================================
  // 3. DETAILED CARD DISPLAY STATE (NO TABLE, NO CREATE BUTTON, NO TOTAL BADGE)
  // =========================================================================
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">My Startup</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your registered startup profile and details.
        </p>
      </div>

      <div className="space-y-4">
        {startupList.map((item, idx) => {
          const itemId = item._id || item.id || idx;
          const name = item.startup_name || item.name || "Untitled";
          const isApproved = item.status === "Approved" || item.approved;

          return (
            <div
              key={itemId}
              className="rounded-2xl bg-[#0D1528] border border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#060C1A] border border-slate-800 flex items-center justify-center">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-amber-500 font-bold text-lg">
                      {name[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-100">{name}</h3>
                    <Badge
                      label={isApproved ? "Approved" : "Pending Review"}
                      variant={isApproved ? "green" : "amber"}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {item.industry} ·{" "}
                    {item.funding_stage || item.fundingStage || "N/A"}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {item.founder_email || item.founderEmail || "N/A"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description || "No description provided."}
              </p>

              <div className="flex gap-3 pt-4 border-t border-slate-800/80">
                <Btn
                  onClick={() => setEditingStartup(item)}
                  variant="outline"
                  size="sm"
                >
                  Update Startup
                </Btn>
                <Btn
                  onClick={() => setConfirmDeleteId(itemId)}
                  variant="danger"
                  size="sm"
                >
                  Delete Startup
                </Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId !== null && (
        <Modal title="Delete Startup?" onClose={() => setConfirmDeleteId(null)}>
          <p className="text-sm text-slate-400 mb-5">
            Are you sure? This action cannot be undone and will delete the
            startup record.
          </p>
          <div className="flex gap-3">
            <Btn onClick={handleDelete} variant="danger" disabled={loading}>
              {loading ? "Deleting..." : "Yes, Delete"}
            </Btn>
            <Btn
              onClick={() => setConfirmDeleteId(null)}
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
