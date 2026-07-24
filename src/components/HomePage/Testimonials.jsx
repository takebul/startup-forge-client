"use client";

import { useState } from "react";

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
    <section className="bg-white py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Community Stories
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Loved by Founders & Collaborators
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            See how teams are building fast and professionals are finding their
            dream startup roles on StartupForge.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="flex flex-col items-center w-full p-8 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 md:p-10">
            {/* User Avatar & Badge */}
            <div className="relative">
              <img
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-violet-500/20 shadow-md"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                {currentTestimonial.userType}
              </span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="max-w-lg text-lg italic font-medium text-center text-slate-700 dark:text-slate-200 leading-relaxed sm:text-xl">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author Details */}
            <div className="text-center">
              <p className="font-bold text-slate-900 dark:text-white">
                {currentTestimonial.name}
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {currentTestimonial.role}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2 pt-2">
              {TESTIMONIALS_DATA.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-8 bg-violet-600 dark:bg-violet-400"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
