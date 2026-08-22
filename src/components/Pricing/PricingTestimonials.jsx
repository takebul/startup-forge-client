import { Star } from "lucide-react";

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
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-white">
          Built for High-Velocity Growth
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Real results from builders who scaled their ventures and careers with
          us
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-[#1E212B] bg-[#12141D] p-6"
          >
            <div>
              <div className="flex space-x-1 text-amber-400">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-300 italic">
                &quot;{t.quote}&quot;
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-3 border-t border-[#1E212B] pt-4">
              <img
                src={t.avatar}
                alt={t.author}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white">{t.author}</p>
                <p className="text-[10px] text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
