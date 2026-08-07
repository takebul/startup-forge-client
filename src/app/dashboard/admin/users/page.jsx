"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Crown,
  BadgeCheck,
  Ban,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Btn, Badge } from "@/components/Dashboard/founder-dashboard-shared";

// Seed Users List
const SEED_USERS = [
  {
    id: "u-1",
    name: "Sarah Chen",
    email: "sarah@nexusai.io",
    role: "founder",
    plan: "founder_premium",
    status: "active",
    joinedDate: "2026-01-12",
  },
  {
    id: "u-2",
    name: "David Miller",
    email: "david@ecogrid.io",
    role: "founder",
    plan: "founder_free",
    status: "active",
    joinedDate: "2026-02-08",
  },
  {
    id: "u-3",
    name: "James Okafor",
    email: "james@dev.io",
    role: "collaborator",
    plan: "collaborator_premium",
    status: "active",
    joinedDate: "2026-03-15",
  },
  {
    id: "u-4",
    name: "Priya Nair",
    email: "priya@eng.com",
    role: "collaborator",
    plan: "collaborator_free",
    status: "active",
    joinedDate: "2026-04-01",
  },
  {
    id: "u-5",
    name: "Mark Tran",
    email: "mark@spam.bad",
    role: "collaborator",
    plan: "collaborator_free",
    status: "blocked",
    joinedDate: "2026-05-20",
  },
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState(SEED_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u,
      ),
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" || u.role.toLowerCase() === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Manage Users</h2>
          <p className="text-xs text-slate-400 mt-1">
            View, filter, and control user access across founders and
            collaborators.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-[#0D1528] border border-slate-800 px-3.5 py-1.5 rounded-xl w-fit">
          Total Registered:{" "}
          <span className="text-amber-500 font-bold font-mono">
            {users.length}
          </span>
        </span>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1528] p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#060C1A] border border-slate-800 text-slate-200 outline-none focus:border-amber-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "founder", "collaborator"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0D1528]">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 text-[11px] font-mono uppercase tracking-wider bg-[#060C1A] text-slate-500 border-b border-slate-800 font-bold">
          <div className="col-span-4">User Details</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Subscription Plan</div>
          <div className="col-span-2">Joined Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No matching users found.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isUpgraded =
                u.plan.includes("premium") || u.plan.includes("enterprise");

              return (
                <div
                  key={u.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors text-xs"
                >
                  {/* User Name & Email */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-amber-500 font-bold flex items-center justify-center text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-100 truncate">
                          {u.name}
                        </span>
                        {isUpgraded && (
                          <BadgeCheck
                            className="w-3.5 h-3.5 text-sky-400 shrink-0"
                            title="Verified Member"
                          />
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2 capitalize font-medium text-slate-300">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-mono ${
                        u.role === "founder"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  {/* Plan Badge */}
                  <div className="col-span-2">
                    {isUpgraded ? (
                      <Badge label="Verified Upgrade" variant="amber" />
                    ) : (
                      <Badge label="Free Plan" variant="gray" />
                    )}
                  </div>

                  {/* Joined Date */}
                  <div className="col-span-2 font-mono text-slate-400">
                    {u.joinedDate}
                  </div>

                  {/* Status Toggle Action */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        u.status === "active"
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-red-400 bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      {u.status}
                    </span>

                    <Btn
                      size="sm"
                      variant={u.status === "active" ? "danger" : "success"}
                      onClick={() => toggleUserStatus(u.id)}
                    >
                      {u.status === "active" ? "Block" : "Unblock"}
                    </Btn>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
