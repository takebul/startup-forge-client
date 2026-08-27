"use client";

import { useState, useRef, Suspense } from "react";
import Image from "next/image";
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
  Shield,
  Briefcase,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { updateUserStatus } from "@/lib/actions/users";

// Basic signup validation: name, email, password rules, and account type
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

// Score password strength and return a label + color
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

// Upload a file to imgbb and return the display URL
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
  return data.data.display_url || data.data.url;
}

// Inline Google logo for the "Continue with Google" button
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

// Labeled form field wrapper with an animated error message
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

// Styled text input with optional icon and suffix
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

// Validate an image URL is direct-linkable; returns an error message or ""
function getImageUrlError(url) {
  if (!url || typeof url !== "string") return "Please enter a valid image URL.";
  const trimmed = url.trim();
  if (!trimmed) return "Please enter a valid image URL.";
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return "";

  try {
    const parsed = new URL(trimmed);
    const isImgBbShareLink =
      parsed.hostname.includes("ibb.co") ||
      parsed.hostname.includes("imgbb.com");
    const isDirectImageHost =
      parsed.hostname.includes("i.ibb.co") ||
      parsed.hostname.includes("i.imgur.com") ||
      parsed.hostname.includes("cloudinary.com") ||
      parsed.hostname.includes("images.unsplash.com") ||
      parsed.hostname.includes("cdn.");
    const hasImageExtension =
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(trimmed);

    if (isImgBbShareLink && !isDirectImageHost && !hasImageExtension) {
      return "imgBB share links are not direct image URLs. Please use a direct image URL ending in .jpg, .png, .gif, or .webp.";
    }

    if (!isDirectImageHost && !hasImageExtension) {
      return "Please use a direct image URL (for example: https://example.com/avatar.jpg).";
    }

    return "";
  } catch {
    return "Please use a valid image URL starting with http:// or https://.";
  }
}

// Convenience wrapper: true when the image URL is valid
function isValidUrl(url) {
  return !getImageUrlError(url);
}

