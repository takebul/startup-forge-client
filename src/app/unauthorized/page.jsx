"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogIn,
  Crown,
  Rocket,
  Briefcase,
  Lock,
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

export default function UnauthorizedPage() {
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
    <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-300 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Main Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-[#1E212B] bg-[#12141D] p-8 md:p-10 shadow-2xl text-center"
        >
          {/* Top Status Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>403 Forbidden Access</span>
            </span>
          </div>

          {/* Central Shield Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5 mb-6">
            <ShieldAlert className="h-10 w-10" />
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Access Restricted
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            You do not have the required permissions or role credentials to
            access this protected StartupForge route.
          </p>

          {/* User Account Context Pill */}
          {isLoggedIn ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#060C1A] p-4 text-left">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-200 truncate">
                    {user?.name || "Active User"}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full uppercase shrink-0 flex items-center gap-1 ${
                    persona === "admin"
                      ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                      : persona === "founder"
                        ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                        : "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                  }`}
                >
                  {persona === "admin" && <Crown className="w-3 h-3" />}
                  {persona === "founder" && <Rocket className="w-3 h-3" />}
                  {persona === "collaborator" && (
                    <Briefcase className="w-3 h-3" />
                  )}
                  <span>{persona} Role</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#060C1A] p-4 text-xs text-slate-400">
              Please sign in with an authorized account to continue.
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="flat"
                  onPress={() => router.back()}
                  className="flex-1 rounded-xl border border-slate-800 bg-white/5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                  startContent={<ArrowLeft className="h-4 w-4" />}
                >
                  Go Back
                </Button>

                <Link href={dashboardHref} className="flex-1">
                  <Button
                    color="primary"
                    className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                    startContent={<LayoutDashboard className="h-4 w-4" />}
                  >
                    My Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="flex-1">
                  <Button
                    variant="flat"
                    className="w-full rounded-xl border border-slate-800 bg-white/5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                    startContent={<Home className="h-4 w-4" />}
                  >
                    Home
                  </Button>
                </Link>

                <Link href="/signin" className="flex-1">
                  <Button
                    color="primary"
                    className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                    startContent={<LogIn className="h-4 w-4" />}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Footer Assistance */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
            Need elevated permissions? Contact{" "}
            <a
              href="mailto:support@startupforge.com"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              support@startupforge.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
