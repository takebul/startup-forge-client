"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time. When switching tiers, prorated pricing adjustments are handled automatically through Stripe.",
  },
  {
    question: "How do monthly application and role quotas work?",
    answer:
      "Founders receive a quota of simultaneous open positions, while Collaborators receive an application allowance that resets at the start of each billing cycle.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We support Visa, Mastercard, American Express, Apple Pay, and Google Pay through secure Stripe payment infrastructure.",
  },
  {
    question: "Do Administrators need a paid plan?",
    answer:
      "No. Admin accounts have full platform-wide access, including unlimited roles, applications, user management, and startup moderation privileges.",
  },
];

export default function PricingFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="mt-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          Got Questions?
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Everything you need to know about plans, billing, and account upgrades
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {FAQ_ITEMS.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800/90 dark:bg-slate-900/80"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  openFaq === index
                    ? "rotate-180 text-violet-600 dark:text-violet-400"
                    : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

