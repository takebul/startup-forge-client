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
import { subscription } from "@/lib/actions/subscriptions";
import { getUserSession } from "@/lib/core/session";

// Friendly plan display name lookup
const PLAN_NAME_MAP = {
  collaborator_free: "Collaborator Free",
  collaborator_premium: "Premium Collaborator",
  collaborator_enterprise: "Collaborator Enterprise",
  founder_free: "Founder Free",
  founder_premium: "Founder Premium",
  founder_enterprise: "Founder Enterprise",
};

export default async function SuccessSubscriptionPage({ searchParams }) {
  const { session_id } = await searchParams;

  const user = await getUserSession();

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  // Retrieve Stripe checkout session with expanded details
  const payment_session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const {
    status,
    customer_details,
    amount_total,
    currency,
    metadata,
    payment_status,
  } = payment_session;

  const customerEmail = customer_details?.email || user?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const rawPlanId = String(
      metadata?.planId || user?.plan || "",
    ).toLowerCase();

    // Accurately determine if the user is a Collaborator or Founder using accountType
    const isCollaborator =
      rawPlanId.includes("collaborator") ||
      user?.accountType === "collaborator" ||
      user?.role === "collaborator";

    const subsInfo = {
      email: user?.email,
      planId: metadata?.planId || rawPlanId,
      payment_status: payment_status,
      amount: amount_total,
      session_id: session_id,
      userId: user?.id || user?._id,
      accountType: isCollaborator ? "collaborator" : "founder",
    };

    const payment_result = await subscription({ subsInfo, user });
    console.log("Subscription Process Result:", payment_result);

    const planDisplayName =
      PLAN_NAME_MAP[rawPlanId] ||
      (isCollaborator ? "Premium Collaborator" : "Founder Premium");

    // Format amount paid
    const amountFormatted = amount_total
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency ? currency.toUpperCase() : "USD",
        }).format(amount_total / 100)
      : "$19.00";

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
              <span className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 font-mono">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Subscription Active</span>
              </span>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                {isCollaborator
                  ? "Welcome to Premium Collaborator!"
                  : "Welcome to StartupForge Premium!"}
              </h1>

              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                {isCollaborator
                  ? "Your collaborator account has been upgraded! You now enjoy an expanded monthly application quota, priority placement in founder candidate review boards, and verified profile status."
                  : "Your founder account has been upgraded. You now have full access to expanded role postings, priority search placement, and candidate filtering."}
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="mt-8 rounded-2xl border border-[#1E212B] bg-[#151722] p-5">
              <div className="flex items-center justify-between border-b border-[#1E212B] pb-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  <Receipt className="h-4 w-4 text-indigo-400" />
                  <span>Payment Summary</span>
                </div>
                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold font-mono text-emerald-400">
                  Paid
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-semibold text-white">
                    {planDisplayName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Charged:</span>
                  <span className="font-bold text-emerald-400 font-mono">
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

            {/* Dynamic Next Steps CTA Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {isCollaborator ? (
                <>
                  <Link
                    href="/dashboard/collaborator"
                    className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
                  >
                    <span>Go to Collaborator Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard/collaborator/browse-opportunities"
                    className="flex flex-1 items-center justify-center space-x-2 rounded-xl border border-[#232634] bg-[#151722] py-3.5 text-xs font-bold text-slate-200 transition-colors hover:bg-[#1E2130]"
                  >
                    <span>Browse Opportunities</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/founder"
                    className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
                  >
                    <span>Go to Founder Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard/founder/add-opportunity"
                    className="flex flex-1 items-center justify-center space-x-2 rounded-xl border border-[#232634] bg-[#151722] py-3.5 text-xs font-bold text-slate-200 transition-colors hover:bg-[#1E2130]"
                  >
                    <span>+ Post Open Role</span>
                  </Link>
                </>
              )}
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-6 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Encrypted Stripe Checkout • Verified{" "}
                {isCollaborator ? "Collaborator" : "Founder"} Status Activated
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
