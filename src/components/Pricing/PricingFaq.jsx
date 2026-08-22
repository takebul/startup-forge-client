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
        <h2 className="text-3xl font-extrabold text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Everything you need to know about plans, billing, and account upgrades
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {FAQ_ITEMS.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-[#1E212B] bg-[#12141D]"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white transition-colors hover:bg-[#151722]"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                  openFaq === index ? "rotate-180 text-indigo-400" : ""
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
                  className="border-t border-[#1E212B] px-5 py-4 text-xs leading-relaxed text-slate-400"
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
