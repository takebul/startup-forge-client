"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Plus,
  Crown,
  Users,
  Settings,
  Sparkles,
  LogOut,
  Home,
  Building2,
  Briefcase,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import NotificationDropdown from "./NotificationDropdown";

function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

export default function DashboardNavbar({ user: initialUser }) {
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const persona = useMemo(() => getUserPersona(user), [user]);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const capitalizeFirstLetter = (str) => {
    if (!str) return "User";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const userName = user?.name || "User";

  return (
    <header className="flex flex-col border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#080E1C] gap-4 px-6 sm:px-8 py-4 sm:flex-row sm:items-center sm:justify-between shrink-0 relative z-40 font-sans transition-colors duration-200">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>{`${capitalizeFirstLetter(persona)} Dashboard`}</span>
          {persona === "admin" && (
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Crown className="w-3 h-3" /> Admin
            </span>
          )}
        </h1>
        <p
          className="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
          suppressHydrationWarning
        >
          {`Welcome back, ${userName} 👋 — Here's your overview`}
        </p>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Theme Switcher Button */}
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle theme"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        )}

        {/* Destructured Notification Dropdown Component */}
        <NotificationDropdown user={user} />

        {/* Dynamic Action CTA */}
        {persona === "admin" ? (
          <Link
            href="/dashboard/admin/users"
            className="flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-purple-600 px-3.5 text-xs font-bold text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20"
          >
            <Users className="h-4 w-4" />
            <span>Manage Users</span>
          </Link>
        ) : persona === "founder" ? (
          <Link
            href="/dashboard/founder/add-opportunity"
            className="flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-violet-600 px-3.5 text-xs font-bold text-white hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Opportunity</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/collaborator/browse-opportunities"
            className="flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-violet-600 px-3.5 text-xs font-bold text-white hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Explore Roles</span>
          </Link>
        )}

        {/* Avatar Dropdown */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => setIsAvatarOpen(!isAvatarOpen)}
            className="flex items-center gap-1.5 rounded-full p-0.5 ring-2 ring-violet-500/30 hover:ring-violet-500/60 transition-all cursor-pointer outline-none"
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

          {isAvatarOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-slate-200 dark:bg-[#0D1528] dark:border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-[#060C1A] dark:border-slate-800/80">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {user?.name || "User Account"}
                  </p>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 ${
                      persona === "admin"
                        ? "text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10"
                        : persona === "founder"
                          ? "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10"
                          : "text-violet-700 bg-violet-100 dark:text-violet-400 dark:bg-violet-500/10"
                    }`}
                  >
                    {persona}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />

              <Link
                href="/"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <Home className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Home</span>
              </Link>

              <Link
                href="/startups"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Browse Startups</span>
              </Link>

              <Link
                href="/opportunities"
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Browse Opportunities</span>
              </Link>

              <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />

              <Link
                href={
                  persona === "founder"
                    ? "/dashboard/founder/profile"
                    : `/dashboard/${user?.accountType}/profile`
                }
                onClick={() => setIsAvatarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Profile Settings</span>
              </Link>

              {persona !== "admin" && (
                <Link
                  href={
                    persona === "founder"
                      ? "/pricing"
                      : "/dashboard/collaborator/premium"
                  }
                  onClick={() => setIsAvatarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Upgrade Plan</span>
                </Link>
              )}

              <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />

              <button
                onClick={() => {
                  setIsAvatarOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-500 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

