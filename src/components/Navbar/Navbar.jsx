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
  User,
  CreditCardIcon,
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

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAvatarOpen(false);
  }, [pathname]);

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
    { name: "Startups", href: "/startups", icon: Rocket },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Pricing", href: "/pricing", icon: CreditCardIcon },
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
            setIsMenuOpen(false);
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
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-[#080E1C]/85 font-sans transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Hamburger Button (Visible on < md) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex md:hidden items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.06, rotate: 8 }}
                whileTap={{ scale: 0.94 }}
                className="rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 p-2 shadow-sm shadow-violet-600/30 shrink-0"
              >
                <Rocket className="h-4 w-4 text-white" />
              </motion.div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                Startup
                <span className="text-violet-600 dark:text-violet-400">
                  Forge
                </span>
              </span>
            </Link>
          </div>

          {/* Center: Tablet & Desktop Nav Links (Visible on >= md) */}
          <ul className="hidden md:flex items-center gap-2 lg:gap-6">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-violet-50 text-violet-700 font-bold dark:bg-violet-500/15 dark:text-violet-300 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions: Theme Toggle, Auth / Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            {mounted && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={toggleTheme}
                aria-label="Toggle color theme"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl h-9 w-9 min-w-9"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </Button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Desktop Dashboard Shortcut */}
                <div className="hidden lg:block">
                  <Link href={dashboardHref}>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="font-bold text-xs rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20 px-3.5 py-1.5"
                      startContent={<LayoutDashboard className="h-3.5 w-3.5" />}
                    >
                      Dashboard
                    </Button>
                  </Link>
                </div>

                {/* User Avatar Popover */}
                <div ref={avatarRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                    className="flex items-center rounded-full p-0.5 ring-2 ring-violet-500/30 hover:ring-violet-500/70 transition-all cursor-pointer outline-none"
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
                                  : "text-violet-700 bg-violet-100 border border-violet-200 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20"
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
                        type="button"
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
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href="/signin" className="hidden sm:inline-flex">
                  <Button
                    size="sm"
                    variant="light"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-xl"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button
                    size="sm"
                    color="primary"
                    variant="shadow"
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-violet-600/25 rounded-xl px-3.5 py-1.5"
                    startContent={<LogIn className="h-3.5 w-3.5" />}
                  >
                    <span className="hidden xs:inline">Join</span>
                    <span className="xs:hidden">Get Started</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Navigation (< md) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#080E1C]/95 md:hidden shadow-xl"
          >
            <div className="px-4 py-5 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* If Logged In: Mobile User Card */}
              {isLoggedIn && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        user?.image ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={user?.name || "User Avatar"}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-500/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user?.name || "User Account"}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 ${
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
              )}

              {/* Public & Navigation Links */}
              <ul className="space-y-1">
                {publicLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 font-bold"
                            : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}

                {isLoggedIn && (
                  <>
                    <li className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-violet-700 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300"
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        <span>Dashboard Overview</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        href={profileHref}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span>Profile Settings</span>
                      </Link>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>

              {/* If Not Logged In: Mobile Auth Buttons */}
              {!isLoggedIn && (
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant="bordered"
                      className="w-full rounded-2xl font-bold text-xs border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200 py-3"
                    >
                      Sign In
                    </Button>
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full"
                  >
                    <Button
                      color="primary"
                      className="w-full rounded-2xl font-bold text-xs bg-violet-600 text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 py-3"
                      startContent={<LogIn className="h-4 w-4" />}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
