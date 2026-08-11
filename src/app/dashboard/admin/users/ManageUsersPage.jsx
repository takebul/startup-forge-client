"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BadgeCheck, ShieldAlert, Crown } from "lucide-react";
import { Table } from "@heroui/react";
import { Btn, Badge } from "@/components/Dashboard/founder-dashboard-shared";
import { authClient } from "@/lib/auth-client";
import { updateUserStatus } from "@/lib/actions/users";

// Helper function to format ISO date strings (e.g., 2026-08-04T12:39:44.194Z -> 2026-08-04)
function formatDate(dateStr) {
  if (!dateStr || dateStr === "N/A") return "N/A";
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
}

// Helper to resolve 3 distinct plan text badges (Free, Premium, Enterprise)
function getPlanBadge(planStr, role) {
  const str = String(planStr || "").toLowerCase();

  if (str.includes("enterprise")) {
    return <Badge label="Enterprise" variant="indigo" />;
  }
  if (str.includes("premium")) {
    return (
      <Badge
        label={role === "founder" ? "Founder Premium" : "Collaborator Premium"}
        variant="amber"
      />
    );
  }
  return <Badge label="Free Plan" variant="gray" />;
}

export default function ManageUsersPage({ ALL_USERS = [], currentUser }) {
  const router = useRouter();

  // Get current logged-in user session to detect own account
  const currentUserId = String(currentUser?.id || currentUser?._id || "");
  const currentUserEmail = String(currentUser?.email || "").toLowerCase();

  // Helper to safely extract users array from props or server payloads
  const parseUsers = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.users)) return data.users;
    return [];
  };

  const [users, setUsers] = useState(() => parseUsers(ALL_USERS));
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Sync state whenever Server Component re-fetches ALL_USERS prop
  useEffect(() => {
    setUsers(parseUsers(ALL_USERS));
  }, [ALL_USERS]);

  // =========================================================================
  // TOGGLE USER STATUS HANDLER (Better Auth Ban/Unban + DB Status Sync)
  // =========================================================================
  const toggleUserStatus = async (targetUser) => {
    const userId = String(targetUser.id || targetUser._id || "");
    if (!userId) return;

    // Safety Guard: Prevent admin from blocking their own account
    const targetEmail = String(targetUser.email || "").toLowerCase();
    if (
      (currentUserId && userId === currentUserId) ||
      (currentUserEmail && targetEmail === currentUserEmail)
    ) {
      setError("You cannot block your own admin account.");
      return;
    }

    // Check if user is currently banned
    const isBanned = Boolean(
      targetUser.banned || targetUser.status === "blocked",
    );
    const nextStatus = isBanned ? "active" : "blocked";

    setLoadingId(userId);
    setError(null);

    const previousUsers = [...users];

    try {
      // 1. Optimistic Local UI Update
      setUsers((prev) =>
        prev.map((u) =>
          String(u.id || u._id) === userId
            ? {
                ...u,
                banned: !isBanned,
                status: nextStatus,
              }
            : u,
        ),
      );

      // 2. Execute Ban / Unban with Better Auth Admin API
      let res;
      if (isBanned) {
        res = await authClient.admin.unbanUser({
          userId: userId,
        });
      } else {
        res = await authClient.admin.banUser({
          userId: userId,
          banReason: "Suspended by admin",
        });
      }

      if (res?.error) {
        throw new Error(
          res.error.message || "Failed to update authentication ban status",
        );
      }

      // 3. Update Database user status field ("active" <-> "blocked")
      const dbRes = await updateUserStatus(userId, { status: nextStatus });
      if (dbRes?.error) {
        throw new Error(dbRes.error || "Failed to update database status");
      }

      // 4. Refresh Server Component Data
      router.refresh();
    } catch (err) {
      console.error("Failed to update user status:", err);
      setError(
        err?.message || "Failed to update user status. Reverting changes.",
      );
      setUsers(previousUsers);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = String(u.name || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const role = String(u.role || "").toLowerCase();

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Manage Users</h2>
          <p className="text-xs text-slate-400 mt-1">
            View, filter, and control user access across founders and
            collaborators.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-[#0D1528] border border-slate-800/80 px-3.5 py-1.5 rounded-xl w-fit shadow-sm">
          Total Registered:{" "}
          <span className="text-amber-500 font-bold font-mono">
            {users.length}
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

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1528] p-3 rounded-2xl border border-slate-800/80 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#060C1A] border border-slate-800/80 text-slate-200 outline-none focus:border-amber-500/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "founder", "collaborator"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* HeroUI Table Component */}
      <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0D1528] text-xs shadow-sm">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Manage Users Table"
              className="w-full text-left"
            >
              <Table.Header className="bg-[#060C1A] text-slate-400 text-[11px] font-mono uppercase tracking-wider border-b border-slate-800/80 font-bold">
                <Table.Column isRowHeader className="px-6 py-3.5">
                  User Details
                </Table.Column>
                <Table.Column className="px-6 py-3.5">Role</Table.Column>
                <Table.Column className="px-6 py-3.5">
                  Subscription Plan
                </Table.Column>
                <Table.Column className="px-6 py-3.5">Joined Date</Table.Column>
                <Table.Column className="px-6 py-3.5">Status</Table.Column>
                <Table.Column className="px-6 py-3.5 text-right">
                  Actions
                </Table.Column>
              </Table.Header>

              <Table.Body className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
                      className="p-8 text-center text-xs text-slate-500 italic"
                    >
                      No matching users found.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const uId = String(u.id || u._id || idx);
                    const planStr = String(
                      u.plan || u.plan_id || "",
                    ).toLowerCase();
                    const isUpgraded =
                      planStr.includes("premium") ||
                      planStr.includes("enterprise");
                    const isProcessing = loadingId === uId;
                    const userName = u.name || "User";
                    const userEmail = u.email || "N/A";
                    const userRole = u.role || "collaborator";
                    const joinedDate = formatDate(u.createdAt || u.joinedDate);

                    const isBlocked = Boolean(
                      u.banned || u.status === "blocked",
                    );

                    // Check if the current row belongs to the logged-in admin user
                    const isSelf =
                      (currentUserId && uId === currentUserId) ||
                      (currentUserEmail &&
                        userEmail.toLowerCase() === currentUserEmail);

                    return (
                      <Table.Row
                        key={uId}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* User Details */}
                        <Table.Cell className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-slate-800 text-amber-500 font-bold flex items-center justify-center text-sm shrink-0 border border-slate-700/50">
                              {userName[0]}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-100 truncate">
                                  {userName}
                                </span>
                                {isUpgraded && (
                                  <BadgeCheck
                                    className="w-3.5 h-3.5 text-sky-400 shrink-0"
                                    title="Verified Member"
                                  />
                                )}
                              </div>
                              <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                                {userEmail}
                              </p>
                            </div>
                          </div>
                        </Table.Cell>

                        {/* Role */}
                        <Table.Cell className="px-6 py-4 capitalize font-medium text-slate-300">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono inline-block font-semibold ${
                              userRole === "founder"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : userRole === "admin"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            }`}
                          >
                            {userRole}
                          </span>
                        </Table.Cell>

                        {/* Subscription Plan (Free, Premium, Enterprise) */}
                        <Table.Cell className="px-6 py-4">
                          {getPlanBadge(planStr, userRole)}
                        </Table.Cell>

                        {/* Joined Date */}
                        <Table.Cell className="px-6 py-4 font-mono text-slate-400">
                          {joinedDate}
                        </Table.Cell>

                        {/* Status */}
                        <Table.Cell className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono capitalize inline-block font-bold ${
                              !isBlocked
                                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                : "text-red-400 bg-red-500/10 border border-red-500/20"
                            }`}
                          >
                            {isBlocked ? "blocked" : "active"}
                          </span>
                        </Table.Cell>

                        {/* Actions */}
                        <Table.Cell className="px-6 py-4 text-right">
                          {isSelf ? (
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 inline-flex items-center gap-1.5 shadow-sm">
                              <Crown className="w-3 h-3 text-purple-400 shrink-0" />
                              <span>Own Account</span>
                            </span>
                          ) : (
                            <Btn
                              size="sm"
                              variant={isBlocked ? "success" : "danger"}
                              disabled={isProcessing}
                              onClick={() => toggleUserStatus(u)}
                            >
                              {isProcessing
                                ? "Processing..."
                                : isBlocked
                                  ? "Unblock"
                                  : "Block"}
                            </Btn>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
}
