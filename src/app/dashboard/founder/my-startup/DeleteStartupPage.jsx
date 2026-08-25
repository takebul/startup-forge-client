"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Btn } from "@/components/Dashboard/founder-dashboard-shared";
import { deleteStartup } from "@/lib/actions/startup";

export default function DeleteStartupPage({ startup, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startupId = startup?.id || startup?._id;
  const startupName = startup?.startup_name || startup?.name || "this startup";

  async function handleDelete() {
    if (!startupId) return;

    setLoading(true);
    try {
      const res = await deleteStartup(startupId);
      console.log("Delete Success:", res);

      // Refresh server components
      router.refresh();

      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to delete startup:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Delete Startup?" onClose={onClose}>
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
