"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Building2,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  RotateCcw,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  Btn,
  Badge,
  Modal,
} from "@/components/Dashboard/founder-dashboard-shared";
import { updateStartup, deleteStartup } from "@/lib/actions/startup";

// Helper to safely extract startups array from props or server payloads
function parseStartups(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.startups)) return data.startups;
  return [];
}

export default function ManageStartupsPage({ ALL_STARTUPS = [] }) {
  const router = useRouter();

  const [startups, setStartups] = useState(() => parseStartups(ALL_STARTUPS));
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDeleteStartup, setConfirmDeleteStartup] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Pending" | "Resubmitted" | "Approved" | "Rejected"

  // Sync state whenever Server Component re-fetches ALL_STARTUPS prop
  useEffect(() => {
    setStartups(parseStartups(ALL_STARTUPS));
  }, [ALL_STARTUPS]);

  // =========================================================================
  // UPDATE STARTUP STATUS HANDLER (Approve / Reject / Pending / Resubmitted)
  // =========================================================================
  const handleUpdateStatus = async (targetStartup, newStatus) => {
    const id = String(targetStartup._id || targetStartup.id || "");
    if (!id) return;

    setLoadingId(id);
    setError(null);
    const previousStartups = [...startups];

    try {
      // 1. Optimistic Local UI Update
      setStartups((prev) =>
        prev.map((s) =>
          String(s._id || s.id) === id ? { ...s, status: newStatus } : s,
        ),
      );

      // 2. Call Server Action
      const result = await updateStartup(id, { status: newStatus });

      if (result?.error) {
        throw new Error(result.error);
      }

      // 3. Refresh Server Component Data
      router.refresh();
    } catch (err) {
      console.error("Failed to update startup status:", err);
      setError("Failed to update startup status. Reverting changes.");
      // Rollback on failure
      setStartups(previousStartups);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================================================================
  // DELETE STARTUP HANDLER (With Modal Confirmation)
  // =========================================================================
  const handleConfirmDelete = async () => {
    if (!confirmDeleteStartup) return;
    const id = String(
      confirmDeleteStartup._id || confirmDeleteStartup.id || "",
    );

    setLoadingId(id);
    setError(null);
    const previousStartups = [...startups];

    try {
      // 1. Optimistic Local UI Update
      setStartups((prev) => prev.filter((s) => String(s._id || s.id) !== id));

      // 2. Call Delete Server Action
      const result = await deleteStartup(id);

      if (result?.error) {
        throw new Error(result.error);
      }

      // 3. Close Modal & Refresh Server Component Data
      setConfirmDeleteStartup(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete startup:", err);
      setError("Failed to delete startup listing. Reverting changes.");
      setStartups(previousStartups);
    } finally {
      setLoadingId(null);
    }
  };

  // Filter and Search Logic
  const filteredStartups = useMemo(() => {
    return startups.filter((s) => {
      const name = String(s.startup_name || s.name || "").toLowerCase();
      const founderEmail = String(
        s.founder_email || s.founderEmail || "",
      ).toLowerCase();
      const industry = String(s.industry || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        search === "" ||
        name.includes(search) ||
        founderEmail.includes(search) ||
        industry.includes(search);

      const status = String(s.status || "Pending").toLowerCase();
      const matchesStatus =
        statusFilter === "All" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [startups, searchTerm, statusFilter]);

  const pendingCount = useMemo(
    () =>
      startups.filter(
        (s) => String(s.status || "Pending").toLowerCase() === "pending",
      ).length,
    [startups],
  );

  const resubmittedCount = useMemo(
    () =>
      startups.filter(
        (s) => String(s.status || "").toLowerCase() === "resubmitted",
      ).length,
    [startups],
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Manage Startups</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted and resubmitted startup profiles, approve listings,
            or remove non-compliant accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {resubmittedCount > 0 && (
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
              <span>{resubmittedCount} Resubmitted</span>
            </span>
          )}

          {pendingCount > 0 && (
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl font-bold">
              {pendingCount} Pending
            </span>
          )}

          <span className="text-xs font-mono text-slate-400 bg-[#0D1528] border border-slate-800 px-3.5 py-1.5 rounded-xl">
            Total: <strong className="text-slate-100">{startups.length}</strong>
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="underline hover:text-red-300 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D1528] border border-slate-800">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, founder email, industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#060C1A] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["All", "Pending", "Resubmitted", "Approved", "Rejected"].map(
            (status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                      : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Startups List */}
      <div className="space-y-3">
        {filteredStartups.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 italic bg-[#0D1528] rounded-2xl border border-slate-800">
            No startup listings match your current filters.
          </div>
        ) : (
          filteredStartups.map((s, idx) => {
            const startupId = String(s._id || s.id || idx);
            const startupName = s.startup_name || s.name || "Untitled Startup";
            const fundingStage = s.funding_stage || s.fundingStage || "N/A";
            const founderEmail = s.founder_email || s.founderEmail || "N/A";
            const currentStatus = String(s.status || "Pending");

            const isApproved =
              currentStatus.toLowerCase() === "approved" || s.status === true;
            const isResubmitted =
              currentStatus.toLowerCase() === "resubmitted" ||
              s.resubmitted === true;
            const isRejected =
              currentStatus.toLowerCase() === "rejected" ||
              currentStatus.toLowerCase() === "removed";
            const isProcessing = loadingId === startupId;

            return (
              <div
                key={startupId}
                className={`rounded-2xl p-5 bg-[#0D1528] border transition-all duration-200 shadow-sm ${
                  isResubmitted
                    ? "border-indigo-500/40 shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "border-slate-800 hover:border-slate-700/80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-2xl bg-[#060C1A] border border-slate-800 flex items-center justify-center text-amber-500 font-bold text-lg overflow-hidden shrink-0">
                      {s.logo ? (
                        <img
                          src={s.logo}
                          alt={startupName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        startupName[0]
                      )}
                    </div>

                    {/* Startup Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-100 text-base">
                          {startupName}
                        </h4>

                        {isApproved ? (
                          <Badge label="Approved" variant="green" />
                        ) : isResubmitted ? (
                          <span className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                            <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin-slow" />
                            <span>Resubmitted (Needs Review)</span>
                          </span>
                        ) : isRejected ? (
                          <Badge label="Rejected / Removed" variant="red" />
                        ) : (
                          <Badge label="Pending Review" variant="amber" />
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mb-1.5">
                        <span className="font-semibold text-slate-300">
                          {s.industry || "General"}
                        </span>{" "}
                        ·{" "}
                        <span className="font-mono text-slate-400">
                          {fundingStage}
                        </span>
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-2 line-clamp-2">
                        {s.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500">
                        <span>
                          Founder:{" "}
                          <strong className="text-amber-400/90 font-normal">
                            {founderEmail}
                          </strong>
                        </span>
                        {s._id && (
                          <a
                            href={`/startups/${s._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
                          >
                            <span>Public Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                    {/* Approve Button */}
                    {!isApproved && (
                      <Btn
                        size="sm"
                        variant="success"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(s, "Approved")}
                      >
                        {isProcessing
                          ? "Saving..."
                          : isResubmitted
                            ? "Approve Resubmission"
                            : "Approve"}
                      </Btn>
                    )}

                    {/* Reject Button */}
                    {!isRejected && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(s, "Rejected")}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Flag/Reject this startup so the founder sees a removal notice"
                      >
                        {isProcessing ? "Saving..." : "Reject"}
                      </button>
                    )}

                    {/* Set Pending Button */}
                    {(isApproved || isRejected || isResubmitted) && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(s, "Pending")}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Set status back to Pending Review"
                      >
                        Set Pending
                      </button>
                    )}

                    {/* Permanent Delete Button */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setConfirmDeleteStartup(s)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Permanently delete this startup record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteStartup !== null && (
        <Modal
          title="Delete Startup Listing?"
          onClose={() => setConfirmDeleteStartup(null)}
        >
          <div className="space-y-4 font-sans">
            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-100">
                @
                {confirmDeleteStartup.startup_name ||
                  confirmDeleteStartup.name ||
                  "Startup"}
              </strong>
              ? This action is irreversible and will remove all associated
              startup records.
            </p>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
              ⚠️ Note: If you just want the founder to fix issues, use the{" "}
              <strong>Reject</strong> button instead so they receive a prompt to
              update and resubmit their profile.
            </div>

            <div className="flex gap-3 pt-2">
              <Btn
                onClick={handleConfirmDelete}
                variant="danger"
                disabled={loadingId !== null}
              >
                {loadingId ? "Deleting..." : "Yes, Permanently Delete"}
              </Btn>
              <Btn
                onClick={() => setConfirmDeleteStartup(null)}
                variant="ghost"
                disabled={loadingId !== null}
              >
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
