"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ArrowLeft,
  LayoutDashboard,
  Rocket,
  Search,
  Compass,
} from "lucide-react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { authClient } from "@/lib/auth-client";

function getUserPersona(u) {
  if (!u) return "guest";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "founder" || role === "founder") return "founder";
  return "collaborator";
}

export default function NotFoundPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const persona = useMemo(() => getUserPersona(user), [user]);
  const isLoggedIn = !!session;
  const [hasLottieError, setHasLottieError] = useState(false);

  const dashboardHref =
    persona === "admin"
      ? "/dashboard/admin/users"
      : persona === "founder"
        ? "/dashboard/founder"
        : "/dashboard/collaborator";

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-6 font-sans overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient Lighting Accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />

      <div className="relative w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 md:p-12 shadow-xl text-center dark:border-slate-800/90 dark:bg-slate-900/90"
        >
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-mono font-bold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>404 • Page Not Found</span>
            </span>
          </div>

          {/* Lottie Animation or High-Fidelity Fallback */}
          <div className="mx-auto w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center relative">
            {!hasLottieError ? (
              <DotLottieReact
                src="https://assets2.lottiefiles.com/packages/lf20_kjixtysj.json"
                loop
                autoplay
                onError={() => setHasLottieError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                <span className="text-6xl font-black font-mono tracking-tighter text-violet-600 dark:text-violet-400">
                  404
                </span>
                <span className="text-xs font-mono mt-2 text-slate-500 dark:text-slate-400">
                  Orbit Trajectory Lost
                </span>
              </div>
            )}
          </div>

          {/* Header & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Lost in Startup Orbit?
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            The page you are looking for has been moved, renamed, or does not
            exist in the StartupForge ecosystem.
          </p>

          {/* Primary Navigational Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="bordered"
              onPress={() => router.back()}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              startContent={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </Button>

            {isLoggedIn ? (
              <Link href={dashboardHref} className="flex-1">
                <Button
                  className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 transition-all cursor-pointer"
                  startContent={<LayoutDashboard className="h-4 w-4" />}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/" className="flex-1">
                <Button
                  className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 transition-all cursor-pointer"
                  startContent={<Home className="h-4 w-4" />}
                >
                  Back to Home
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Platform Shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
            <Link
              href="/startups"
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              <Rocket className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Browse Startups</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <Link
              href="/opportunities"
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Explore Opportunities</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <Link
              href="/pricing"
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              <span>Pricing Plans</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

