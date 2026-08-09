"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Building2 } from "lucide-react";
import { Btn, Badge } from "@/components/Dashboard/founder-dashboard-shared";
import { updateStartup, deleteStartup } from "@/lib/actions/startup";

export default function ManageStartupsPage({ ALL_STARTUPS = [] }) {
  const router = useRouter();

  // Helper to safely extract startups array from props or server payloads
  const parseStartups = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.startups)) return data.startups;
    return [];
  };

  const [startups, setStartups] = useState(() => parseStartups(ALL_STARTUPS));
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Sync state whenever Server Component re-fetches ALL_STARTUPS prop
  useEffect(() => {
    setStartups(parseStartups(ALL_STARTUPS));
  }, [ALL_STARTUPS]);

  // =========================================================================
  // UPDATE STARTUP STATUS HANDLER (Approve / Pending)
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

      // 2. Call Server Action / PATCH API
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
  // DELETE STARTUP HANDLER
  // =========================================================================
  const handleDelete = async (targetStartup) => {
    const id = String(targetStartup._id || targetStartup.id || "");
    if (!id) return;

    setLoadingId(id);
    setError(null);
    const previousStartups = [...startups];

    try {
      // 1. Optimistic Local UI Update (Remove from array)
      setStartups((prev) => prev.filter((s) => String(s._id || s.id) !== id));

      // 2. Call Delete Server Action / DELETE API
      const result = await deleteStartup(id);

      if (result?.error) {
        throw new Error(result.error);
      }

      // 3. Refresh Server Component Data
      router.refresh();
    } catch (err) {
      console.error("Failed to delete startup:", err);
      setError("Failed to delete startup listing. Reverting changes.");

      // Rollback on failure
      setStartups(previousStartups);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Manage Startups</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted startup profiles, approve pending applications, and
            manage platform listings.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-[#0D1528] border border-slate-800/80 px-3.5 py-1.5 rounded-xl w-fit shadow-sm">
          Total Startups:{" "}
          <span className="text-amber-500 font-bold font-mono">
            {startups.length}
          </span>
        </span>
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

      {/* Startups List */}
      <div className="space-y-3">
        {startups.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 italic bg-[#0D1528] rounded-2xl border border-slate-800/80">
            No startup listings found.
          </div>
        ) : (
          startups.map((s, idx) => {
            const startupId = String(s._id || s.id || idx);
            const startupName = s.startup_name || s.name || "Untitled Startup";
            const fundingStage = s.funding_stage || s.fundingStage || "N/A";
            const founderEmail = s.founder_email || s.founderEmail || "N/A";
            const isApproved = s.status === "Approved" || s.status === true;
            const isProcessing = loadingId === startupId;

            return (
              <div
                key={startupId}
                className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Logo / Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#060C1A] border border-slate-800 flex items-center justify-center text-amber-500 font-bold text-base overflow-hidden shrink-0">
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

                    {/* Startup Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-100 text-base">
                          {startupName}
                        </h4>
                        {isApproved ? (
                          <Badge label="Approved" variant="green" />
                        ) : (
                          <Badge label="Pending Review" variant="amber" />
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mb-1">
                        {s.industry} ·{" "}
                        <span className="font-mono text-slate-300">
                          {fundingStage}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl mb-2">
                        {s.description}
                      </p>

                      <p className="text-[11px] font-mono text-slate-500">
                        Founder:{" "}
                        <span className="text-amber-500/90">
                          {founderEmail}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isApproved && (
                      <Btn
                        size="sm"
                        variant="success"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(s, "Approved")}
                      >
                        {isProcessing ? "Saving..." : "Approve"}
                      </Btn>
                    )}
                    <Btn
                      size="sm"
                      variant="danger"
                      disabled={isProcessing}
                      onClick={() => handleDelete(s)}
                    >
                      {isProcessing ? "Deleting..." : "Remove Listing"}
                    </Btn>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
