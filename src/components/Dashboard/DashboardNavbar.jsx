"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardNavbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const capitalizeFirstLetter = (str) => {
    if (!str) return "User";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const isFounder = user?.role === "founder";

  return (
    <header className="flex flex-col border-b border-slate-800 bg-[#080E1C] gap-4 px-8 py-5 sm:flex-row sm:items-center sm:justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-100">
          {capitalizeFirstLetter(user?.role)} Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">
          Welcome back, {user?.name || "Collaborator"} 👋 — Here's your overview
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notification Counter */}
        <button className="flex h-9 items-center justify-center space-x-2 rounded-xl bg-white/5 px-3.5 text-xs font-semibold text-slate-300 border border-slate-800 hover:bg-white/10 transition-colors cursor-pointer">
          <Bell className="h-4 w-4 text-slate-400" />
          <span className="font-mono text-amber-500 font-bold">3</span>
        </button>

        {/* Dynamic Action Button */}
        {isFounder ? (
          <Link
            href="/dashboard/founder/my-startup"
            className="flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-amber-500 px-4 text-xs font-bold text-slate-950 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>New Startup</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/collaborator/browse-opportunities"
            className="flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Explore Roles</span>
          </Link>
        )}

        {/* User Avatar */}
        <img
          src={
            user?.image ||
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
          }
          alt={user?.name || "User"}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-500/30"
        />
      </div>
    </header>
  );
}
