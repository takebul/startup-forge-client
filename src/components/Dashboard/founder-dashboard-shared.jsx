"use client";

import { useState, useRef, useCallback } from "react";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

// ─── Image Upload API ────────────────────────────────────────────────────────
export async function uploadToImgbb(file) {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: form,
    },
  );

  const data = await res.json();
  if (!data.success) throw new Error("Upload failed");
  return data.data.display_url;
}

// ─── UI Primitives ───────────────────────────────────────────────────────────

export function Label({ children }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
      {children}
    </label>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  name,
  defaultValue,
  required,
}) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors duration-150 bg-white border border-slate-200 text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-200 dark:focus:border-violet-500 shadow-xs"
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  name,
  defaultValue,
  required,
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors duration-150 resize-none bg-white border border-slate-200 text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-200 dark:focus:border-violet-500 shadow-xs"
    />
  );
}

export function Select({ value, onChange, options, name }) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl text-sm outline-none transition-colors duration-150 cursor-pointer bg-white border border-slate-200 text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:bg-[#060C1A] dark:border-slate-800 dark:text-slate-200 dark:focus:border-violet-500 shadow-xs"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-white dark:bg-[#0D1528] text-slate-900 dark:text-slate-200">
            {o}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  fullWidth,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-150 cursor-pointer shadow-xs";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-xs sm:text-sm" };
  const variants = {
    primary: "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20",
    ghost:
      "bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/20",
    success:
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/20",
    outline:
      "bg-transparent text-violet-600 border border-violet-300 hover:bg-violet-50 dark:text-violet-400 dark:border-violet-500/30 dark:hover:bg-violet-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );
}

export function Badge({ label, variant }) {
  const map = {
    amber: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    red: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    indigo: "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    gray: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-slate-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono ${
        map[variant] || map.gray
      }`}
    >
      {label}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (status === "Pending") return <Badge label="Pending" variant="amber" />;
  if (status === "Accepted") return <Badge label="Accepted" variant="green" />;
  if (status === "Rejected") return <Badge label="Rejected" variant="red" />;
  return <Badge label={status} variant="gray" />;
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div className="rounded-3xl p-12 text-center bg-white border border-slate-200/90 shadow-sm dark:bg-[#0D1528] dark:border-slate-800">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
}

export function StatCard({ label, value, sub, color = "#7C3AED" }) {
  return (
    <div className="rounded-3xl p-5 bg-white border border-slate-200/90 shadow-sm dark:bg-[#0D1528] dark:border-slate-800">
      <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
        {label}
      </p>
      <p className="text-3xl font-extrabold mb-1 tracking-tight" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl dark:bg-[#0D1528] dark:border-slate-800 font-sans">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ImageUpload({ value, onChange }) {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handle = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      setError("");
      try {
        const url = await uploadToImgbb(file);
        onChange(url);
      } catch {
        setError("Upload failed. Check your imgbb API key.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-slate-50 border border-slate-200 dark:bg-[#060C1A] dark:border-slate-800">
          {value ? (
            <img
              src={value}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-xl">🖼️</span>
          )}
        </div>
        <div>
          <Btn
            onClick={() => ref.current?.click()}
            variant="ghost"
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload Logo"}
          </Btn>
          <p className="text-[11px] mt-1 font-mono text-slate-500">
            PNG, JPG up to 5MB · Hosted via imgbb
          </p>
          {error && <p className="text-[11px] mt-1 text-red-500">{error}</p>}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handle}
        className="hidden"
      />
    </div>
  );
}

