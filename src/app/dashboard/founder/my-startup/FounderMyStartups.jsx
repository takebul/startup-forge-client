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
import { toast } from "@/components/Toast/Toast";

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
      toast.create("Startup Profile Created!", `"${payload.startup_name}" has been published and submitted for review.`);
    } catch (err) {
      console.error("Failed to create startup:", err);
      toast.error("Creation Failed", err.message || "Failed to create startup profile.");
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
      toast.update("Startup Updated & Resubmitted!", "Your updated profile has been saved and sent for review.");
    } catch (error) {
      console.error("Failed to update startup:", error);
      toast.error("Update Failed", error.message || "Failed to update startup details.");
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
      toast.delete("Startup Record Deleted", "The startup profile has been permanently removed.");
    } catch (error) {
      console.error("Failed to delete startup:", error);
      toast.error("Delete Failed", error.message || "Failed to delete startup profile.");
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto font-sans">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Startup Status
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your startup registration status and admin feedback.
          </p>
        </div>

        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-red-500/30 text-center space-y-6 shadow-xl dark:bg-[#0D1528] relative overflow-hidden">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>STATUS: PROFILE REMOVED BY ADMIN</span>
          </div>

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-red-500/30 text-red-500 dark:bg-[#060C1A] dark:text-red-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          {/* Message */}
          <div className="space-y-3 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Startup Listing Was Removed
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your startup profile for{" "}
              <span className="text-red-600 dark:text-red-400 font-semibold font-mono">
                @
                {currentStartup.startup_name ||
                  currentStartup.name ||
                  "Startup"}
              </span>{" "}
              was reviewed and removed by the platform administration team.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#060C1A] dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 text-left space-y-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Action Required:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-violet-600/20 cursor-pointer flex items-center gap-2 justify-center"
            >
              <Edit className="w-4 h-4" />
              <span>Edit &amp; Resubmit</span>
            </Button>

            <Button
              type="button"
              onClick={() =>
                setConfirmDeleteId(currentStartup._id || currentStartup.id)
              }
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/20 transition-all cursor-pointer flex items-center gap-2 justify-center"
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
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-sans">
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl font-sans">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Create Startup Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in the details below to publish your startup profile on
            StartupForge.
          </p>
        </div>

        <Form
          onSubmit={handleCreateStartup}
          className="rounded-2xl p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800"
        >
          {/* Startup Name */}
          <TextField isRequired className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Startup Name
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-400 dark:text-slate-500">
                🚀
              </InputGroup.Prefix>
              <InputGroup.Input
                value={newStartup.startup_name}
                onChange={(e) =>
                  setNewStartup({ ...newStartup, startup_name: e.target.value })
                }
                placeholder="e.g. NexusAI"
                required
                className="w-full px-3 py-2.5 text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 rounded-xl"
              />
            </InputGroup>
            <Description className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Your registered business or platform brand name.
            </Description>
            <FieldError className="text-xs text-red-500 dark:text-red-400" />
          </TextField>

          {/* Logo Upload */}
          <div>
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Logo
            </Label>
            <ImageUpload
              value={newStartup.logo}
              onChange={(url) => setNewStartup({ ...newStartup, logo: url })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Industry
              </Label>
              <Select
                value={newStartup.industry}
                onChange={(v) => setNewStartup({ ...newStartup, industry: v })}
                options={industries}
              />
            </div>
            <div>
              <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Founder Email
            </Label>
            <InputGroup>
              <InputGroup.Prefix className="pl-3 text-slate-400 dark:text-slate-500">
                ✉️
              </InputGroup.Prefix>
              <InputGroup.Input
                type="email"
                value={newStartup.founder_email || founder?.email || ""}
                disabled
                className="w-full px-3 py-2.5 text-sm outline-none bg-slate-100 border border-slate-200 text-slate-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-400 cursor-not-allowed rounded-xl"
              />
            </InputGroup>
          </TextField>

          {/* Description */}
          <TextField className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
                className="w-full px-3 py-2.5 text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500 resize-none rounded-xl"
              />
            </InputGroup>
          </TextField>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isDisabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Startup"}
            </Button>
            {startupList.length > 0 && (
              <Button
                type="button"
                onClick={() => setIsCreating(false)}
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

  // =========================================================================
  // 3. EDITING / RESUBMIT STATE: RENDER UPDATE FORM
  // =========================================================================
  if (editingStartup) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl font-sans">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isRemovedOrRejected
              ? "Edit & Resubmit Startup Profile"
              : "Update Startup"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isRemovedOrRejected
              ? "Make necessary corrections and save your changes to resubmit for admin review."
              : "Update your public startup details and recruitment profile."}
          </p>
        </div>

        <Form
          onSubmit={handleEditing}
          className="rounded-2xl p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-sm dark:bg-[#0D1528] dark:border-slate-800"
        >
          <TextField className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-100 dark:focus:bg-[#060C1A] dark:focus:border-violet-500"
            />
          </TextField>

          <div>
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
              <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
              <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-slate-100 border border-slate-200 text-slate-500 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-400 cursor-not-allowed"
            />
          </TextField>

          <TextField className="w-full">
            <Label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer disabled:opacity-50"
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
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl font-sans">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          My Startup
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm dark:bg-[#0D1528] dark:border-slate-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200 dark:bg-[#060C1A] dark:border-slate-800 flex items-center justify-center shadow-inner">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-violet-600 dark:text-violet-400 font-bold text-xl">
                      {name[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {name}
                    </h3>
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
                            ? "purple"
                            : "yellow"
                      }
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {item.industry} ·{" "}
                    {item.funding_stage || item.fundingStage || "N/A"}
                  </p>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.founder_email || item.founderEmail || "N/A"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#060C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                {item.description || "No description provided."}
              </p>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-sans">
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
