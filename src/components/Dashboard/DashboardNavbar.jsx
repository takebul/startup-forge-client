"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Bell,
  Plus,
  Check,
  AlertTriangle,
  Info,
  Crown,
  Users,
  Settings,
  Sparkles,
  LogOut,
  Home,
  Building2,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Helper to format planId into readable plan title
function formatPlanTitle(planId) {
  if (!planId) return "Subscription Plan";
  return String(planId)
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Helper to format ISO dates into human-readable timestamps
function formatTimestamp(dateStr) {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recent";
  }
}

// Helper parser to safely extract array data regardless of API response wrapping
function parseArrayData(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (key && Array.isArray(data?.[key])) return data[key];
  return [];
}

export default function DashboardNavbar({
  subscriptions = [],
  startups = [],
  applications = [],
  founderStartups = [],
  user: initialUser,
}) {
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const role = user?.role || "collaborator";

  const router = useRouter();

  // Notification Popover State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const notifRef = useRef(null);

  // Avatar Dropdown Popover State
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  // Safely parse all datasets
  const parsedSubscriptions = useMemo(
    () => parseArrayData(subscriptions, "subscriptions"),
    [subscriptions],
  );
  const parsedStartups = useMemo(
    () => parseArrayData(startups, "startups"),
    [startups],
  );
  const parsedFounderStartups = useMemo(
    () => parseArrayData(founderStartups, "founderStartups"),
    [founderStartups],
  );
  const parsedApplications = useMemo(
    () => parseArrayData(applications, "applications"),
    [applications],
  );

  // =========================================================================
  // DYNAMIC ROLE-BASED NOTIFICATION GENERATOR
  // =========================================================================
  const dynamicNotifications = useMemo(() => {
    const list = [];

    // 1. FOUNDER NOTIFICATIONS
    if (role === "founder") {
      const combinedFounderStartups =
        parsedFounderStartups.length > 0
          ? parsedFounderStartups
          : parsedStartups.filter(
              (s) =>
                s.startupId === user?.id ||
                s.founder_email === user?.email ||
                s.founderEmail === user?.email,
            );

      combinedFounderStartups.forEach((s) => {
        if (s.status === "Approved" || s.status === true) {
          list.push({
            id: `notif-approved-${s._id || s.id}`,
            message: `🎉 Your startup profile for '${
              s.startup_name || s.name || "Startup"
            }' has been approved by Admin!`,
            type: "success",
            timestamp: "Approved",
            rawDate: new Date(),
          });
        }
      });

      parsedApplications.forEach((app) => {
        list.push({
          id: `notif-app-${app._id || app.id}`,
          message: `📥 ${
            app.applicantName || app.applicantEmail || "A collaborator"
          } applied for '${app.opportunityTitle || "Role"}'`,
          type: "info",
          timestamp: formatTimestamp(app.appliedDate || app.createdAt),
          rawDate: new Date(app.appliedDate || app.createdAt || Date.now()),
        });
      });
    }

    // 2. COLLABORATOR NOTIFICATIONS
    if (role === "collaborator") {
      parsedApplications.forEach((app) => {
        if (app.status === "Accepted") {
          list.push({
            id: `notif-collab-acc-${app._id || app.id}`,
            message: `🎉 Congratulations! Your application for '${
              app.opportunityTitle || "Role"
            }' at '${app.startupName || "Startup"}' was Accepted!`,
            type: "success",
            timestamp: formatTimestamp(app.appliedDate || app.createdAt),
            rawDate: new Date(app.appliedDate || app.createdAt || Date.now()),
          });
        }
      });
    }

    // 3. ADMIN NOTIFICATIONS
    if (role === "admin") {
      parsedStartups.forEach((s) => {
        const isPending = s.status === "Pending" || s.status === false;
        list.push({
          id: `notif-admin-st-${s._id || s.id}`,
          message: `🚀 ${
            isPending ? "Pending Review:" : "New Startup:"
          } '${s.startup_name || s.name}' created by ${
            s.founder_email || "a founder"
          }`,
          type: isPending ? "warning" : "info",
          timestamp: "Recent",
          rawDate: new Date(),
        });
      });

      parsedSubscriptions.forEach((sub) => {
        if (
          sub.payment_status === "paid" ||
          sub.payment_status === "Completed"
        ) {
          const planName = formatPlanTitle(sub.planId);
          const amountFormatted = sub.amount
            ? `$${(sub.amount / 100).toFixed(0)}`
            : "$29";

          list.push({
            id: `notif-admin-sub-${sub._id || sub.id}`,
            message: `💳 ${
              sub.email || sub.user || "A user"
            } subscribed to ${planName} (${amountFormatted})`,
            type: "success",
            timestamp: formatTimestamp(
              sub.subscriptionAt || sub.createdAt || sub.date,
            ),
            rawDate: new Date(
              sub.subscriptionAt || sub.createdAt || Date.now(),
            ),
          });
        }
      });
    }

    return list.sort((a, b) => b.rawDate - a.rawDate);
  }, [
    role,
    user,
    parsedStartups,
    parsedFounderStartups,
    parsedApplications,
    parsedSubscriptions,
  ]);

  const unreadCount = useMemo(() => {
    return dynamicNotifications.filter((n) => !readIds.includes(n.id)).length;
  }, [dynamicNotifications, readIds]);

  // Outside Click Listener for both Notifications & Avatar Menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setReadIds(dynamicNotifications.map((n) => n.id));
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin");
          },
        },
      });
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case "warning":
        return (
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        );
      default:
        return <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "User";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <header className="flex flex-col border-b border-slate-800 bg-[#080E1C] gap-4 px-8 py-5 sm:flex-row sm:items-center sm:justify-between shrink-0 relative z-40 font-sans">
      {/* Page Title & Greeting */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>{capitalizeFirstLetter(role)} Dashboard</span>
          {role === "admin" && (
            <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Crown className="w-3 h-3" /> Admin
            </span>
          )}
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">
          Welcome back, {user?.name || "User"} 👋 — Here's your overview
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* ========================================================================= */}
        {/* NOTIFICATION BELL WITH POPOVER                                            */}
        {/* ========================================================================= */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsAvatarOpen(false);
            }}
            className="relative flex h-9 items-center justify-center space-x-2 rounded-xl bg-white/5 px-3.5 text-xs font-semibold text-slate-300 border border-slate-800 hover:bg-white/10 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4 text-slate-400" />
            {unreadCount > 0 && (
              <span className="font-mono text-amber-500 font-bold text-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0D1528] border border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-[#060C1A]">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-mono text-amber-500 hover:text-amber-400 underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {dynamicNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 italic">
                    No new notifications right now.
                  </div>
                ) : (
                  dynamicNotifications.map((n) => {
                    const isRead = readIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start space-x-3 p-3.5 transition-colors ${
                          isRead
                            ? "bg-transparent opacity-70"
                            : "bg-indigo-500/[0.04] hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          {renderNotificationIcon(n.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs leading-relaxed ${
                              isRead
                                ? "text-slate-400"
                                : "text-slate-200 font-medium"
                            }`}
                          >
                            {n.message}
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-slate-500">
                            {n.timestamp}
                          </p>
                        </div>

                        {!isRead && (
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Action Button */}
        {role === "admin" ? (
          <Link
            href="/dashboard/admin/users"
            className="flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-purple-600 px-4 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/10"
          >
            <Users className="h-4 w-4" />
            <span>Manage Users</span>
          </Link>
        ) : role === "founder" ? (
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

        {/* ========================================================================= */}
        {/* USER AVATAR WITH DROPDOWN MENU                                           */}
        {/* ========================================================================= */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => {
              setIsAvatarOpen(!isAvatarOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-full p-0.5 ring-2 ring-amber-500/30 hover:ring-amber-500/60 transition-all cursor-pointer outline-none"
            title="User Profile Menu"
          >
            <img
              src={
                user?.image ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              }
              alt={user?.name || "User"}
              className="h-9 w-9 rounded-full object-cover"
            />
          </button>

          {/* AVATAR DROPDOWN MENU */}
          {isAvatarOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0D1528] border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Account Summary Header */}
              <div className="px-3 py-2.5 mb-1 rounded-xl bg-[#060C1A] border border-slate-800/80">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-100 truncate">
                    {user?.name || "User Account"}
                  </p>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 ${
                      role === "admin"
                        ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                        : role === "founder"
                          ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                          : "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                    }`}
                  >
                    {role}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <div className="h-px bg-slate-800/80 my-1" />

              {/* Navigation Links */}
              <Link
                href="/"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Home className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Home</span>
              </Link>

              <Link
                href="/startups"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Browse Startups</span>
              </Link>

              <Link
                href="/opportunities"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Browse Opportunities</span>
              </Link>

              <div className="h-px bg-slate-800/80 my-1" />

              {/* Profile Settings Link */}
              <Link
                href="/profile"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Profile Settings</span>
              </Link>

              {/* Upgrade Plan Link (Founders & Collaborators) */}
              {role !== "admin" && (
                <Link
                  href={
                    role === "founder"
                      ? "/pricing"
                      : "/dashboard/collaborator/premium"
                  }
                  onClick={() => setIsAvatarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Upgrade Plan</span>
                </Link>
              )}

              <div className="h-px bg-slate-800/80 my-1" />

              {/* Sign Out Action */}
              <button
                onClick={() => {
                  setIsAvatarOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 rounded-xl hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
