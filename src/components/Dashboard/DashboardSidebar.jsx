"use client";

import { authClient } from "@/lib/auth-client";
import {
  BadgeCheck,
  BarChart3,
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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const role = user?.role || "founder";

  // Check if user has an upgraded plan (Founder or Collaborator)
  const planKey = String(user?.plan || user?.plan_id || "").toLowerCase();
  const isUpgraded =
    planKey.includes("premium") ||
    planKey.includes("enterprise") ||
    (planKey !== "" && !planKey.includes("free"));

  const isAdmin = role === "admin";

  const MAIN_MENU = {
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
        href: `/dashboard/founder/manage-opportunities?startupId=${user?.id}`,
        icon: Briefcase,
      },
      {
        label: "Applications",
        href: "/dashboard/founder/applications",
        icon: FileText,
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
        label: "Profile",
        href: "/dashboard/collaborator/profile",
        icon: User,
      },
      {
        label: "Bookmark",
        href: "/dashboard/collaborator/bookmark",
        icon: Bookmark,
      },
      {
        label: "Premium",
        href: "/dashboard/collaborator/premium",
        icon: Zap,
        badge: 2,
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
  };

  return (
    <aside className="w-60 bg-[#080E1C] border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="flex h-20 items-center px-6 border-b border-slate-800/50">
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold">
            SF
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            StartupForge
          </span>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-6">
          <h3 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </h3>
          <nav className="space-y-1.5">
            {MAIN_MENU[role]?.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "text-slate-400 hover:bg-[#1A1D27] hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile Card & Badges */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between rounded-xl bg-[#151722] p-3 border border-[#232634]">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={
                  user?.image ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                }
                alt={user?.name || "User"}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-500/30"
              />
              {/* Badge overlay on Avatar */}
              {isAdmin ? (
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white ring-2 ring-[#151722]">
                  <Crown className="h-2.5 w-2.5" />
                </div>
              ) : isUpgraded ? (
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-slate-950 ring-2 ring-[#151722]">
                  <BadgeCheck className="h-3 w-3 fill-sky-500 text-[#151722]" />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-white truncate">
                  {user?.name || "Alex Rivera"}
                </span>
                {/* Verified Badge Icon next to name */}
                {isAdmin && (
                  <Crown
                    className="h-3.5 w-3.5 text-purple-400 shrink-0"
                    title="Unique Admin Status"
                  />
                )}
                {!isAdmin && isUpgraded && (
                  <BadgeCheck
                    className="h-3.5 w-3.5 text-sky-400 shrink-0 fill-sky-400/20"
                    title="Verified Member"
                  />
                )}
              </div>

              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[10px] text-slate-500 capitalize">
                  {role}
                </span>
                {isAdmin ? (
                  <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-500/10 px-1.5 rounded border border-purple-500/20">
                    ADMIN
                  </span>
                ) : isUpgraded ? (
                  <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 rounded border border-amber-500/20">
                    VERIFIED
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <button
            onClick={async () =>
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              })
            }
            className="text-slate-500 hover:text-slate-300 ml-2"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
