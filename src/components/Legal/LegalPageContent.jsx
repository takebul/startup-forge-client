import { CalendarDays, ArrowUpRight } from "lucide-react";

/**
 * Shared legal-page layout used by /privacy and /terms.
 *
 * Sections follow this shape:
 *   { id, heading, intro?, paragraphs?: string[], items?: { title?, text }[], note? }
 */
export default function LegalPageContent({
  badge,
  title,
  highlight,
  description,
  lastUpdated,
  sections,
}) {
  return (
    <div className="relative overflow-hidden bg-white py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:py-20 lg:py-24 font-sans">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-600/10" />

      <div className="container relative mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <ShieldGradient />
            <span>{badge}</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            {title}{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              {highlight}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            {description}
          </p>

          <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-mono font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Body Layout: TOC sidebar + sections */}
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          {/* Desktop Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                On this page
              </p>
              <nav className="mt-3 space-y-0.5">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
              <a
                href="mailto:takebulislam@gmail.com"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-violet-700"
              >
                Questions?
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-6">
            {/* Mobile Table of Contents */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm lg:hidden dark:border-slate-800/90 dark:bg-slate-900/80">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                On this page
              </p>
              <nav className="mt-3 flex flex-wrap gap-2">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-violet-100 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                  >
                    {index + 1}. {section.heading}
                  </a>
                ))}
              </nav>
            </div>

            {/* Sections */}
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm sm:p-9 dark:border-slate-800/90 dark:bg-slate-900/80"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 font-mono text-sm font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {section.heading}
                  </h2>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {section.intro && <p>{section.intro}</p>}

                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}

                  {section.items?.length > 0 && (
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-violet-400" />
                          <span>
                            {item.title && (
                              <strong className="font-semibold text-slate-900 dark:text-white">
                                {item.title}:{" "}
                              </strong>
                            )}
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.note && (
                    <div className="mt-4 rounded-2xl border border-violet-200/80 bg-violet-50 px-5 py-4 text-xs text-violet-900 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
                      <span className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-wider">
                        ⚡ At a glance
                      </span>
                      {section.note}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldGradient() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
