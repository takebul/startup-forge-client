"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  AlertTriangle,
  Info,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { getNotifications } from "@/lib/api/notifications";
import {
  markAllNotificationsRead,
  markNotificationAsRead,
} from "@/lib/actions/notifications";

function formatTimestamp(dateStr) {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent";

    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timePart = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} • ${timePart}`;
  } catch {
    return "Recent";
  }
}

function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

export default function NotificationDropdown({ user }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const activeUserId = String(user?.id || user?._id || "");
  const persona = useMemo(() => getUserPersona(user), [user]);

  const fetchUserNotifications = useCallback(async () => {
    if (!activeUserId) return;
    setIsLoading(true);
    try {
      const data = await getNotifications(activeUserId, persona);
      setNotifications(data?.notifications || []);
      setUnreadCount(data?.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeUserId, persona]);

  useEffect(() => {
    fetchUserNotifications();
  }, [fetchUserNotifications]);

  const handleMarkAllRead = async () => {
    if (!activeUserId || unreadCount === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead(activeUserId, persona);
    } catch (err) {
      console.error("Error marking all read:", err);
      fetchUserNotifications();
    }
  };

  const handleNotificationClick = async (notif) => {
    const notifId = notif._id || notif.id;

    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          (n._id || n.id) === notifId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationAsRead(notifId);
      } catch (err) {
        console.error("Error marking notification read:", err);
      }
    }

    if (notif.link) {
      setIsOpen(false);

      // Route aliases for legacy notification documents
      let targetUrl = notif.link;
      if (targetUrl === "/dashboard/admin/subscriptions") {
        targetUrl = "/dashboard/admin/transactions";
      } else if (targetUrl === "/dashboard/founder/my-applications") {
        targetUrl = "/dashboard/founder/applications";
      }

      router.push(targetUrl);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case "warning":
        return (
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        );
      case "resubmitted":
        return (
          <RefreshCw className="h-3.5 w-3.5 text-indigo-400 shrink-0 animate-spin-slow" />
        );
      case "subscription":
        return <CreditCard className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
      default:
        return <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 items-center justify-center space-x-2 rounded-xl bg-slate-50 dark:bg-white/5 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-xs"
        title="Notifications"
      >
        <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="font-mono text-violet-600 dark:text-violet-400 font-bold text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060C1A]">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-[10px] font-mono font-bold border border-violet-200 dark:border-violet-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic">
                No new notifications right now.
              </div>
            ) : (
              notifications.map((n) => {
                const notifId = n._id || n.id;
                const isRead = n.isRead === true;

                return (
                  <div
                    key={notifId}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-start space-x-3 p-3.5 transition-colors cursor-pointer ${
                      isRead
                        ? "bg-transparent opacity-60 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                        : "bg-violet-500/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shrink-0">
                      {renderIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-relaxed ${
                          isRead
                            ? "text-slate-500 dark:text-slate-400"
                            : "text-slate-900 dark:text-slate-200 font-medium"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {formatTimestamp(n.createdAt)}
                      </p>
                    </div>

                    {!isRead && (
                      <span className="h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

