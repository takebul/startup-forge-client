import { Star } from "lucide-react";

// Customer testimonials: quote, author, role, and avatar URL
const TESTIMONIALS = [
  {
    quote:
      "The priority listing placement doubled our inbound candidate flow in 48 hours. We connected with an exceptional Full-Stack Lead who is now our technical co-founder.",
    author: "Alex Rivera",
    role: "Founder @ NexusAI",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    quote:
      "Upgrading our plan gave us expanded application slots, helping us recruit 3 developers and a designer in under a week. StartupForge saved us months of searching.",
    author: "Sarah Kim",
    role: "Founder @ EcoGrid",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    quote:
      "The streamlined application review board made candidate evaluation effortless, and the Verified badge added immediate trust to our profile.",
    author: "David Miller",
    role: "Founder @ HealthSphere",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
];

export default function PricingTestimonials() {
  return (
    <section className="mt-28">
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          Member Testimonials
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Built for High-Velocity Growth
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Real results from builders who scaled their ventures and careers with
          us
        </p>
      </div>

      {/* Testimonial cards with 5-star rating and author bio */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-violet-500/40"
          >
            <div>
              <div className="flex space-x-1 text-amber-500 dark:text-amber-400">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-amber-500 dark:fill-amber-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300 italic">
                &quot;{t.quote}&quot;
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <img
                src={t.avatar}
                alt={t.author}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/20"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.author}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

