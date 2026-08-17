"use client";

import { useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import Person from "@gravity-ui/icons/Person";
import Envelope from "@gravity-ui/icons/Envelope";
import Lock from "@gravity-ui/icons/Lock";
import Eye from "@gravity-ui/icons/Eye";
import EyeSlash from "@gravity-ui/icons/EyeSlash";
import Camera from "@gravity-ui/icons/Camera";
import LinkIcon from "@gravity-ui/icons/Link";
import ArrowRight from "@gravity-ui/icons/ArrowRight";
import CircleCheckFill from "@gravity-ui/icons/CircleCheckFill";
import CircleXmark from "@gravity-ui/icons/CircleXmark";
import {
  ChevronDown,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  User,
  Briefcase,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { updateUserStatus } from "@/lib/actions/users";

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Full name is required.";
  if (!form.email.trim()) {
    errs.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!form.password) {
    errs.password = "Password is required.";
  } else if (form.password.length < 6) {
    errs.password = "Password must be at least 6 characters.";
  } else if (!/[A-Z]/.test(form.password)) {
    errs.password = "Must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(form.password)) {
    errs.password = "Must contain at least one lowercase letter.";
  }
  if (!form.accountType) errs.accountType = "Please select an account type.";
  return errs;
}

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 4) return { score, label: "Fair", color: "#f59e0b" };
  return { score, label: "Strong", color: "#22c55e" };
}

async function uploadToImgbb(file) {
  const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "demo";
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.data.url;
}

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

