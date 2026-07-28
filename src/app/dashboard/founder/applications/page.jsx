"use client";

import {
  Btn,
  Modal,
  StatusBadge,
} from "@/components/Dashboard/founder-dashboard-shared";
import { useState } from "react";

export default function FounderApplicationsPage() {
  const [applications, setApplications] = useState([
    {
      id: "app-1",
      opportunityTitle: "Senior Full Stack Engineer",
      applicantName: "James Okafor",
      applicantEmail: "james@dev.io",
      portfolioLink: "https://james.dev",
      motivationMessage: "6 years building SaaS products.",
      status: "Pending",
      appliedDate: "2026-07-18",
    },
  ]);

  const [selected, setSelected] = useState(null);

  function handleStatus(id, newStatus) {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-100">Applications</h2>
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-100">
                  {app.applicantName}
                </span>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-xs text-amber-500">
                Role: {app.opportunityTitle}
              </p>
            </div>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" onClick={() => setSelected(app)}>
                View
              </Btn>
              {app.status === "Pending" && (
                <>
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() => handleStatus(app.id, "Accepted")}
                  >
                    Accept
                  </Btn>
                  <Btn
                    size="sm"
                    variant="danger"
                    onClick={() => handleStatus(app.id, "Rejected")}
                  >
                    Reject
                  </Btn>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <Modal title="Application Details" onClose={() => setSelected(null)}>
          <div className="space-y-3">
            <p className="text-sm text-slate-200">
              <strong>Applicant:</strong> {selected.applicantName}
            </p>
            <p className="text-sm text-slate-200">
              <strong>Portfolio:</strong>{" "}
              <a
                href={selected.portfolioLink}
                target="_blank"
                className="text-amber-500 underline"
              >
                {selected.portfolioLink}
              </a>
            </p>
            <p className="text-sm text-slate-400">
              <strong>Message:</strong> {selected.motivationMessage}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
