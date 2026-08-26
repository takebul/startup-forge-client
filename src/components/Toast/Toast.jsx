"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Trash2,
  Sparkles,
  RefreshCw,
  X,
  PlusCircle,
} from "lucide-react";

// Global event bus for dispatching toasts without React Context overhead
class ToastManager {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(toast) {
    this.listeners.forEach((listener) => listener(toast));
  }

  show(type, title, description, options = {}) {
    const id = options.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = {
      id,
      type,
      title: title || (type.charAt(0).toUpperCase() + type.slice(1)),
      description,
      duration: options.duration !== undefined ? options.duration : 4000,
      ...options,
    };
    this.notify(toast);
    return id;
  }

  success(title, description, options) {
    return this.show("success", title, description, options);
  }

  create(title, description, options) {
    return this.show("create", title || "Created Successfully", description, options);
  }

  update(title, description, options) {
    return this.show("update", title || "Updated Successfully", description, options);
  }

  delete(title, description, options) {
    return this.show("delete", title || "Deleted Successfully", description, options);
  }

  error(title, description, options) {
    return this.show("error", title || "Operation Failed", description, options);
  }

  info(title, description, options) {
    return this.show("info", title || "Information", description, options);
  }

  warning(title, description, options) {
    return this.show("warning", title || "Warning", description, options);
  }
}

export const toast = new ToastManager();

const TOAST_THEMES = {
  create: {
    icon: PlusCircle,
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-500/20 border-violet-200 dark:border-violet-500/30",
    badge: "CREATED",
    badgeColor: "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-500/20 border-violet-200 dark:border-violet-500/30",
    border: "border-violet-300/80 dark:border-violet-500/30",
    progressBar: "bg-gradient-to-r from-violet-600 to-indigo-600",
    glow: "shadow-violet-500/10 dark:shadow-violet-500/5",
  },
  update: {
    icon: RefreshCw,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30",
    badge: "UPDATED",
    badgeColor: "text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30",
    border: "border-amber-300/80 dark:border-amber-500/30",
    progressBar: "bg-gradient-to-r from-amber-500 to-yellow-500",
    glow: "shadow-amber-500/10 dark:shadow-amber-500/5",
  },
  delete: {
    icon: Trash2,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30",
    badge: "DELETED",
    badgeColor: "text-rose-800 bg-rose-100 dark:text-rose-300 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30",
    border: "border-rose-300/80 dark:border-rose-500/30",
    progressBar: "bg-gradient-to-r from-rose-600 to-red-600",
    glow: "shadow-rose-500/10 dark:shadow-rose-500/5",
  },
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30",
    badge: "SUCCESS",
    badgeColor: "text-emerald-800 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30",
    border: "border-emerald-300/80 dark:border-emerald-500/30",
    progressBar: "bg-gradient-to-r from-emerald-600 to-teal-600",
    glow: "shadow-emerald-500/10 dark:shadow-emerald-500/5",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30",
    badge: "ERROR",
    badgeColor: "text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-500/20 border-red-200 dark:border-red-500/30",
    border: "border-red-300/80 dark:border-red-500/30",
    progressBar: "bg-gradient-to-r from-red-600 to-rose-600",
    glow: "shadow-red-500/10 dark:shadow-red-500/5",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30",
    badge: "WARNING",
    badgeColor: "text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30",
    border: "border-amber-300/80 dark:border-amber-500/30",
    progressBar: "bg-gradient-to-r from-amber-600 to-orange-600",
    glow: "shadow-amber-500/10 dark:shadow-amber-500/5",
  },
  info: {
    icon: Info,
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-100 dark:bg-sky-500/20 border-sky-200 dark:border-sky-500/30",
    badge: "INFO",
    badgeColor: "text-sky-800 bg-sky-100 dark:text-sky-300 dark:bg-sky-500/20 border-sky-200 dark:border-sky-500/30",
    border: "border-sky-300/80 dark:border-sky-500/30",
    progressBar: "bg-gradient-to-r from-sky-600 to-blue-600",
    glow: "shadow-sky-500/10 dark:shadow-sky-500/5",
  },
};

function ToastItem({ toastItem, onDismiss }) {
  const theme = TOAST_THEMES[toastItem.type] || TOAST_THEMES.info;
  const Icon = theme.icon;

  useEffect(() => {
    if (toastItem.duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(toastItem.id);
    }, toastItem.duration);

    return () => clearTimeout(timer);
  }, [toastItem, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      className={`relative w-full max-w-sm rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border ${theme.border} p-3.5 shadow-xl ${theme.glow} overflow-hidden font-sans text-slate-900 dark:text-slate-100`}
    >
      <div className="flex items-start gap-3">
        {/* Left Themed Icon */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${theme.iconBg} ${theme.iconColor} shadow-2xs`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        {/* Middle Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {toastItem.title}
            </h4>
            <span
              className={`text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded uppercase border ${theme.badgeColor}`}
            >
              {theme.badge}
            </span>
          </div>

          {toastItem.description && (
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
              {toastItem.description}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(toastItem.id)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss toast"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress Bar Timer */}
      {toastItem.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-0.5 ${theme.progressBar}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toastItem.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto w-full">
            <ToastItem toastItem={item} onDismiss={handleDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
