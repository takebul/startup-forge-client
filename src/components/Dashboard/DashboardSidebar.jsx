"use client";

import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  Crown,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Rocket,
  Search,
  User,
  Users,
  Zap,
  Flame,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Helper to resolve user persona (admin, founder, collaborator)
function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

const DashboardSidebar = ({ initialUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const activeUserId = String(user?.id || user?._id || "");

  // Resolve active persona (admin, founder, collaborator)
  const persona = useMemo(() => getUserPersona(user), [user]);
  const isAdmin = persona === "admin";

  // Check if user has an upgraded plan (Founder or Collaborator)
  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  const MAIN_MENU = useMemo(
    () => ({
      founder: [
        {
          label: "Overview",
          href: "/dashboard/founder",
          icon: LayoutDashboard,
        },
        {
          label: "My Startups",
          href: "/dashboard/founder/my-startup",
          icon: Rocket,
        },
        {
          label: "Add Opportunity",
          href: "/dashboard/founder/add-opportunity",
          icon: PlusCircle,
        },
        {
          label: "Manage Opportunities",
          href: activeUserId
            ? `/dashboard/founder/manage-opportunities?startupId=${activeUserId}`
            : "/dashboard/founder/manage-opportunities",
          icon: Briefcase,
        },
        {
          label: "Applications",
          href: "/dashboard/founder/applications",
          icon: FileText,
        },
        {
          label: "Pricing & Plans",
          href: "/pricing",
          icon: Zap,
        },
      ],
      collaborator: [
        {
          label: "Overview",
          href: "/dashboard/collaborator",
          icon: LayoutDashboard,
        },
        {
          label: "Browse Opportunities",
          href: "/dashboard/collaborator/browse-opportunities",
          icon: Search,
        },
        {
          label: "My Applications",
          href: "/dashboard/collaborator/my-applications",
          icon: FileText,
        },
        {
          label: "Saved Bookmarks",
          href: "/dashboard/collaborator/bookmarks",
          icon: Bookmark,
        },
        {
          label: "Profile Settings",
          href: "/dashboard/collaborator/profile",
          icon: User,
        },
        {
          label: "Premium Membership",
          href: "/dashboard/collaborator/premium",
          icon: Zap,
        },
      ],
      admin: [
        {
          label: "Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          label: "Manage Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          label: "Manage Startups",
          href: "/dashboard/admin/startups",
          icon: Building2,
        },
        {
          label: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: CreditCard,
        },
      ],
    }),
    [activeUserId],
  );

  const activeLinks = MAIN_MENU[persona] || MAIN_MENU.collaborator;

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

  const isLinkActive = (href) => {
    const cleanHref = href.split("?")[0];
    if (cleanHref === `/dashboard/${persona}` || cleanHref === "/dashboard") {
      return pathname === cleanHref;
    }
    return pathname.startsWith(cleanHref);
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#080E1C] border-r border-slate-200 dark:border-slate-800/90 flex flex-col h-screen sticky top-0 font-sans z-30 select-none transition-colors duration-200">
      {/* Brand Logo & Platform Badge */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/70">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold font-mono shadow-sm group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            StartupForge
          </span>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 mb-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Navigation
            </h3>
            <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 capitalize">
              {persona}
            </span>
          </div>

          <nav className="space-y-1">
            {activeLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1D27] hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-violet-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </div>
                    <span>{link.label}</span>
                  </div>

                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile Card & Badges */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/80 p-3 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={
                  user?.image ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                }
                alt={user?.name || "User"}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/30"
              />
              {/* Badge overlay on Avatar */}
              {isAdmin ? (
                <div
                  className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white ring-2 ring-white dark:ring-slate-900 shadow-sm"
                  title="Super Administrator"
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

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || "User"}
                </span>
                {isAdmin ? (
                  <Crown
                    className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0"
                    title="Platform Administrator"
                  />
                ) : isUpgraded ? (
                  <BadgeCheck
                    className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400 shrink-0"
                    title="Verified Member"
                  />
                ) : null}
              </div>

              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-mono">
                  {persona}
                </span>
                {isAdmin ? (
                  <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-500/20">
                    ADMIN
                  </span>
                ) : isUpgraded ? (
                  <span className="text-[9px] font-mono font-bold text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-200 dark:border-sky-500/20 flex items-center gap-0.5">
                    <BadgeCheck className="w-2.5 h-2.5 text-sky-500 dark:text-sky-400" />
                    <span>VERIFIED</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-slate-400 hover:text-red-500 ml-2 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
