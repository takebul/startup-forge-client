"use client";

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* =====================================================================
          1. LIGHT THEME — SENIOR DESIGNER AMBIENT CANVAS (Ultra-Subtle & Smooth)
          ===================================================================== */}
      <div className="absolute inset-0 dark:hidden">
        {/* Crisp Base Gradient Wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-white to-white" />

        {/* Whisper-Soft Micro-Dot Grid Pattern with Radial Vignette */}
        <div
          className="absolute inset-0 bg-dot-pattern-light opacity-30"
          style={{
            maskImage:
              "radial-gradient(ellipse at 50% 25%, black 25%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 25%, black 25%, transparent 75%)",
          }}
        />

        {/* Top Radiant Ambient Light Wash */}
        <div className="absolute -top-36 left-1/2 h-[350px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-200/18 via-indigo-100/12 to-transparent blur-[120px] animate-mesh-pulse" />

        {/* Ethereal Aurora Orb 1: Violet & Lavender (Top-Left calm drift) */}
        <div className="absolute -top-32 -left-28 h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-violet-200/18 via-purple-100/14 to-transparent blur-[140px] animate-aurora-1" />

        {/* Ethereal Aurora Orb 2: Sky Blue & Periwinkle (Top-Right calm drift) */}
        <div className="absolute top-12 -right-32 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-indigo-100/18 via-sky-100/12 to-transparent blur-[140px] animate-aurora-2" />

        {/* Ethereal Aurora Orb 3: Soft Amethyst (Center-Bottom gentle breathing) */}
        <div className="absolute bottom-20 left-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-100/14 via-violet-100/10 to-transparent blur-[160px] animate-aurora-3" />
      </div>

      {/* =====================================================================
          2. DARK THEME — DEEP SPACE LUXURY CANVAS (Refined & Ambient)
          ===================================================================== */}
      <div className="absolute inset-0 hidden dark:block">
        {/* Dark Micro-Grid Pattern */}
        <div
          className="absolute inset-0 bg-dot-pattern-dark opacity-35"
          style={{
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 25%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 30%, black 25%, transparent 80%)",
          }}
        />

        {/* Dark Ambient Deep Glows */}
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-950/25 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/4 -left-32 h-[550px] w-[550px] rounded-full bg-indigo-950/20 blur-[140px] animate-aurora-1" />
        <div className="absolute bottom-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-purple-950/20 blur-[150px] animate-aurora-2" />
      </div>
    </div>
  );
}
