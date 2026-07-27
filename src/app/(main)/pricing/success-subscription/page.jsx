import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Receipt,
  Mail,
} from "lucide-react";

export default async function SuccessSubscriptionPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details, amount_total, currency } = session;
  const customerEmail = customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    // Format amount paid
    const amountFormatted = amount_total
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency ? currency.toUpperCase() : "USD",
        }).format(amount_total / 100)
      : "$24.00";

    return (
      <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-300 transition-colors duration-200 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Main Success Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#1E212B] bg-[#12141D] p-8 shadow-2xl md:p-12">
            {/* Top Glowing Gradient accent */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

            {/* Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            {/* Header Text */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Subscription Active</span>
              </span>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Welcome to StartupForge Premium!
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Your founder account has been upgraded. You now have full access
                to unlimited postings, priority search placement, and candidate
                filtering.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="mt-8 rounded-2xl border border-[#1E212B] bg-[#151722] p-5">
              <div className="flex items-center justify-between border-b border-[#1E212B] pb-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Receipt className="h-4 w-4 text-indigo-400" />
                  <span>Payment Summary</span>
                </div>
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                  Paid
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-semibold text-white">
                    Founder Premium
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Charged:</span>
                  <span className="font-bold text-emerald-400">
                    {amountFormatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confirmation Sent To:</span>
                  <span className="font-medium text-slate-300">
                    {customerEmail}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stripe Session ID:</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[180px]">
                    {session_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmation Note */}
            <div className="mt-6 flex items-start space-x-3 rounded-xl bg-indigo-500/5 p-4 border border-indigo-500/10">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              <p className="text-xs leading-relaxed text-slate-400">
                A confirmation receipt and invoice have been emailed to{" "}
                <span className="font-semibold text-indigo-300">
                  {customerEmail}
                </span>
                . If you need support or have questions, reach us at{" "}
                <a
                  href="mailto:support@startupforge.com"
                  className="text-indigo-400 underline hover:text-indigo-300"
                >
                  support@startupforge.com
                </a>
                .
              </p>
            </div>

            {/* Next Steps CTA Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
              >
                <span>Go to Founder Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/founder/post-role"
                className="flex flex-1 items-center justify-center space-x-2 rounded-xl border border-[#232634] bg-[#151722] py-3.5 text-xs font-bold text-slate-200 transition-colors hover:bg-[#1E2130]"
              >
                <span>+ Post Open Role</span>
              </Link>
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-6 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Encrypted Stripe Checkout • Verified Founder Status Activated
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
