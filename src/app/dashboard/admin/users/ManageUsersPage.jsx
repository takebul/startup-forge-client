"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BadgeCheck, ShieldAlert, Crown } from "lucide-react";
import { Btn, Badge } from "@/components/Dashboard/founder-dashboard-shared";
import { authClient } from "@/lib/auth-client";
import { updateUserStatus } from "@/lib/actions/users";

// Helper function to format ISO date strings (e.g., 2026-08-17T10:11:58.148Z -> 2026-08-17)
function formatDate(dateStr) {
  if (!dateStr || dateStr === "N/A") return "N/A";
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return String(dateStr);
}

// Helper to resolve 3 distinct plan text badges (Free, Premium, Enterprise)
function getPlanBadge(planStr, persona) {
  const str = String(planStr || "").toLowerCase();

  if (str.includes("enterprise")) {
    return <Badge label="Enterprise" variant="indigo" />;
  }
  if (str.includes("premium")) {
    return (
      <Badge
        label={
          persona === "founder" ? "Founder Premium" : "Collaborator Premium"
        }
        variant="indigo"
      />
    );
  }
  return <Badge label="Free Plan" variant="gray" />;
}

// Helper to resolve a user's ecosystem persona
function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
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
      const persona = getUserPersona(u);

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || persona === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Manage Users
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View, filter, and control user access across founders and
            collaborators.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-600 bg-white border border-slate-200/90 dark:bg-slate-900/80 dark:border-slate-800/90 dark:text-slate-300 px-3.5 py-1.5 rounded-xl w-fit shadow-xs">
          Total Registered:{" "}
          <span className="text-violet-600 dark:text-violet-400 font-bold font-mono">
            {users.length}
          </span>
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs font-mono flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="underline hover:text-red-700 dark:hover:text-red-300 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-violet-500 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-violet-500 [color-scheme:light] dark:[color-scheme:dark] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "founder", "collaborator", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Users Table */}
      <div className="rounded-2xl overflow-x-auto border border-slate-200/90 bg-white text-xs shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 text-slate-700 text-[11px] font-mono uppercase tracking-wider border-b border-slate-200/90 dark:bg-slate-950/60 dark:text-slate-400 dark:border-slate-800 font-bold">
            <tr>
              <th className="px-6 py-3.5">User Details</th>
              <th className="px-6 py-3.5">Account Type</th>
              <th className="px-6 py-3.5">Subscription Plan</th>
              <th className="px-6 py-3.5">Joined Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-xs text-slate-500 italic dark:text-slate-400"
                >
                  No matching users found.
                </td>
              </tr>
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
                const userPersona = getUserPersona(u);
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
                  <tr
                    key={uId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* User Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {u.image && u.image.startsWith("http") ? (
                          <img
                            src={u.image}
                            alt={userName}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700/50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 dark:bg-slate-800 dark:text-violet-400 font-bold flex items-center justify-center text-sm shrink-0 border border-slate-200 dark:border-slate-700/50">
                            {userName[0] || "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {userName}
                            </span>
                            {isUpgraded && (
                              <BadgeCheck
                                className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0"
                                title="Verified Member"
                              />
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Account Type / Role */}
                    <td className="px-6 py-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono inline-block font-semibold ${
                          userPersona === "founder"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                            : userPersona === "admin"
                              ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                              : "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                        }`}
                      >
                        {userPersona}
                      </span>
                    </td>

                    {/* Subscription Plan (Free, Premium, Enterprise) */}
                    <td className="px-6 py-4">
                      {getPlanBadge(planStr, userPersona)}
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                      {joinedDate}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono capitalize inline-block font-bold ${
                          !isBlocked
                            ? "text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                            : "text-red-700 bg-red-50 border border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20"
                        }`}
                      >
                        {isBlocked ? "blocked" : "active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {isSelf ? (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20 inline-flex items-center gap-1.5 shadow-xs">
                          <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
