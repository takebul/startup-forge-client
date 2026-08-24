"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ban,
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogIn,
  Crown,
  Rocket,
  Briefcase,
  ShieldX,
  AlertOctagon,
} from "lucide-react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

function getUserPersona(u) {
  if (!u) return "guest";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

export default function ForbiddenPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const persona = useMemo(() => getUserPersona(user), [user]);
  const isLoggedIn = !!session;

  const dashboardHref =
    persona === "admin"
      ? "/dashboard/admin/users"
      : persona === "founder"
        ? "/dashboard/founder"
        : "/dashboard/collaborator";

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-6 font-sans overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-600/15" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-600/15" />

      <div className="relative w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 md:p-10 shadow-xl text-center dark:border-slate-800/90 dark:bg-slate-900/90"
        >
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-50 px-3.5 py-1 text-xs font-mono font-bold text-rose-600 dark:bg-red-500/10 dark:text-rose-400 uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>HTTP 403 • Forbidden Resource</span>
            </span>
          </div>

          {/* Central Ban Shield Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 shadow-inner mb-6">
            <ShieldX className="h-10 w-10" />
          </div>

          {/* Headline & Explanation */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Action Not Allowed
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Your current account credentials do not grant access to perform this
            action or view this specific resource.
          </p>

          {/* Active Persona Context Card */}
          {isLoggedIn ? (
            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left space-y-2 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {user?.name || "Active Session"}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 flex items-center gap-1 ${
                    persona === "admin"
                      ? "text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10"
                      : persona === "founder"
                        ? "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10"
                        : "text-violet-700 bg-violet-100 dark:text-violet-400 dark:bg-violet-500/10"
                  }`}
                >
                  {persona === "admin" && <Crown className="w-3 h-3" />}
                  {persona === "founder" && <Rocket className="w-3 h-3" />}
                  {persona === "collaborator" && (
                    <Briefcase className="w-3 h-3" />
                  )}
                  <span>{persona} Tier</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>
                  {persona === "collaborator"
                    ? "Collaborator accounts cannot access founder or moderation workspaces."
                    : persona === "founder"
                      ? "Founder accounts cannot access collaborator application forms or admin panels."
                      : "This route requires root administrative overrides."}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 text-center font-mono">
              Unauthenticated request. Sign in with valid credentials.
            </div>
          )}

          {/* Navigational Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="bordered"
                  onPress={() => router.back()}
                  className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  startContent={<ArrowLeft className="h-4 w-4" />}
                >
                  Go Back
                </Button>

                <Link href={dashboardHref} className="flex-1">
                  <Button
                    className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 transition-all"
                    startContent={<LayoutDashboard className="h-4 w-4" />}
                  >
                    Return to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="flex-1">
                  <Button
                    variant="bordered"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    startContent={<Home className="h-4 w-4" />}
                  >
                    Homepage
                  </Button>
                </Link>

                <Link href="/signin" className="flex-1">
                  <Button
                    className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 transition-all"
                    startContent={<LogIn className="h-4 w-4" />}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Help Footnote */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Believe this is a system mistake? Contact{" "}
            <a
              href="mailto:support@startupforge.com"
              className="text-violet-600 dark:text-violet-400 underline hover:text-violet-500"
            >
              support@startupforge.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

