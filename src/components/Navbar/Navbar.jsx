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
  Crown,
  CreditCard,
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

  // Close avatar dropdown when clicking outside
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
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#080E1C]/80 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2 shadow-sm shadow-indigo-600/30"
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

          {/* Desktop Navigation */}
          <ul className="hidden sm:flex sm:items-center sm:gap-6">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                isIconOnly
                variant="light"
                onPress={toggleTheme}
                aria-label="Toggle theme"
                className="text-slate-600 dark:text-slate-400"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Authentication & Profile Menu */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Desktop Dashboard Shortcut Button */}
                <div className="hidden sm:block">
                  <Link href={dashboardHref}>
                    <Button
                      variant="flat"
                      color="primary"
                      className="font-bold text-xs"
                      startContent={<LayoutDashboard className="h-3.5 w-3.5" />}
                    >
                      Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Avatar Popover Dropdown */}
                <div ref={avatarRef} className="relative">
                  <button
                    onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                    className="flex items-center gap-1.5 rounded-full p-0.5 ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 transition-all cursor-pointer outline-none"
                    title="User Profile Menu"
                  >
                    <img
                      src={
                        user?.image ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={user?.name || "User"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </button>

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
                              persona === "admin"
                                ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                                : persona === "founder"
                                  ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                                  : "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                            }`}
                          >
                            {persona}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>

                      <div className="h-px bg-slate-800/80 my-1" />

                      {/* Navigation Links */}
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Go to Dashboard</span>
                      </Link>

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

                      {/* Dynamic Role Profile */}
                      <Link
                        href={profileHref}
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Profile Settings</span>
                      </Link>

                      {/* Upgrade Plan (Non-Admins) */}
                      {persona !== "admin" && (
                        <Link
                          href="/pricing"
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
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 rounded-xl hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/signin">
                <Button
                  color="primary"
                  variant="shadow"
                  className="bg-indigo-600 font-bold text-xs text-white shadow-indigo-600/30"
                  startContent={<LogIn className="h-4 w-4" />}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
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
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400"
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
