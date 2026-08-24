"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

const TESTIMONIALS_DATA = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Founder & CEO @ NexusAI",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote:
      "StartupForge bridged the exact talent gap we had. Within 48 hours of posting our role requirement, we connected with a brilliant React developer who is now our technical co-founder.",
    userType: "Founder",
    rating: 5,
    highlight: "Found Co-Founder in 48h",
    stat: "Raised $1.8M Seed",
    startupDomain: "Artificial Intelligence",
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "Lead UI/UX Designer @ PulsePay",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "As a designer looking for real-world high-impact ventures, StartupForge let me skip generic corporate job boards and connect directly with founders who valued my design system capabilities.",
    userType: "Collaborator",
    rating: 5,
    highlight: "Joined Core Team",
    stat: "Equity & Full Comp",
    startupDomain: "FinTech & Payments",
  },
  {
    id: "3",
    name: "Sophia Patel",
    role: "Co-Founder @ EcoPulse Ventures",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    quote:
      "The application review board made candidate filtering effortless. We recruited two full-stack developers and launched our CleanTech MVP three weeks ahead of our milestone schedule.",
    userType: "Founder",
    rating: 5,
    highlight: "Shipped MVP Early",
    stat: "Built Team of 5",
    startupDomain: "CleanTech & Climate",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Senior Full-Stack Engineer @ CloudGrid",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote:
      "Tracking application status in real-time gave me complete clarity. I joined an early-stage venture that aligned perfectly with my career aspirations and modern cloud tech stack.",
    userType: "Collaborator",
    rating: 5,
    highlight: "Matched in 3 Days",
    stat: "Lead Architect",
    startupDomain: "DevOps & Cloud",
  },
  {
    id: "5",
    name: "Elena Rostova",
    role: "Founder @ HealthSync AI",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote:
      "We needed a machine learning specialist with PyTorch and healthcare compliance experience. StartupForge delivered three top-tier candidates within a single weekend.",
    userType: "Founder",
    rating: 5,
    highlight: "Hired ML Specialist",
    stat: "Clinical Beta Live",
    startupDomain: "HealthTech & MedAI",
  },
  {
    id: "6",
    name: "Liam O'Connor",
    role: "Growth & Product Strategist",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    quote:
      "The platform transparently showcases company traction, funding stage, and role expectations. It made it straightforward to pick the most promising venture to dedicate my time to.",
    userType: "Collaborator",
    rating: 5,
    highlight: "Scaled 10x Users",
    stat: "Venture Partner",
    startupDomain: "SaaS & Growth",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

const Testimonials = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  const currentIndex =
    ((page % TESTIMONIALS_DATA.length) + TESTIMONIALS_DATA.length) %
    TESTIMONIALS_DATA.length;
  const currentTestimonial = TESTIMONIALS_DATA[currentIndex];

  const paginate = useCallback((newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const jumpTo = (index) => {
    const diff = index - currentIndex;
    if (diff !== 0) {
      setPage([index, diff > 0 ? 1 : -1]);
    }
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [paginate, isPaused]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      paginate(1);
    } else if (diff < -50) {
      paginate(-1);
    }
  };

  return (
    <section className="relative overflow-hidden py-10 md:py-12 lg:py-14 text-slate-900 transition-colors duration-300 dark:text-slate-100 font-sans">
      <div className="container relative mx-auto px-6 lg:px-12 max-w-6xl space-y-8 md:space-y-10">

        {/* Section Header with Motion Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50 px-4 py-1 text-xs font-mono font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Community Stories &amp; Proof</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Loved by Founders &amp;{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              Collaborators
            </span>
          </h2>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            See how ambitious early-stage ventures assemble elite teams and
            passionate specialists find high-impact co-building roles.
          </p>

          {/* Social Proof Metric Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <strong className="text-slate-900 dark:text-white">4.9 / 5.0</strong> Rating
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <strong className="text-slate-900 dark:text-white">98%</strong> Match Success
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              <Users className="h-3.5 w-3.5 text-violet-500" />
              <strong className="text-slate-900 dark:text-white">8,500+</strong> Builders
            </span>
          </div>
        </motion.div>

        {/* Interactive Swiper Carousel Box with Motion Scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 md:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-xl">
            {/* Background Decorative Pattern */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-violet-500/10 blur-2xl dark:bg-violet-600/15" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-2xl dark:bg-indigo-600/15" />

            {/* Top Card Controls Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
              {/* Rating & Domain Tag */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-mono font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                  {currentTestimonial.startupDomain}
                </span>
              </div>

              {/* Prev / Next Swiper Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Previous Testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50 text-slate-700 shadow-xs transition-all hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-violet-600 dark:hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next Testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50 text-slate-700 shadow-xs transition-all hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-violet-600 dark:hover:text-white cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Slide Body with AnimatePresence */}
            <div className="relative min-h-[260px] md:min-h-[220px] py-8 flex flex-col justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Quote text */}
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 shrink-0">
                      <Quote className="h-5 w-5" />
                    </div>
                    <blockquote className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic">
                      &ldquo;{currentTestimonial.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Outcome Highlight Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-mono font-bold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {currentTestimonial.highlight}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-mono font-bold text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
                      <Award className="h-3.5 w-3.5" />
                      {currentTestimonial.stat}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Footer: Author Info & Progress Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
              {/* Author Identity */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-violet-600 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white shadow-xs">
                    {currentTestimonial.userType}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>

              {/* Swiper Dots & Auto-play indicator */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS_DATA.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => jumpTo(index)}
                    aria-label={`Slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index
                        ? "w-8 bg-violet-600 dark:bg-violet-400"
                        : "w-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Author Thumbnail Switcher Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {TESTIMONIALS_DATA.map((item, index) => {
              const isSelected = currentIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpTo(index)}
                  className={`group flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs transition-all cursor-pointer ${isSelected
                      ? "border-violet-600 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-500/15 dark:text-violet-300 font-bold shadow-xs scale-105"
                      : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-6 w-6 rounded-full object-cover shrink-0"
                  />
                  <span className="truncate max-w-[100px]">{item.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Radiant Pre-Footer CTA Section with Motion Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-b from-violet-500/10 via-purple-500/5 to-transparent p-8 md:p-12 text-center dark:border-violet-500/20 dark:from-violet-950/40 dark:via-purple-950/20 dark:to-transparent shadow-xs"
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl animate-pulse-glow" />

          <div className="relative mx-auto max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/60 bg-white/80 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Join the Movement</span>
            </div>

            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Ready to build the next breakout startup?
            </h3>

            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed">
              Join 8,500+ founders and collaborators building the future of
              technology. Create your profile in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700 hover:shadow-violet-600/35 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/opportunities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300/90 bg-white px-8 py-4 text-sm font-bold text-slate-800 shadow-xs hover:border-violet-400 hover:bg-slate-50 hover:text-violet-600 hover:-translate-y-0.5 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-900 dark:hover:text-violet-300 transition-all"
              >
                <span>Explore Opportunities</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;


