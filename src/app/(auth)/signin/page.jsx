"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import Envelope from "@gravity-ui/icons/Envelope";
import Lock from "@gravity-ui/icons/Lock";
import Eye from "@gravity-ui/icons/Eye";
import EyeSlash from "@gravity-ui/icons/EyeSlash";
import ArrowRight from "@gravity-ui/icons/ArrowRight";
import CircleXmark from "@gravity-ui/icons/CircleXmark";
import { User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
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
            className="flex items-center gap-1.5 text-xs text-red-400"
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
        "flex items-center gap-2.5 h-11 px-3.5 rounded-xl border bg-zinc-900 transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-indigo-500/30",
        hasError
          ? "border-red-500/60 focus-within:ring-red-500/20"
          : "border-zinc-800 hover:border-zinc-700 focus-within:border-indigo-500/50",
      ].join(" ")}
    >
      {icon && <span className="text-zinc-500 flex-shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none min-w-0"
      />
      {suffix && <span className="flex-shrink-0">{suffix}</span>}
    </div>
  );
}

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

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

    const { data, error } = await signIn.email({
      email: form.email,
      password: form.password,
    });

    console.log({ data, error });

    if (error) {
      setStatus("error");
      setStatusMessage(
        error.message || "Invalid credentials. Please try again.",
      );
    } else {
      setStatus("success");
      setStatusMessage("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }

  async function handleGoogleAuth() {
    setStatus("loading");
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      setStatus("error");
      setStatusMessage(
        error.message || "Google sign-in failed. Please try again.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-[440px]"
      >
        <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="px-7 pt-8 pb-7">
            <div className="mb-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-[3px] bg-indigo-400" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                  Launchpad
                </span>
              </div>
              <h1 className="text-2xl font-bold text-zinc-50 tracking-tight leading-none mb-1.5">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-500">
                Sign in to your account to continue.
              </p>
            </div>

            <AnimatePresence>
              {(status === "success" || status === "error") && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className={[
                    "flex items-start gap-3 rounded-xl px-4 py-3 text-sm",
                    status === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                      : "bg-red-500/10 border border-red-500/25 text-red-300",
                  ].join(" ")}
                >
                  {status === "success" ? (
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <CircleXmark
                      width={16}
                      height={16}
                      className="flex-shrink-0 mt-0.5"
                    />
                  )}
                  <span>{statusMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <Field label="Email" error={errors.email}>
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
                      className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

              <div className="text-right -mt-1">
                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                isDisabled={status === "loading" || status === "success"}
                className="mt-1 w-full h-11 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-600">or continue with</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={status === "loading"}
              className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-zinc-700 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 text-sm text-zinc-200 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="text-center text-sm text-zinc-600 mt-5">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-4">
          <User size={11} className="inline mr-1" />
          Launchpad Auth System
        </p>
      </motion.div>
    </div>
  );
}
