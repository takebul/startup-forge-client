"use client";

import { authClient } from "@/lib/auth-client";
import {
  Bell,
  BookMarked,
  CreditCard,
  File,
  Flag,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const role = user?.role || "founder";

  const MAIN_MENU = {
    founder: [
      { label: "Dashboard", href: "/dashboard/founder", icon: LayoutDashboard },
      {
        label: "My Startups",
        href: "/dashboard/founder/my-startup",
        icon: Layers,
      },
      {
        label: "Add Opportunity",
        href: "/dashboard/founder/add-opportunity",
        icon: Inbox,
      },
      {
        label: "Manage Opportunities",
        href: "/dashboard/founder/manage-opportunities",
        icon: Users,
      },
      {
        label: "Applications",
        href: "/dashboard/founder/applications",
        icon: Bell,
      },
    ],
    collaborator: [
      {
        label: "Dashboard",
        href: "/dashboard/collaborator",
        icon: LayoutDashboard,
      },
      {
        label: "Browse Startups",
        href: "/dashboard/collaborator/startups",
        icon: Search,
      },
      {
        label: "My Applications",
        href: "/dashboard/collaborator/applications",
        icon: File,
      },
      {
        label: "Saved Roles",
        href: "/dashboard/collaborator/roles",
        icon: BookMarked,
      },
      {
        label: "Notifications",
        href: "/dashboard/collaborator/notifications",
        icon: Bell,
        badge: 2,
      },
    ],
    admin: [
      { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Manage Users", href: "/dashboard/admin/users", icon: Inbox },
      {
        label: "Manage Startups",
        href: "/dashboard/admin/startups",
        icon: Layers,
      },
      {
        label: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: CreditCard,
      },
      {
        label: "Reports",
        href: "/dashboard/admin/reports",
        icon: Flag,
        badge: 3,
      },
    ],
  };

  const ACCOUNT_MENU = [
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-60 bg-[#080E1C] border-r border-slate-800 flex flex-col h-screen sticky top-0">
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

        <div>
          <h3 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Account
          </h3>
          <nav className="space-y-1.5">
            {ACCOUNT_MENU.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-[#1A1D27] hover:text-slate-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between rounded-xl bg-[#151722] p-3 border border-[#232634]">
          <div className="flex items-center space-x-3">
            <img
              src={
                user?.image ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              }
              alt={user?.name || "User"}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-500/30"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                {user?.name || "Alex Rivera"}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {role}
              </span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-300">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