function SignupContent() {
  // Query params: pre-selected account type and post-auth redirect target
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("accountType") || "";
  const redirectTo = searchParams.get("redirect") || "/";

  // Form state, validation errors, image mode, and auth status
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
    accountType: defaultRole,
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

  // Update a single form field and clear its error
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // Upload a chosen file to imgbb and preview the resulting URL
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const local = URL.createObjectURL(file);
    setImagePreview(local);
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      const trimmedUrl = url.trim();
      set("imageUrl", trimmedUrl);
      setImagePreview(trimmedUrl);
    } catch {
      setUploadError("Upload failed. Check your Imgbb API key.");
      set("imageUrl", "");
    } finally {
      setUploading(false);
    }
  }

  // Derive the subscription plan from the selected account type
  const plan =
    form.accountType === "founder" ? "founder_free" : "collaborator_free";

  // Submit the form; create the account, set the user's status, and redirect
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("loading");

    try {
      const res = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.imageUrl?.trim() || undefined,
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

  // Sign up with Google and redirect on success
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

  // Display labels for each account type option
  const accountTypeLabels = {
    founder: "Founder",
    collaborator: "Collaborator",
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/90 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600" />

      <div>
        {/* Header: logo, title, and subtitle */}
        <div className="mb-7">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-violet-600/30">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-violet-600 dark:text-violet-400 uppercase font-mono">
              StartupForge Account
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join the ecosystem of visionary founders and skilled collaborators.
          </p>
        </div>

        <AnimatePresence>
          {/* Status banner: success or error message */}
          {(status === "success" || status === "error") && (
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
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Name, email, and password fields with strength meter */}
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
              placeholder="Min. 6 chars, uppercase & lowercase"
              type={showPassword ? "text" : "password"}
              icon={<Lock width={15} height={15} />}
              hasError={!!errors.password}
              autoComplete="new-password"
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
                          i <= strength.score ? strength.color : "#cbd5e1",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-[11px] font-mono font-medium"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </motion.div>
            )}
          </Field>

          {/* Account Type Selection */}
          <Field label="Account Type" error={errors.accountType}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen((o) => !o)}
                className={[
                  "flex items-center justify-between w-full h-11 px-3.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer",
                  "bg-slate-50 dark:bg-slate-950",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/20",
                  roleOpen
                    ? "border-violet-500 ring-2 ring-violet-500/20"
                    : "",
                  errors.accountType
                    ? "border-red-500/60"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700",
                  form.accountType
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-400 dark:text-slate-500",
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
                  className="text-slate-400"
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
                    className="absolute top-[calc(100%+6px)] left-0 right-0 z-20 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xl overflow-hidden p-1"
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
                          "w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between",
                          form.accountType === r
                            ? "bg-violet-50 text-violet-700 font-bold dark:bg-violet-500/15 dark:text-violet-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60",
                        ].join(" ")}
                      >
                        <span className="font-semibold flex items-center gap-2">
                          {r === "founder" ? (
                            <Rocket className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Briefcase className="w-3.5 h-3.5 text-violet-500" />
                          )}
                          {accountTypeLabels[r]}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          {r === "founder"
                            ? "Building a startup"
                            : "Joining as talent"}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Field>

          {/* Profile Image Mode & Input */}
          <Field label="Profile Image" error={uploadError ?? undefined}>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={[
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
                  imageMode === "url"
                    ? "bg-violet-50 border-violet-300 text-violet-700 dark:bg-violet-500/15 dark:border-violet-500/40 dark:text-violet-300"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400",
                ].join(" ")}
              >
                <LinkIcon width={12} height={12} />
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={[
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
                  imageMode === "file"
                    ? "bg-violet-50 border-violet-300 text-violet-700 dark:bg-violet-500/15 dark:border-violet-500/40 dark:text-violet-300"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400",
                ].join(" ")}
              >
                <Upload size={12} />
                Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <>
                <TextInput
                  value={form.imageUrl}
                  onChange={(v) => {
                    const trimmed = v.trim();
                    set("imageUrl", trimmed);
                    if (trimmed && isValidUrl(trimmed)) {
                      setImagePreview(trimmed);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  placeholder="https://example.com/avatar.jpg"
                  icon={<Camera width={15} height={15} />}
                  hasError={
                    form.imageUrl.length > 0 && !isValidUrl(form.imageUrl)
                  }
                />
                {form.imageUrl.length > 0 && !isValidUrl(form.imageUrl) && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-1.5"
                  >
                    <AlertCircle size={12} />
                    {getImageUrlError(form.imageUrl)}
                  </motion.p>
                )}
              </>
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
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 hover:border-violet-500 bg-slate-50 hover:bg-violet-50 text-xs font-semibold text-slate-600 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-violet-500/10 dark:text-slate-400 dark:hover:text-violet-300 transition-all cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 size={15} className="animate-spin text-violet-600" />
                  ) : (
                    <Upload size={15} />
                  )}
                  {uploading ? "Uploading image…" : "Choose image file"}
                </button>
              </div>
            )}

            <AnimatePresence>
              {imagePreview && !uploading && isValidUrl(imagePreview) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 mt-2.5"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 shrink-0">
                    <Image
                      src={imagePreview?.trim()}
                      alt="Preview"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CircleCheckFill width={13} height={13} />
                    Avatar verified
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Field>

          {/* Submit button */}
          <Button
            type="submit"
            isDisabled={status === "loading" || status === "success"}
            className="mt-1 w-full h-11 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

        {/* Divider between email and Google sign-up */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 font-mono">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Google OAuth sign-up button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={status === "loading"}
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs text-slate-700 font-semibold transition-all dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Link to the sign-in page */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            href={`/signin?redirect=${redirectTo}`}
            className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-bold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// Loading fallback shown while the form suspends on useSearchParams
function SignupFallback() {
  return (
    <div className="relative rounded-3xl border border-slate-200/90 bg-white p-12 text-center flex flex-col items-center justify-center dark:border-slate-800/90 dark:bg-slate-900/90 shadow-xl">
      <Loader2 size={24} className="animate-spin text-violet-600 mb-3" />
      <p className="text-xs font-mono text-slate-500">Loading sign up...</p>
    </div>
  );
}

// Page wrapper: ambient background, entrance animation, and Suspense boundary
export default function SignupContentClient() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 font-sans overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[480px]"
      >
        <Suspense fallback={<SignupFallback />}>
          <SignupContent />
        </Suspense>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1">
          <Shield size={12} />
          StartupForge Secure Authentication
        </p>
      </motion.div>
    </div>
  );
}
