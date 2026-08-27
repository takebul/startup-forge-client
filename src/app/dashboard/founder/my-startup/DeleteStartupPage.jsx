"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Btn } from "@/components/Dashboard/founder-dashboard-shared";
import { deleteStartup } from "@/lib/actions/startup";
import { toast } from "@/components/Toast/Toast";

export default function DeleteStartupPage({ startup, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startupId = startup?.id || startup?._id;
  const startupName = startup?.startup_name || startup?.name || "this startup";

  // Delete handler: remove startup, refresh server components, then close modal
  async function handleDelete() {
    if (!startupId) return;

    setLoading(true);
    try {
      const res = await deleteStartup(startupId);
      console.log("Delete Success:", res);

      // Refresh server components
      router.refresh();
      toast.delete("Startup Deleted", `"${startupName}" has been permanently removed.`);

      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to delete startup:", error);
      toast.error("Delete Failed", error.message || "Failed to delete startup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Delete Startup?" onClose={onClose}>
      {/* Confirmation Message & Action Buttons */}
      <div className="space-y-4 font-sans">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            &quot;{startupName}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3 pt-2">
          <Btn onClick={handleDelete} variant="danger" disabled={loading}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </Btn>
          <Btn onClick={onClose} variant="ghost" disabled={loading}>
            Cancel
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
