"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Btn, Badge } from "@/components/Dashboard/founder-dashboard-shared";

// Seed Startups
const SEED_STARTUPS = [
  {
    id: "st-1",
    name: "NexusAI",
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop",
    industry: "Artificial Intelligence",
    description:
      "Autonomous workflow agents that eliminate repetitive enterprise tasks.",
    fundingStage: "Seed",
    founderEmail: "sarah@nexusai.io",
    approved: true,
  },
  {
    id: "st-2",
    name: "EcoGrid",
    logo: "",
    industry: "CleanTech",
    description: "Peer-to-peer renewable energy trading framework.",
    fundingStage: "Pre-Seed",
    founderEmail: "david@ecogrid.io",
    approved: true,
  },
  {
    id: "st-3",
    name: "PayPulse",
    logo: "",
    industry: "FinTech",
    description: "Instant cross-border payroll infrastructure.",
    fundingStage: "Series A",
    founderEmail: "elena@paypulse.com",
    approved: false,
  },
  {
    id: "st-4",
    name: "HealthSphere",
    logo: "",
    industry: "HealthTech",
    description: "AI patient monitoring and early diagnostics.",
    fundingStage: "Seed",
    founderEmail: "marcus@healthsphere.io",
    approved: true,
  },
];

export default function ManageStartupsPage() {
  const [startups, setStartups] = useState(SEED_STARTUPS);

  const handleApprove = (id) => {
    setStartups((prev) =>
      prev.map((s) => (s.id === id ? { ...s, approved: true } : s)),
    );
  };

  const handleRemove = (id) => {
    setStartups((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Manage Startups</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted startup profiles, approve pending applications, and
            manage platform listings.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-[#0D1528] border border-slate-800 px-3.5 py-1.5 rounded-xl w-fit">
          Total Startups:{" "}
          <span className="text-amber-500 font-bold font-mono">
            {startups.length}
          </span>
        </span>
      </div>

      {/* Startups List */}
      <div className="space-y-3">
        {startups.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 hover:border-slate-700/80 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#060C1A] border border-slate-800 flex items-center justify-center text-amber-500 font-bold text-base overflow-hidden shrink-0">
                  {s.logo ? (
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    s.name[0]
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-slate-100 text-base">
                      {s.name}
                    </h4>
                    {s.approved ? (
                      <Badge label="Approved" variant="green" />
                    ) : (
                      <Badge label="Pending Review" variant="amber" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-1">
                    {s.industry} ·{" "}
                    <span className="font-mono text-slate-300">
                      {s.fundingStage}
                    </span>
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl mb-2">
                    {s.description}
                  </p>

                  <p className="text-[11px] font-mono text-slate-500">
                    Founder:{" "}
                    <span className="text-amber-500/90">{s.founderEmail}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {!s.approved && (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() => handleApprove(s.id)}
                  >
                    Approve
                  </Btn>
                )}
                <Btn
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemove(s.id)}
                >
                  Remove Listing
                </Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
