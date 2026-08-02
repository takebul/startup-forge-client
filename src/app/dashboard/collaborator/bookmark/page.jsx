"use client";

import { useState } from "react";
import {
  Badge,
  EmptyState,
} from "@/components/Dashboard/founder-dashboard-shared";

const BOOKMARKED_ITEMS = [
  {
    id: "op-2",
    startupName: "EcoGrid",
    roleTitle: "Lead UI/UX Designer",
    workType: "Hybrid",
    deadline: "2026-08-10",
  },
  {
    id: "op-7",
    startupName: "DevLoom",
    roleTitle: "DevOps & Cloud Engineer",
    workType: "Remote",
    deadline: "2026-08-28",
  },
];

export default function BookmarkedPage() {
  const [bookmarks, setBookmarks] = useState(BOOKMARKED_ITEMS);

  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Saved Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access bookmarked roles for quick review and future applications.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Total Saved:{" "}
          <span className="text-amber-500 font-bold">{bookmarks.length}</span>
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No bookmarked roles"
          sub="Save opportunities from the Browse page to review them here."
        />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-5 bg-[#0D1528] border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-slate-100">
                    {item.roleTitle}
                  </h4>
                  <Badge label={item.workType} variant="green" />
                </div>
                <p className="text-xs text-amber-500">@{item.startupName}</p>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Deadline: {item.deadline}
                </p>
              </div>

              <button
                onClick={() => removeBookmark(item.id)}
                className="text-xs px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
