"use client";

import { useState } from "react";
import {
  StatusBadge,
  EmptyState,
} from "@/components/Dashboard/founder-dashboard-shared";

const SEED_APPLICATIONS = [
  {
    id: "app-1",
    opportunityTitle: "Lead UI/UX Designer",
    startupName: "EcoGrid",
    appliedDate: "2026-07-22",
    status: "Pending",
  },
  {
    id: "app-2",
    opportunityTitle: "Senior Full Stack Engineer",
    startupName: "NexusAI",
    appliedDate: "2026-07-10",
    status: "Accepted",
  },
];

export default function MyApplicationsPage() {
  const [applications] = useState(SEED_APPLICATIONS);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">My Applications</h2>
        <p className="text-xs text-slate-400 mt-1">
          Track the status of roles you have applied for across different
          startups.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon="📬"
          title="No applications yet"
          sub="Browse open opportunities and apply to get started."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-slate-100">
                    {app.opportunityTitle}
                  </h4>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-amber-500 font-medium">
                  @{app.startupName}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Applied: {app.appliedDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
