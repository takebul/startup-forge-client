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
  Table,
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
  updateStartup,
  deleteStartup,
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

    const result = await createStartup({ ...newStartup, userId: founder?.id });
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
      status: "Pending",
    });
    setIsCreating(false);
  }

  // =========================================================================
  // NEW: HANDLER TO UPDATE / EDIT A STARTUP
  // =========================================================================
  async function handleEditing(e) {
    e.preventDefault();
    const id = editingStartup?._id || editingStartup?.id;
    if (!id) return;

    setLoading(true);
    try {
      // const result = await updateStartup(id, editingStartup);
      // console.log("Update result:", result);

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
  // NEW: HANDLER TO DELETE A STARTUP
  // =========================================================================
  async function handleDelete() {
    if (!confirmDeleteId) return;

    setLoading(true);
    try {
      // const result = await deleteStartup(confirmDeleteId);
      // console.log("Delete result:", result);

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Create Startup Profile
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Fill in the details below to publish a new startup on
              StartupForge.
            </p>
          </div>
          {startupList && startupList.length > 0 && (
            <Button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl font-medium text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-all cursor-pointer"
            >
              ← Back to List
            </Button>
          )}
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
            {startupList.length > 0 ? (
              <Button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </Button>
            ) : (
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
                    status: "Pending",
                  })
                }
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-all cursor-pointer"
              >
                Reset
              </Button>
            )}
          </div>
        </Form>
      </div>
    );
  }

  // =========================================================================
  // 2. EDITING STATE: RENDER UPDATE FORM (NOW USING handleEditing)
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
  // 3. IF DATA EXISTS (startupList.length > 0): SHOW DATA TABLE
  // =========================================================================
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">My Startups</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your registered startup ideas and recruitment details.
          </p>
        </div>

        {/* Action button to trigger creation form when data exists */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            Total:{" "}
            <span className="text-amber-500 font-bold">
              {startupList.length}
            </span>
          </span>
          <Button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
          >
            <span>+</span> Create New Startup
          </Button>
        </div>
      </div>

      <Table className="w-full bg-[#0D1528] border border-slate-800 rounded-2xl overflow-hidden">
        <Table.ScrollContainer>
          <Table.Content aria-label="Startups list table" className="w-full">
            <Table.Header className="bg-[#060C1A] border-b border-slate-800">
              <Table.Column
                isRowHeader
                className="px-6 py-4 text-xs font-mono uppercase text-slate-400 font-semibold text-left"
              >
                Startup
              </Table.Column>
              <Table.Column className="px-6 py-4 text-xs font-mono uppercase text-slate-400 font-semibold text-left">
                Industry & Stage
              </Table.Column>
              <Table.Column className="px-6 py-4 text-xs font-mono uppercase text-slate-400 font-semibold text-left">
                Founder Email
              </Table.Column>
              <Table.Column className="px-6 py-4 text-xs font-mono uppercase text-slate-400 font-semibold text-left">
                Status
              </Table.Column>
              <Table.Column className="px-6 py-4 text-xs font-mono uppercase text-slate-400 font-semibold text-right">
                Actions
              </Table.Column>
            </Table.Header>

            <Table.Body>
              {startupList.map((item, idx) => {
                const itemId = item._id || item.id || idx;
                const name = item.startup_name || item.name || "Untitled";

                return (
                  <Table.Row
                    key={itemId}
                    className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Startup Column */}
                    <Table.Cell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                            {name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-slate-100">
                            {name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Industry & Stage Column */}
                    <Table.Cell className="px-6 py-4 text-sm text-slate-300">
                      <div>
                        <p className="font-medium text-slate-200">
                          {item.industry}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.funding_stage || item.fundingStage}
                        </p>
                      </div>
                    </Table.Cell>

                    {/* Email Column */}
                    <Table.Cell className="px-6 py-4 text-xs font-mono text-slate-400">
                      {item.founder_email || item.founderEmail || "N/A"}
                    </Table.Cell>

                    {/* Status Column */}
                    <Table.Cell className="px-6 py-4">
                      <Badge
                        label={
                          item.status === "Approved" || item.approved
                            ? "Approved"
                            : "Pending"
                        }
                        variant={
                          item.status === "Approved" || item.approved
                            ? "green"
                            : "amber"
                        }
                      />
                    </Table.Cell>

                    {/* Actions Column */}
                    <Table.Cell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Btn
                          onClick={() => setEditingStartup(item)}
                          variant="outline"
                          size="sm"
                        >
                          Update
                        </Btn>
                        <Btn
                          onClick={() => setConfirmDeleteId(itemId)}
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Btn>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {/* Delete Confirmation Modal (NOW USING handleDelete) */}
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
