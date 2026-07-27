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
import { usePathname, useRouter } from "next/navigation";

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
        href: "/dashboard/founder/startups",
        icon: Layers,
      },
      {
        label: "Applications",
        href: "/dashboard/founder/applications",
        icon: Inbox,
      },
      { label: "Team Roles", href: "/dashboard/founder/roles", icon: Users },
      {
        label: "Notifications",
        href: "/dashboard/founder/notifications",
        icon: Bell,
        badge: 3,
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
    <div>
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            StartupForge
          </span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-6">
          <h3 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </h3>
          <nav className="space-y-1.5">
            {MAIN_MENU[role].map((link) => {
              const isActive =
                pathname === link.href ||
                (link.label === "Dashboard" && pathname === "/dashboard");
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-[#1A1D27] hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
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
                  className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-[#1A1D27] hover:text-slate-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile Card */}
      <div className="p-4">
        <div className="flex items-center justify-between rounded-xl bg-[#151722] p-3 border border-[#232634]">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              alt="Alex Rivera"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Alex Rivera</span>
              <span className="text-[10px] text-slate-500">Founder</span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-300">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
