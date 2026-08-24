"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import Envelope from "@gravity-ui/icons/Envelope";
import Lock from "@gravity-ui/icons/Lock";
import Eye from "@gravity-ui/icons/Eye";
import EyeSlash from "@gravity-ui/icons/EyeSlash";
import ArrowRight from "@gravity-ui/icons/ArrowRight";
import CircleXmark from "@gravity-ui/icons/CircleXmark";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Flame,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1027-1.17.2827-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5813C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400"
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  suffix,
  hasError,
  autoComplete,
}) {
  return (
    <div
      className={[
        "flex items-center gap-2.5 h-11 px-3.5 rounded-xl border transition-all duration-200",
        "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
        "focus-within:ring-2 focus-within:ring-violet-500/20",
        hasError
          ? "border-red-500/60 focus-within:ring-red-500/20"
          : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 focus-within:border-violet-500 dark:focus-within:border-violet-500",
      ].join(" ")}
    >
      {icon && (
        <span className="text-slate-400 dark:text-slate-500 shrink-0">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none min-w-0"
      />
      {suffix && <span className="shrink-0">{suffix}</span>}
    </div>
  );
}

function SigninContent() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [banReason, setBanReason] = useState(null);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email address is required.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("loading");
    setBanReason(null);

    const { data, error } = await signIn.email({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setStatus("error");
      const errLower = (error.message || "").toLowerCase();

      if (
        error.banReason ||
        error.code === "USER_BANNED" ||
        errLower.includes("banned") ||
        errLower.includes("blocked") ||
        errLower.includes("suspended")
      ) {
        setBanReason(
          error.banReason ||
            error.message ||
            "Your account has been suspended by an administrator.",
        );
        setStatusMessage("Account Blocked");
      } else {
        setBanReason(null);
        setStatusMessage(
          error.message || "Invalid credentials. Please try again.",
        );
      }
    } else {
      setStatus("success");
      setBanReason(null);
      setStatusMessage("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    }
  }

  async function handleGoogleAuth() {
    setStatus("loading");
    setBanReason(null);

    const { error } = await signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });

    if (error) {
      setStatus("error");
      const errLower = (error.message || "").toLowerCase();

      if (
        error.banReason ||
        errLower.includes("banned") ||
        errLower.includes("blocked") ||
        errLower.includes("suspended")
      ) {
        setBanReason(
          error.banReason ||
            error.message ||
            "Your account has been suspended by an administrator.",
        );
        setStatusMessage("Account Blocked");
      } else {
        setBanReason(null);
        setStatusMessage(
          error.message || "Google sign-in failed. Please try again.",
        );
      }
    }
  }

  return (
    <div className="relative rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/90 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600" />

      <div>
        <div className="mb-7">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-100 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-violet-600 dark:text-violet-400 uppercase font-mono">
              StartupForge Auth
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to access your startup dashboard & applications.
          </p>
        </div>

        <AnimatePresence>
          {banReason ? (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Account Suspended</span>
              </div>
              <p className="text-xs text-red-600/90 dark:text-red-200/90 leading-relaxed">
                Reason: <span className="font-medium">{banReason}</span>
              </p>
              <div className="pt-1.5 border-t border-red-200 dark:border-red-500/20 text-[11px] font-mono text-red-500 dark:text-red-300/70">
                If you believe this is a mistake, please contact support.
              </div>
            </motion.div>
          ) : (
            (status === "success" || status === "error") && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className={[
                  "flex items-start gap-3 rounded-2xl px-4 py-3 text-xs font-medium",
                  status === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-300"
                    : "bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300",
                ].join(" ")}
              >
                {status === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <CircleXmark size={16} className="shrink-0 mt-0.5" />
                )}
                <span>{statusMessage}</span>
              </motion.div>
            )
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Field label="Email Address" error={errors.email}>
            <TextInput
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="alex@company.com"
              type="email"
              icon={<Envelope width={15} height={15} />}
              hasError={!!errors.email}
              autoComplete="email"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <TextInput
              value={form.password}
              onChange={(v) => set("password", v)}
              placeholder="Your password"
              type={showPassword ? "text" : "password"}
              icon={<Lock width={15} height={15} />}
              hasError={!!errors.password}
              autoComplete="current-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-0.5 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlash width={15} height={15} />
                  ) : (
                    <Eye width={15} height={15} />
                  )}
                </button>
              }
            />
          </Field>

          <Button
            type="submit"
            isDisabled={status === "loading" || status === "success"}
            className="mt-1 w-full h-11 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 size={16} />
                Signed in!
              </>
            ) : (
              <>
                Sign in
                <ArrowRight width={15} height={15} />
              </>
            )}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 font-mono">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={status === "loading"}
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs text-slate-700 font-semibold transition-all dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6">
          {"Don't have an account? "}
          <Link
            href={`/signup?redirect=${redirectTo}`}
            className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-bold transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

function SigninFallback() {
  return (
    <div className="relative rounded-3xl border border-slate-200/90 bg-white p-12 text-center flex flex-col items-center justify-center dark:border-slate-800/90 dark:bg-slate-900/90 shadow-xl">
      <Loader2 size={24} className="animate-spin text-violet-600 mb-3" />
      <p className="text-xs font-mono text-slate-500">Loading sign in...</p>
    </div>
  );
}

export default function SigninContentClient() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 font-sans overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[440px]"
      >
        <Suspense fallback={<SigninFallback />}>
          <SigninContent />
        </Suspense>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1">
          <Shield size={12} />
          StartupForge Secure Authentication
        </p>
      </motion.div>
    </div>
  );
}
