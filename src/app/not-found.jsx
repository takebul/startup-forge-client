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
  AlertCircle,
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
    <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-300 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Lighting Accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-[#1E212B] bg-[#12141D] p-8 md:p-12 shadow-2xl text-center"
        >
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>404 • Page Not Found</span>
            </span>
          </div>

          {/* Lottie Animation or High-Fidelity Fallback */}
          <div className="mx-auto w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center relative">
            {!hasLottieError ? (
              <DotLottieReact
                src="https://assets2.lottiefiles.com/packages/lf20_kjixtysj.json"
                loop
                autoplay
                onError={() => setHasLottieError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-400">
                <span className="text-6xl font-black font-mono tracking-tighter text-indigo-400">
                  404
                </span>
                <span className="text-xs font-mono mt-2 text-slate-400">
                  Orbit Trajectory Lost
                </span>
              </div>
            )}
          </div>

          {/* Header & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
            Lost in Startup Orbit?
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            The page you are looking for has been moved, renamed, or does not
            exist in the StartupForge ecosystem.
          </p>

          {/* Primary Navigational Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="flat"
              onPress={() => router.back()}
              className="flex-1 rounded-xl border border-slate-800 bg-white/5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
              startContent={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </Button>

            {isLoggedIn ? (
              <Link href={dashboardHref} className="flex-1">
                <Button
                  color="primary"
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
                  startContent={<LayoutDashboard className="h-4 w-4" />}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/" className="flex-1">
                <Button
                  color="primary"
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
                  startContent={<Home className="h-4 w-4" />}
                >
                  Back to Home
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Platform Shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs font-semibold text-slate-400 flex-wrap">
            <Link
              href="/startups"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse Startups</span>
            </Link>

            <span className="text-slate-700">•</span>

            <Link
              href="/opportunities"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Opportunities</span>
            </Link>

            <span className="text-slate-700">•</span>

            <Link
              href="/pricing"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Pricing Plans</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