function SignupContent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
    accountType: "", // Stores 'founder' or 'collaborator'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [imageMode, setImageMode] = useState("url");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const fileRef = useRef(null);

  const strength = getStrength(form.password);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const local = URL.createObjectURL(file);
    setImagePreview(local);
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      set("imageUrl", url);
      setImagePreview(url);
    } catch {
      setUploadError("Upload failed. Check your Imgbb API key.");
      set("imageUrl", "");
    } finally {
      setUploading(false);
    }
  }

  const plan =
    form.accountType === "founder" ? "founder_free" : "collaborator_free";

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("loading");

    try {
      // 1. Sign up user: Pass accountType directly instead of privileged 'role'
      const res = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.imageUrl || undefined,
        accountType: form.accountType,
        plan: plan,
        status: "active",
        callbackURL: redirectTo,
      });

      if (res?.error) {
        throw new Error(
          res.error.message || "Signup failed. Please try again.",
        );
      }

      // 2. Sync to MongoDB to ensure accountType and plan persist
      const createdUserId = res?.data?.user?.id || res?.data?.user?._id;
      if (createdUserId) {
        await updateUserStatus(createdUserId, {
          accountType: form.accountType,
          plan: plan,
          status: "active",
        });
      }

      setStatus("success");
      setStatusMessage(`Welcome, ${form.name.split(" ")[0]}! Redirecting...`);
      setTimeout(() => {
        router.push(redirectTo);
      }, 1200);
    } catch (err) {
      console.error("Signup error:", err);
      setStatus("error");
      setStatusMessage(err?.message || "Signup failed. Please try again.");
    }
  }

  async function handleGoogleAuth() {
    setStatus("loading");
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });
    if (error) {
      setStatus("error");
      setStatusMessage(
        error.message || "Google sign-in failed. Please try again.",
      );
    }
  }

  const accountTypeLabels = {
    founder: "Founder",
    collaborator: "Collaborator",
  };

  return (
    <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden font-sans">
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
            Create your account
          </h1>
          <p className="text-sm text-zinc-500">
            Join the network of founders and collaborators.
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
          <Field label="Full Name" error={errors.name}>
            <TextInput
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder="Alex Johnson"
              icon={<Person width={15} height={15} />}
              hasError={!!errors.name}
              autoComplete="name"
            />
          </Field>

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
              placeholder="Min. 6 chars, Aa..."
              type={showPassword ? "text" : "password"}
              icon={<Lock width={15} height={15} />}
              hasError={!!errors.password}
              autoComplete="new-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 cursor-pointer"
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
            {form.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-0.5"
              >
                <div className="flex gap-0.5 flex-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-0.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i <= strength.score ? strength.color : "#27272a",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </motion.div>
            )}
          </Field>

          {/* Profile Image Mode & Input */}
          <Field label="Profile Image" error={uploadError ?? undefined}>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={[
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                  imageMode === "url"
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                    : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:border-zinc-600",
                ].join(" ")}
              >
                <LinkIcon width={12} height={12} />
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={[
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                  imageMode === "file"
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                    : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:border-zinc-600",
                ].join(" ")}
              >
                <Upload size={12} />
                Upload
              </button>
            </div>

            {imageMode === "url" ? (
              <TextInput
                value={form.imageUrl}
                onChange={(v) => {
                  set("imageUrl", v);
                  setImagePreview(v || null);
                }}
                placeholder="https://example.com/avatar.jpg"
                icon={<Camera width={15} height={15} />}
              />
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 hover:border-indigo-500/50 bg-zinc-900 hover:bg-indigo-500/5 text-sm text-zinc-500 hover:text-indigo-300 transition-all duration-200 cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Upload size={15} />
                  )}
                  {uploading ? "Uploading…" : "Choose image file"}
                </button>
              </div>
            )}

            <AnimatePresence>
              {imagePreview && !uploading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 mt-2.5"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CircleCheckFill width={13} height={13} />
                    Image ready
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Field>

          {/* Account Type Selection */}
          <Field label="Account Type" error={errors.accountType}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen((o) => !o)}
                className={[
                  "flex items-center justify-between w-full h-11 px-3.5 rounded-xl border bg-zinc-900 text-sm transition-all duration-200 cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
                  roleOpen
                    ? "border-indigo-500/50 ring-2 ring-indigo-500/20"
                    : "",
                  errors.accountType
                    ? "border-red-500/60"
                    : "border-zinc-800 hover:border-zinc-700",
                  form.accountType ? "text-zinc-100" : "text-zinc-600",
                ].join(" ")}
              >
                <span>
                  {form.accountType
                    ? accountTypeLabels[form.accountType]
                    : "Select account type…"}
                </span>
                <motion.span
                  animate={{ rotate: roleOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-zinc-500"
                >
                  <ChevronDown size={15} />
                </motion.span>
              </button>

              <AnimatePresence>
                {roleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+6px)] left-0 right-0 z-20 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden"
                  >
                    {["founder", "collaborator"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          set("accountType", r);
                          setRoleOpen(false);
                        }}
                        className={[
                          "w-full text-left px-3.5 py-2.5 text-sm transition-colors cursor-pointer",
                          form.accountType === r
                            ? "bg-indigo-500/15 text-indigo-300"
                            : "text-zinc-300 hover:bg-zinc-800",
                        ].join(" ")}
                      >
                        <span className="font-medium">
                          {accountTypeLabels[r]}
                        </span>
                        <span className="ml-2 text-zinc-600 text-xs">
                          {r === "founder"
                            ? "— building something new"
                            : "— joining a team"}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Field>

          <Button
            type="submit"
            isDisabled={status === "loading" || status === "success"}
            className={[
              "mt-1 w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200",
              "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900",
              "flex items-center justify-center gap-2",
            ].join(" ")}
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account…
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 size={16} />
                Account created!
              </>
            ) : (
              <>
                Create account
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
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-zinc-700 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 text-sm text-zinc-200 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-sm text-zinc-600 mt-5">
          Already have an account?{" "}
          <Link
            href={`/signin?redirect=${redirectTo}`}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function SignupFallback() {
  return (
    <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-12 text-center flex flex-col items-center justify-center font-sans">
      <Loader2 size={24} className="animate-spin text-indigo-500 mb-3" />
      <p className="text-xs font-mono text-zinc-500">Loading sign up...</p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
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
        <Suspense fallback={<SignupFallback />}>
          <SignupContent />
        </Suspense>

        <p className="text-center text-xs text-zinc-700 mt-4">
          <User size={11} className="inline mr-1" />
          Launchpad Auth System
        </p>
      </motion.div>
    </div>
  );
}
