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
  Menu,
  X,
  LayoutDashboard,
  Rocket,
  PlusCircle,
  FileText,
  Zap,
  Search,
  Bookmark,
  User,
  Flame,
  CreditCard,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const activeUserId = String(user?.id || user?._id || "");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const avatarRef = useRef(null);
  const drawerRef = useRef(null);

  // Check if user has an upgraded plan (Founder or Collaborator)
  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  const isAdmin = persona === "admin";

  // Menu links configuration by persona
  const MAIN_MENU = useMemo(
    () => ({
      founder: [
        {
          label: "Overview",
          href: "/dashboard/founder",
          icon: LayoutDashboard,
          description: "Key metrics & activity",
        },
        {
          label: "My Startups",
          href: "/dashboard/founder/my-startup",
          icon: Rocket,
          description: "Manage your venture profiles",
        },
        {
          label: "Add Opportunity",
          href: "/dashboard/founder/add-opportunity",
          icon: PlusCircle,
          description: "Post new open roles",
        },
        {
          label: "Manage Opportunities",
          href: activeUserId
            ? `/dashboard/founder/manage-opportunities?startupId=${activeUserId}`
            : "/dashboard/founder/manage-opportunities",
          icon: Briefcase,
          description: "Edit & track listings",
        },
        {
          label: "Applications",
          href: "/dashboard/founder/applications",
          icon: FileText,
          description: "Review candidates",
        },
        {
          label: "Pricing & Plans",
          href: "/pricing",
          icon: Zap,
          description: "Upgrade your tier",
        },
      ],
      collaborator: [
        {
          label: "Overview",
          href: "/dashboard/collaborator",
          icon: LayoutDashboard,
          description: "Personal activity hub",
        },
        {
          label: "Browse Opportunities",
          href: "/dashboard/collaborator/browse-opportunities",
          icon: Search,
          description: "Find your next role",
        },
        {
          label: "My Applications",
          href: "/dashboard/collaborator/my-applications",
          icon: FileText,
          description: "Track application statuses",
        },
        {
          label: "Saved Bookmarks",
          href: "/dashboard/collaborator/bookmarks",
          icon: Bookmark,
          description: "Saved roles & startups",
        },
        {
          label: "Profile Settings",
          href: "/dashboard/collaborator/profile",
          icon: User,
          description: "Customize your bio & skills",
        },
        {
          label: "Premium Membership",
          href: "/dashboard/collaborator/premium",
          icon: Zap,
          description: "Unlock pro benefits",
        },
      ],
      admin: [
        {
          label: "Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
          description: "System analytics & controls",
        },
        {
          label: "Manage Users",
          href: "/dashboard/admin/users",
          icon: Users,
          description: "User directory & permissions",
        },
        {
          label: "Manage Startups",
          href: "/dashboard/admin/startups",
          icon: Building2,
          description: "Startup listings & verification",
        },
        {
          label: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: CreditCard,
          description: "Revenue & billing records",
        },
      ],
    }),
    [activeUserId],
  );

  const activeLinks = MAIN_MENU[persona] || MAIN_MENU.collaborator;

  // Mobile dock bottom navigation items (top 4 items for current role + Menu trigger)
  const mobileDockTabs = useMemo(() => {
    if (persona === "founder") {
      return [
        {
          label: "Overview",
          href: "/dashboard/founder",
          icon: LayoutDashboard,
        },
        {
          label: "Startups",
          href: "/dashboard/founder/my-startup",
          icon: Rocket,
        },
        {
          label: "Add Opp",
          href: "/dashboard/founder/add-opportunity",
          icon: PlusCircle,
          isAction: true,
        },
        {
          label: "Apps",
          href: "/dashboard/founder/applications",
          icon: FileText,
        },
      ];
    }
    if (persona === "admin") {
      return [
        {
          label: "Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          label: "Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          label: "Startups",
          href: "/dashboard/admin/startups",
          icon: Building2,
        },
        {
          label: "Finance",
          href: "/dashboard/admin/transactions",
          icon: CreditCard,
        },
      ];
    }
    return [
      {
        label: "Overview",
        href: "/dashboard/collaborator",
        icon: LayoutDashboard,
      },
      {
        label: "Browse",
        href: "/dashboard/collaborator/browse-opportunities",
        icon: Search,
      },
      {
        label: "My Apps",
        href: "/dashboard/collaborator/my-applications",
        icon: FileText,
      },
      {
        label: "Saved",
        href: "/dashboard/collaborator/bookmarks",
        icon: Bookmark,
      },
    ];
  }, [persona]);

  // Click outside handling for avatar dropdown and escape key for mobile drawer
  useEffect(() => {
    setMounted(true);

    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsAvatarOpen(false);
        setIsMobileDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileDrawerOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

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

  // Check if link is active
  const isLinkActive = (href) => {
    const cleanHref = href.split("?")[0];
    if (cleanHref === `/dashboard/${persona}` || cleanHref === "/dashboard") {
      return pathname === cleanHref;
    }
    return pathname.startsWith(cleanHref);
  };

  return (
    <>
      {/* =========================================================================
          TOP HEADER NAVBAR (Desktop & Mobile/Tablet Unified Responsive Experience)
          ========================================================================= */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#080E1C]/95">
        {/* Left Side: Mobile/Tablet Hamburger / Brand + Desktop Greeting */}
        <div className="flex items-center gap-3">
          {/* Mobile/Tablet Hamburger Toggle Button (Active up to lg: breakpoint) */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-xs shrink-0"
            aria-label="Open Navigation Menu"
            title="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile/Tablet Brand Logo Mark (Line break: StartupForge on top, Persona badge below) */}
          <Link href="/" className="flex items-center gap-2.5 lg:hidden group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold font-mono shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Flame className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                StartupForge
              </span>
              <div className="mt-1 flex items-center">
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border leading-none ${
                    persona === "admin"
                      ? "text-purple-700 bg-purple-100 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20"
                      : persona === "founder"
                        ? "text-violet-700 bg-violet-100 border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20"
                        : "text-indigo-700 bg-indigo-100 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20"
                  }`}
                >
                  {persona}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Title & Subtitle (Visible on lg: and above) */}
          <div className="hidden lg:block">
            <h1 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <span>{`${capitalizeFirstLetter(persona)} Dashboard`}</span>
              {isAdmin ? (
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Admin
                </span>
              ) : isUpgraded ? (
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-2xs">
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />{" "}
                  Verified Member
                </span>
              ) : null}
            </h1>
          </div>
        </div>

        {/* Right Side: Theme Toggle + Notifications + Dynamic Action Button + Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Switcher Button */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-xs"
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>
          )}

          {/* Destructured Notification Dropdown Component */}
          <NotificationDropdown user={user} />

          {/* Dynamic Action CTA (Visible on tablet & desktop) */}
          {persona === "admin" ? (
            <Link
              href="/dashboard/admin/users"
              className="hidden sm:flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-purple-600 px-3.5 text-xs font-bold text-white hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-600/20"
            >
              <Users className="h-4 w-4" />
              <span>Manage Users</span>
            </Link>
          ) : persona === "founder" ? (
            <Link
              href="/dashboard/founder/add-opportunity"
              className="hidden sm:flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 text-xs font-bold text-white hover:opacity-95 active:scale-95 transition-all shadow-md shadow-violet-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>Add Opportunity</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/collaborator/browse-opportunities"
              className="hidden sm:flex h-9 items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 text-xs font-bold text-white hover:opacity-95 active:scale-95 transition-all shadow-md shadow-violet-600/20"
            >
              <Search className="h-4 w-4" />
              <span>Explore Roles</span>
            </Link>
          )}

          {/* Avatar Menu Dropdown */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="relative flex items-center gap-1.5 rounded-full p-0.5 ring-2 ring-violet-500/30 hover:ring-violet-500/60 focus:ring-violet-500/70 transition-all cursor-pointer outline-none active:scale-95"
              title="User Profile Menu"
              aria-label="User profile menu"
            >
              <img
                src={
                  user?.image ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                }
                alt={user?.name || "User"}
                className="h-8.5 w-8.5 rounded-full object-cover"
              />
              {/* Badge overlay on Avatar */}
              {isAdmin ? (
                <div
                  className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-purple-600 text-white ring-2 ring-white dark:ring-[#0D1528] shadow-xs"
                  title="Admin"
                >
                  <Crown className="h-2 w-2" />
                </div>
              ) : isUpgraded ? (
                <div
                  className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-500 text-white ring-2 ring-white dark:ring-[#0D1528] shadow-xs"
                  title="Verified Member"
                >
                  <BadgeCheck className="h-2.5 w-2.5" />
                </div>
              ) : null}
            </button>

            {isAvatarOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-slate-200 dark:bg-[#0D1528] dark:border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-[#060C1A] dark:border-slate-800/80">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user?.name || "User Account"}
                      </p>
                      {isAdmin ? (
                        <Crown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      ) : isUpgraded ? (
                        <BadgeCheck className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" title="Verified Member" />
                      ) : null}
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 ${
                        isAdmin
                          ? "text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10"
                          : isUpgraded
                            ? "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/10"
                            : persona === "founder"
                              ? "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-500/10"
                              : "text-indigo-700 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10"
                      }`}
                    >
                      {isAdmin ? "Admin" : isUpgraded ? "Verified" : persona}
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
                      : `/dashboard/${user?.accountType || "collaborator"}/profile`
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

      {/* =========================================================================
          MOBILE & TABLET NAVIGATION DRAWER (Slide-out Offcanvas Sidebar Sheet)
          ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container Panel */}
          <div
            ref={drawerRef}
            className="relative w-[310px] max-w-[85vw] bg-white dark:bg-[#080E1C] border-r border-slate-200 dark:border-slate-800/90 h-full flex flex-col shadow-2xl z-50 animate-in slide-in-from-left duration-300 ease-out"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <Link
                href="/"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center space-x-2.5"
              >
                <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold font-mono shadow-sm shrink-0">
                  <Flame className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    StartupForge
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 capitalize">
                    {persona} dashboard
                  </span>
                </div>
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* User Mini Profile Card */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
              <div className="flex items-center space-x-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 p-3 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <div className="relative shrink-0">
                  <img
                    src={
                      user?.image ||
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    }
                    alt={user?.name || "User"}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-500/40"
                  />
                  {isAdmin ? (
                    <div
                      className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white ring-2 ring-white dark:ring-slate-900 shadow-sm"
                      title="Admin"
                    >
                      <Crown className="h-2.5 w-2.5" />
                    </div>
                  ) : isUpgraded ? (
                    <div
                      className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-sm"
                      title="Verified Member"
                    >
                      <BadgeCheck className="h-3 w-3" />
                    </div>
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || "User"}
                    </p>
                    {isAdmin ? (
                      <Crown className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    ) : isUpgraded ? (
                      <BadgeCheck className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400 shrink-0" title="Verified Member" />
                    ) : null}
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                        isAdmin
                          ? "text-purple-700 bg-purple-100 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20"
                          : persona === "founder"
                            ? "text-violet-700 bg-violet-100 border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20"
                            : "text-indigo-700 bg-indigo-100 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20"
                      }`}
                    >
                      {persona}
                    </span>
                    {isUpgraded && (
                      <span className="text-[9px] font-mono font-bold text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-200 dark:border-sky-500/20 flex items-center gap-0.5">
                        <BadgeCheck className="w-2.5 h-2.5 text-sky-500 dark:text-sky-400" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
              {/* Section 1: Dashboard Routes */}
              <div>
                <div className="flex items-center justify-between px-3 mb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Dashboard Routes
                  </h3>
                  <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 capitalize">
                    {persona} view
                  </span>
                </div>

                <nav className="space-y-1.5">
                  {activeLinks.map((link) => {
                    const active = isLinkActive(link.href);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                          active
                            ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 font-bold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1D27] hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                              active
                                ? "bg-violet-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{link.label}</span>
                            {link.description && (
                              <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 truncate">
                                {link.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 shrink-0 ${
                            active
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Section 2: Explore Platform */}
              <div>
                <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                  Explore Platform
                </h3>
                <nav className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center space-x-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1D27] hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    <Home className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Home Page</span>
                  </Link>
                  <Link
                    href="/startups"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center space-x-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1D27] hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Explore Startups</span>
                  </Link>
                  <Link
                    href="/opportunities"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center space-x-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1D27] hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Browse Opportunities</span>
                  </Link>
                  {persona !== "admin" && (
                    <Link
                      href={
                        persona === "founder"
                          ? "/pricing"
                          : "/dashboard/collaborator/premium"
                      }
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="flex items-center space-x-3 rounded-xl px-3 py-2 text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                    >
                      <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>Upgrade Plan</span>
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#060C1A]/50 shrink-0 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-slate-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  handleSignOut();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE & TABLET BOTTOM NAVIGATION DOCK (Active up to lg: breakpoint)
          ========================================================================= */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/80 bg-white/90 px-2 py-1 backdrop-blur-xl lg:hidden shadow-lg shadow-black/5 dark:border-slate-800/80 dark:bg-[#080E1C]/90"
        aria-label="Mobile Navigation Dock"
      >
        {mobileDockTabs.map((tab) => {
          const active = isLinkActive(tab.href);
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center justify-center group -mt-5"
                aria-label={tab.label}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 group-active:scale-95 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors relative ${
                active
                  ? "text-violet-600 dark:text-violet-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-4.5 w-4.5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`}
                />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-violet-600 dark:bg-violet-400" />
                )}
              </div>
              <span className="mt-1 text-[10px] truncate max-w-[58px]">
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* 5th Tab: Menu trigger for full Drawer */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            isMobileDrawerOpen
              ? "text-violet-600 dark:text-violet-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
          }`}
          aria-label="Open Full Navigation Menu"
        >
          <div className="relative">
            <Menu className="h-4.5 w-4.5 stroke-[1.8]" />
          </div>
          <span className="mt-1 text-[10px]">Menu</span>
        </button>
      </nav>
    </>
  );
}
