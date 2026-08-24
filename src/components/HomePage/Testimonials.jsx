"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Quote } from "lucide-react";

const TESTIMONIALS_DATA = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Founder & CEO @ AI Flow",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote:
      "StartupForge bridged the exact gap we had. Within 48 hours of posting our role requirement, we connected with a brilliant React developer who is now our technical co-founder.",
    userType: "Founder",
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "Lead UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "As a designer looking for real-world projects, StartupForge let me skip generic job listings and connect directly with founders who valued my design system skills.",
    userType: "Collaborator",
  },
  {
    id: "3",
    name: "Sophia Patel",
    role: "Co-Founder @ EcoPulse",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    quote:
      "The application review board made filtering candidates seamless. We recruited two full-stack developers and launched our MVP weeks ahead of schedule.",
    userType: "Founder",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Full Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote:
      "Tracking application status in real-time gave me full clarity. I joined an early-stage CleanTech startup that aligned perfectly with my career goals.",
    userType: "Collaborator",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTestimonial = TESTIMONIALS_DATA[currentIndex];

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 text-slate-900 transition-colors duration-300 dark:text-slate-100 font-sans">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-600/10 animate-pulse-glow" />

      <div className="container relative mx-auto px-6 lg:px-12 max-w-6xl space-y-24">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 font-mono">
            Community Stories
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Loved by Founders &amp;{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              Collaborators
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed">
            See how teams are building fast and professionals are finding their
            dream startup roles on StartupForge.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center w-full p-8 md:p-12 space-y-7 rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80 transition-all">
            {/* Quote Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400">
              <Quote className="h-6 w-6" />
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg italic font-medium text-center text-slate-700 dark:text-slate-200 leading-relaxed sm:text-xl md:text-2xl">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </blockquote>

            {/* User Avatar & Badge */}
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div className="relative">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-violet-500/20 shadow-md"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {currentTestimonial.userType}
                </span>
              </div>

              <div className="text-center pt-2">
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  {currentTestimonial.name}
                </p>
                <p className="text-xs font-semibold font-mono text-slate-500 dark:text-slate-400">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2 pt-4">
              {TESTIMONIALS_DATA.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === index
                      ? "w-8 bg-violet-600 dark:bg-violet-400"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Radiant Pre-Footer CTA Section */}
        <div className="relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-b from-violet-500/10 via-purple-500/5 to-transparent p-10 md:p-16 text-center dark:border-violet-500/20 dark:from-violet-950/40 dark:via-purple-950/20 dark:to-transparent shadow-xs">
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
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

