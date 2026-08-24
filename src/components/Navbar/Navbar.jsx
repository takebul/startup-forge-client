"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Sun,
  Moon,
  Home,
  Rocket,
  Briefcase,
  LogIn,
  LayoutDashboard,
  LogOut,
  X,
  Settings,
  Menu,
  Sparkles,
  Building2,
  CreditCard,
  Crown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

function getUserPersona(u) {
  if (!u) return "collaborator";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = !!session;
  const persona = useMemo(() => getUserPersona(user), [user]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avatarRef = useRef(null);

  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Do not render main navbar inside dashboard routes
  if (pathname?.includes("dashboard")) {
    return null;
  }

  const publicLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Startups", href: "/startups", icon: Rocket },
    { name: "Browse Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsAvatarOpen(false);
            router.push("/");
          },
        },
      });
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const dashboardHref =
    persona === "admin"
      ? "/dashboard/admin/users"
      : persona === "founder"
        ? "/dashboard/founder"
        : "/dashboard/collaborator";

  const profileHref =
    persona === "admin"
      ? "/dashboard/admin/profile"
      : persona === "founder"
        ? "/dashboard/founder/profile"
        : "/dashboard/collaborator/profile";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#080E1C]/80 font-sans transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors sm:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-500 p-2 shadow-sm shadow-indigo-600/30"
              >
                <Rocket className="h-4 w-4 text-white" />
              </motion.div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Startup
                <span className="text-indigo-600 dark:text-indigo-400">
                  Forge
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden sm:flex sm:items-center sm:gap-6">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            {mounted && (
              <Button
                isIconOnly
                variant="light"
                onPress={toggleTheme}
                aria-label="Toggle theme"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </Button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Desktop Dashboard Shortcut */}
                <div className="hidden sm:block">
                  <Link href={dashboardHref}>
                    <Button
                      variant="flat"
                      color="primary"
                      className="font-bold text-xs rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                      startContent={<LayoutDashboard className="h-3.5 w-3.5" />}
                    >
                      Dashboard
                    </Button>
                  </Link>
                </div>

                {/* User Avatar Popover */}
                <div ref={avatarRef} className="relative">
                  <button
                    onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                    className="flex items-center rounded-full p-0.5 ring-2 ring-indigo-500/30 hover:ring-indigo-500/70 transition-all cursor-pointer outline-none"
                    title="User Profile Menu"
                  >
                    <img
                      src={
                        user?.image ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={user?.name || "User Avatar"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </button>

                  {isAvatarOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Account Summary Header */}
                      <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 dark:bg-[#060C1A] border border-slate-200/80 dark:border-slate-800/80">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {user?.name || "User Account"}
                          </p>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 ${
                              persona === "admin"
                                ? "text-purple-700 bg-purple-100 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20"
                                : persona === "founder"
                                  ? "text-amber-700 bg-amber-100 border border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20"
                                  : "text-indigo-700 bg-indigo-100 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20"
                            }`}
                          >
                            {persona}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      {/* Navigation Links */}
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>Go to Dashboard</span>
                      </Link>

                      <Link
                        href="/"
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Home className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>Home</span>
                      </Link>

                      <Link
                        href="/startups"
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>Browse Startups</span>
                      </Link>

                      <Link
                        href="/opportunities"
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>Browse Opportunities</span>
                      </Link>

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <Link
                        href={profileHref}
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>Profile Settings</span>
                      </Link>

                      {persona !== "admin" && (
                        <Link
                          href="/pricing"
                          onClick={() => setIsAvatarOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>Upgrade Plan</span>
                        </Link>
                      )}

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button
                    variant="light"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 rounded-xl"
                  >
                    Sign in
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button
                    color="primary"
                    variant="shadow"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-indigo-600/25 rounded-xl"
                    startContent={<LogIn className="h-3.5 w-3.5" />}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#080E1C] sm:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {publicLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}

              {isLoggedIn && (
                <li className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
