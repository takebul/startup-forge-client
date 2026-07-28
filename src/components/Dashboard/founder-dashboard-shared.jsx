"use client";

import { useState, useRef, useCallback } from "react";

const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY";

export async function uploadToImgbb(file) {
  if (IMGBB_API_KEY === "YOUR_IMGBB_API_KEY") {
    await new Promise((r) => setTimeout(r, 800));
    return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop";
  }
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

export function Label({ children }) {
  return (
    <label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wider text-slate-400">
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
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors duration-150 bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50 disabled:opacity-50"
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors duration-150 resize-none bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50"
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl text-sm outline-none transition-colors duration-150 cursor-pointer bg-[#060C1A] border border-slate-800 text-slate-200 focus:border-amber-500/50"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0D1528]">
            {o}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5l3 3 3-3"
          stroke="#5A6480"
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
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm" };
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-slate-950",
    ghost:
      "bg-white/5 hover:bg-white/10 text-slate-400 border border-slate-800",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
    success:
      "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
    outline:
      "bg-transparent text-amber-500 border border-amber-500/30 hover:bg-amber-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );
}

export function Badge({ label, variant }) {
  const map = {
    amber: "bg-amber-500/10 text-amber-500",
    green: "bg-emerald-500/10 text-emerald-400",
    red: "bg-red-500/10 text-red-400",
    indigo: "bg-indigo-500/10 text-indigo-400",
    gray: "bg-white/5 text-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono ${map[variant] || map.gray}`}
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

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D1528] border border-slate-800">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-semibold text-base text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 bg-white/5 hover:bg-white/10"
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
        <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-[#060C1A] border border-slate-800">
          {value ? (
            <img
              src={value}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-600 text-xl">🖼️</span>
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
          {error && <p className="text-[11px] mt-1 text-red-400">{error}</p>}
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
