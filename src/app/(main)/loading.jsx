"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket } from "lucide-react";

export default function MainLoadingSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/50 dark:bg-[#080E1C] font-sans pb-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15 animate-pulse-glow" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/10 animate-float-slow" />

      {/* Hero Banner Skeleton */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          {/* Top Chip Skeleton */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-200/80 px-5 py-2 dark:bg-slate-800/80 animate-pulse">
            <Sparkles className="h-4 w-4 text-violet-500/70" />
            <div className="h-3 w-32 rounded bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Heading Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="mx-auto h-10 w-3/4 sm:h-12 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            <div className="mx-auto h-10 w-1/2 sm:h-12 rounded-2xl bg-gradient-to-r from-violet-200 to-indigo-200 dark:from-violet-900/40 dark:to-indigo-900/40 animate-pulse" />
          </div>

          {/* Subtitle Skeleton */}
          <div className="mx-auto max-w-2xl space-y-2 pt-2">
            <div className="mx-auto h-4 w-5/6 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
            <div className="mx-auto h-4 w-2/3 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <div className="h-12 w-44 rounded-2xl bg-violet-600/30 dark:bg-violet-600/20 animate-pulse" />
            <div className="h-12 w-44 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Startups Grid Skeleton */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="mx-auto h-4 w-24 rounded-full bg-violet-200/80 dark:bg-violet-800/40 animate-pulse" />
          <div className="mx-auto h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="mx-auto h-4 w-80 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
        </div>

        {/* 6 Cards Grid Skeleton */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 relative overflow-hidden"
            >
              {/* Shimmer sweep overlay */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-50" />

              <div className="space-y-4">
                {/* Header: Logo & Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>

                {/* Title & Domain */}
                <div className="space-y-2 pt-2">
                  <div className="h-6 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                </div>

                {/* Description Lines */}
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                </div>

                {/* Tags */}
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                <div className="h-8 w-24 rounded-xl bg-violet-600/25 dark:bg-violet-600/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
