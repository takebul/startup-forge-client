"use client";

import { useState, useEffect } from "react";
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
  User,
  LogOut,
  X,
  Settings,
  Menu,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  // 1. Fetch real session data
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = !!session; // Auto-updates based on real auth state

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.includes("dashboard")) {
    return null;
  }

  const publicLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Startups", href: "/startups", icon: Rocket },
    { name: "Browse Opportunities", href: "/opportunities", icon: Briefcase },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile Menu Toggle & Brand */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Animated Logo */}
              <Link href="/">
                <motion.div
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-2"
                >
                  {/* Rocket Icon Animation */}
                  <motion.div
                    variants={{
                      initial: { scale: 0, rotate: -45, opacity: 0 },
                      animate: {
                        scale: 1,
                        rotate: 0,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          bounce: 0.5,
                          duration: 0.6,
                        },
                      },
                      hover: {
                        scale: 1.1,
                        rotate: 15,
                        y: -2,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        },
                      },
                      tap: { scale: 0.95, rotate: 0 },
                    }}
                    className="rounded-lg bg-blue-600 p-1.5 shadow-sm shadow-blue-600/30"
                  >
                    <Rocket className="h-5 w-5 text-white" />
                  </motion.div>

                  {/* Text Animation */}
                  <motion.p
                    variants={{
                      initial: { opacity: 0, x: -15 },
                      animate: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.4,
                          delay: 0.1,
                          ease: "easeOut",
                        },
                      },
                      hover: { x: 2 },
                    }}
                    className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
                  >
                    <span className="text-purple-600 dark:text-purple-50">
                      Startup
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Forge
                    </span>
                  </motion.p>
                </motion.div>
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
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Switcher */}
              {mounted && (
                <Button
                  isIconOnly
                  variant="light"
                  onPress={toggleTheme}
                  aria-label="Toggle theme"
                  className="text-zinc-600 dark:text-zinc-400"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}

              {/* Auth/Profile Actions */}
              {isLoggedIn ? (
                <>
                  <div className="hidden sm:block">
                    <Link href="/dashboard">
                      <Button
                        variant="flat"
                        color="primary"
                        className="font-medium"
                        startContent={<LayoutDashboard className="h-4 w-4" />}
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                  {/* Small Profile Button with Avatar if available */}
                  <Button
                    isIconOnly
                    variant="flat"
                    className="overflow-hidden rounded-full bg-zinc-100 p-0 dark:bg-zinc-800"
                    onPress={() => setIsProfileOpen(true)}
                  >
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    )}
                  </Button>
                </>
              ) : (
                <Link href={"/signin"}>
                  <Button
                    color="primary"
                    variant="shadow"
                    className="bg-blue-600 font-medium text-white shadow-blue-600/30"
                    startContent={<LogIn className="h-4 w-4" />}
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Animated) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:hidden"
            >
              <ul className="space-y-1 px-4 py-4">
                {publicLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={`${link.name}-${link.href}`}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}

                {isLoggedIn && (
                  <li>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Profile Drawer */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Your Profile
                </h2>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setIsProfileOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Drawer Content - Now completely dynamic! */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-blue-600 bg-blue-100 dark:bg-blue-900/30">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate text-lg font-bold text-zinc-900 dark:text-white">
                      {user?.name || "User"}
                    </h3>
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Button
                      variant="light"
                      className="w-full justify-start text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      size="lg"
                      startContent={<LayoutDashboard className="h-5 w-5" />}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="light"
                    className="w-full justify-start text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    size="lg"
                    startContent={<Settings className="h-5 w-5" />}
                  >
                    Account Settings
                  </Button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
                <Button
                  color="danger"
                  variant="flat"
                  className="w-full font-medium"
                  startContent={<LogOut className="h-4 w-4" />}
                  onPress={async () => {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          setIsProfileOpen(false); // Close drawer on logout
                          router.push("/");
                        },
                      },
                    });
                  }}
                >
                  Logout
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
