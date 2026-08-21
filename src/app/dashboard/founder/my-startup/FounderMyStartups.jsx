"use client";

import { useState, useEffect } from "react";
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
  ShieldAlert,
  AlertTriangle,
  Building2,
  Trash2,
  Edit,
  Clock,
} from "lucide-react";

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

function parseInitialStartups(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.startups)) return data.startups;
  if (typeof data === "object" && Object.keys(data).length > 0 && !data.error) {
    return [data];
  }
  return [];
}

export default function FounderMyStartups({ founder, startups }) {
  const router = useRouter();

  // Normalize initial prop to array state
  const [startupList, setStartupList] = useState(() =>
    parseInitialStartups(startups),
  );

  // Sync state if server component props change
  useEffect(() => {
    setStartupList(parseInitialStartups(startups));
  }, [startups]);

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
    founder_email: founder?.email || "",
    status: "Pending",
  });

  const industries = [
    "Artificial Intelligence",
    "CleanTech",
    "FinTech",
    "HealthTech",
    "E-commerce",
    "SaaS",
    "Other",
  ];
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped"];

  // =========================================================================
  // HANDLER TO CREATE A NEW STARTUP
  // =========================================================================
  async function handleCreateStartup(e) {
    e.preventDefault();
    if (!newStartup.startup_name.trim()) return;

    setLoading(true);
    try {
      const payload = {
        ...newStartup,
        startupId: founder?.id || founder?._id,
        founder_email: founder?.email || newStartup.founder_email,
      };

      const result = await createStartup(payload);

      const createdItem = {
        ...payload,
        _id: result?.insertedId || result?._id || `st-${Date.now()}`,
        id: result?.insertedId || result?._id || `st-${Date.now()}`,
      };

      // Instantly update local list state
      setStartupList([createdItem]);

      // Reset create form state & hide creation view
      setNewStartup({
        startup_name: "",
        logo: "",
        industry: "Artificial Intelligence",
        description: "",
        funding_stage: "Seed",
        founder_email: founder?.email || "",
        status: "Pending",
      });
      setIsCreating(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to create startup:", err);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================================
  // HANDLER TO UPDATE / RESUBMIT A STARTUP
  // =========================================================================
  async function handleEditing(e) {
    e.preventDefault();
    const id = editingStartup?._id || editingStartup?.id;
    if (!id) return;

    setLoading(true);
    try {
      // Send 'Resubmitted' status so admin sees it for re-evaluation
      const updatedPayload = {
        ...editingStartup,
        status: "Resubmitted",
        resubmitted: true,
      };

      await updateStartup(id, updatedPayload);

      setStartupList((prev) =>
        prev.map((item) =>
          String(item._id || item.id) === String(id)
            ? { ...item, ...updatedPayload }
            : item,
        ),
      );

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
      await deleteStartup(confirmDeleteId);

      // Instantly update local state so the form renders immediately
      setStartupList((prev) =>
        prev.filter(
          (item) => String(item._id || item.id) !== String(confirmDeleteId),
        ),
      );

      router.refresh();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Failed to delete startup:", error);
    } finally {
      setLoading(false);
    }
  }

  const currentStartup = startupList[0] || null;
  const startupStatus = String(currentStartup?.status || "").toLowerCase();
  const isRemovedOrRejected =
    startupStatus === "rejected" ||
    startupStatus === "removed" ||
    startupStatus === "declined";

  // =========================================================================
  // 1. ADMIN REMOVAL / REJECTION SCREEN (2 BUTTONS ONLY)
  // =========================================================================
  if (currentStartup && isRemovedOrRejected && !isCreating && !editingStartup) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto font-sans">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Startup Status</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review your startup registration status and admin feedback.
          </p>
        </div>

        <div className="rounded-2xl p-8 sm:p-12 bg-[#0D1528] border border-red-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>STATUS: PROFILE REMOVED BY ADMIN</span>
          </div>

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-[#060C1A] border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          {/* Message */}
          <div className="space-y-3 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-slate-100">
              Startup Listing Was Removed
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your startup profile for{" "}
              <span className="text-red-400 font-semibold font-mono">
                @
                {currentStartup.startup_name ||
                  currentStartup.name ||
                  "Startup"}
              </span>{" "}
              was reviewed and removed by the platform administration team.
            </p>

            <div className="p-4 rounded-xl bg-[#060C1A] border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Action Required:</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Please verify that your startup name, description, and logo meet
                platform community guidelines. Click &quot;Edit &amp;
                Resubmit&quot; to update your details and request a re-review
                from admin.
              </p>
            </div>
          </div>

          {/* Action Buttons: Edit & Resubmit + Delete Record */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setEditingStartup(currentStartup)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all shadow-md cursor-pointer flex items-center gap-2 justify-center"
            >
              <Edit className="w-4 h-4" />
              <span>Edit &amp; Resubmit</span>
            </Button>

            <Button
              type="button"
              onClick={() =>
                setConfirmDeleteId(currentStartup._id || currentStartup.id)
              }
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer flex items-center gap-2 justify-center"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Record</span>
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDeleteId !== null && (
          <Modal
            title="Delete Startup Record?"
            onClose={() => setConfirmDeleteId(null)}
          >
            <p className="text-sm text-slate-400 mb-5 font-sans">
              Are you sure? This will remove the record permanently so you can
              start fresh.
            </p>
            <div className="flex gap-3 font-sans">
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

  // =========================================================================
  // 2. EMPTY STATE OR CREATING MODE: SHOW CREATE FORM
  // =========================================================================
  if (!startupList || startupList.length === 0 || isCreating) {
    return (
      <div className="p-8 space-y-6 max-w-4xl font-sans">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Create Startup Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the details below to publish your startup profile on
            StartupForge.
          </p>
        </div>

        <Form
          onSubmit={handleCreateStartup}
          className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800 shadow-sm"
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
              Your registered business or platform brand name.
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
          <TextField isDisabled className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Founder Email
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-500">
                ✉️
              </InputGroup.Prefix>
              <InputGroup.Input
                type="email"
                value={newStartup.founder_email || founder?.email || ""}
                disabled
                className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-400 cursor-not-allowed"
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
                placeholder="Describe your startup's core mission, product, and vision..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm outline-none bg-[#060C1A] text-slate-200 resize-none"
              />
            </InputGroup>
          </TextField>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isDisabled={loading}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Startup"}
            </Button>
            {startupList.length > 0 && (
              <Button
                type="button"
                onClick={() => setIsCreating(false)}
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

  // =========================================================================
  // 3. EDITING / RESUBMIT STATE: RENDER UPDATE FORM
  // =========================================================================
  if (editingStartup) {
    return (
      <div className="p-8 space-y-6 max-w-4xl font-sans">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            {isRemovedOrRejected
              ? "Edit & Resubmit Startup Profile"
              : "Update Startup"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRemovedOrRejected
              ? "Make necessary corrections and save your changes to resubmit for admin review."
              : "Update your public startup details and recruitment profile."}
          </p>
        </div>

        <Form
          onSubmit={handleEditing}
          className="rounded-2xl p-6 space-y-4 bg-[#0D1528] border border-slate-800 shadow-sm"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <TextField isDisabled className="w-full">
            <Label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
              Founder Email
            </Label>
            <Input
              type="email"
              disabled
              value={
                editingStartup.founder_email ||
                editingStartup.founderEmail ||
                founder?.email ||
                ""
              }
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-[#060C1A] border border-slate-800 text-slate-400 cursor-not-allowed"
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
              {loading
                ? "Submitting..."
                : isRemovedOrRejected
                  ? "Resubmit Profile"
                  : "Save Changes"}
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
  // 4. DETAILED CARD DISPLAY STATE
  // =========================================================================
  return (
    <div className="p-8 space-y-6 max-w-4xl font-sans">
      <div>
        <h2 className="text-xl font-bold text-slate-100">My Startup</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your registered startup profile and recruitment details.
        </p>
      </div>

      <div className="space-y-4">
        {startupList.map((item, idx) => {
          const itemId = item._id || item.id || idx;
          const name = item.startup_name || item.name || "Untitled";
          const statusStr = String(item.status || "Pending");
          const isApproved =
            statusStr.toLowerCase() === "approved" || item.approved === true;
          const isResubmitted = statusStr.toLowerCase() === "resubmitted";

          return (
            <div
              key={itemId}
              className="rounded-2xl bg-[#0D1528] border border-slate-800 p-6 space-y-5 shadow-sm"
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
                      label={
                        isApproved
                          ? "Approved"
                          : isResubmitted
                            ? "Resubmitted (Pending Review)"
                            : "Pending Review"
                      }
                      variant={
                        isApproved
                          ? "green"
                          : isResubmitted
                            ? "indigo"
                            : "amber"
                      }
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
          <p className="text-sm text-slate-400 mb-5 font-sans">
            Are you sure? This action cannot be undone and will permanently
            delete your startup record.
          </p>
          <div className="flex gap-3 font-sans">
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
